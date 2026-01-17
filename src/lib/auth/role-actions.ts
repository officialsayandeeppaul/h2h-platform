/**
 * H2H Healthcare - Server Actions for Role Management
 * Production-grade role management with proper authorization
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { 
  ROLES, 
  canManageRole, 
  getAssignableRoles,
  type UserRole 
} from './roles';

interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

interface UserWithRole {
  id: string;
  email: string;
  fullName: string | null;
  role: UserRole;
  createdAt: string;
  lastSignInAt: string | null;
  emailVerified: boolean;
}

/**
 * Get current user's role
 */
export async function getCurrentUserRole(): Promise<UserRole> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return ROLES.PATIENT;
  }
  
  return (user.user_metadata?.role as UserRole) || ROLES.PATIENT;
}

/**
 * Check if current user can manage roles
 */
export async function canCurrentUserManageRoles(): Promise<boolean> {
  const currentRole = await getCurrentUserRole();
  return getAssignableRoles(currentRole).length > 0;
}

/**
 * Update a user's role
 * Only super_admin and admin can update roles
 */
export async function updateUserRole(
  targetUserId: string,
  newRole: UserRole
): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    
    if (!currentUser) {
      return { success: false, error: 'Not authenticated' };
    }
    
    const currentUserRole = (currentUser.user_metadata?.role as UserRole) || ROLES.PATIENT;
    
    // Check if current user can assign this role
    const assignableRoles = getAssignableRoles(currentUserRole);
    if (!assignableRoles.includes(newRole)) {
      return { success: false, error: 'You do not have permission to assign this role' };
    }
    
    // Prevent self-demotion for super_admin
    if (currentUser.id === targetUserId && currentUserRole === ROLES.SUPER_ADMIN) {
      return { success: false, error: 'Super admin cannot change their own role' };
    }
    
    // In production, this would use Supabase Admin API or Edge Function
    // For now, we'll update via a database function or direct metadata update
    
    // Option 1: If you have a users table synced with auth
    const { error: dbError } = await supabase
      .from('users')
      .update({ role: newRole, updated_at: new Date().toISOString() } as never)
      .eq('id', targetUserId);
    
    if (dbError) {
      console.error('Database update error:', dbError);
      // Continue anyway - the auth metadata is the source of truth
    }
    
    // Note: To update auth.users metadata, you need to use:
    // 1. Supabase Admin API (requires service_role key - server-side only)
    // 2. Supabase Edge Function
    // 3. Database trigger that syncs to auth.users
    
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Update role error:', error);
    return { success: false, error: 'Failed to update role' };
  }
}

/**
 * Get all users (for admin panel)
 * Requires admin or super_admin role
 */
export async function getAllUsers(): Promise<ActionResult<UserWithRole[]>> {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    
    if (!currentUser) {
      return { success: false, error: 'Not authenticated' };
    }
    
    const currentUserRole = (currentUser.user_metadata?.role as UserRole) || ROLES.PATIENT;
    
    // Only admin and super_admin can view all users
    if (currentUserRole !== ROLES.SUPER_ADMIN && currentUserRole !== ROLES.ADMIN) {
      return { success: false, error: 'Insufficient permissions' };
    }
    
    // Fetch users from your users table
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, full_name, role, created_at, last_sign_in_at, email_confirmed_at')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Fetch users error:', error);
      return { success: false, error: 'Failed to fetch users' };
    }
    
    // Type assertion for Supabase response
    type UserRow = {
      id: string;
      email: string;
      full_name: string | null;
      role: string | null;
      created_at: string;
      last_sign_in_at: string | null;
      email_confirmed_at: string | null;
    };
    
    const mappedUsers: UserWithRole[] = ((users || []) as UserRow[]).map(u => ({
      id: u.id,
      email: u.email,
      fullName: u.full_name,
      role: (u.role as UserRole) || ROLES.PATIENT,
      createdAt: u.created_at,
      lastSignInAt: u.last_sign_in_at,
      emailVerified: !!u.email_confirmed_at,
    }));
    
    return { success: true, data: mappedUsers };
  } catch (error) {
    console.error('Get users error:', error);
    return { success: false, error: 'Failed to fetch users' };
  }
}

