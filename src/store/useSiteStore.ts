import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

interface SiteSettings {
  [key: string]: string;
}

interface PageContent {
  [section: string]: any;
}

interface SiteStore {
  settings: SiteSettings;
  pageContent: Record<string, PageContent>;
  isLoading: boolean;
  
  fetchSettings: () => Promise<void>;
  fetchPageContent: (page: string) => Promise<void>;
}

export const useSiteStore = create<SiteStore>((set, get) => ({
  settings: {},
  pageContent: {},
  isLoading: false,

  fetchSettings: async () => {
    if (Object.keys(get().settings).length > 0) return;
    
    try {
      const { data, error } = await supabase.from('site_settings').select('*');
      if (error) throw error;
      
      const map: SiteSettings = {};
      data?.forEach((s) => {
        map[s.key] = s.value || '';
      });
      set({ settings: map });
    } catch (err) {
      console.error('Failed to fetch site settings:', err);
    }
  },

  fetchPageContent: async (page: string) => {
    if (get().pageContent[page]) return;

    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page', page);
      
      if (error) throw error;
      
      const map: PageContent = {};
      data?.forEach((row) => {
        map[row.section] = row.content;
      });
      
      set((state) => ({
        pageContent: { ...state.pageContent, [page]: map },
        isLoading: false
      }));
    } catch (err) {
      console.error(`Failed to fetch content for ${page}:`, err);
      set({ isLoading: false });
    }
  }
}));
