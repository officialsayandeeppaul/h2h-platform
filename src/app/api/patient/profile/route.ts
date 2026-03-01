/**
 * H2H Healthcare - Patient Profile API
 * Get and update patient profile
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const adminClient = createAdminClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Look up user by email since auth ID may differ from users table ID
    let { data: profile, error } = await (adminClient.from('users') as any)
      .select('*')
      .eq('email', user.email)
      .single();

    // Fallback: try by auth ID
    if (!profile) {
      const fallback = await (adminClient.from('users') as any)
        .select('*')
        .eq('id', user.id)
        .single();
      profile = fallback.data;
      error = fallback.error;
    }

    if (error) {
      console.error('Error fetching profile:', error);
      return NextResponse.json({ success: false, error: 'Failed to fetch profile' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: profile.id,
        email: profile.email,
        fullName: profile.full_name,
        phone: profile.phone,
        avatar: profile.avatar_url,
        dateOfBirth: profile.date_of_birth,
        gender: profile.gender,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        pincode: profile.pincode,
        emergencyContact: profile.emergency_contact,
        bloodGroup: profile.blood_group,
        allergies: profile.allergies,
        medicalConditions: profile.medical_conditions,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
      },
    });
  } catch (error) {
    console.error('Error in patient profile API:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const adminClient = createAdminClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    // Only update allowed fields
    const allowedFields = [
      'full_name', 'phone', 'avatar_url', 'date_of_birth', 'gender',
      'address', 'city', 'state', 'pincode', 'emergency_contact',
      'blood_group', 'allergies', 'medical_conditions'
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    // Look up user by email to get correct users table ID
    const { data: userData } = await (adminClient.from('users') as any)
      .select('id')
      .eq('email', user.email)
      .single();
    const profileId = userData?.id || user.id;

    // Update profile
    const { data: profile, error } = await (adminClient.from('users') as any)
      .update(updateData)
      .eq('id', profileId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return NextResponse.json({ success: false, error: 'Failed to update profile' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: profile,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Error in patient profile update API:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