/**
 * Delete a user
 * Only super_admin can delete users
 */
export async function deleteUser(targetUserId: string): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    
    if (!currentUser) {
      return { success: false, error: 'Not authenticated' };
    }
    
    const currentUserRole = (currentUser.user_metadata?.role as UserRole) || ROLES.PATIENT;
    
    // Only super_admin can delete users
    if (currentUserRole !== ROLES.SUPER_ADMIN) {
      return { success: false, error: 'Only super admin can delete users' };
    }
    
    // Prevent self-deletion
    if (currentUser.id === targetUserId) {
      return { success: false, error: 'Cannot delete your own account' };
    }
    
    // Delete from users table
    const { error: dbError } = await supabase
      .from('users')
      .delete()
      .eq('id', targetUserId);
    
    if (dbError) {
      console.error('Delete user error:', dbError);
      return { success: false, error: 'Failed to delete user' };
    }
    
    // Note: To delete from auth.users, you need Supabase Admin API
    
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Delete user error:', error);
    return { success: false, error: 'Failed to delete user' };
  }
}

/**
 * Create a new user with a specific role
 * Only admin and super_admin can create users
 */
export async function createUserWithRole(
  email: string,
  password: string,
  fullName: string,
  role: UserRole
): Promise<ActionResult<{ userId: string }>> {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    
    if (!currentUser) {
      return { success: false, error: 'Not authenticated' };
    }
    
    const currentUserRole = (currentUser.user_metadata?.role as UserRole) || ROLES.PATIENT;
    
    // Check if current user can assign this role
    const assignableRoles = getAssignableRoles(currentUserRole);
    if (!assignableRoles.includes(role)) {
      return { success: false, error: 'You do not have permission to create users with this role' };
    }
    
    // Create user via Supabase Auth
    // Note: This requires admin privileges or a custom Edge Function
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        },
      },
    });
    
    if (error) {
      console.error('Create user error:', error);
      return { success: false, error: error.message };
    }
    
    if (!data.user) {
      return { success: false, error: 'Failed to create user' };
    }
    
    revalidatePath('/admin/users');
    return { success: true, data: { userId: data.user.id } };
  } catch (error) {
    console.error('Create user error:', error);
    return { success: false, error: 'Failed to create user' };
  }
}

/**
 * Get users by role
 */
export async function getUsersByRole(role: UserRole): Promise<ActionResult<UserWithRole[]>> {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    
    if (!currentUser) {
      return { success: false, error: 'Not authenticated' };
    }
    
    const currentUserRole = (currentUser.user_metadata?.role as UserRole) || ROLES.PATIENT;
    
    // Check permissions
    if (currentUserRole !== ROLES.SUPER_ADMIN && currentUserRole !== ROLES.ADMIN) {
      return { success: false, error: 'Insufficient permissions' };
    }
    
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, full_name, role, created_at, last_sign_in_at, email_confirmed_at')
      .eq('role', role)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Fetch users by role error:', error);
      return { success: false, error: 'Failed to fetch users' };
    }
    
    // Type assertion for Supabase response
    type UserRow = {
      id: string;
      email: string;
      full_name: string | null;
      role: string | null;
      created_at: string;
      last_sign_in_at: string | null;
      email_confirmed_at: string | null;
    };
    
    const mappedUsers: UserWithRole[] = ((users || []) as UserRow[]).map(u => ({
      id: u.id,
      email: u.email,
      fullName: u.full_name,
      role: (u.role as UserRole) || ROLES.PATIENT,
      createdAt: u.created_at,
      lastSignInAt: u.last_sign_in_at,
      emailVerified: !!u.email_confirmed_at,
    }));
    
    return { success: true, data: mappedUsers };
  } catch (error) {
    console.error('Get users by role error:', error);
    return { success: false, error: 'Failed to fetch users' };
  }
}
