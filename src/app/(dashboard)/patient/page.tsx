'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  Video, 
  Building2, 
  ArrowRight,
  FileText,
  CreditCard,
  Bell,
  Loader2,
  Stethoscope
} from 'lucide-react';

interface DashboardData {
  user: { id: string; name: string; email: string; phone: string; avatar: string };
  stats: { upcoming: number; completed: number; records: number; totalSpent: number };
  upcomingAppointments: Array<{
    id: string;
    service: string;
    doctor: string;
    date: string;
    time: string;
    mode: string;
    status: string;
    location: string;
  }>;
  recentPayments: Array<{
    id: string;
    amount: number;
    date: string;
    status: string;
    service: string;
  }>;
}

export default function PatientDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch('/api/patient/dashboard');
        const result = await res.json();
        if (result.success) {
          setData(result.data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        {/* Welcome Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-gray-200">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5 rounded" />
                  <div>
                    <Skeleton className="h-7 w-12 mb-1" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Cards Skeleton */}
        <div className="grid lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i} className="border-gray-200">
              <CardHeader className="pb-4">
                <Skeleton className="h-5 w-40 mb-1" />
                <Skeleton className="h-3 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100">
                      <Skeleton className="h-8 w-8 rounded-lg" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-3 w-24 mb-2" />
                        <Skeleton className="h-3 w-40" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions Skeleton */}
        <Card className="mt-6 border-gray-200">
          <CardHeader className="pb-4">
            <Skeleton className="h-5 w-28" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-9 w-44" />
              <Skeleton className="h-9 w-40" />
              <Skeleton className="h-9 w-36" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = data?.stats || { upcoming: 0, completed: 0, records: 0, totalSpent: 0 };
  const upcomingAppointments = data?.upcomingAppointments || [];
  const recentPayments = data?.recentPayments || [];
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
                <p className="text-2xl font-semibold text-gray-900">{stats.upcoming}</p>
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
                <p className="text-2xl font-semibold text-gray-900">{stats.completed}</p>
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
                <p className="text-2xl font-semibold text-gray-900">{stats.records}</p>
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
                <p className="text-2xl font-semibold text-gray-900">₹{stats.totalSpent.toLocaleString()}</p>
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
              {upcomingAppointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                  <p className="text-[13px]">No upcoming appointments</p>
                  <Button size="sm" className="mt-3 bg-cyan-500 hover:bg-cyan-600 text-white text-[11px]" asChild>
                    <Link href="/booking">Book Now</Link>
                  </Button>
                </div>
              ) : (
                upcomingAppointments.map((appointment) => (
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
                ))
              )}
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
              {recentPayments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CreditCard className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                  <p className="text-[13px]">No payment history yet</p>
                </div>
              ) : (
                recentPayments.map((payment) => (
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
                ))
              )}
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
              <Link href="/patient/doctors">
                <Stethoscope className="mr-2 h-4 w-4" />
                Find Doctors
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
