import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { 
  Calendar, 
  Users, 
  Stethoscope,
  IndianRupee,
  TrendingUp,
  ArrowRight,
  ArrowUpRight,
  Clock,
  Video,
  Building2
} from 'lucide-react';

const stats = [
  { 
    title: 'Today\'s Revenue', 
    value: '₹18,500', 
    change: '+15%', 
    icon: IndianRupee,
    color: 'bg-green-100 text-green-600'
  },
  { 
    title: 'Today\'s Appointments', 
    value: '24', 
    change: '+4', 
    icon: Calendar,
    color: 'bg-blue-100 text-blue-600'
  },
  { 
    title: 'Active Doctors', 
    value: '8', 
    change: '2 on leave', 
    icon: Stethoscope,
    color: 'bg-purple-100 text-purple-600'
  },
  { 
    title: 'This Month', 
    value: '₹3.2L', 
    change: '+22%', 
    icon: TrendingUp,
    color: 'bg-orange-100 text-orange-600'
  },
];

const todayAppointments = [
  { id: '1', patient: 'Rahul Sharma', doctor: 'Dr. Priya Sharma', time: '10:00 AM', service: 'Back Pain', mode: 'offline', status: 'completed' },
  { id: '2', patient: 'Priya Patel', doctor: 'Dr. Amit Patel', time: '11:30 AM', service: 'Sports Rehab', mode: 'online', status: 'in_progress' },
  { id: '3', patient: 'Amit Kumar', doctor: 'Dr. Rajesh Kumar', time: '02:00 PM', service: 'Physiotherapy', mode: 'offline', status: 'confirmed' },
  { id: '4', patient: 'Sneha Gupta', doctor: 'Dr. Priya Sharma', time: '04:30 PM', service: 'Yoga', mode: 'online', status: 'confirmed' },
];

const doctorAvailability = [
  { id: '1', name: 'Dr. Priya Sharma', status: 'available', appointments: 6, nextSlot: '03:00 PM' },
  { id: '2', name: 'Dr. Amit Patel', status: 'busy', appointments: 8, nextSlot: '05:00 PM' },
  { id: '3', name: 'Dr. Rajesh Kumar', status: 'available', appointments: 4, nextSlot: '02:30 PM' },
  { id: '4', name: 'Dr. Neha Singh', status: 'on_leave', appointments: 0, nextSlot: '-' },
];

export default function LocationAdminDashboard() {
  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline">Mumbai - Andheri</Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Location Dashboard</h1>
          <p className="text-muted-foreground">Manage your location&apos;s operations</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline" asChild>
            <Link href="/location-admin/reports">
              View Reports
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-1 text-sm text-green-600">
                    <ArrowUpRight className="h-4 w-4" />
                    {stat.change}
                  </div>
                </div>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Today's Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Today&apos;s Appointments</CardTitle>
              <CardDescription>All appointments for today</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/location-admin/appointments">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayAppointments.map((apt) => (
                <div key={apt.id} className="flex items-start gap-4 p-3 rounded-lg border">
                  <div className={`p-2 rounded-lg ${apt.mode === 'online' ? 'bg-blue-100' : 'bg-green-100'}`}>
                    {apt.mode === 'online' ? (
                      <Video className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Building2 className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium truncate">{apt.patient}</p>
                      <Badge variant={
                        apt.status === 'completed' ? 'default' :
                        apt.status === 'in_progress' ? 'secondary' : 'outline'
                      }>
                        {apt.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {apt.doctor} • {apt.service}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" />
                      {apt.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Doctor Availability */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Doctor Availability</CardTitle>
              <CardDescription>Current status of your doctors</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/location-admin/doctors">
                Manage
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {doctorAvailability.map((doctor) => (
                <div key={doctor.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold">
                      {doctor.name.split(' ')[1]?.charAt(0) || doctor.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{doctor.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {doctor.appointments} appointments today
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={
                      doctor.status === 'available' ? 'default' :
                      doctor.status === 'busy' ? 'secondary' : 'outline'
                    }>
                      {doctor.status.replace('_', ' ')}
                    </Badge>
                    {doctor.nextSlot !== '-' && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Next: {doctor.nextSlot}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/location-admin/appointments/new">
                <Calendar className="mr-2 h-4 w-4" />
                Manual Booking
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/location-admin/doctors">
                <Stethoscope className="mr-2 h-4 w-4" />
                Manage Doctors
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/location-admin/patients">
                <Users className="mr-2 h-4 w-4" />
                View Patients
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
