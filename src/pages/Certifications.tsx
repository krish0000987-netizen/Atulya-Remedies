import { useState } from "react";
import { Award, Shield, ChevronLeft, ChevronRight, X } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { usePageContent } from "@/hooks/usePageContent";
import certImg from "@/assets/certifications.jpg";

const defaultCerts = [
  { title: "ISO 9001:2015", desc: "International standard for quality management systems. Ensures consistent quality across all our products and processes." },
  { title: "WHO-GMP Certified", desc: "World Health Organization - Good Manufacturing Practices certification. Guarantees our products meet the highest quality standards." },
];

const certIcons = [Shield, Award];

const Certifications = () => {
  const { data: content } = usePageContent("certifications");
  const main = (content?.main as Record<string, any>) || {};
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const certs = Array.isArray(main.certs) && main.certs.length > 0 ? main.certs : defaultCerts;

  // Support both new multi-image array and legacy single image
  const certificateImages: string[] = (() => {
    if (Array.isArray(main.certificate_images) && main.certificate_images.length > 0) {
      return main.certificate_images;
    }
    if (main.image_url) {
      return [main.image_url];
    }
    return [certImg];
  })();

  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === 0 ? certificateImages.length - 1 : lightboxIndex - 1);
    }
  };
  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === certificateImages.length - 1 ? 0 : lightboxIndex + 1);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <SectionHeading
          title={main.title || "Our Certifications"}
          subtitle={main.subtitle || "Quality certified products meeting the highest industry standards."}
        />

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          {certs.map((c: any, i: number) => {
            const Icon = certIcons[i % certIcons.length];
            return (
              <div key={c.title} className="bg-card rounded-lg p-8 shadow-card border border-border">
                <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mb-5">
                  <Icon className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="font-heading font-bold text-xl text-foreground mb-2">{c.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Certificate Images Grid */}
        {certificateImages.length === 1 ? (
          <div className="max-w-3xl mx-auto rounded-lg overflow-hidden shadow-elevated">
            <img
              src={certificateImages[0]}
              alt="Atulya Remedies certification"
              loading="lazy"
              width={1200}
              height={800}
              className="w-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => openLightbox(0)}
            />
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            <h3 className="text-lg font-heading font-semibold text-foreground text-center mb-6">
              Our Certificates
            </h3>
            <div className={`grid gap-4 ${
              certificateImages.length === 2 ? "grid-cols-1 sm:grid-cols-2" :
              certificateImages.length === 3 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" :
              "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            }`}>
              {certificateImages.map((imgUrl, idx) => (
                <div
                  key={`${imgUrl}-${idx}`}
                  className="rounded-lg overflow-hidden shadow-elevated group cursor-pointer border border-border bg-card"
                  onClick={() => openLightbox(idx)}
                >
                  <div className="aspect-[4/3] overflow-hidden flex items-center justify-center p-4 bg-muted/30">
                    <img
                      src={imgUrl}
                      alt={`Certificate ${idx + 1}`}
                      loading="lazy"
                      width={800}
                      height={600}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="px-4 py-3 text-center">
                    <span className="text-sm text-muted-foreground font-medium">Certificate {idx + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lightbox Modal */}
        {lightboxIndex !== null && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-white/80 transition-colors z-10"
              onClick={closeLightbox}
              aria-label="Close"
            >
              <X className="w-8 h-8" />
            </button>

            {certificateImages.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-white/80 transition-colors z-10 bg-black/40 rounded-full p-2"
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-white/80 transition-colors z-10 bg-black/40 rounded-full p-2"
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  aria-label="Next"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            <div
              className="max-w-4xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={certificateImages[lightboxIndex]}
                alt={`Certificate ${lightboxIndex + 1}`}
                className="w-full h-full object-contain rounded-lg"
              />
              {certificateImages.length > 1 && (
                <div className="text-center mt-3 text-white/70 text-sm">
                  {lightboxIndex + 1} / {certificateImages.length}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Certifications;
