import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Shield, Award, Users, TrendingUp, Star, CheckCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";
import { usePageContent } from "@/hooks/usePageContent";
import { useProductStore } from "@/store/useProductStore";
import heroImg from "@/assets/hero-pharma.jpg";

const defaultWhyUs = [
  { title: "WHO-GMP Certified", desc: "Products meeting strict international quality standards." },
  { title: "ISO 9001:2015", desc: "Quality management systems you can trust." },
  { title: "PAN India Presence", desc: "Serving healthcare needs across all states." },
  { title: "Quality Assured", desc: "Every product undergoes rigorous quality testing." },
];

const defaultTestimonials = [
  { name: "Dr. Rajesh Kumar", role: "Physician, Delhi", text: "Atulya Remedies products have shown excellent clinical results. I regularly recommend their products to my patients." },
  { name: "Amit Sharma", role: "Partner, Jaipur", text: "The support from Atulya Remedies is outstanding. Reliable products and excellent service." },
  { name: "Dr. Priya Singh", role: "Gynecologist, Lucknow", text: "A trusted brand in my practice. The quality is consistently excellent." },
];

const defaultStats = [
  { label: "Products", value: "50+" },
  { label: "States Covered", value: "20+" },
  { label: "Years of Trust", value: "5+" },
];

const whyUsIcons = [Shield, Award, Users, TrendingUp];

const Index = () => {
  const { data: content } = usePageContent("home");
  const { products: dbProducts, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  const hero = (content?.hero as Record<string, any>) || {};
  const aboutShort = (content?.about_short as Record<string, any>) || {};
  const whyUs = (content?.why_us as Record<string, any>) || {};
  const testimonials = (content?.testimonials as Record<string, any>) || {};
  const cta = (content?.cta as Record<string, any>) || {};

  const stats = Array.isArray(aboutShort.stats) && aboutShort.stats.length > 0 ? aboutShort.stats : defaultStats;
  const whyUsItems = Array.isArray(whyUs.items) && whyUs.items.length > 0 ? whyUs.items : defaultWhyUs;
  const testimonialItems = Array.isArray(testimonials.items) && testimonials.items.length > 0 ? testimonials.items : defaultTestimonials;

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-hero text-primary-foreground overflow-hidden">
        <div className="absolute inset-0">
          <img src={hero.bg_image || heroImg} alt="Pharmaceutical products" width={1920} height={1080} className="w-full h-full object-cover opacity-20" />
        </div>
        <div className="relative container py-20 md:py-32 lg:py-40">
          <div className="max-w-2xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/20 text-secondary text-sm font-medium mb-6">
              <CheckCircle className="w-4 h-4" /> {hero.badge_text || "WHO-GMP Certified | ISO 9001:2015"}
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-extrabold leading-tight mb-5">
              {hero.heading || "Trusted Pharmaceutical Company in India"}
            </h1>
            <p className="text-primary-foreground/80 text-base md:text-lg leading-relaxed mb-8 max-w-xl">
              {hero.subheading || "Providing high-quality pharmaceutical and nutraceutical products focused on health and wellness."}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/products">
                <Button size="lg" className="bg-gradient-accent text-accent-foreground font-semibold px-8">
                  {hero.cta1_text || "Explore Products"}
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-white text-white bg-white/10 hover:bg-white/20 font-semibold">
                  {hero.cta2_text || "Contact Us"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About short */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <SectionHeading
            title={aboutShort.title || "About Atulya Remedies"}
            subtitle={aboutShort.subtitle || "A trusted name in pharmaceutical excellence, committed to quality healthcare products that improve lives across India."}
          />
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {stats.map((s: any) => (
              <div key={s.label} className="bg-card rounded-lg p-6 text-center shadow-card">
                <div className="text-3xl font-heading font-bold text-secondary">{s.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products from DB */}
      {dbProducts && dbProducts.length > 0 && (
        <section className="py-16 md:py-24 bg-muted">
          <div className="container">
            <SectionHeading title="Featured Products" subtitle="Quality-tested and trusted healthcare products meeting the highest industry standards." />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {dbProducts.map((p) => (
                <div key={p.id} className="bg-card rounded-lg overflow-hidden shadow-card hover:shadow-elevated transition-shadow group">
                  <div className="aspect-square bg-card overflow-hidden flex items-center justify-center p-6">
                    {p.image_url ? (
                      <img src={p.image_url} alt={`${p.name} healthcare product`} loading="lazy" width={800} height={800} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">No Image</div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading font-bold text-lg text-foreground">{p.name}</h3>
                    <div className="flex items-center gap-0.5 mt-1">
                      {[...Array(5)].map((_, si) => (
                        <span key={si} className={`text-xs ${si < Math.floor(p.rating || 4) ? "text-yellow-500" : "text-muted-foreground/30"}`}>★</span>
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">{p.rating}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{p.tagline} — {p.price}</p>
                    <Link to="/products" className="inline-block mt-3 text-sm font-medium text-secondary hover:underline">
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <SectionHeading
            title={whyUs.title || "Why Choose Us"}
            subtitle={whyUs.subtitle || "Committed to quality and healthcare excellence for your trust and well-being."}
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {whyUsItems.map((w: any, i: number) => {
              const Icon = whyUsIcons[i % whyUsIcons.length];
              return (
                <div key={w.title} className="bg-card rounded-lg p-6 shadow-card text-center">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground">{w.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{w.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container">
          <SectionHeading
            title={testimonials.title || "What Our Partners Say"}
            subtitle={testimonials.subtitle || "Trusted by doctors, healthcare professionals, and partners across India."}
          />
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonialItems.map((t: any) => (
              <div key={t.name} className="bg-card rounded-lg p-6 shadow-card">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{t.text}"</p>
                <div className="font-heading font-semibold text-sm text-foreground">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-10 bg-background">
        <div className="container text-center">
          <a href="https://maps.google.com/?q=Shanti+Puram+Shahganj+Taj+Nagri+19+Sikandra+Bodla+Rd+Sikandra+Agra+282007" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-muted-foreground hover:text-secondary transition-colors text-sm">
            <MapPin className="w-4 h-4" />
            Based in Agra, India — Serving Nationwide
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-hero text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-2xl md:text-4xl font-heading font-bold mb-4">
            {cta.heading || "Looking for Quality Healthcare Products?"}
          </h2>
          <p className="text-primary-foreground/80 max-w-lg mx-auto mb-8">
            {cta.description || "Explore our range of pharmaceutical and nutraceutical products trusted by healthcare professionals across India."}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/products">
              <Button size="lg" className="bg-gradient-accent text-accent-foreground font-semibold px-10">
                {cta.button_text || "Explore Products"}
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white text-white bg-white/10 hover:bg-white/20 font-semibold px-10">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
