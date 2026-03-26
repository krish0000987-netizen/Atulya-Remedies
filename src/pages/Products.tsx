import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";
import { useProductStore } from "@/store/useProductStore";
import { openWhatsApp } from "@/lib/whatsapp";
import { AlertCircle, RefreshCw } from "lucide-react";

const Products = () => {
  const { 
    products, 
    isLoading, 
    isError, 
    errorMessage, 
    fetchProducts 
  } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <SectionHeading title="Our Products" subtitle="Quality-tested and trusted healthcare products meeting the highest industry standards." />

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mx-auto mb-3" />
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-12">
            <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
            <p className="text-muted-foreground mb-2">Failed to load products. Please try again.</p>
            <p className="text-xs text-muted-foreground/70 mb-4">{errorMessage}</p>
            <Button
              variant="outline"
              onClick={() => fetchProducts(true)}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Retry
            </Button>
          </div>
        ) : !products?.length ? (
          <div className="text-center text-muted-foreground py-12">No products available.</div>
        ) : (
          <div className="space-y-16 max-w-5xl mx-auto">
            {products.map((p, i) => (
              <div key={p.id} className={`grid lg:grid-cols-2 gap-8 items-center ${i % 2 === 1 ? "lg:direction-rtl" : ""}`}>
                <div className={`rounded-lg overflow-hidden shadow-card bg-card flex items-center justify-center p-8 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                  {p.image_url ? (
                    <img src={p.image_url} alt={`${p.name} - ${p.tagline}`} loading="lazy" width={800} height={800} className="w-full aspect-square object-contain" />
                  ) : (
                    <div className="w-full aspect-square bg-muted flex items-center justify-center text-muted-foreground">No Image</div>
                  )}
                </div>
                <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                  {p.tagline && (
                    <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-semibold mb-3">
                      {p.tagline}
                    </span>
                  )}
                  <h3 className="text-2xl font-heading font-bold text-foreground mb-1">{p.name}</h3>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, si) => (
                        <span key={si} className={`text-sm ${si < Math.floor(p.rating || 4) ? "text-yellow-500" : "text-muted-foreground/30"}`}>★</span>
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">{p.rating}</span>
                    </div>
                    {p.price && <span className="text-sm font-bold text-secondary">{p.price}</span>}
                  </div>
                  {p.description && <p className="text-muted-foreground leading-relaxed mb-4">{p.description}</p>}
                  {p.benefits && p.benefits.length > 0 && (
                    <ul className="space-y-2 mb-6">
                      {p.benefits.map((b) => (
                        <li key={b} className="flex items-center gap-2 text-sm text-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                  <Button
                    className="bg-gradient-accent text-accent-foreground font-semibold"
                    onClick={() => openWhatsApp("", "", "", `I'm interested in ${p.name} (${p.tagline}). Price: ${p.price}`)}
                  >
                    Enquire Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;
