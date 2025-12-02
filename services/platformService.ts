
import { supabase } from '../lib/supabase';
import { platforms as staticPlatforms } from '../data';
import { PlatformData } from '../types';

export const PlatformService = {
  /**
   * Fetch all platforms and their related specs from the database.
   * Falls back to static data if DB is unconnected or tables don't exist.
   */
  async getAll(): Promise<PlatformData[]> {
    if (!supabase) return staticPlatforms;

    try {
      // Fetch platforms with nested specs
      const { data, error } = await supabase
        .from('platforms')
        .select('*, specs(*)')
        .order('name');

      if (error) {
        console.warn('Supabase: Using static platforms data (Table not found or connection issue)', error.message);
        return staticPlatforms;
      }

      if (!data || data.length === 0) {
        return staticPlatforms;
      }

      // Transform DB snake_case to TS camelCase
      const formattedData: PlatformData[] = data.map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        lastUpdated: p.last_updated || new Date().toISOString().split('T')[0],
        specs: (p.specs || []).map((s: any) => ({
          id: s.id,
          title: s.title,
          dimensions: s.dimensions,
          width: s.width,
          height: s.height,
          aspectRatio: s.aspect_ratio,
          format: s.format,
          fileType: Array.isArray(s.file_type) ? s.file_type : (s.file_type ? JSON.parse(s.file_type) : []),
          maxFileSize: s.max_file_size,
          maxFileSizeBytes: s.max_file_size_bytes,
          notes: s.notes,
          settings: s.settings
        }))
      }));

      return formattedData;
    } catch (error) {
      console.warn('Unexpected error in PlatformService.getAll, defaulting to static data:', error);
      return staticPlatforms;
    }
  },

  /**
   * Subscribe to real-time changes
   */
  subscribe(onUpdate: () => void) {
    if (!supabase) return () => {};
    
    // Subscribe to both tables to trigger refresh on any change
    const channels = [
        supabase.channel('public:platforms').on('postgres_changes', { event: '*', schema: 'public', table: 'platforms' }, onUpdate).subscribe(),
        supabase.channel('public:specs').on('postgres_changes', { event: '*', schema: 'public', table: 'specs' }, onUpdate).subscribe()
    ];

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }
};
