'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Calendar,
  ChevronDown,
  ChevronUp,
  Copy,
  IndianRupee,
  Loader2,
  Pencil,
  Receipt,
  RefreshCw,
  Search,
  Tag,
  TrendingDown,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { format, parseISO, subMonths } from 'date-fns';
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CallRequestsAdminSkeleton } from '@/components/admin/AdminSkeletons';
import { EXPENSES_MIGRATION_SQL } from '@/lib/expenses/migration';
import {
  EXPENSE_CATEGORIES,
  EXPENSE_LIMITS,
  PAID_VIA_LABELS,
  PAID_VIA_OPTIONS,
  istTodayIso,
  validateExpenseFields,
  type PaidVia,
} from '@/lib/expenses/validation';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Expense {
  id: string;
  title: string;
  category: string;
  /** NUMERIC may serialize as a string — always render through Number(). */
  amount: number | string;
  expense_date: string; // YYYY-MM-DD
  paid_via: string;
  paid_to: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

/** Light projection used for stats/charts so the capped list can't skew them. */
type ExpenseLightRow = Pick<Expense, 'expense_date' | 'amount' | 'category' | 'paid_via'>;

// ---------------------------------------------------------------------------
// Visual tokens + small helpers
// ---------------------------------------------------------------------------

/** Category badges hash to a stable colour so "Salary" is always the same look. */
const CATEGORY_BADGE_CLASSES = [
  'bg-cyan-50 text-cyan-700 border-cyan-200',
  'bg-teal-50 text-teal-700 border-teal-200',
  'bg-blue-50 text-blue-700 border-blue-200',
  'bg-violet-50 text-violet-700 border-violet-200',
  'bg-amber-50 text-amber-700 border-amber-200',
  'bg-rose-50 text-rose-700 border-rose-200',
  'bg-emerald-50 text-emerald-700 border-emerald-200',
  'bg-orange-50 text-orange-700 border-orange-200',
];

const CATEGORY_HEX = [
  '#06b6d4',
  '#14b8a6',
  '#3b82f6',
  '#8b5cf6',
  '#f59e0b',
  '#f43f5e',
  '#10b981',
  '#f97316',
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function categoryIndex(name: string): number {
  return hashString((name || '').toLowerCase()) % CATEGORY_HEX.length;
}

function categoryBadgeClass(name: string): string {
  return CATEGORY_BADGE_CLASSES[categoryIndex(name)];
}

function categoryHex(name: string): string {
  return CATEGORY_HEX[categoryIndex(name)];
}

/** ₹ with Indian grouping ("1,00,000"), tolerating numeric strings. */
function money(value: number | string): string {
  const amount = Number(value) || 0;
  return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

function parseDateSafe(iso: string | null | undefined): Date | null {
  if (!iso) return null;
  const parsed = parseISO(iso);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/** "24 Oct" for the current year, "06 Sep 2010" otherwise. */
function formatExpenseDate(date: string): string {
  const parsed = parseDateSafe(date);
  if (!parsed) return date || '—';
  const base = format(parsed, 'dd MMM');
  return parsed.getFullYear() !== new Date().getFullYear()
    ? `${base} ${parsed.getFullYear()}`
    : base;
}

function monthKeyOf(date: string): string {
  return (date || '').slice(0, 7);
}

/** "2026-10" → "October 2026" (falls back to the raw key when malformed). */
function monthLabel(key: string): string {
  const parsed = parseDateSafe(`${key}-01`);
  return parsed ? format(parsed, 'MMMM yyyy') : key;
}

function paidViaLabel(value: string): string {
  return PAID_VIA_LABELS[value as PaidVia] || value || '—';
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

function ExpensesContent() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [allRows, setAllRows] = useState<ExpenseLightRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [migration, setMigration] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');
  const [paidViaFilter, setPaidViaFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);

  const fetchExpenses = useCallback(async (silent = false) => {
    // Silent refreshes keep the current view on screen — the full skeleton
    // only appears on first load (same discipline as Audit Bookings).
    if (!silent) setLoading(true);
    setRefreshing(true);
    setError(null);
    try {
      const res = await fetch('/api/super-admin/expenses');
      const data = await res.json().catch(() => ({}));
      if (data.migrationRequired) {
        // Not an error — a one-time setup state with the SQL to run.
        setMigration(typeof data.migrationSql === 'string' ? data.migrationSql : EXPENSES_MIGRATION_SQL);
        setExpenses([]);
        setAllRows([]);
        return;
      }
      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to load expenses');
        // A failed background refresh keeps the current view; only a fresh
        // load clears the list (nothing useful to show alongside the banner).
        if (!silent) {
          setExpenses([]);
          setAllRows([]);
        }
      } else {
        setMigration(null);
        setExpenses(Array.isArray(data.data) ? data.data : []);
        setAllRows(
          Array.isArray(data.all) ? data.all : Array.isArray(data.data) ? data.data : []
        );
      }
    } catch {
      setError('Failed to load expenses');
      if (!silent) {
        setExpenses([]);
        setAllRows([]);
      }
    } finally {
      if (!silent) setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // --- Derived: stats, charts, tables, filters ----------------------------

  const stats = useMemo(() => {
    const now = new Date();
    const thisKey = format(now, 'yyyy-MM');
    const lastKey = format(subMonths(now, 1), 'yyyy-MM');

    let thisMonth = 0;
    let lastMonth = 0;
    let allTime = 0;
    let largest = 0;
    const byCategory = new Map<string, number>();

    for (const e of allRows) {
      const amount = Number(e.amount) || 0;
      allTime += amount;
      if (amount > largest) largest = amount;

      const key = monthKeyOf(e.expense_date);
      if (key === thisKey) thisMonth += amount;
      else if (key === lastKey) lastMonth += amount;

      const category = e.category || 'Uncategorised';
      byCategory.set(category, (byCategory.get(category) || 0) + amount);
    }

    let topCategory = { name: '—', total: 0 };
    for (const [name, total] of byCategory) {
      if (total > topCategory.total) topCategory = { name, total };
    }

    return { thisMonth, lastMonth, allTime, count: allRows.length, largest, topCategory };
  }, [allRows]);

  const monthlyTrend = useMemo(() => {
    const now = new Date();
    const out: { label: string; total: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = subMonths(now, i);
      const key = format(d, 'yyyy-MM');
      let total = 0;
      for (const e of allRows) {
        if (monthKeyOf(e.expense_date) === key) total += Number(e.amount) || 0;
      }
      out.push({ label: format(d, 'MMM'), total });
    }
    return out;
  }, [allRows]);

  const categoryBreakdown = useMemo(() => {
    const groups = new Map<string, number>();
    for (const e of allRows) {
      const category = e.category || 'Uncategorised';
      groups.set(category, (groups.get(category) || 0) + (Number(e.amount) || 0));
    }
    return [...groups.entries()]
      .map(([name, value]) => ({ key: name, name, value }))
      .sort((a, b) => b.value - a.value);
  }, [allRows]);

  const monthlySummary = useMemo(() => {
    const now = new Date();
    const rows: { key: string; label: string; count: number; total: number; top: string }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = subMonths(now, i);
      const key = format(d, 'yyyy-MM');
      let count = 0;
      let total = 0;
      const catTotals = new Map<string, number>();
      for (const e of allRows) {
        if (monthKeyOf(e.expense_date) !== key) continue;
        count++;
        const amount = Number(e.amount) || 0;
        total += amount;
        const category = e.category || 'Uncategorised';
        catTotals.set(category, (catTotals.get(category) || 0) + amount);
      }
      let top = '—';
      let topSum = -1;
      for (const [name, sum] of catTotals) {
        if (sum > topSum) {
          topSum = sum;
          top = name;
        }
      }
      rows.push({ key, label: format(d, 'MMMM yyyy'), count, total, top });
    }
    return rows;
  }, [allRows]);

  const summaryTotals = useMemo(
    () =>
      monthlySummary.reduce(
        (acc, row) => ({ count: acc.count + row.count, total: acc.total + row.total }),
        { count: 0, total: 0 }
      ),
    [monthlySummary]
  );

  const monthOptions = useMemo(() => {
    const keys = new Set<string>();
    const now = new Date();
    keys.add(format(now, 'yyyy-MM'));
    keys.add(format(subMonths(now, 1), 'yyyy-MM'));
    for (const e of allRows) {
      if (e.expense_date) keys.add(monthKeyOf(e.expense_date));
    }
    return [...keys].sort().reverse();
  }, [allRows]);

  const categoryOptions = useMemo(() => {
    const names = new Set<string>();
    for (const e of allRows) {
      if (e.category) names.add(e.category);
    }
    return [...names].sort((a, b) => a.localeCompare(b));
  }, [allRows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return expenses.filter((e) => {
      const matchesSearch =
        !q ||
        (e.title || '').toLowerCase().includes(q) ||
        (e.category || '').toLowerCase().includes(q) ||
        (e.paid_to || '').toLowerCase().includes(q) ||
        (e.notes || '').toLowerCase().includes(q);
      const matchesCategory = categoryFilter === 'all' || e.category === categoryFilter;
      const matchesMonth = monthFilter === 'all' || monthKeyOf(e.expense_date) === monthFilter;
      const matchesPaidVia = paidViaFilter === 'all' || e.paid_via === paidViaFilter;
      return matchesSearch && matchesCategory && matchesMonth && matchesPaidVia;
    });
  }, [expenses, search, categoryFilter, monthFilter, paidViaFilter]);

  // Newest month first, with a running subtotal per month header.
  const grouped = useMemo(() => {
    const map = new Map<string, { rows: Expense[]; subtotal: number }>();
    for (const e of filtered) {
      const key = monthKeyOf(e.expense_date) || 'unknown';
      const group = map.get(key) || { rows: [], subtotal: 0 };
      group.rows.push(e);
      group.subtotal += Number(e.amount) || 0;
      map.set(key, group);
    }
    return [...map.entries()].map(([key, group]) => ({ key, ...group }));
  }, [filtered]);

  // --- Actions -------------------------------------------------------------

  const deleteExpense = async (id: string) => {
    setActionId(id);
    try {
      const res = await fetch(`/api/super-admin/expenses/${id}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (data.migrationRequired) {
        setMigration(EXPENSES_MIGRATION_SQL);
        return;
      }
      if (!res.ok || !data.success) throw new Error(data.error || 'Delete failed');
      toast.success('Expense deleted');
      setConfirmDeleteId(null);
      setExpandedId((prev) => (prev === id ? null : prev));
      await fetchExpenses(true); // silent — no skeleton flash
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Delete failed');
    } finally {
      setActionId(null);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (expense: Expense) => {
    setEditing(expense);
    setDialogOpen(true);
  };

  const handleSaved = () => {
    setDialogOpen(false);
    setEditing(null);
    void fetchExpenses(true);
  };

  // --- Render ---------------------------------------------------------------

  if (loading) return <CallRequestsAdminSkeleton />;

  if (migration) {
    return <SetupPanel sql={migration} refreshing={refreshing} onRefresh={() => fetchExpenses()} />;
  }

  return (
    <div className="space-y-5 sm:space-y-6 w-full min-w-0">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Receipt className="h-6 w-6 text-cyan-600 shrink-0" /> Expenses
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Salaries, office costs and everything else the clinic spends — recorded, totaled and
            searchable.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchExpenses()}
            disabled={refreshing}
            className="w-full sm:w-auto"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Button
            size="sm"
            onClick={openCreate}
            className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-700"
          >
            <span className="mr-2 text-base leading-none">＋</span> New expense
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="This month" value={money(stats.thisMonth)} icon={Calendar} tone="text-cyan-600" />
        <StatCard label="Last month" value={money(stats.lastMonth)} icon={Calendar} tone="text-teal-600" />
        <StatCard label="All time" value={money(stats.allTime)} icon={IndianRupee} tone="text-gray-900" />
        <StatCard label="Entries" value={stats.count} icon={Receipt} tone="text-blue-600" />
        <StatCard label="Largest entry" value={money(stats.largest)} icon={TrendingDown} tone="text-rose-600" />
        <StatCard
          label={stats.topCategory.name !== '—' ? `Top: ${stats.topCategory.name}` : 'Top category'}
          value={money(stats.topCategory.total)}
          icon={Tag}
          tone="text-violet-600"
        />
      </div>

      {/* Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">Spending — last 6 months</h2>
            <span className="text-xs text-gray-400">by expense date</span>
          </div>
          {allRows.length === 0 || monthlyTrend.every((d) => d.total === 0) ? (
            <div className="h-52 flex items-center justify-center text-sm text-gray-400">
              {allRows.length === 0 ? 'No data yet' : 'No expenses in the last 6 months'}
            </div>
          ) : (
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrend} margin={{ top: 5, right: 8, left: -8, bottom: 0 }}>
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => (v >= 100000 ? `${Math.round(v / 100000)}L` : String(v))}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(6,182,212,0.06)' }}
                    contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
                    formatter={(value) => [money(Number(value) || 0), 'Spent']}
                  />
                  <Bar dataKey="total" fill="#06b6d4" radius={[4, 4, 0, 0]} maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">By category (all time)</h2>
          {categoryBreakdown.length === 0 ? (
            <div className="h-52 flex items-center justify-center text-sm text-gray-400">No data yet</div>
          ) : (
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                  >
                    {categoryBreakdown.map((entry) => (
                      <Cell key={entry.key} fill={categoryHex(entry.key)} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
                    formatter={(value, name) => [money(Number(value) || 0), name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 max-h-24 overflow-y-auto">
            {categoryBreakdown.map((entry) => (
              <span key={entry.key} className="flex items-center gap-1.5 text-xs text-gray-600">
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: categoryHex(entry.key) }} />
                <span className="truncate max-w-[110px]">{entry.name}</span>
                <span className="text-gray-400">{money(entry.value)}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly calculator table */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 overflow-x-auto">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900">Monthly breakdown — last 6 months</h2>
          <span className="text-xs text-gray-400">count · total · top category</span>
        </div>
        {allRows.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400">No expenses recorded yet</p>
        ) : (
          <table className="w-full text-sm min-w-[520px]">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-gray-400 border-b">
                <th className="py-2 pr-3 font-medium">Month</th>
                <th className="py-2 px-3 font-medium text-right">Entries</th>
                <th className="py-2 px-3 font-medium text-right">Total</th>
                <th className="py-2 pl-3 font-medium">Top category</th>
              </tr>
            </thead>
            <tbody>
              {monthlySummary.map((row) => (
                <tr key={row.key} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="py-2 pr-3 font-medium text-gray-900 whitespace-nowrap">{row.label}</td>
                  <td className="py-2 px-3 text-right tabular-nums text-gray-600">{row.count}</td>
                  <td
                    className={`py-2 px-3 text-right tabular-nums font-semibold ${
                      row.total ? 'text-gray-900' : 'text-gray-300'
                    }`}
                  >
                    {money(row.total)}
                  </td>
                  <td className="py-2 pl-3 text-gray-600 max-w-[180px] truncate">{row.top}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-200">
                <td className="py-2 pr-3 text-xs font-semibold uppercase text-gray-500 whitespace-nowrap">
                  6-month total
                </td>
                <td className="py-2 px-3 text-right tabular-nums font-semibold">{summaryTotals.count}</td>
                <td className="py-2 px-3 text-right tabular-nums font-bold text-gray-900">
                  {money(summaryTotals.total)}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by title, category, payee or notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <SelectField
          ariaLabel="Filter by category"
          value={categoryOptions.includes(categoryFilter) ? categoryFilter : 'all'}
          onChange={setCategoryFilter}
          className="min-w-[150px]"
        >
          <option value="all">All categories</option>
          {categoryOptions.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </SelectField>
        <SelectField
          ariaLabel="Filter by month"
          value={monthOptions.includes(monthFilter) ? monthFilter : 'all'}
          onChange={setMonthFilter}
          className="min-w-[150px]"
        >
          <option value="all">All months</option>
          {monthOptions.map((key) => (
            <option key={key} value={key}>
              {monthLabel(key)}
            </option>
          ))}
        </SelectField>
        <SelectField
          ariaLabel="Filter by payment method"
          value={paidViaFilter}
          onChange={setPaidViaFilter}
          className="min-w-[140px]"
        >
          <option value="all">All methods</option>
          {PAID_VIA_OPTIONS.map((method) => (
            <option key={method} value={method}>
              {PAID_VIA_LABELS[method]}
            </option>
          ))}
        </SelectField>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span className="flex-1">{error}</span>
          <Button variant="outline" size="sm" onClick={() => fetchExpenses()}>
            Retry
          </Button>
        </div>
      )}

      {/* Cap note */}
      {allRows.length > expenses.length && filtered.length > 0 && (
        <p className="text-xs text-gray-400 text-right -mt-2">
          Showing the latest {expenses.length} of {allRows.length} expenses — stats, charts and the
          monthly breakdown above cover all of them.
        </p>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-14 bg-white rounded-xl border border-gray-200">
          <Receipt className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-600 font-medium">
            {allRows.length === 0 ? 'No expenses yet' : 'No expenses match your filters'}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {allRows.length === 0
              ? 'Use “New expense” to record a salary, office cost or any other spend.'
              : 'Try adjusting the search or filters.'}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {grouped.map((group) => (
            <div key={group.key} className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-semibold text-gray-700">
                  {group.key === 'unknown' ? 'Undated' : monthLabel(group.key)}
                </h3>
                <p className="text-xs text-gray-400">
                  {group.rows.length} {group.rows.length === 1 ? 'entry' : 'entries'} ·{' '}
                  {money(group.subtotal)}
                </p>
              </div>

              {group.rows.map((e) => {
                const isExpanded = expandedId === e.id;
                const date = parseDateSafe(e.expense_date);
                const created = parseDateSafe(e.created_at);
                const isConfirmingDelete = confirmDeleteId === e.id;

                return (
                  <div key={e.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {/* Main row */}
                    <div
                      className="p-4 flex items-center gap-3 sm:gap-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => {
                        setExpandedId(isExpanded ? null : e.id);
                        setConfirmDeleteId(null);
                      }}
                    >
                      <div className="w-16 text-center shrink-0">
                        <p className="text-sm font-semibold text-gray-900">{formatExpenseDate(e.expense_date)}</p>
                        <p className="text-xs text-gray-500">{date ? format(date, 'EEE') : '—'}</p>
                      </div>

                      <Badge
                        className={`text-[10px] border shrink-0 max-w-[120px] truncate ${categoryBadgeClass(e.category)}`}
                        title={`Category: ${e.category}`}
                      >
                        {e.category || 'Uncategorised'}
                      </Badge>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{e.title}</p>
                        {e.paid_to && (
                          <p className="text-xs text-gray-500 truncate">Paid to {e.paid_to}</p>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <p className="font-semibold text-gray-900 tabular-nums">{money(e.amount)}</p>
                        <p className="text-[10px] text-gray-400">{paidViaLabel(e.paid_via)}</p>
                      </div>

                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-gray-400 shrink-0" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400 shrink-0" />
                      )}
                    </div>

                    {/* Expanded details + actions */}
                    {isExpanded && (
                      <div className="border-t bg-gray-50 p-4 space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">Details</h4>
                            <div className="space-y-1 text-sm">
                              <p>
                                <span className="text-gray-500">Category:</span>{' '}
                                <span className="font-medium">{e.category || 'Uncategorised'}</span>
                              </p>
                              <p>
                                <span className="text-gray-500">Amount:</span>{' '}
                                <span className="font-medium tabular-nums">{money(e.amount)}</span>
                              </p>
                              <p>
                                <span className="text-gray-500">Paid via:</span>{' '}
                                <span className="font-medium">{paidViaLabel(e.paid_via)}</span>
                              </p>
                              <p>
                                <span className="text-gray-500">Paid on:</span>{' '}
                                <span className="font-medium">
                                  {date ? format(date, 'EEE, dd MMM yyyy') : e.expense_date || '—'}
                                </span>
                              </p>
                              <p>
                                <span className="text-gray-500">Recorded:</span>{' '}
                                <span className="font-medium">
                                  {created ? format(created, 'dd MMM yyyy, HH:mm') : '—'}
                                </span>
                              </p>
                              <p>
                                <span className="text-gray-500">Recorded by:</span>{' '}
                                <span className="font-medium break-all">{e.created_by || '—'}</span>
                              </p>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">Notes</h4>
                            {e.notes ? (
                              <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                                {e.notes}
                              </p>
                            ) : (
                              <p className="text-sm text-gray-400">No notes for this entry.</p>
                            )}
                          </div>
                        </div>

                        {/* Actions / delete confirmation */}
                        {isConfirmingDelete ? (
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm text-red-700 flex-1 min-w-[200px]">
                              Delete “{e.title}” permanently? This cannot be undone.
                            </p>
                            <Button
                              size="sm"
                              className="bg-red-600 hover:bg-red-700 text-white"
                              disabled={actionId === e.id}
                              onClick={() => deleteExpense(e.id)}
                            >
                              {actionId === e.id ? (
                                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                              ) : (
                                <AlertCircle className="h-3 w-3 mr-1" />
                              )}
                              Confirm delete
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={actionId === e.id}
                              onClick={() => setConfirmDeleteId(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={actionId === e.id}
                              onClick={() => openEdit(e)}
                            >
                              <Pencil className="h-3 w-3 mr-1" /> Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              disabled={actionId === e.id}
                              onClick={() => setConfirmDeleteId(e.id)}
                            >
                              <Trash2Icon /> Delete
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      <ExpenseDialog
        key={editing?.id || 'new'}
        open={dialogOpen}
        initial={editing}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditing(null);
        }}
        onSaved={handleSaved}
        onMigration={() => {
          setDialogOpen(false);
          setEditing(null);
          setMigration(EXPENSES_MIGRATION_SQL);
        }}
      />
    </div>
  );
}

function Trash2Icon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3 w-3 mr-1"
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Setup banner — shown until the one-time migration SQL has been run
// ---------------------------------------------------------------------------

function SetupPanel({
  sql,
  refreshing,
  onRefresh,
}: {
  sql: string;
  refreshing: boolean;
  onRefresh: () => void;
}) {
  const copySql = async () => {
    try {
      await navigator.clipboard.writeText(sql);
      toast.success('SQL copied — paste it in the Supabase SQL Editor and run it.');
    } catch {
      toast.error('Could not copy — select the SQL below manually.');
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6 w-full min-w-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Receipt className="h-6 w-6 text-cyan-600 shrink-0" /> Expenses
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Salaries, office costs and everything else the clinic spends — recorded, totaled and
          searchable.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-amber-300 p-5 sm:p-6 space-y-4 max-w-3xl">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-gray-900">One-time setup needed</h2>
            <p className="text-sm text-gray-600 mt-1">
              The expense table hasn&apos;t been created in the database yet. Run the SQL below once
              in the Supabase dashboard (<span className="font-mono text-xs">SQL Editor → New query</span>),
              then come back and refresh. It is safe to re-run and nothing else is required.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={copySql} className="bg-cyan-600 hover:bg-cyan-700">
            <Copy className="h-4 w-4 mr-2" /> Copy SQL
          </Button>
          <Button size="sm" variant="outline" onClick={onRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} /> I ran it —
            refresh
          </Button>
        </div>

        <pre className="bg-gray-950 text-gray-100 text-xs rounded-lg p-4 overflow-x-auto max-h-80 leading-relaxed">
          {sql}
        </pre>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stat card + select (shared visual language with Audit Bookings)
// ---------------------------------------------------------------------------

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs text-gray-500 truncate">{label}</p>
          <p className={`text-lg xl:text-xl font-semibold mt-1 tabular-nums truncate ${tone}`}>
            {value}
          </p>
        </div>
        <Icon className="h-5 w-5 text-gray-300 shrink-0" />
      </div>
    </div>
  );
}

function SelectField({
  value,
  onChange,
  ariaLabel,
  className,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  ariaLabel?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`relative ${className || ''}`}>
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-9 text-sm text-gray-900 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300"
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// New / edit expense dialog
// ---------------------------------------------------------------------------

const CUSTOM_CATEGORY = '__custom';

function ExpenseDialog({
  open,
  initial,
  onOpenChange,
  onSaved,
  onMigration,
}: {
  open: boolean;
  initial: Expense | null;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
  onMigration?: () => void;
}) {
  const isPreset = (value: string) => (EXPENSE_CATEGORIES as readonly string[]).includes(value);

  const [title, setTitle] = useState(initial?.title || '');
  const [category, setCategory] = useState<string>(() => {
    if (!initial?.category) return EXPENSE_CATEGORIES[0];
    return isPreset(initial.category) ? initial.category : CUSTOM_CATEGORY;
  });
  const [customCategory, setCustomCategory] = useState<string>(() =>
    initial?.category && !isPreset(initial.category) ? initial.category : ''
  );
  const [amount, setAmount] = useState(initial ? String(initial.amount) : '');
  const [date, setDate] = useState(initial?.expense_date || istTodayIso());
  const [paidVia, setPaidVia] = useState<PaidVia>(
    (PAID_VIA_OPTIONS as readonly string[]).includes(initial?.paid_via || '')
      ? ((initial?.paid_via || 'cash') as PaidVia)
      : 'cash'
  );
  const [paidTo, setPaidTo] = useState(initial?.paid_to || '');
  const [notes, setNotes] = useState(initial?.notes || '');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const effectiveCategory = category === CUSTOM_CATEGORY ? customCategory.trim() : category;

  // Keystroke gate: digits and at most one decimal point, max 8 + 2dp — the
  // same rule the server enforces (₹1,00,00,000 cap).
  const onAmountChange = (next: string) => {
    const clean = next.replace(/[^\d.]/g, '');
    if (/^\d{0,8}(\.\d{0,2})?$/.test(clean)) setAmount(clean);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const payload = {
      title,
      category: effectiveCategory,
      amount,
      date,
      paidVia,
      paidTo,
      notes,
    };

    // Client validation runs the exact same code the API runs.
    const check = validateExpenseFields(payload, 'create');
    if (!check.ok) {
      setFormError(check.error);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(
        initial ? `/api/super-admin/expenses/${initial.id}` : '/api/super-admin/expenses',
        {
          method: initial ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (data.migrationRequired) {
        onMigration?.();
        return;
      }
      if (!res.ok || !data.success) {
        setFormError(data.error || 'Could not save the expense');
        return;
      }
      toast.success(data.message || (initial ? 'Expense updated' : 'Expense recorded'));
      onSaved();
      onOpenChange(false);
    } catch {
      setFormError('Could not save the expense — check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const fieldLabel = 'block text-xs font-medium text-gray-600 mb-1';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] gap-0 overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b border-gray-100 px-6 pb-4 pr-10 pt-6">
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-cyan-600" />
            {initial ? 'Edit expense' : 'New expense'}
          </DialogTitle>
          <DialogDescription>
            {initial
              ? 'Update the details of this entry. Only what you change is rewritten.'
              : 'Record a salary, office cost or any other spend. Totals update instantly.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="flex min-h-0 flex-col">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-4">
            {/* Title */}
            <div>
              <label className={fieldLabel} htmlFor="expense-title">
                Title <span className="text-red-500">*</span>
              </label>
              <Input
                id="expense-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={EXPENSE_LIMITS.titleMax}
                placeholder="e.g. October salary — Dr. Sharma"
              />
            </div>

            {/* Category (preset or dynamic custom entry) */}
            <div>
              <label className={fieldLabel} htmlFor="expense-category">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <SelectField
                  value={category}
                  onChange={setCategory}
                  ariaLabel="Expense category"
                  className="sm:flex-1"
                >
                  {EXPENSE_CATEGORIES.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                  {/* Keep an existing custom category selectable when editing */}
                  {initial?.category && !isPreset(initial.category) && category !== CUSTOM_CATEGORY && (
                    <option value={initial.category}>{initial.category}</option>
                  )}
                  <option value={CUSTOM_CATEGORY}>+ Custom category…</option>
                </SelectField>
                {category === CUSTOM_CATEGORY && (
                  <Input
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    maxLength={EXPENSE_LIMITS.categoryMax}
                    placeholder="Type any category, e.g. Security"
                    className="sm:flex-1"
                    autoFocus
                  />
                )}
              </div>
            </div>

            {/* Amount + date + method */}
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className={fieldLabel} htmlFor="expense-amount">
                  Amount (₹) <span className="text-red-500">*</span>
                </label>
                <Input
                  id="expense-amount"
                  value={amount}
                  onChange={(e) => onAmountChange(e.target.value)}
                  inputMode="decimal"
                  placeholder="0"
                />
              </div>
              <div>
                <label className={fieldLabel} htmlFor="expense-date">
                  Date <span className="text-red-500">*</span>
                </label>
                <Input
                  id="expense-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={EXPENSE_LIMITS.dateMin}
                  max={istTodayIso()}
                />
              </div>
              <div>
                <label className={fieldLabel} htmlFor="expense-via">
                  Paid via
                </label>
                <SelectField
                  value={paidVia}
                  onChange={(v) => setPaidVia(v as PaidVia)}
                  ariaLabel="Payment method"
                >
                  {PAID_VIA_OPTIONS.map((method) => (
                    <option key={method} value={method}>
                      {PAID_VIA_LABELS[method]}
                    </option>
                  ))}
                </SelectField>
              </div>
            </div>

            {/* Paid to */}
            <div>
              <label className={fieldLabel} htmlFor="expense-payee">
                Paid to <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <Input
                id="expense-payee"
                value={paidTo}
                onChange={(e) => setPaidTo(e.target.value)}
                maxLength={EXPENSE_LIMITS.paidToMax}
                placeholder="Employee, landlord, vendor…"
              />
            </div>

            {/* Notes */}
            <div>
              <label className={fieldLabel} htmlFor="expense-notes">
                Notes <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <textarea
                id="expense-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={EXPENSE_LIMITS.notesMax}
                rows={3}
                placeholder="Anything worth remembering about this spend…"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300"
              />
              {notes.length > 0 && (
                <p className="text-[11px] text-gray-400 text-right mt-1 tabular-nums">
                  {notes.length}/{EXPENSE_LIMITS.notesMax}
                </p>
              )}
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}
          </div>

          <DialogFooter className="shrink-0 border-t border-gray-100 px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {initial ? 'Save changes' : 'Record expense'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ExpensesPage() {
  return <ExpensesContent />;
}
