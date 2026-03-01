/**
 * H2H Healthcare - Admin Contact Message (single) - PATCH status
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import type { ContactMessageStatus, Database } from '@/types/database';

async function checkSuperAdmin(): Promise<{ isSuperAdmin: boolean; adminClient: ReturnType<typeof createAdminClient> }> {
  const supabase = await createClient();
  const adminClient = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { isSuperAdmin: false, adminClient };

  const { data: userData } = await adminClient
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = (userData as { role?: string } | null)?.role;
  return { isSuperAdmin: role === 'super_admin', adminClient };
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { isSuperAdmin, adminClient } = await checkSuperAdmin();

    if (!isSuperAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const status = body?.status as string | undefined;

    if (!status || !(['new', 'read', 'replied'] as ContactMessageStatus[]).includes(status as ContactMessageStatus)) {
      return NextResponse.json({ error: 'Valid status required' }, { status: 400 });
    }

    type ContactUpdate = Database['public']['Tables']['contact_messages']['Update'];
    const { data, error } = await adminClient
      .from('contact_messages')
      .update({ status } as ContactUpdate)
      .eq('id', id)
      .select('id, status')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
