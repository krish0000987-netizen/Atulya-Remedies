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
  updatePageContent: (page: string, sectionData: Record<string, any>) => Promise<void>;
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
    // We fetch even if exists if we want to ensure fresh data on explicit request
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
  },

  updatePageContent: async (page: string, sectionData: Record<string, any>) => {
    set({ isLoading: true });
    try {
      for (const [section, content] of Object.entries(sectionData)) {
        const { error } = await supabase
          .from("page_content")
          .upsert(
            { page, section, content },
            { onConflict: "page,section" }
          );
        if (error) throw error;
      }
      
      // Refresh local state
      await get().fetchPageContent(page);
    } catch (err) {
      console.error(`Failed to update content for ${page}:`, err);
      throw err;
    } finally {
      set({ isLoading: false });
    }
  }
}));
