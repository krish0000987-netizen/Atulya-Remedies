import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export const usePageContent = (page: string) => {
  return useQuery({
    queryKey: ["page-content", page],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_content")
        .select("*")
        .eq("page", page);
      if (error) {
        console.error(`Failed to fetch page content for "${page}":`, error);
        throw error;
      }
      const map: Record<string, Json | null> = {};
      data?.forEach((row) => {
        map[row.section] = row.content;
      });
      return map;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
};

export const useSiteSettings = () => {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*");
      if (error) {
        console.error("Failed to fetch site settings:", error);
        throw error;
      }
      const map: Record<string, string> = {};
      data?.forEach((s) => {
        map[s.key] = s.value || "";
      });
      return map;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
};
