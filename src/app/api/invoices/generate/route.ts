/**
 * H2H Healthcare - Invoice Generator API
 * Generates PDF invoices for appointments
 */

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const appointmentId = searchParams.get('appointmentId');

    if (!appointmentId) {
      return NextResponse.json({ error: 'Appointment ID is required' }, { status: 400 });
    }

    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch appointment with all related data
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .select(`
        id,
        appointment_date,
        start_time,
        end_time,
        mode,
        status,
        payment_status,
        amount,
        razorpay_payment_id,
        created_at,
        service:services(id, name, duration_minutes),
        doctor:doctors(id, user:users!doctors_user_id_fkey(full_name, email)),
        location:locations(id, name, city, address),
        patient:users!appointments_patient_id_fkey(id, full_name, email, phone)
      `)
      .eq('id', appointmentId)
      .single();

    if (appointmentError || !appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Verify user owns this appointment
    if ((appointment as any).patient?.id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Generate invoice data
    const apt = appointment as any;
    const invoiceData = {
      invoiceNumber: `INV-${apt.id.slice(0, 8).toUpperCase()}`,
      invoiceDate: new Date().toISOString(),
      appointmentDate: apt.appointment_date,
      
      // Patient details
      patient: {
        name: apt.patient?.full_name || 'Patient',
        email: apt.patient?.email || '',
        phone: apt.patient?.phone || '',
      },
      
      // Service details
      service: {
        name: apt.service?.name || 'Healthcare Service',
        duration: apt.service?.duration_minutes || 30,
      },
      
      // Doctor details
      doctor: {
        name: apt.doctor?.user?.full_name || 'Doctor',
      },
      
      // Location
      location: apt.mode === 'online' 
        ? 'Online Consultation'
        : apt.location 
          ? `${apt.location.name}, ${apt.location.city}`
          : 'H2H Healthcare Clinic',
      
      // Timing
      time: `${apt.start_time?.slice(0, 5)} - ${apt.end_time?.slice(0, 5)}`,
      mode: apt.mode,
      
      // Payment
      amount: apt.amount,
      paymentStatus: apt.payment_status,
      paymentId: apt.razorpay_payment_id,
      
      // Company details
      company: {
        name: 'H2H Healthcare Pvt. Ltd.',
        address: 'Indiranagar, Bangalore 560038',
        gstin: 'GSTIN: 29AABCH1234A1Z5',
        email: 'support@healtohealth.in',
        phone: '+91 1800 123 4567',
      },
    };

    return NextResponse.json({ 
      success: true, 
      invoice: invoiceData 
    });

  } catch (error) {
    console.error('Invoice generation error:', error);
    return NextResponse.json({ error: 'Failed to generate invoice' }, { status: 500 });
  }
}

// POST endpoint to generate and store invoice
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { appointmentId } = body;

    if (!appointmentId) {
      return NextResponse.json({ error: 'Appointment ID is required' }, { status: 400 });
    }

    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch appointment
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .select(`
        id,
        appointment_date,
        start_time,
        end_time,
        mode,
        status,
        payment_status,
        amount,
        razorpay_payment_id,
        created_at,
        service:services(id, name, duration_minutes),
        doctor:doctors(id, user:users!doctors_user_id_fkey(full_name)),
        location:locations(id, name, city, address),
        patient:users!appointments_patient_id_fkey(id, full_name, email, phone)
      `)
      .eq('id', appointmentId)
      .single();

    if (appointmentError || !appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Verify user owns this appointment
    const apt2 = appointment as any;
    if (apt2.patient?.id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now().toString(36).toUpperCase()}-${apt2.id.slice(0, 4).toUpperCase()}`;

    // Check if invoice already exists
    const { data: existingInvoice } = await (supabase
      .from('invoices') as any)
      .select('id, invoice_number')
      .eq('appointment_id', appointmentId)
      .single();

    if (existingInvoice) {
      return NextResponse.json({ 
        success: true, 
        invoice: existingInvoice,
        message: 'Invoice already exists'
      });
    }

    // Create invoice record
    const { data: invoice, error: invoiceError } = await (supabase
      .from('invoices') as any)
      .insert({
        appointment_id: appointmentId,
        patient_id: user.id,
        invoice_number: invoiceNumber,
        amount: apt2.amount,
        status: apt2.payment_status === 'paid' ? 'paid' : 'pending',
        issued_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (invoiceError) {
      console.error('Invoice creation error:', invoiceError);
      // If table doesn't exist, just return the invoice data without storing
      return NextResponse.json({ 
        success: true, 
        invoice: {
          invoice_number: invoiceNumber,
          amount: apt2.amount,
          status: apt2.payment_status,
        },
        message: 'Invoice generated (not stored)'
      });
    }

    return NextResponse.json({ 
      success: true, 
      invoice 
    });

  } catch (error) {
    console.error('Invoice creation error:', error);
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
  }
}
