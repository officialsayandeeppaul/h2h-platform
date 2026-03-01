/**
 * H2H Healthcare - Invoice Generation API
 * Generate and download invoice PDF for appointments
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

interface RouteParams {
  params: Promise<{ appointmentId: string }>;
}

/**
 * GET /api/invoices/[appointmentId] - Get invoice data for an appointment
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { appointmentId } = await params;
    const supabase = await createClient();
    const adminClient = createAdminClient();

    // Get appointment with all related data
    const { data: appointment, error } = await adminClient
      .from('appointments')
      .select(`
        *,
        patient:patient_id(id, full_name, email, phone),
        doctor:doctor_id(id, consultation_fee, users:user_id(full_name, email)),
        service:service_id(id, name, duration_minutes),
        location:location_id(id, name, city, address)
      `)
      .eq('id', appointmentId)
      .single();

    if (error || !appointment) {
      return NextResponse.json({ success: false, error: 'Appointment not found' }, { status: 404 });
    }

    // Generate invoice number
    const invoiceNumber = `H2H-${new Date().getFullYear()}-${appointmentId.slice(0, 8).toUpperCase()}`;
    
    // Get patient details from metadata or patient relation
    const patientName = (appointment as any).metadata?.patient_name || 
                       (appointment as any).patient?.full_name || 'Patient';
    const patientPhone = (appointment as any).metadata?.patient_phone || 
                        (appointment as any).patient?.phone || '';
    const patientEmail = (appointment as any).patient?.email || '';

    // Get doctor and service details
    const rawDoctorName = (appointment as any).doctor?.users?.full_name || 'Doctor';
    const doctorName = rawDoctorName.replace(/^Dr\.?\s*/i, '');
    const serviceName = (appointment as any).service?.name || 'Consultation';
    const serviceDuration = (appointment as any).service?.duration_minutes || 30;
    
    // Get location details
    const locationName = (appointment as any).metadata?.center_name || 
                        (appointment as any).location?.name || '';
    const locationCity = (appointment as any).location?.city || '';
    const locationAddress = (appointment as any).location?.address || '';

    // Calculate amounts
    const subtotal = (appointment as any).amount || 0;
    const gst = Math.round(subtotal * 0.18); // 18% GST
    const total = subtotal; // GST included in amount

    // Build invoice data
    const invoiceData = {
      invoiceNumber,
      invoiceDate: new Date().toISOString(),
      
      // Company details
      company: {
        name: 'H2H Healthcare Pvt. Ltd.',
        address: 'Tower B, DLF Cyber City, Gurgaon, Haryana 122002',
        phone: '+91 1800 123 4567',
        email: 'support@h2hhealthcare.com',
        gstin: '06AABCH1234A1Z5',
        website: 'www.h2hhealthcare.com',
      },
      
      // Patient details
      patient: {
        name: patientName,
        phone: patientPhone,
        email: patientEmail,
      },
      
      // Appointment details
      appointment: {
        id: appointmentId,
        date: (appointment as any).appointment_date,
        time: `${(appointment as any).start_time} - ${(appointment as any).end_time}`,
        mode: (appointment as any).mode,
        status: (appointment as any).status,
        paymentStatus: (appointment as any).payment_status,
      },
      
      // Service details
      service: {
        name: serviceName,
        duration: serviceDuration,
        doctor: doctorName,
      },
      
      // Location details
      location: {
        name: locationName,
        city: locationCity,
        address: locationAddress,
      },
      
      // Billing details
      billing: {
        subtotal,
        gst,
        total,
        currency: 'INR',
        paymentMethod: 'Online Payment',
        transactionId: (appointment as any).razorpay_payment_id || null,
      },
      
      // Notes
      notes: (appointment as any).notes || null,
    };

    return NextResponse.json({ success: true, data: invoiceData });
  } catch (error) {
    console.error('Error generating invoice:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
