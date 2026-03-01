/**
 * H2H Healthcare - Patient Medical Records API
 * Fetch medical records for logged-in patient
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const adminClient = createAdminClient();
    const searchParams = request.nextUrl.searchParams;
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Look up user by email since auth ID may differ from users table ID
    const { data: userData } = await (adminClient.from('users') as any)
      .select('id')
      .eq('email', user.email)
      .single();
    const patientId = userData?.id || user.id;

    // Try to fetch from medical_records table
    const { data: records, error } = await (adminClient.from('medical_records') as any)
      .select(`
        id,
        record_type,
        title,
        description,
        file_url,
        notes,
        created_at,
        doctor:doctor_id(users:user_id(full_name)),
        appointment:appointment_id(
          appointment_date,
          service:service_id(name)
        )
      `)
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      // If medical_records table doesn't exist, return empty with completed appointments as records
      console.log('Medical records table may not exist, fetching from appointments');
      
      const { data: appointments } = await (adminClient.from('appointments') as any)
        .select(`
          id,
          appointment_date,
          notes,
          created_at,
          doctor:doctor_id(users:user_id(full_name)),
          service:service_id(name)
        `)
        .eq('patient_id', patientId)
        .in('status', ['completed', 'confirmed'])
        .order('appointment_date', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      const transformedRecords = (appointments || []).map((apt: any) => ({
        id: apt.id,
        type: 'consultation',
        title: apt.service?.name || 'Consultation',
        description: apt.notes || 'Completed consultation',
        date: apt.appointment_date,
        doctor: apt.doctor?.users?.full_name || 'Doctor',
        createdAt: apt.created_at,
      }));

      return NextResponse.json({
        success: true,
        data: transformedRecords,
        pagination: { page, limit, total: transformedRecords.length },
      });
    }

    // Transform medical records data
    const transformedRecords = (records || []).map((record: any) => ({
      id: record.id,
      type: record.record_type || 'document',
      title: record.title || 'Medical Record',
      description: record.description,
      fileUrl: record.file_url,
      notes: record.notes,
      date: record.appointment?.appointment_date || record.created_at,
      service: record.appointment?.service?.name,
      doctor: record.doctor?.users?.full_name || 'Doctor',
      createdAt: record.created_at,
    }));

    return NextResponse.json({
      success: true,
      data: transformedRecords,
      pagination: { page, limit, total: records?.length || 0 },
    });
  } catch (error) {
    console.error('Error in patient records API:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
