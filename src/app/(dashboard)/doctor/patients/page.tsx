'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Search, RefreshCw, Phone, Mail, Calendar } from 'lucide-react';

interface PatientRow {
  patientId: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  lastVisit: string;
  lastTime: string;
  appointmentCount: number;
}

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState<PatientRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('pageSize', String(pageSize));
      if (search) params.set('search', search);
      const res = await fetch(`/api/doctor/patients?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setPatients(data.data || []);
        setTotal(data.total ?? 0);
      } else {
        setError(data.error || 'Failed to load patients');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [page, search]);

  const totalPages = Math.ceil(total / pageSize);
  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  if (loading && patients.length === 0) {
    return (
      <div className="p-6 lg:p-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Patients</h1>
            <p className="text-sm text-gray-500 mt-0.5">{total} patients</p>
          </div>
          <div className="flex items-center gap-2 sm:ml-auto w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search name, email, phone..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="h-9 pl-9 pr-3 rounded-lg border border-gray-200 text-sm w-full sm:w-56"
              />
            </div>
            <Button variant="outline" size="sm" onClick={fetchPatients} className="shrink-0">
              <RefreshCw className="h-4 w-4 mr-1" /> Refresh
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-5 w-5" /> Patient list
          </CardTitle>
        </CardHeader>
        <CardContent>
          {patients.length === 0 ? (
            <div className="py-12 text-center text-gray-500 text-sm">No patients found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-500 font-medium">
                    <th className="pb-3 pr-4">Name</th>
                    <th className="pb-3 pr-4">Contact</th>
                    <th className="pb-3 pr-4">Last visit</th>
                    <th className="pb-3">Visits</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((p) => (
                    <tr key={p.patientId || p.fullName} className="border-b border-gray-100">
                      <td className="py-3 pr-4 font-medium text-gray-900">{p.fullName}</td>
                      <td className="py-3 pr-4 text-gray-600">
                        <div className="flex flex-col gap-0.5">
                          {p.phone && (
                            <a href={`tel:${p.phone}`} className="flex items-center gap-1 text-cyan-600 hover:underline">
                              <Phone className="h-3 w-3" /> {p.phone}
                            </a>
                          )}
                          {p.email && (
                            <a href={`mailto:${p.email}`} className="flex items-center gap-1 text-cyan-600 hover:underline truncate max-w-[200px]">
                              <Mail className="h-3 w-3 shrink-0" /> {p.email}
                            </a>
                          )}
                          {!p.phone && !p.email && '—'}
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-gray-600 flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(p.lastVisit)} {p.lastTime ? `· ${p.lastTime.slice(0, 5)}` : ''}
                      </td>
                      <td className="py-3">{p.appointmentCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
              <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </Button>
              <span className="text-xs text-gray-500">Page {page} of {totalPages}</span>
              <Button variant="ghost" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
