
import { supabase } from '../lib/supabase';

export interface ToolDB {
  id: string;
  created_at?: string;
  title: string;
  description: string;
  category: string;
  features: string[];
  website_url?: string;
  icon_name?: string;
  color?: string;
}

export const ToolsService = {
  /**
   * Fetch all tools from the database
   */
  async getAll(): Promise<ToolDB[]> {
    if (!supabase) return [];
    
    try {
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        // Log the specific error message rather than the object
        console.warn('Supabase fetch warning (Tools):', error.message);
        return [];
      }
      return data || [];
    } catch (error) {
      console.warn('Unexpected error in ToolsService.getAll:', error);
      return [];
    }
  },

  /**
   * Create a new tool
   */
  async add(tool: Omit<ToolDB, 'id' | 'created_at'>) {
    if (!supabase) throw new Error("Database not connected");
    
    try {
      const { data, error } = await supabase
        .from('tools')
        .insert([tool])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error adding tool:', error.message || error);
      throw error;
    }
  },

  /**
   * Update an existing tool
   */
  async update(id: string, updates: Partial<ToolDB>) {
    if (!supabase) throw new Error("Database not connected");

    try {
      const { data, error } = await supabase
        .from('tools')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error updating tool:', error.message || error);
      throw error;
    }
  },

  /**
   * Delete a tool by ID
   */
  async delete(id: string) {
    if (!supabase) throw new Error("Database not connected");

    try {
      const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Error deleting tool:', error.message || error);
      throw error;
    }
  },

  /**
   * Subscribe to real-time changes on the tools table
   */
  subscribe(onUpdate: () => void) {
    if (!supabase) return () => {};
    
    try {
      const channel = supabase
        .channel('public:tools')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'tools' }, (payload) => {
           if (payload.errors) {
               console.warn('Realtime subscription error:', payload.errors);
               return;
           }
           onUpdate();
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            // Subscription active
          }
          if (status === 'CHANNEL_ERROR') {
            console.warn('Failed to subscribe to tools changes');
          }
        });

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (e) {
      console.warn('Error setting up subscription:', e);
      return () => {};
    }
  }
};
