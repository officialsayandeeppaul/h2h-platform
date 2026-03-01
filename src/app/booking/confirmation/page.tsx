'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Header, Footer } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Confetti, type ConfettiRef } from '@/components/ui/confetti';
import { 
  CheckCircle2, 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  Building2, 
  Home,
  Download,
  Share2,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { format } from 'date-fns';

interface AppointmentDetails {
  id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  mode: 'online' | 'offline' | 'home_visit';
  status: string;
  payment_status: string;
  amount: number;
  google_meet_link: string | null;
  metadata?: {
    center_id?: string;
    center_name?: string;
  };
  service: {
    name: string;
    duration_minutes: number;
  };
  doctor: {
    user: {
      full_name: string;
    };
    specializations: string[];
  };
  location: {
    name: string;
    city: string;
    address: string;
  };
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get('appointmentId');
  const [appointment, setAppointment] = useState<AppointmentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const confettiRef = useRef<ConfettiRef>(null);
  const [confettiFired, setConfettiFired] = useState(false);

  useEffect(() => {
    if (!appointmentId) {
      setError('No appointment ID provided');
      setLoading(false);
      return;
    }

    const fetchAppointment = async () => {
      try {
        const response = await fetch(`/api/appointments/${appointmentId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch appointment');
        }

        setAppointment(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load appointment');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  // Fire confetti only when appointment is paid (payment successful)
  useEffect(() => {
    if (appointment?.payment_status === 'paid' && !confettiFired) {
      setConfettiFired(true);
      // Fire multiple bursts for a party effect
      setTimeout(() => {
        confettiRef.current?.fire({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }, 300);
      setTimeout(() => {
        confettiRef.current?.fire({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
      }, 500);
      setTimeout(() => {
        confettiRef.current?.fire({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 700);
    }
  }, [appointment?.payment_status, appointment, confettiFired]);

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'online': return <Video className="h-5 w-5" />;
      case 'offline': return <Building2 className="h-5 w-5" />;
      case 'home_visit': return <Home className="h-5 w-5" />;
      default: return <Building2 className="h-5 w-5" />;
    }
  };

  const getModeLabel = (mode: string) => {
    switch (mode) {
      case 'online': return 'Online Consultation';
      case 'offline': return 'Clinic Visit';
      case 'home_visit': return 'Home Visit';
      default: return mode;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-medium text-gray-900 mb-4">
              {error || 'Appointment not found'}
            </h1>
            <Link href="/booking">
              <Button className="bg-cyan-500 hover:bg-cyan-600">
                Book New Appointment
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const doctorName = ((appointment.doctor as any)?.user?.full_name || (appointment.doctor as any)?.users?.full_name || 'Doctor').replace(/^Dr\.?\s*/i, '');
  const serviceName = appointment.service?.name || 'Healthcare Service';

  const calendarUrl = (() => {
    const apt = appointment;
    const startDT = `${apt.appointment_date.replace(/-/g, '')}T${(apt.start_time || '09:00').replace(/:/g, '')}00`;
    const endDT = `${apt.appointment_date.replace(/-/g, '')}T${(apt.end_time || '10:00').replace(/:/g, '')}00`;
    const locationText = apt.mode === 'online'
      ? (apt.google_meet_link || 'Online Video Consultation')
      : `${apt.location?.name || ''}, ${apt.location?.city || ''}`;
    const details = `H2H Healthcare Appointment\nService: ${serviceName}\nDoctor: Dr. ${doctorName}\nMode: ${apt.mode === 'online' ? 'Video Consultation' : 'In-Clinic Visit'}${apt.google_meet_link ? '\nMeet Link: ' + apt.google_meet_link : ''}`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`H2H: ${serviceName} with Dr. ${doctorName}`)}&dates=${startDT}/${endDT}&ctz=Asia/Kolkata&details=${encodeURIComponent(details)}&location=${encodeURIComponent(locationText)}`;
  })();

  const handleDownloadReceipt = async () => {
    try {
      const response = await fetch(`/api/invoices/${appointment.id}`);
      const data = await response.json();
      if (data.success && data.data) {
        const inv = data.data;
        const fmtC = (a: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(a);
        const fmtD = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        const fmtDLong = (d: string) => new Date(d).toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
        const modeLabel = ({ online: 'Online Consultation', offline: 'Clinic Visit', home_visit: 'Home Visit' } as Record<string, string>)[inv.appointment.mode] || inv.appointment.mode;
        const isPaid = inv.appointment.paymentStatus === 'paid';
        const htmlContent = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Invoice ${inv.invoiceNumber}</title><style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Inter',system-ui,sans-serif;color:#1e293b;line-height:1.4;background:#f1f5f9}.toolbar{max-width:780px;margin:10px auto 0;display:flex;justify-content:flex-end;gap:8px}.toolbar button{padding:8px 18px;border:none;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:6px;transition:all .2s}.btn-print{background:linear-gradient(135deg,#0891b2,#06b6d4);color:#fff}.btn-download{background:#fff;color:#334155;border:1px solid #e2e8f0 !important}.page{max-width:780px;margin:8px auto 20px;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,.06)}.accent-bar{height:5px;background:linear-gradient(90deg,#0891b2,#06b6d4,#22d3ee)}.header{display:flex;justify-content:space-between;align-items:flex-start;padding:20px 30px 16px}.brand{display:flex;align-items:center;gap:10px}.brand-icon{width:38px;height:38px;background:linear-gradient(135deg,#0891b2,#06b6d4);border-radius:9px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:14px}.brand-text h2{font-size:16px;font-weight:700;color:#0f172a}.brand-text p{font-size:9px;color:#94a3b8;font-weight:500;letter-spacing:0.5px;text-transform:uppercase}.inv-badge{text-align:right}.inv-badge h1{font-size:10px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:#0891b2;margin-bottom:2px}.inv-badge .inv-num{font-size:17px;font-weight:800;color:#0f172a}.inv-badge .inv-date{font-size:10px;color:#64748b;margin-top:3px}.divider{height:1px;background:#e2e8f0;margin:0 30px}.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:0;padding:14px 30px}.info-col{padding-right:20px}.info-col:last-child{padding-right:0;padding-left:20px;border-left:1px solid #f1f5f9}.info-label{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:#0891b2;margin-bottom:6px}.info-name{font-size:13px;font-weight:700;color:#0f172a;margin-bottom:4px}.info-row{display:flex;justify-content:space-between;align-items:center;padding:2px 0;font-size:11px}.info-row .label{color:#64748b;font-weight:500}.info-row .val{color:#1e293b;font-weight:600;text-align:right}.mode-badge{display:inline-flex;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:600;background:#ecfeff;color:#0891b2;border:1px solid #cffafe}.svc-section{padding:0 30px 14px}.svc-header{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:#0891b2;margin-bottom:8px}.svc-table{width:100%;border-collapse:separate;border-spacing:0;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden}.svc-table thead th{background:#f8fafc;padding:8px 12px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#64748b;border-bottom:1px solid #e2e8f0;text-align:left}.svc-table thead th:last-child{text-align:right}.svc-table tbody td{padding:10px 12px;font-size:11px;color:#334155;font-weight:500}.svc-table tbody td:first-child{font-weight:700;color:#0f172a;font-size:12px}.svc-table tbody td:last-child{text-align:right;font-weight:700;color:#0f172a;font-size:12px}.totals-wrap{display:flex;justify-content:flex-end;padding:0 30px 14px}.totals{width:240px;background:#f8fafc;border-radius:8px;padding:10px 14px;border:1px solid #e2e8f0}.totals-row{display:flex;justify-content:space-between;padding:3px 0;font-size:11px;color:#64748b;font-weight:500}.totals-row .amt{color:#334155;font-weight:600}.totals-row.grand{border-top:2px solid #0891b2;margin-top:6px;padding-top:8px}.totals-row.grand span{font-size:14px;font-weight:800;color:#0891b2}.pay-section{padding:0 30px 14px}.pay-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}.pay-card{background:#f8fafc;border-radius:6px;padding:8px 12px;border:1px solid #e2e8f0}.pay-card .pc-label{font-size:8px;font-weight:600;text-transform:uppercase;letter-spacing:0.8px;color:#94a3b8;margin-bottom:2px}.pay-card .pc-val{font-size:11px;font-weight:700;color:#0f172a}.status-paid{display:inline-flex;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:700;background:#dcfce7;color:#166534;border:1px solid #bbf7d0}.status-pending{display:inline-flex;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:700;background:#fef9c3;color:#854d0e;border:1px solid #fde68a}.footer{background:#f8fafc;border-top:1px solid #e2e8f0;padding:14px 30px;display:flex;justify-content:space-between;align-items:center}.footer-left p{font-size:9px;color:#94a3b8;line-height:1.5}.footer-left p strong{color:#64748b}.footer-right{text-align:right}.footer-right .thank{font-size:12px;font-weight:700;color:#0891b2;margin-bottom:2px}.footer-right p{font-size:9px;color:#94a3b8}@media print{.toolbar{display:none !important}body{background:#fff}.page{margin:0;border-radius:0;box-shadow:none;max-width:100%}@page{margin:10mm;size:A4}.accent-bar,thead th,.mode-badge,.status-paid,.status-pending,.totals,.pay-card,.brand-icon{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body><div class="toolbar"><button class="btn-download" onclick="var a=document.createElement('a');a.href='data:text/html;charset=utf-8,'+encodeURIComponent(document.documentElement.outerHTML);a.download='Invoice-${inv.invoiceNumber}.html';a.click()">&#11015; Download</button><button class="btn-print" onclick="window.print()">&#128438; Save as PDF</button></div><div class="page"><div class="accent-bar"></div><div class="header"><div class="brand"><div class="brand-icon">H2H</div><div class="brand-text"><h2>H2H Healthcare</h2><p>Physiotherapy & Wellness</p></div></div><div class="inv-badge"><h1>Invoice</h1><div class="inv-num">${inv.invoiceNumber}</div><div class="inv-date">Issued ${fmtD(inv.invoiceDate)}</div></div></div><div class="divider"></div><div class="info-grid"><div class="info-col"><div class="info-label">Billed To</div><div class="info-name">${inv.patient.name}</div><div class="info-row"><span class="label">Phone</span><span class="val">${inv.patient.phone || 'N/A'}</span></div><div class="info-row"><span class="label">Email</span><span class="val" style="font-size:10px">${inv.patient.email || 'N/A'}</span></div></div><div class="info-col"><div class="info-label">Appointment Details</div><div class="info-row"><span class="label">Date</span><span class="val">${fmtDLong(inv.appointment.date)}</span></div><div class="info-row"><span class="label">Time</span><span class="val">${inv.appointment.time}</span></div><div class="info-row"><span class="label">Mode</span><span class="val"><span class="mode-badge">${modeLabel}</span></span></div>${inv.location.name ? '<div class="info-row"><span class="label">Location</span><span class="val" style="font-size:10px">' + inv.location.name + ', ' + inv.location.city + '</span></div>' : ''}</div></div><div class="divider" style="margin-bottom:14px"></div><div class="svc-section"><div class="svc-header">Service Details</div><table class="svc-table"><thead><tr><th>Service</th><th>Doctor</th><th>Duration</th><th>Amount</th></tr></thead><tbody><tr><td>${inv.service.name}</td><td>Dr. ${inv.service.doctor}</td><td>${inv.service.duration} mins</td><td>${fmtC(inv.billing.subtotal)}</td></tr></tbody></table></div><div class="totals-wrap"><div class="totals"><div class="totals-row"><span>Subtotal</span><span class="amt">${fmtC(inv.billing.subtotal)}</span></div><div class="totals-row"><span>GST (Included)</span><span class="amt">${fmtC(inv.billing.gst)}</span></div><div class="totals-row grand"><span>Total Payable</span><span>${fmtC(inv.billing.total)}</span></div></div></div><div class="divider" style="margin-bottom:14px"></div><div class="pay-section"><div class="svc-header" style="margin-bottom:8px">Payment Information</div><div class="pay-grid"><div class="pay-card"><div class="pc-label">Status</div><div class="pc-val"><span class="${isPaid ? 'status-paid' : 'status-pending'}">${isPaid ? 'Paid' : 'Pending'}</span></div></div><div class="pay-card"><div class="pc-label">Method</div><div class="pc-val">${inv.billing.paymentMethod}</div></div><div class="pay-card"><div class="pc-label">Transaction ID</div><div class="pc-val" style="font-size:9px;word-break:break-all">${inv.billing.transactionId || 'N/A'}</div></div></div></div><div class="footer"><div class="footer-left"><p><strong>${inv.company.name}</strong></p><p>${inv.company.address}</p><p>GSTIN: ${inv.company.gstin}</p><p style="margin-top:3px;font-size:8px">Computer-generated invoice</p></div><div class="footer-right"><div class="thank">Thank you!</div><p>${inv.company.phone}</p><p>${inv.company.email}</p></div></div></div></body></html>`;
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const blobUrl = URL.createObjectURL(blob);
        const w = window.open(blobUrl, '_blank');
        if (w) w.onload = () => setTimeout(() => w.print(), 500);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
      } else {
        alert('Failed to generate invoice.');
      }
    } catch (err) {
      console.error('Receipt error:', err);
      alert('Failed to generate receipt.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 relative overflow-hidden">
      <Confetti ref={confettiRef} className="absolute top-0 left-0 z-50 w-full h-full pointer-events-none" manualstart />
      <Header />

      <main className="flex-1 pt-28 sm:pt-32 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Success Header - only show full confirmation when payment is done */}
          <div className="text-center mb-8">
            {appointment.payment_status === 'paid' ? (
              <>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 border border-green-200 rounded-full text-green-700 text-sm font-medium mb-4">
                  <CheckCircle2 className="h-4 w-4" />
                  Payment Successful
                </div>
                <h2 className="text-[26px] md:text-[30px] font-bold text-gray-900 tracking-tight">
                  Booking Confirmed!
                </h2>
                <p className="text-[14px] text-gray-500 mt-1">
                  Your appointment has been booked. A confirmation email is on its way.
                </p>
              </>
            ) : (
              <>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-amber-700 text-sm font-medium mb-4">
                  <Clock className="h-4 w-4" />
                  Payment Pending
                </div>
                <h2 className="text-[26px] md:text-[30px] font-bold text-gray-900 tracking-tight">
                  Booking Created
                </h2>
                <p className="text-[14px] text-gray-500 mt-1">
                  Complete payment to confirm your appointment. Check your email or contact support if you need help.
                </p>
              </>
            )}
          </div>

          {/* 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* LEFT: Appointment Details (3 cols) */}
            <div className="lg:col-span-3 space-y-5">
              {/* Main Card */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-cyan-500 to-teal-500 px-6 py-5 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[12px] font-medium opacity-80 uppercase tracking-wider">Booking ID</span>
                    <span className="text-[12px] font-mono bg-white/20 px-3 py-1 rounded-full">
                      {appointment.id.slice(0, 8).toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-[20px] font-bold mb-0.5">{serviceName}</h2>
                  <p className="text-[13px] opacity-80">with Dr. {doctorName}</p>
                </div>

                {/* Details Grid */}
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-stretch">
                    {/* Date */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center flex-shrink-0">
                        <Calendar className="h-4 w-4 text-cyan-600" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Date</p>
                        <p className="text-[14px] font-semibold text-gray-900">
                          {format(new Date(appointment.appointment_date), 'EEEE, MMMM d, yyyy')}
                        </p>
                      </div>
                    </div>

                    {/* Time */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center flex-shrink-0">
                        <Clock className="h-4 w-4 text-cyan-600" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Time</p>
                        <p className="text-[14px] font-semibold text-gray-900">
                          {appointment.start_time?.slice(0, 5) || '00:00'} - {appointment.end_time?.slice(0, 5) || '00:00'}
                        </p>
                      </div>
                    </div>

                    {/* Mode */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center flex-shrink-0">
                        {getModeIcon(appointment.mode)}
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Mode</p>
                        <p className="text-[14px] font-semibold text-gray-900">{getModeLabel(appointment.mode)}</p>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${appointment.payment_status === 'paid' ? 'bg-green-50' : 'bg-amber-50'}`}>
                        {appointment.payment_status === 'paid' ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <Clock className="h-4 w-4 text-amber-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                          {appointment.payment_status === 'paid' ? 'Amount Paid' : 'Amount Due'}
                        </p>
                        <p className={`text-[18px] font-bold ${appointment.payment_status === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>₹{appointment.amount}</p>
                      </div>
                    </div>
                  </div>

                  {/* Location (for offline/home visit) */}
                  {appointment.mode !== 'online' && appointment.location && (
                    <div className="mt-5 pt-5 border-t border-gray-100 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-4 w-4 text-cyan-600" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Location</p>
                        {appointment.metadata?.center_name ? (
                          <>
                            <p className="text-[14px] font-semibold text-gray-900">{appointment.metadata.center_name}</p>
                            <p className="text-[12px] text-gray-500">{appointment.location?.city}</p>
                          </>
                        ) : (
                          <p className="text-[14px] font-semibold text-gray-900">{appointment.location?.name || 'Clinic'}</p>
                        )}
                        {appointment.location?.address && (
                          <p className="text-[12px] text-gray-500 mt-0.5">{appointment.location.address}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Video Consultation Link */}
                  {appointment.mode === 'online' && appointment.google_meet_link && (
                    <div className="mt-5 pt-5 border-t border-gray-100">
                      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Your Video Call</p>
                      <a
                        href={appointment.google_meet_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl hover:from-green-100 hover:to-emerald-100 hover:border-green-300 transition-all"
                      >
                        <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                          <Video className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[15px] font-bold text-green-800">Join Video Consultation</p>
                          <p className="text-[12px] text-green-600 font-mono truncate mt-0.5">{appointment.google_meet_link}</p>
                          <p className="text-[11px] text-gray-500 mt-1">Click to open — room is ready for you and the doctor</p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-green-600 flex-shrink-0" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT: Actions & What's Next (2 cols) */}
            <div className="lg:col-span-2 space-y-5">
              {/* Add to Calendar Card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                <h3 className="text-[14px] font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-cyan-500" />
                  Add to Calendar
                </h3>
                <a href={calendarUrl} target="_blank" rel="noopener noreferrer" className="block">
                  <Button className="w-full h-11 rounded-xl bg-white border-2 border-cyan-500 text-cyan-600 hover:bg-cyan-50 font-semibold text-[13px]">
                    <Calendar className="mr-2 h-4 w-4" />
                    Google Calendar
                  </Button>
                </a>
              </div>

              {/* Quick Actions Card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                <h3 className="text-[14px] font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full h-11 rounded-xl border-gray-200 hover:bg-gray-50 justify-start text-[13px]"
                    onClick={handleDownloadReceipt}
                  >
                    <Download className="mr-3 h-4 w-4 text-gray-400" />
                    Download Receipt
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-11 rounded-xl border-gray-200 hover:bg-gray-50 justify-start text-[13px]"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: 'H2H Healthcare Appointment',
                          text: `Appointment booked for ${serviceName}`,
                          url: window.location.href,
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Link copied to clipboard!');
                      }
                    }}
                  >
                    <Share2 className="mr-3 h-4 w-4 text-gray-400" />
                    Share Booking
                  </Button>
                </div>
              </div>

              {/* What's Next Card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                <h3 className="text-[14px] font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  What&apos;s Next?
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-[13px] text-gray-600">Confirmation email with appointment details</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-[13px] text-gray-600">Email reminders before your appointment</span>
                  </li>
                  {appointment.mode === 'online' && (
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-[13px] text-gray-600">Video consultation link is ready in your dashboard</span>
                    </li>
                  )}
                </ul>
              </div>

              {/* Go to Dashboard */}
              <Link href="/patient" className="block">
                <Button className="w-full h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-semibold text-[14px]">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
