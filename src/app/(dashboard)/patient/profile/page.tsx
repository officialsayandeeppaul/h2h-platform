'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Loader2, User, Mail, Phone, MapPin, 
  Calendar, Heart, AlertCircle, Save, CheckCircle2
} from 'lucide-react';

interface Profile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  avatar: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  emergencyContact: string;
  bloodGroup: string;
  allergies: string[];
  medicalConditions: string[];
}

export default function PatientProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<Partial<Profile>>({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/patient/profile');
      const data = await res.json();
      if (data.success) {
        setProfile(data.data);
        setFormData(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      const res = await fetch('/api/patient/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.fullName,
          phone: formData.phone,
          date_of_birth: formData.dateOfBirth,
          gender: formData.gender,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          emergency_contact: formData.emergencyContact,
          blood_group: formData.bloodGroup,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-3 md:p-6 lg:p-8">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div>
              <Skeleton className="h-6 w-32 mb-1" />
              <Skeleton className="h-4 w-48 hidden sm:block" />
            </div>
          </div>
          <Skeleton className="h-9 w-24" />
        </div>
        
        {/* Personal Info Skeleton */}
        <Card className="border-gray-200 rounded-xl mb-4 md:mb-6">
          <CardHeader className="pb-3 md:pb-4 px-4 md:px-6">
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 px-4 md:px-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i}>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
        
        {/* Address Skeleton */}
        <Card className="border-gray-200 rounded-xl">
          <CardHeader className="pb-3 md:pb-4 px-4 md:px-6">
            <Skeleton className="h-5 w-24" />
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 px-4 md:px-6">
            <div className="md:col-span-2">
              <Skeleton className="h-4 w-28 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-lg md:text-xl font-semibold text-gray-900">My Profile</h1>
            <p className="text-xs md:text-sm text-gray-500 hidden sm:block">Manage your personal information</p>
          </div>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-cyan-500 hover:bg-cyan-600 text-white shrink-0"
          size="sm"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
          <span className="hidden sm:inline">Save Changes</span>
          <span className="sm:hidden">Save</span>
        </Button>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" /> Profile updated successfully!
        </div>
      )}

      <div className="space-y-4 md:space-y-6">
        {/* Personal Information */}
        <Card className="border-gray-200 rounded-xl">
          <CardHeader className="pb-3 md:pb-4 px-4 md:px-6">
            <CardTitle className="text-sm md:text-base font-semibold flex items-center gap-2">
              <User className="h-4 w-4 md:h-5 md:w-5 text-cyan-500" /> Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 px-4 md:px-6">
            <div>
              <Label className="text-sm text-gray-600">Full Name</Label>
              <Input 
                value={formData.fullName || ''} 
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm text-gray-600">Email</Label>
              <Input value={formData.email || ''} disabled className="mt-1 bg-gray-50" />
            </div>
            <div>
              <Label className="text-sm text-gray-600">Phone</Label>
              <Input 
                value={formData.phone || ''} 
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm text-gray-600">Date of Birth</Label>
              <Input 
                type="date"
                value={formData.dateOfBirth || ''} 
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm text-gray-600">Gender</Label>
              <select 
                value={formData.gender || ''} 
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-md text-sm"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Blood Group</Label>
              <select 
                value={formData.bloodGroup || ''} 
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-md text-sm"
              >
                <option value="">Select</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card className="border-gray-200 rounded-xl">
          <CardHeader className="pb-3 md:pb-4 px-4 md:px-6">
            <CardTitle className="text-sm md:text-base font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4 md:h-5 md:w-5 text-cyan-500" /> Address
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 px-4 md:px-6">
            <div className="md:col-span-2">
              <Label className="text-sm text-gray-600">Street Address</Label>
              <Input 
                value={formData.address || ''} 
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm text-gray-600">City</Label>
              <Input 
                value={formData.city || ''} 
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm text-gray-600">State</Label>
              <Input 
                value={formData.state || ''} 
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm text-gray-600">Pincode</Label>
              <Input 
                value={formData.pincode || ''} 
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm text-gray-600">Emergency Contact</Label>
              <Input 
                value={formData.emergencyContact || ''} 
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                placeholder="+91 XXXXX XXXXX"
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
