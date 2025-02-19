import { createClient } from '@supabase/supabase-js';
import { Database } from '../../types_db';

export const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export const updateUserDetails = async (userId: string, updates: Partial<Database['public']['Tables']['users']['Update']>) => {
    const { error } = await supabaseAdmin
        .from('users')
        .update(updates)
        .eq('id', userId);
    
    if (error) throw error;
};