import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SectionHeading from "@/components/SectionHeading";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

const GallerySection = () => {
  const { data: images } = useQuery({
    queryKey: ["gallery-preview"],
    queryFn: async () => {
      const { data, error } = await supabase.storage.from("site-media").list("gallery", {
        sortBy: { column: "created_at", order: "desc" },
        limit: 4,
      });
      if (error) throw error;
      return (data || []).map((f) => ({
        url: supabase.storage.from("site-media").getPublicUrl(`gallery/${f.name}`).data.publicUrl,
      }));
    },
  });

  if (!images || images.length === 0) return null;

  return (
    <section className="py-24 bg-muted/20 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 blur-3xl rounded-full bg-secondary/5 -translate-x-1/2 -translate-y-1/2" />
      <div className="container relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <SectionHeading 
            title="Insights Hub" 
            subtitle="Catch a glimpse of our manufacturing power and corporate culture." 
          />
          <Link to="/gallery">
            <Button variant="ghost" className="text-secondary font-bold gap-2">
              BROWSE GALLERY <ArrowUpRight size={18} />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {images.slice(0, 4).map((img, idx) => (
            <Link 
              to="/gallery" 
              key={idx} 
              className={`group relative overflow-hidden rounded-[2rem] aspect-square ${
                idx % 2 === 1 ? 'lg:translate-y-6' : ''
              } shadow-lg transition-transform duration-500 hover:z-10`}
            >
              <img 
                src={img.url} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                alt="Gallery preview" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
