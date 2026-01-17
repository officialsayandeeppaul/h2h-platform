import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { 
  Calendar, 
  Users, 
  MapPin,
  Stethoscope,
  IndianRupee,
  TrendingUp,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3
} from 'lucide-react';

const stats = [
  { 
    title: 'Total Revenue', 
    value: '₹4,52,000', 
    change: '+12.5%', 
    trend: 'up',
    icon: IndianRupee,
    color: 'bg-green-100 text-green-600'
  },
  { 
    title: 'Total Appointments', 
    value: '1,234', 
    change: '+8.2%', 
    trend: 'up',
    icon: Calendar,
    color: 'bg-blue-100 text-blue-600'
  },
  { 
    title: 'Active Doctors', 
    value: '48', 
    change: '+3', 
    trend: 'up',
    icon: Stethoscope,
    color: 'bg-purple-100 text-purple-600'
  },
  { 
    title: 'Total Patients', 
    value: '8,456', 
    change: '+156', 
    trend: 'up',
    icon: Users,
    color: 'bg-orange-100 text-orange-600'
  },
];

const recentAppointments = [
  { id: '1', patient: 'Rahul Sharma', doctor: 'Dr. Priya Sharma', service: 'Back Pain', location: 'Mumbai', status: 'completed', amount: 1200 },
  { id: '2', patient: 'Priya Patel', doctor: 'Dr. Amit Patel', service: 'Sports Rehab', location: 'Bangalore', status: 'confirmed', amount: 1500 },
  { id: '3', patient: 'Amit Kumar', doctor: 'Dr. Rajesh Kumar', service: 'Physiotherapy', location: 'Delhi', status: 'pending', amount: 1800 },
  { id: '4', patient: 'Sneha Gupta', doctor: 'Dr. Priya Sharma', service: 'Yoga', location: 'Mumbai', status: 'confirmed', amount: 800 },
];

const locationStats = [
  { city: 'Mumbai', appointments: 342, revenue: 125000, doctors: 12 },
  { city: 'Bangalore', appointments: 289, revenue: 98000, doctors: 10 },
  { city: 'Delhi', appointments: 256, revenue: 89000, doctors: 8 },
  { city: 'Hyderabad', appointments: 198, revenue: 72000, doctors: 6 },
];

export default function AdminDashboard() {
  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of H2H Healthcare Platform</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline" asChild>
            <Link href="/admin/reports">
              <BarChart3 className="mr-2 h-4 w-4" />
              View Reports
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/settings">
              Settings
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
                  <div className={`flex items-center gap-1 mt-1 text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
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
        {/* Recent Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Appointments</CardTitle>
              <CardDescription>Latest bookings across all locations</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/appointments">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{apt.patient}</p>
                      <Badge variant={
                        apt.status === 'completed' ? 'default' :
                        apt.status === 'confirmed' ? 'secondary' : 'outline'
                      }>
                        {apt.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {apt.doctor} • {apt.service} • {apt.location}
                    </p>
                  </div>
                  <p className="font-semibold">₹{apt.amount}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Location Performance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Location Performance</CardTitle>
              <CardDescription>Revenue and appointments by city</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/locations">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {locationStats.map((loc) => (
                <div key={loc.city} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{loc.city}</p>
                      <p className="text-sm text-muted-foreground">
                        {loc.doctors} doctors • {loc.appointments} appointments
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold">₹{(loc.revenue / 1000).toFixed(0)}K</p>
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
              <Link href="/admin/doctors/new">
                <Stethoscope className="mr-2 h-4 w-4" />
                Add New Doctor
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/locations/new">
                <MapPin className="mr-2 h-4 w-4" />
                Add Location
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/services">
                <TrendingUp className="mr-2 h-4 w-4" />
                Manage Services
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/users">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
