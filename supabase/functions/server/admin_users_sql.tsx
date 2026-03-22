import { supabase, logSQLError } from "./db.tsx";

/**
 * Récupère tous les utilisateurs avec filtres et pagination
 */
export async function getUsers(filters?: {
  search?: string;
  status?: string;
  membershipType?: string;
  country?: string;
  limit?: number;
  offset?: number;
}) {
  try {
    let query = supabase
      .from('users')
      .select('*', { count: 'exact' });

    // Filtres
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.membershipType) {
      query = query.eq('membership_type', filters.membershipType);
    }
    if (filters?.country) {
      query = query.eq('country', filters.country);
    }

    // Pagination
    const limit = filters?.limit || 50;
    const offset = filters?.offset || 0;
    query = query.range(offset, offset + limit - 1);

    // Tri par date de création
    query = query.order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      logSQLError('getUsers', error);
      throw error;
    }

    return {
      success: true,
      users: data || [],
      total: count || 0,
      limit,
      offset
    };
  } catch (error) {
    console.error('❌ Erreur récupération utilisateurs:', error);
    throw error;
  }
}

/**
 * Récupère un utilisateur par ID
 */
export async function getUserById(userId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      logSQLError('getUserById', error);
      throw error;
    }

    return {
      success: true,
      user: data
    };
  } catch (error) {
    console.error('❌ Erreur récupération utilisateur:', error);
    throw error;
  }
}

/**
 * Met à jour un utilisateur
 */
export async function updateUser(userId: string, updates: any, adminId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      logSQLError('updateUser', error);
      throw error;
    }

    // Log l'action admin
    await logAdminActivity({
      adminId,
      actionType: 'user_updated',
      entityType: 'user',
      entityId: userId,
      details: updates
    });

    return {
      success: true,
      user: data
    };
  } catch (error) {
    console.error('❌ Erreur mise à jour utilisateur:', error);
    throw error;
  }
}

/**
 * Suspend un utilisateur
 */
export async function suspendUser(userId: string, adminId: string, reason: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        status: 'suspended',
        suspended_by: adminId,
        suspension_reason: reason
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      logSQLError('suspendUser', error);
      throw error;
    }

    // Log l'action admin
    await logAdminActivity({
      adminId,
      actionType: 'user_suspended',
      entityType: 'user',
      entityId: userId,
      details: { reason }
    });

    return {
      success: true,
      user: data
    };
  } catch (error) {
    console.error('❌ Erreur suspension utilisateur:', error);
    throw error;
  }
}

/**
 * Réactive un utilisateur suspendu
 */
export async function reactivateUser(userId: string, adminId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        status: 'active',
        suspended_by: null,
        suspension_reason: null
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      logSQLError('reactivateUser', error);
      throw error;
    }

    // Log l'action admin
    await logAdminActivity({
      adminId,
      actionType: 'user_updated',
      entityType: 'user',
      entityId: userId,
      details: { action: 'reactivated' }
    });

    return {
      success: true,
      user: data
    };
  } catch (error) {
    console.error('❌ Erreur réactivation utilisateur:', error);
    throw error;
  }
}

/**
 * Supprime un utilisateur (soft delete)
 */
export async function deleteUser(userId: string, adminId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ status: 'deleted' })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      logSQLError('deleteUser', error);
      throw error;
    }

    // Log l'action admin
    await logAdminActivity({
      adminId,
      actionType: 'user_deleted',
      entityType: 'user',
      entityId: userId,
      details: {}
    });

    return {
      success: true,
      user: data
    };
  } catch (error) {
    console.error('❌ Erreur suppression utilisateur:', error);
    throw error;
  }
}

/**
 * Récupère les statistiques des utilisateurs
 */
export async function getUserStats() {
  try {
    const [
      { count: totalUsers },
      { count: activeUsers },
      { count: suspendedUsers },
      { count: cercleMembers }
    ] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }).neq('status', 'deleted'),
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('status', 'suspended'),
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('membership_type', 'cercle')
    ]);

    return {
      success: true,
      stats: {
        total: totalUsers || 0,
        active: activeUsers || 0,
        suspended: suspendedUsers || 0,
        cercleMembers: cercleMembers || 0
      }
    };
  } catch (error) {
    console.error('❌ Erreur récupération stats utilisateurs:', error);
    throw error;
  }
}

/**
 * Log une action admin dans admin_activity_logs
 */
async function logAdminActivity(params: {
  adminId: string;
  actionType: string;
  entityType: string;
  entityId: string;
  details: any;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    const { error } = await supabase
      .from('admin_activity_logs')
      .insert({
        admin_id: params.adminId,
        action_type: params.actionType,
        entity_type: params.entityType,
        entity_id: params.entityId,
        details: params.details,
        ip_address: params.ipAddress,
        user_agent: params.userAgent
      });

    if (error) {
      logSQLError('logAdminActivity', error);
    }
  } catch (error) {
    console.error('⚠️ Erreur log activité admin (non-bloquant):', error);
  }
}
