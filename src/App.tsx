import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

// Eagerly load home page and admin shell for fast navigation
import Index from "./pages/Index";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";

// Code-split public pages (not critical path)
const About = lazy(() => import("./pages/About"));
const Products = lazy(() => import("./pages/Products"));
const Certifications = lazy(() => import("./pages/Certifications"));
const Contact = lazy(() => import("./pages/Contact"));
const Gallery = lazy(() => import("./pages/Gallery"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Code-split admin sub-pages (loaded after admin shell is ready)
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const PagesAdmin = lazy(() => import("./pages/admin/PagesAdmin"));
const ProductsAdmin = lazy(() => import("./pages/admin/ProductsAdmin"));
const MediaAdmin = lazy(() => import("./pages/admin/MediaAdmin"));
const InquiriesAdmin = lazy(() => import("./pages/admin/InquiriesAdmin"));
const SettingsAdmin = lazy(() => import("./pages/admin/SettingsAdmin"));
const GalleryAdmin = lazy(() => import("./pages/admin/GalleryAdmin"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 15000),
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mx-auto mb-3" />
      <p className="text-muted-foreground text-sm">Loading...</p>
    </div>
  </div>
);

const AdminPageLoader = () => (
  <div className="flex items-center justify-center py-20">
    <div className="text-center">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-secondary mx-auto mb-2" />
      <p className="text-muted-foreground text-xs">Loading...</p>
    </div>
  </div>
);

const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Navbar />
    <main className="min-h-screen">{children}</main>
    <Footer />
    <WhatsAppButton />
  </>
);

import { useEffect } from "react";
import { useSiteStore } from "@/store/useSiteStore";
import { useProductStore } from "@/store/useProductStore";

const App = () => {
  const { fetchSettings, fetchPageContent } = useSiteStore();
  const { fetchProducts } = useProductStore();

  useEffect(() => {
    // Global pre-fetch for the best user experience
    fetchSettings();
    fetchPageContent("home");
    fetchProducts();

    // DEBUG HELPER (Check console for these logs)
    console.log("🛠️ App initialized");
    console.log("📡 Supabase URL:", import.meta.env.VITE_SUPABASE_URL ? "Exists ✅" : "MISSING ❌");
    console.log("🏪 Store loading state:", { settings: "fetching", products: "fetching" });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<PublicLayout><Index /></PublicLayout>} />
            <Route path="/about" element={<Suspense fallback={<PageLoader />}><PublicLayout><About /></PublicLayout></Suspense>} />
            <Route path="/products" element={<Suspense fallback={<PageLoader />}><PublicLayout><Products /></PublicLayout></Suspense>} />
            <Route path="/certifications" element={<Suspense fallback={<PageLoader />}><PublicLayout><Certifications /></PublicLayout></Suspense>} />
            <Route path="/contact" element={<Suspense fallback={<PageLoader />}><PublicLayout><Contact /></PublicLayout></Suspense>} />
            <Route path="/gallery" element={<Suspense fallback={<PageLoader />}><PublicLayout><Gallery /></PublicLayout></Suspense>} />

            {/* Admin routes - AdminLogin and AdminLayout load eagerly */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Suspense fallback={<AdminPageLoader />}><Dashboard /></Suspense>} />
              <Route path="pages" element={<Suspense fallback={<AdminPageLoader />}><PagesAdmin /></Suspense>} />
              <Route path="products" element={<Suspense fallback={<AdminPageLoader />}><ProductsAdmin /></Suspense>} />
              <Route path="media" element={<Suspense fallback={<AdminPageLoader />}><MediaAdmin /></Suspense>} />
              <Route path="inquiries" element={<Suspense fallback={<AdminPageLoader />}><InquiriesAdmin /></Suspense>} />
              <Route path="settings" element={<Suspense fallback={<AdminPageLoader />}><SettingsAdmin /></Suspense>} />
              <Route path="gallery" element={<Suspense fallback={<AdminPageLoader />}><GalleryAdmin /></Suspense>} />
            </Route>

            <Route path="*" element={<Suspense fallback={<PageLoader />}><PublicLayout><NotFound /></PublicLayout></Suspense>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);
};

export default App;
