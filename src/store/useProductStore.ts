import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  name: string;
  tagline?: string;
  category?: string;
  description?: string;
  price?: string;
  rating?: number;
  image_url?: string;
  benefits?: string[];
  status: string;
  sort_order: number;
}

interface ProductState {
  products: Product[]; // Publicly active products
  adminProducts: Product[]; // All products including inactive
  isLoading: boolean;
  isAdminLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  
  // Actions
  fetchProducts: (force?: boolean) => Promise<void>;
  fetchAdminProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'sort_order'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  adminProducts: [],
  isLoading: false,
  isAdminLoading: false,
  isError: false,
  errorMessage: null,

  fetchProducts: async (force = false) => {
    if (get().isLoading) return;
    if (!force && get().products.length > 0) return;

    set({ isLoading: true, isError: false, errorMessage: null });
    
    // SAFETY TIMEOUT for data fetching
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 10000);

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('sort_order', { ascending: true })
        .abortSignal(controller.signal);

      clearTimeout(timeoutId);
      if (error) throw error;
      set({ products: data as Product[] || [], isLoading: false });
    } catch (err: any) {
      clearTimeout(timeoutId);
      const msg = err.name === 'AbortError' ? "Request timed out after 10 seconds" : err.message;
      console.error("Fetch Products Error:", msg);
      set({ isError: true, errorMessage: msg, isLoading: false });
    }
  },

  fetchAdminProducts: async () => {
    set({ isAdminLoading: true });
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      set({ adminProducts: data as Product[] || [], isAdminLoading: false });
    } catch (err: any) {
      set({ isError: true, errorMessage: err.message, isAdminLoading: false });
    }
  },

  addProduct: async (payload) => {
    const { error } = await supabase.from('products').insert([payload]);
    if (error) throw error;
    await get().fetchAdminProducts();
    await get().fetchProducts(true);
  },

  updateProduct: async (id, updates) => {
    const { error } = await supabase.from('products').update(updates).eq('id', id);
    if (error) throw error;
    await get().fetchAdminProducts();
    await get().fetchProducts(true);
  },

  deleteProduct: async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    await get().fetchAdminProducts();
    await get().fetchProducts(true);
  },
}));
