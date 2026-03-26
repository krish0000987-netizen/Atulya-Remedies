import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SectionHeading from "@/components/SectionHeading";
import { ImageIcon, Maximize2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: images, isLoading } = useQuery({
    queryKey: ["gallery-images"],
    queryFn: async () => {
      const { data, error } = await supabase.storage.from("site-media").list("gallery", {
        sortBy: { column: "created_at", order: "desc" },
      });
      if (error) throw error;

      return (data || []).map((f) => ({
        name: f.name,
        url: supabase.storage.from("site-media").getPublicUrl(`gallery/${f.name}`).data.publicUrl,
      }));
    },
  });

  return (
    <div className="py-20 lg:py-32 bg-background min-h-screen">
      <div className="container">
        <SectionHeading 
          title="Our Gallery" 
          subtitle="Explore our world-class manufacturing facilities, laboratory excellence, and corporate milestones." 
        />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mb-4" />
            <p className="text-muted-foreground">Loading gallery...</p>
          </div>
        ) : !images || images.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-[2rem] border-2 border-dashed border-border">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <h3 className="text-xl font-bold mb-2">No photos yet</h3>
            <p className="text-muted-foreground">Check back soon for latest updates.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-16">
            {images.map((img, idx) => (
              <div 
                key={idx} 
                className="group relative aspect-square rounded-[2rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
                onClick={() => setSelectedImage(img.url)}
              >
                <img 
                  src={img.url} 
                  alt={img.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white">
                    <Maximize2 size={24} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden bg-transparent border-none shadow-none flex items-center justify-center">
          {selectedImage && (
            <img 
              src={selectedImage} 
              alt="Gallery highlight" 
              className="w-full h-auto max-h-[85vh] object-contain rounded-xl" 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Gallery;
