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
import { BookingConfirmationSkeleton } from '@/components/booking/BookingSkeletons';

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
    return <BookingConfirmationSkeleton />;
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
      const { buildInvoiceHtml } = await import('@/lib/invoice');
      const response = await fetch(`/api/invoices/${appointment.id}`);
      const data = await response.json();
      if (data.success && data.data) {
        const htmlContent = buildInvoiceHtml(data.data);
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
                <h2 className="text-[26px] md:text-[30px] font-semibold text-gray-900 tracking-tight">
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
                <h2 className="text-[26px] md:text-[30px] font-semibold text-gray-900 tracking-tight">
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
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-cyan-500 to-teal-500 px-6 py-5 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[12px] font-medium opacity-80 uppercase tracking-wider">Booking ID</span>
                    <span className="text-[12px] font-mono bg-white/20 px-3 py-1 rounded-full">
                      {appointment.id.slice(0, 8).toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-[20px] font-semibold mb-0.5">{serviceName}</h2>
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
                        <p className={`text-[18px] font-semibold ${appointment.payment_status === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>₹{appointment.amount}</p>
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
                        <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
                          <Video className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[15px] font-semibold text-green-800">Join Video Consultation</p>
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
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <h3 className="text-[14px] font-semibold text-gray-900 mb-4 flex items-center gap-2">
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
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <h3 className="text-[14px] font-semibold text-gray-900 mb-4">Quick Actions</h3>
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
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <h3 className="text-[14px] font-semibold text-gray-900 mb-4 flex items-center gap-2">
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
    <Suspense fallback={<BookingConfirmationSkeleton />}>
      <ConfirmationContent />
    </Suspense>
  );
}
