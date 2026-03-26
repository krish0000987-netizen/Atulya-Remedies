import { Link } from "react-router-dom";
import { useEffect } from "react";
import { 
  Shield, Award, Users, TrendingUp, Star, CheckCircle, MapPin, 
  HeartPulse, Activity, Zap, Beaker, Briefcase, Globe,
  Leaf, Info, ArrowUpRight, Newspaper, Building2, FlaskConical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";
import { useSiteStore } from "@/store/useSiteStore";
import { useProductStore } from "@/store/useProductStore";
import heroImg from "@/assets/hero-pharma.jpg";
import GallerySection from "@/components/GallerySection";

const defaultWhyUs = [
  { title: "WHO-GMP Certified", desc: "Products meeting strict international quality standards." },
  { title: "ISO 9001:2015", desc: "Quality management systems you can trust." },
  { title: "PAN India Presence", desc: "Serving healthcare needs across all states." },
  { title: "Quality Assured", desc: "Every product undergoes rigorous quality testing." },
];

const categories = [
  { name: "Dermatologist & Cosmetologist", icon: HeartPulse, color: "text-red-500", bg: "bg-red-500/10" },
  { name: "Antibiotics & Anti-infectives", icon: Beaker, color: "text-blue-500", bg: "bg-blue-500/10" },
  { name: "Nutraceuticals", icon: Zap, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { name: "Analgesics & NSAIDs", icon: Activity, color: "text-green-500", bg: "bg-green-500/10" },
  { name: "Gastroenterology", icon: FlaskConical, color: "text-purple-500", bg: "bg-purple-500/10" },
  { name: "Gynecology", icon: Users, color: "text-pink-500", bg: "bg-pink-500/10" },
];

const Index = () => {
  const { pageContent, fetchPageContent } = useSiteStore();
  const { products: dbProducts, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
    fetchPageContent("home");
  }, []);

  const content = pageContent["home"] || {};
  const hero = (content.hero as Record<string, any>) || {};
  const whyUs = (content.why_us as Record<string, any>) || {};
  const testimonials = (content.testimonials as Record<string, any>) || {};
  const cta = (content.cta as Record<string, any>) || {};

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center bg-gradient-hero text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={hero.bg_image || heroImg} 
            alt="Atulya Remedies Background" 
            className="w-full h-full object-cover opacity-15 scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
        </div>
        <div className="relative z-10 container py-20">
          <div className="max-w-3xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/15 backdrop-blur-sm border border-secondary/20 text-secondary text-sm font-semibold mb-6">
              <Star className="w-4 h-4 fill-secondary" /> {hero.badge_text || "India's Leading Pharmaceutical Excellence"}
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-extrabold leading-tight mb-6">
              {hero.heading || "Advancing Healthcare Through Innovation"}
            </h1>
            <p className="text-primary-foreground/90 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl font-light">
              Atulya Remedies is dedicated to delivering world-class pharmaceutical solutions that empower healthcare professionals and transform lives across the nation.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products">
                <Button size="lg" className="h-14 bg-gradient-accent hover:shadow-lg hover:shadow-secondary/20 text-accent-foreground font-bold px-10 rounded-xl transition-all hover:-translate-y-1">
                  {hero.cta1_text || "View Products"}
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="h-14 border-white/30 text-white bg-white/5 hover:bg-white/10 backdrop-blur-md px-10 rounded-xl transition-all">
                  Collaborate With Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Floating Stats - Glassmorphism */}
        <div className="absolute bottom-10 right-10 hidden xl:grid grid-cols-2 gap-4 animate-fade-in">
          {[
            { label: "Products", val: "150+" },
            { label: "Distributors", val: "200+" },
            { label: "Trust Rate", val: "99%" },
            { label: "Locations", val: "25+" }
          ].map(s => (
            <div key={s.label} className="bg-white/5 backdrop-blur-lg border border-white/10 p-4 rounded-2xl w-32 shadow-2xl">
              <div className="text-2xl font-bold">{s.val}</div>
              <div className="text-[10px] uppercase tracking-widest text-white/60 font-semibold">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 1. Therapeutic Areas (NEW) */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="container relative z-10">
          <SectionHeading 
            title="Therapeutic Excellence" 
            subtitle="Diverse range of medical segments we specialize in, providing specialized care for complex health needs." 
          />
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {categories.map((cat, idx) => (
              <div key={idx} className="group bg-card hover:bg-muted/50 border border-border p-8 rounded-2xl transition-all hover:shadow-elevated cursor-default overflow-hidden relative">
                <div className="absolute bottom-0 right-0 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                  <cat.icon size={120} />
                </div>
                <div className={`w-14 h-14 rounded-2xl ${cat.bg} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                  <cat.icon size={28} className={cat.color} />
                </div>
                <h3 className="text-xl font-bold mb-2">{cat.name}</h3>
                <p className="text-sm text-muted-foreground">High-performance formulations designed for efficacy and patient compliance.</p>
                <div className="mt-6 flex items-center gap-2 text-xs font-bold text-secondary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                  LEARN MORE <ArrowUpRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Mission & Vision (REPLACED About Short) */}
      <section className="py-24 bg-muted/40 overflow-hidden">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-block px-4 py-1 rounded-lg bg-secondary/10 text-secondary text-sm font-bold uppercase tracking-wider">
                Who We Are
              </div>
              <h2 className="text-4xl md:text-5xl font-heading font-extrabold leading-tight">
                Empowering Lives Through <span className="text-gradient">Superior Quality</span> Medicines
              </h2>
              <div className="grid gap-6">
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center text-white">
                    <Globe size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">Our Mission</h4>
                    <p className="text-muted-foreground text-sm">To bridge the gap between innovation and affordability by providing world-class pharmaceutical solutions across every corner of India.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-accent flex items-center justify-center text-white font-bold">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">Our Vision</h4>
                    <p className="text-muted-foreground text-sm">To be the most trusted name in the global healthcare industry, known for our unwavering commitment to quality and patient safety.</p>
                  </div>
                </div>
              </div>
              <Button size="lg" variant="outline" className="rounded-xl border-secondary/20 hover:bg-secondary/5 text-secondary">
                Read Full Story
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <img src={heroImg} alt="Pharma Innovation" className="w-full h-full object-cover brightness-95" />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-card p-8 rounded-3xl shadow-elevated border border-border hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="text-5xl font-bold text-secondary">10+</div>
                  <div className="text-sm font-medium leading-tight">Years of Pharmaceutical<br />Excellence</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Global Quality Standards (NEW) */}
      <section className="py-24 bg-background">
        <div className="container">
          <SectionHeading title="Global Quality Standards" subtitle="We adhere to the most stringent international regulations to ensure every tablet and syrup is safe." />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            {[
              { title: "WHO-GMP", desc: "World Health Organization - Good Manufacturing Practices", color: "from-blue-500 to-indigo-600" },
              { title: "ISO 9001:2015", desc: "Quality Management Systems Certified", color: "from-emerald-500 to-teal-600" },
              { title: "Rigorous Labs", desc: "Advanced In-house analytical & microbiological labs", color: "from-orange-500 to-rose-600" },
              { title: "Ethical Sourcing", desc: "Premium API sourcing with direct supply chain control", color: "from-purple-500 to-violet-600" }
            ].map((q, i) => (
              <div key={i} className="group p-8 rounded-3xl bg-card border border-border hover:border-secondary/30 transition-all text-center">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${q.color} flex items-center justify-center text-white mx-auto mb-6 shadow-lg group-hover:rotate-6 transition-transform`}>
                  <Shield size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3">{q.title}</h3>
                <p className="text-sm text-muted-foreground">{q.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PCD Pharma Franchise (NEW) */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 opacity-50" />
        <div className="container relative z-10">
          <div className="bg-gradient-to-r from-primary to-[#0f172a] rounded-[2.5rem] p-12 md:p-20 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-secondary/20 translate-x-1/4 -skew-x-12 blur-3xl" />
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">Start Your Journey with <span className="text-secondary">Atulya Partnership</span></h2>
                <p className="text-primary-foreground/70 mb-8 text-lg">We offer lucrative PCD Pharma Franchise opportunities across India. Join a network that values trust, transparency, and timely delivery.</p>
                <ul className="space-y-4 mb-10">
                  {["Monopoly Rights in Your Area", "Premium Marketing Support & Toolkits", "Prompt Delivery & Stable Pricing", "Regular Product Portfolio Expansions"].map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm">
                      <div className="p-1 rounded-full bg-secondary/20">
                        <CheckCircle size={16} className="text-secondary" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <Button className="bg-gradient-accent text-accent-foreground font-bold px-10 h-14 rounded-xl">
                  Become a Partner
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Building2, label: "Warehouse Infrastructure" },
                  { icon: Newspaper, label: "Marketing Collaterals" },
                  { icon: FlaskConical, label: "R&D Support" },
                  { icon: Globe, label: "Logistics Network" }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex flex-col items-center text-center">
                    <item.icon size={32} className="text-secondary mb-3" />
                    <span className="text-xs font-semibold">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <GallerySection />

      {/* Featured Products (Refined) */}
      {dbProducts && dbProducts.length > 0 && (
        <section className="py-24 bg-muted/30">
          <div className="container">
            <SectionHeading title="Top Performing Formulations" subtitle="Explore our most recommended pharmaceutical products by leading specialists." />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 max-w-6xl mx-auto">
              {dbProducts.slice(0, 3).map((p) => (
                <div key={p.id} className="bg-card rounded-[2rem] overflow-hidden border border-border hover:border-secondary/20 transition-all group p-4">
                  <div className="aspect-square bg-white rounded-2xl overflow-hidden flex items-center justify-center p-8 mb-4 relative">
                    <div className="absolute top-4 right-4 bg-secondary/10 text-secondary text-[10px] font-bold px-3 py-1 rounded-full">CERTIFIED</div>
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="text-muted-foreground italic">No Image</div>
                    )}
                  </div>
                  <div className="px-4 pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-xl">{p.name}</h3>
                      <div className="bg-muted text-[10px] font-bold px-2 py-0.5 rounded uppercase">{p.category}</div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 font-light">{p.tagline}</p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-secondary text-secondary" />
                        <span className="text-sm font-bold">{p.rating || "4.5"}</span>
                      </div>
                      <Link to="/products" className="text-sm font-bold text-secondary flex items-center gap-1 hover:gap-2 transition-all">
                        DETAILS <ArrowUpRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Health & Wellness Updates (NEW) */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-5xl font-heading font-extrabold mb-4">Latest Insights</h2>
              <p className="text-muted-foreground">Expert medical advice and corporate updates from the world of Atulya Remedies.</p>
            </div>
            <Button variant="ghost" className="text-secondary font-bold gap-2">VIEW ALL POSTS <ArrowUpRight size={18} /></Button>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: "Innovation in Cardiac Care", 
                category: "Research", 
                date: "Oct 12, 2024", 
                image: "/assets/cardiac-insight.png" 
              },
              { 
                title: "Expansion into South India", 
                category: "News", 
                date: "Sep 28, 2024", 
                image: "/assets/corporate-insight.png" 
              },
              { 
                title: "Importance of Pure Nutraceuticals", 
                category: "Wellness", 
                date: "Sep 15, 2024", 
                image: "/assets/wellness-insight.png" 
              }
            ].map((post, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-[16/10] rounded-2xl bg-muted overflow-hidden mb-6 relative">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-secondary/5 group-hover:bg-secondary/15 transition-colors" />
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <span className="bg-card text-[10px] font-bold px-3 py-1 rounded-full">{post.category}</span>
                    <span className="bg-card/50 backdrop-blur-md text-[10px] text-white font-bold px-3 py-1 rounded-full">{post.date}</span>
                  </div>
                </div>
                <h4 className="text-xl font-bold group-hover:text-secondary transition-colors line-clamp-2">{post.title}</h4>
                <p className="mt-2 text-sm text-muted-foreground">Discover how our latest research and expansions are shaping the future of healthcare. Stay tuned for expert medical insights.</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Visual MapPin footer spacer */}
      <div className="py-8 bg-background border-t border-border/40 text-center">
        <Link to="/contact" className="inline-flex items-center gap-2 text-[10px] hover:text-secondary transition-colors uppercase tracking-[0.2em] font-bold text-muted-foreground/60">
          <MapPin size={12} /> Headquarted in Agra — Serving the Nation
        </Link>
      </div>
    </div>
  );
};

export default Index;
