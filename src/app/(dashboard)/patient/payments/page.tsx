'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Loader2, IndianRupee, CreditCard, Calendar, 
  CheckCircle2, Clock, XCircle, Download, FileText
} from 'lucide-react';
import { APP_CONFIG } from '@/constants/config';

interface Payment {
  id: string;
  date: string;
  appointmentDate: string;
  time: string;
  amount: number;
  status: string;
  transactionId: string;
  service: string;
  doctor: string;
}

interface Stats {
  totalPaid: number;
  totalPending: number;
  totalRefunded: number;
  count: number;
}

const STATUS_COLORS: Record<string, string> = {
  paid: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  refunded: 'bg-purple-100 text-purple-700',
  failed: 'bg-red-100 text-red-700',
};

const STATUS_ICONS: Record<string, any> = {
  paid: CheckCircle2,
  pending: Clock,
  refunded: XCircle,
};

export default function PatientPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<Stats>({ totalPaid: 0, totalPending: 0, totalRefunded: 0, count: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [invoiceLoading, setInvoiceLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchPayments();
  }, [filter]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('status', filter);
      
      const res = await fetch(`/api/patient/payments?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setPayments(data.data || []);
        setStats(data.stats || { totalPaid: 0, totalPending: 0, totalRefunded: 0, count: 0 });
      }
    } catch (err) {
      console.error('Failed to fetch payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInvoiceDownload = async (payment: Payment) => {
    setInvoiceLoading(payment.id);
    try {
      const response = await fetch(`/api/invoices/${payment.id}`);
      const data = await response.json();
      if (data.success && data.data) {
        const inv = data.data;
        const fmtC = (a: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(a);
        const fmtD = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        const fmtDLong = (d: string) => new Date(d).toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
        const modeLabel = ({ online: 'Online Consultation', offline: 'Clinic Visit', home_visit: 'Home Visit' } as Record<string, string>)[inv.appointment?.mode] || inv.appointment?.mode || 'Consultation';
        const isPaid = inv.appointment?.paymentStatus === 'paid';

        const htmlContent = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><title>Invoice ${inv.invoiceNumber} - H2H Healthcare</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',system-ui,sans-serif;color:#1e293b;line-height:1.4;background:#f1f5f9}
.toolbar{max-width:780px;margin:10px auto 0;display:flex;justify-content:flex-end;gap:8px}
.toolbar button{padding:8px 18px;border:none;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:6px;transition:all .2s}
.btn-print{background:linear-gradient(135deg,#0891b2,#06b6d4);color:#fff}
.btn-print:hover{background:linear-gradient(135deg,#0e7490,#0891b2)}
.btn-download{background:#fff;color:#334155;border:1px solid #e2e8f0 !important}
.btn-download:hover{background:#f8fafc}
.page{max-width:780px;margin:8px auto 20px;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,.06)}
.accent-bar{height:5px;background:linear-gradient(90deg,#0891b2,#06b6d4,#22d3ee)}
.header{display:flex;justify-content:space-between;align-items:flex-start;padding:20px 30px 16px}
.brand{display:flex;align-items:center;gap:10px}
.brand-icon{width:38px;height:38px;background:linear-gradient(135deg,#0891b2,#06b6d4);border-radius:9px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:14px}
.brand-text h2{font-size:16px;font-weight:700;color:#0f172a}
.brand-text p{font-size:9px;color:#94a3b8;font-weight:500;letter-spacing:0.5px;text-transform:uppercase}
.inv-badge{text-align:right}
.inv-badge h1{font-size:10px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:#0891b2;margin-bottom:2px}
.inv-badge .inv-num{font-size:17px;font-weight:800;color:#0f172a}
.inv-badge .inv-date{font-size:10px;color:#64748b;margin-top:3px}
.divider{height:1px;background:#e2e8f0;margin:0 30px}
.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:0;padding:14px 30px}
.info-col{padding-right:20px}
.info-col:last-child{padding-right:0;padding-left:20px;border-left:1px solid #f1f5f9}
.info-label{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:#0891b2;margin-bottom:6px}
.info-name{font-size:13px;font-weight:700;color:#0f172a;margin-bottom:4px}
.info-row{display:flex;justify-content:space-between;align-items:center;padding:2px 0;font-size:11px}
.info-row .label{color:#64748b;font-weight:500}
.info-row .val{color:#1e293b;font-weight:600;text-align:right}
.mode-badge{display:inline-flex;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:600;background:#ecfeff;color:#0891b2;border:1px solid #cffafe}
.svc-section{padding:0 30px 14px}
.svc-header{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:#0891b2;margin-bottom:8px}
.svc-table{width:100%;border-collapse:separate;border-spacing:0;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden}
.svc-table thead th{background:#f8fafc;padding:8px 12px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#64748b;border-bottom:1px solid #e2e8f0;text-align:left}
.svc-table thead th:last-child{text-align:right}
.svc-table tbody td{padding:10px 12px;font-size:11px;color:#334155;font-weight:500}
.svc-table tbody td:first-child{font-weight:700;color:#0f172a;font-size:12px}
.svc-table tbody td:last-child{text-align:right;font-weight:700;color:#0f172a;font-size:12px}
.totals-wrap{display:flex;justify-content:flex-end;padding:0 30px 14px}
.totals{width:240px;background:#f8fafc;border-radius:8px;padding:10px 14px;border:1px solid #e2e8f0}
.totals-row{display:flex;justify-content:space-between;padding:3px 0;font-size:11px;color:#64748b;font-weight:500}
.totals-row .amt{color:#334155;font-weight:600}
.totals-row.grand{border-top:2px solid #0891b2;margin-top:6px;padding-top:8px}
.totals-row.grand span{font-size:14px;font-weight:800;color:#0891b2}
.pay-section{padding:0 30px 14px}
.pay-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}
.pay-card{background:#f8fafc;border-radius:6px;padding:8px 12px;border:1px solid #e2e8f0}
.pay-card .pc-label{font-size:8px;font-weight:600;text-transform:uppercase;letter-spacing:0.8px;color:#94a3b8;margin-bottom:2px}
.pay-card .pc-val{font-size:11px;font-weight:700;color:#0f172a}
.status-paid{display:inline-flex;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:700;background:#dcfce7;color:#166534;border:1px solid #bbf7d0}
.status-pending{display:inline-flex;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:700;background:#fef9c3;color:#854d0e;border:1px solid #fde68a}
.footer{background:#f8fafc;border-top:1px solid #e2e8f0;padding:14px 30px;display:flex;justify-content:space-between;align-items:center}
.footer-left p{font-size:9px;color:#94a3b8;line-height:1.5}
.footer-left p strong{color:#64748b}
.footer-right{text-align:right}
.footer-right .thank{font-size:12px;font-weight:700;color:#0891b2;margin-bottom:2px}
.footer-right p{font-size:9px;color:#94a3b8}
@media print{.toolbar{display:none !important}body{background:#fff}.page{margin:0;border-radius:0;box-shadow:none;max-width:100%}@page{margin:10mm;size:A4}}
</style></head><body>
<div class="toolbar">
  <button class="btn-download" onclick="downloadHTML()">&#11015; Download HTML</button>
  <button class="btn-print" onclick="window.print()">&#128438; Save as PDF</button>
</div>
<div class="page">
  <div class="accent-bar"></div>
  <div class="header">
    <div class="brand"><div class="brand-icon">H2H</div><div class="brand-text"><h2>H2H Healthcare</h2><p>Physiotherapy & Wellness</p></div></div>
    <div class="inv-badge"><h1>Invoice</h1><div class="inv-num">${inv.invoiceNumber}</div><div class="inv-date">Issued ${fmtD(inv.invoiceDate)}</div></div>
  </div>
  <div class="divider"></div>
  <div class="info-grid">
    <div class="info-col">
      <div class="info-label">Billed To</div>
      <div class="info-name">${inv.patient?.name || 'Patient'}</div>
      <div class="info-row"><span class="label">Phone</span><span class="val">${inv.patient?.phone || 'N/A'}</span></div>
      <div class="info-row"><span class="label">Email</span><span class="val" style="font-size:10px">${inv.patient?.email || 'N/A'}</span></div>
    </div>
    <div class="info-col">
      <div class="info-label">Appointment Details</div>
      <div class="info-row"><span class="label">Date</span><span class="val">${fmtDLong(inv.appointment?.date || payment.date)}</span></div>
      <div class="info-row"><span class="label">Time</span><span class="val">${inv.appointment?.time || payment.time}</span></div>
      <div class="info-row"><span class="label">Mode</span><span class="val"><span class="mode-badge">${modeLabel}</span></span></div>
      ${inv.location?.name ? '<div class="info-row"><span class="label">Location</span><span class="val" style="font-size:10px">' + inv.location.name + ', ' + (inv.location.city || '') + '</span></div>' : ''}
    </div>
  </div>
  <div class="divider" style="margin-bottom:14px"></div>
  <div class="svc-section">
    <div class="svc-header">Service Details</div>
    <table class="svc-table"><thead><tr><th>Service</th><th>Doctor</th><th>Duration</th><th>Amount</th></tr></thead>
    <tbody><tr><td>${inv.service?.name || payment.service}</td><td>${inv.service?.doctor ? 'Dr. ' + inv.service.doctor : payment.doctor}</td><td>${inv.service?.duration || 30} mins</td><td>${fmtC(inv.billing?.subtotal || payment.amount)}</td></tr></tbody></table>
  </div>
  <div class="totals-wrap"><div class="totals">
    <div class="totals-row"><span>Subtotal</span><span class="amt">${fmtC(inv.billing?.subtotal || payment.amount)}</span></div>
    <div class="totals-row"><span>GST (Included)</span><span class="amt">${fmtC(inv.billing?.gst ?? Math.round(payment.amount * 0.18))}</span></div>
    <div class="totals-row grand"><span>Total Payable</span><span>${fmtC(inv.billing?.total || payment.amount)}</span></div>
  </div></div>
  <div class="divider" style="margin-bottom:14px"></div>
  <div class="pay-section">
    <div class="svc-header" style="margin-bottom:8px">Payment Information</div>
    <div class="pay-grid">
      <div class="pay-card"><div class="pc-label">Status</div><div class="pc-val"><span class="${isPaid ? 'status-paid' : 'status-pending'}">${payment.status === 'refunded' ? 'Refunded' : (isPaid ? 'Paid' : 'Pending')}</span></div></div>
      <div class="pay-card"><div class="pc-label">Method</div><div class="pc-val">${inv.billing?.paymentMethod || 'Online'}</div></div>
      <div class="pay-card"><div class="pc-label">Transaction ID</div><div class="pc-val" style="font-size:9px;word-break:break-all">${inv.billing?.transactionId || payment.transactionId || 'N/A'}</div></div>
    </div>
  </div>
  <div class="footer">
    <div class="footer-left"><p><strong>${inv.company?.name || 'H2H Healthcare'}</strong></p><p>${inv.company?.address || 'Tower B, DLF Cyber City, Gurgaon, Haryana 122002'}</p><p>GSTIN: ${inv.company?.gstin || '06AABCH1234A1Z5'}</p><p style="margin-top:3px;font-size:8px">Computer-generated invoice</p></div>
    <div class="footer-right"><div class="thank">Thank you!</div><p>${inv.company?.phone || APP_CONFIG.phone}</p><p>${inv.company?.email || APP_CONFIG.email}</p></div>
  </div>
</div>
<script>
function downloadHTML(){
  var a=document.createElement('a');
  a.href='data:text/html;charset=utf-8,'+encodeURIComponent(document.documentElement.outerHTML);
  a.download='Invoice-${inv.invoiceNumber}.html';
  a.click();
}
</script>
</body></html>`;

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const blobUrl = URL.createObjectURL(blob);
        const w = window.open(blobUrl, '_blank');
        if (w) {
          w.onload = () => setTimeout(() => w.print(), 500);
        }
        setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
      } else {
        alert('Failed to generate invoice.');
      }
    } catch (err) {
      console.error('Invoice error:', err);
      alert('Failed to generate invoice.');
    } finally {
      setInvoiceLoading(null);
    }
  };

  return (
    <div className="p-3 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div>
          <h1 className="text-lg md:text-xl font-semibold text-gray-900">Payment History</h1>
          <p className="text-xs md:text-sm text-gray-500">View all your transactions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6">
        <Card className="border-gray-200 bg-green-50/50">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
              <div>
                <p className="text-base md:text-lg font-semibold text-gray-900 flex items-center">
                  <IndianRupee className="h-3 w-3 md:h-4 md:w-4" />{stats.totalPaid.toLocaleString()}
                </p>
                <p className="text-[10px] md:text-xs text-gray-500">Total Paid</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200 bg-yellow-50/50">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 md:h-5 md:w-5 text-yellow-600" />
              <div>
                <p className="text-base md:text-lg font-semibold text-gray-900 flex items-center">
                  <IndianRupee className="h-3 w-3 md:h-4 md:w-4" />{stats.totalPending.toLocaleString()}
                </p>
                <p className="text-[10px] md:text-xs text-gray-500">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200 bg-purple-50/50">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
              <div>
                <p className="text-base md:text-lg font-semibold text-gray-900 flex items-center">
                  <IndianRupee className="h-3 w-3 md:h-4 md:w-4" />{stats.totalRefunded.toLocaleString()}
                </p>
                <p className="text-[10px] md:text-xs text-gray-500">Refunded</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200 bg-gray-50/50">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
              <div>
                <p className="text-base md:text-lg font-semibold text-gray-900">{stats.count}</p>
                <p className="text-[10px] md:text-xs text-gray-500">Transactions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 md:mb-6 overflow-x-auto pb-2">
        {['all', 'paid', 'pending', 'refunded'].map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f)}
            className={`text-xs md:text-sm shrink-0 ${filter === f ? 'bg-cyan-500 hover:bg-cyan-600' : ''}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      {/* Payments Table */}
      <Card className="border-gray-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-4">
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-16 ml-auto" />
                </div>
              ))}
            </div>
          </div>
        ) : payments.length === 0 ? (
          <CardContent className="py-16 text-center">
            <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No payment records found</p>
          </CardContent>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/80">
                  <TableHead className="text-xs font-semibold text-gray-600">Date</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600">Service</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600 hidden md:table-cell">Doctor</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600 hidden lg:table-cell">Transaction ID</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600 text-right">Amount</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600 text-center">Status</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600 text-right">Invoice</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id} className="hover:bg-gray-50/50">
                    <TableCell className="text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        {new Date(payment.date).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium text-gray-900">{payment.service}</p>
                      <p className="text-xs text-gray-500 md:hidden">{payment.doctor}</p>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 hidden md:table-cell">
                      {payment.doctor}
                    </TableCell>
                    <TableCell className="text-xs text-gray-500 font-mono hidden lg:table-cell">
                      {payment.transactionId ? `${payment.transactionId.slice(0, 16)}...` : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold text-gray-900 flex items-center justify-end">
                        <IndianRupee className="h-3.5 w-3.5" />{payment.amount.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={`${STATUS_COLORS[payment.status]} capitalize text-[10px] md:text-xs`}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50"
                        onClick={() => handleInvoiceDownload(payment)}
                        disabled={!!invoiceLoading}
                      >
                        {invoiceLoading === payment.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <FileText className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">Invoice</span>
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}
