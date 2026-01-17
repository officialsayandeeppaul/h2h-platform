import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  Video, 
  Building2, 
  ArrowRight,
  FileText,
  CreditCard,
  Bell
} from 'lucide-react';

const upcomingAppointments = [
  {
    id: '1',
    service: 'Back Pain Treatment',
    doctor: 'Dr. Priya Sharma',
    date: '2026-01-20',
    time: '10:00 AM',
    mode: 'offline',
    status: 'confirmed',
    location: 'Mumbai - Andheri',
  },
  {
    id: '2',
    service: 'Therapeutic Yoga',
    doctor: 'Dr. Amit Patel',
    date: '2026-01-25',
    time: '11:30 AM',
    mode: 'online',
    status: 'confirmed',
    location: 'Online',
  },
];

const recentPayments = [
  { id: '1', amount: 1200, date: '2026-01-10', status: 'success', service: 'Physiotherapy Session' },
  { id: '2', amount: 800, date: '2026-01-05', status: 'success', service: 'Yoga Session' },
];

export default function PatientDashboard() {
  return (
    <div className="p-6 lg:p-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-[28px] font-semibold text-gray-900 tracking-tight">Welcome back!</h1>
        <p className="text-[15px] text-gray-500 mt-1">Here&apos;s an overview of your health journey</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-gray-200 bg-cyan-50/50">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-cyan-600" />
              <div>
                <p className="text-2xl font-semibold text-gray-900">2</p>
                <p className="text-[13px] text-gray-500">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200 bg-teal-50/50">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-teal-600" />
              <div>
                <p className="text-2xl font-semibold text-gray-900">12</p>
                <p className="text-[13px] text-gray-500">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200 bg-purple-50/50">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-semibold text-gray-900">5</p>
                <p className="text-[13px] text-gray-500">Records</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200 bg-orange-50/50">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-semibold text-gray-900">₹8,400</p>
                <p className="text-[13px] text-gray-500">Total Spent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-[15px] font-semibold text-gray-900">Upcoming Appointments</CardTitle>
              <CardDescription className="text-[12px] text-gray-500">Your scheduled consultations</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 text-[12px] h-8" asChild>
              <Link href="/patient/appointments">
                View All
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${appointment.mode === 'online' ? 'bg-blue-50' : 'bg-green-50'}`}>
                    {appointment.mode === 'online' ? (
                      <Video className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Building2 className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-[13px] text-gray-900">{appointment.service}</p>
                        <p className="text-[12px] text-gray-500">{appointment.doctor}</p>
                      </div>
                      <Badge className="bg-cyan-500 text-white border-0 text-[10px] font-medium px-2 py-0.5">
                        {appointment.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(appointment.date).toLocaleDateString('en-IN', { 
                          day: 'numeric', 
                          month: 'short' 
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {appointment.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-[15px] font-semibold text-gray-900">Recent Payments</CardTitle>
              <CardDescription className="text-[12px] text-gray-500">Your payment history</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 text-[12px] h-8" asChild>
              <Link href="/patient/payments">
                View All
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <div>
                    <p className="font-medium text-[13px] text-gray-900">{payment.service}</p>
                    <p className="text-[11px] text-gray-500">
                      {new Date(payment.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[14px] text-gray-900">₹{payment.amount}</p>
                    <Badge className="bg-green-500 text-white border-0 text-[10px] font-medium px-2 py-0.5">
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-6 border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-[15px] font-semibold text-gray-900">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button className="bg-cyan-500 hover:bg-cyan-600 text-white text-[12px] h-9" asChild>
              <Link href="/booking">
                <Calendar className="mr-2 h-4 w-4" />
                Book New Appointment
              </Link>
            </Button>
            <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50 text-[12px] h-9" asChild>
              <Link href="/patient/records">
                <FileText className="mr-2 h-4 w-4" />
                View Medical Records
              </Link>
            </Button>
            <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50 text-[12px] h-9" asChild>
              <Link href="/contact">
                <Bell className="mr-2 h-4 w-4" />
                Contact Support
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
