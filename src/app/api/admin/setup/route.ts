/**
 * Super Admin Setup API
 * First-time setup with secret key to create the initial super admin
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

const SUPER_ADMIN_SECRET = process.env.SUPER_ADMIN_SECRET_KEY || 'h2h-super-admin-2024';

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const body = await request.json();
    const { secretKey, email } = body;

    // Validate secret key
    if (secretKey !== SUPER_ADMIN_SECRET) {
      return NextResponse.json({ error: 'Invalid secret key' }, { status: 403 });
    }

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if any super admin exists
    const { data: existingAdmins } = await supabase
      .from('users')
      .select('id')
      .eq('role', 'super_admin')
      .limit(1);

    if (existingAdmins && existingAdmins.length > 0) {
      return NextResponse.json({ 
        error: 'Super admin already exists. New admins must be approved by existing super admin.' 
      }, { status: 400 });
    }

    // Find user by email
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email, full_name')
      .eq('email', email)
      .single();

    const user = userData as { id: string; email: string; full_name: string } | null;
    console.log('User lookup:', { email, user, error: userError });

    if (userError || !user) {
      return NextResponse.json({ 
        error: `User not found. Please sign up first with Google. (${userError?.message || 'No user with this email'})` 
      }, { status: 404 });
    }

    // Update user to super_admin
    const { error: updateError } = await (supabase
      .from('users') as any)
      .update({ role: 'super_admin' })
      .eq('id', user.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Super admin created successfully',
      user: { id: user.id, email: user.email, full_name: user.full_name }
    });

  } catch (error) {
    console.error('Super admin setup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = createAdminClient();
    
    // Check if super admin exists
    const { data: admins, error } = await supabase
      .from('users')
      .select('id, email, role')
      .eq('role', 'super_admin');

    console.log('Super admin check:', { admins, error });

    const hasSuperAdmin = !error && admins && admins.length > 0;

    return NextResponse.json({ 
      hasSuperAdmin,
      needsSetup: !hasSuperAdmin
    });

  } catch (error) {
    console.error('GET /api/admin/setup error:', error);
    return NextResponse.json({ error: 'Internal server error', needsSetup: true }, { status: 500 });
  }
}
