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
  Users,
  FileText,
  Star,
  TrendingUp
} from 'lucide-react';

const todayAppointments = [
  {
    id: '1',
    patient: 'Rahul Sharma',
    service: 'Back Pain Treatment',
    time: '10:00 AM',
    mode: 'offline',
    status: 'confirmed',
  },
  {
    id: '2',
    patient: 'Priya Patel',
    service: 'Sports Injury Assessment',
    time: '11:30 AM',
    mode: 'online',
    status: 'confirmed',
  },
  {
    id: '3',
    patient: 'Amit Kumar',
    service: 'Post-Surgery Rehabilitation',
    time: '02:00 PM',
    mode: 'offline',
    status: 'pending',
  },
  {
    id: '4',
    patient: 'Sneha Gupta',
    service: 'Therapeutic Yoga',
    time: '04:30 PM',
    mode: 'online',
    status: 'confirmed',
  },
];

const recentPatients = [
  { id: '1', name: 'Rahul Sharma', lastVisit: '2026-01-15', condition: 'Lower Back Pain' },
  { id: '2', name: 'Priya Patel', lastVisit: '2026-01-14', condition: 'ACL Recovery' },
  { id: '3', name: 'Amit Kumar', lastVisit: '2026-01-12', condition: 'Knee Replacement' },
];

export default function DoctorDashboard() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Good Morning, Dr. Kumar!</h1>
        <p className="text-muted-foreground">You have 4 appointments scheduled for today</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">4</p>
                <p className="text-sm text-muted-foreground">Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">156</p>
                <p className="text-sm text-muted-foreground">Patients</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">4.9</p>
                <p className="text-sm text-muted-foreground">Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">28</p>
                <p className="text-sm text-muted-foreground">This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Today&apos;s Appointments</CardTitle>
              <CardDescription>Your schedule for today</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/doctor/appointments">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-start gap-4 p-4 rounded-lg border bg-card"
                >
                  <div className={`p-2 rounded-lg ${appointment.mode === 'online' ? 'bg-blue-100' : 'bg-green-100'}`}>
                    {appointment.mode === 'online' ? (
                      <Video className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Building2 className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">{appointment.patient}</p>
                        <p className="text-sm text-muted-foreground">{appointment.service}</p>
                      </div>
                      <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}>
                        {appointment.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {appointment.time}
                      </span>
                      {appointment.mode === 'online' && appointment.status === 'confirmed' && (
                        <Button size="sm" variant="outline">
                          <Video className="mr-1 h-3 w-3" />
                          Start Call
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Patients */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Patients</CardTitle>
              <CardDescription>Patients you&apos;ve seen recently</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/doctor/patients">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold">
                      {patient.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-muted-foreground">{patient.condition}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Last Visit</p>
                    <p className="text-sm font-medium">
                      {new Date(patient.lastVisit).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/doctor/schedule">
                <Calendar className="mr-2 h-4 w-4" />
                Manage Schedule
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/doctor/prescriptions">
                <FileText className="mr-2 h-4 w-4" />
                Write Prescription
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/doctor/patients">
                <Users className="mr-2 h-4 w-4" />
                View All Patients
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
