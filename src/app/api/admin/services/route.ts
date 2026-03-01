/**
 * Admin Services API - CRUD operations for services
 * Only accessible by super_admin and location_admin
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

async function checkAdminAccess(): Promise<{ isAdmin: boolean; user: any; adminClient: any }> {
  const supabase = await createClient();
  const adminClient = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { isAdmin: false, user: null, adminClient };

  const { data: userData } = await adminClient
    .from('users')
    .select('id, role')
    .eq('id', user.id)
    .single();

  const isAdmin = (userData as any)?.role === 'super_admin' || (userData as any)?.role === 'location_admin';
  return { isAdmin, user: userData, adminClient };
}

// GET - List all services (admin view with all fields)
export async function GET(request: NextRequest) {
  try {
    const { isAdmin, adminClient } = await checkAdminAccess();

    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { data: services, error } = await adminClient
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new service
export async function POST(request: NextRequest) {
  try {
    const { isAdmin, user, adminClient } = await checkAdminAccess();

    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const {
      name,
      slug,
      category,
      description,
      online_available,
      offline_available,
      home_visit_available,
      is_active,
    } = body;

    if (!name || !slug || !category) {
      return NextResponse.json({ error: 'Name, slug, and category are required' }, { status: 400 });
    }

    // Check if slug already exists
    const { data: existing } = await adminClient
      .from('services')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Service with this slug already exists' }, { status: 400 });
    }

    const { data: service, error } = await (adminClient
      .from('services') as any)
      .insert({
        name,
        slug,
        category: category || 'pain_relief_physiotherapy',
        description: description || '',
        online_available: online_available ?? true,
        offline_available: offline_available ?? true,
        home_visit_available: home_visit_available ?? false,
        is_active: is_active ?? true,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: service }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update service
export async function PUT(request: NextRequest) {
  try {
    const { isAdmin, adminClient } = await checkAdminAccess();

    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
    }

    const { data: service, error } = await (adminClient
      .from('services') as any)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: service });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete service
export async function DELETE(request: NextRequest) {
  try {
    const { isAdmin, user, adminClient } = await checkAdminAccess();

    if (!isAdmin || user?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Only super admin can delete services' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
    }

    const { error } = await adminClient
      .from('services')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Service deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
