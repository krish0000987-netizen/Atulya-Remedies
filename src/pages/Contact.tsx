import { useState } from "react";
import { Phone, MapPin, Clock, Navigation, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SectionHeading from "@/components/SectionHeading";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { openWhatsApp } from "@/lib/whatsapp";
import { usePageContent, useSiteSettings } from "@/hooks/usePageContent";

const FULL_ADDRESS = "Shanti Puram, Shahganj Taj Nagri, 19, Sikandra Bodla Rd, near Awas Vikash Colony, Sector 6-C, Sector 6, Avas Vikas Colony, Sikandra, Agra, Uttar Pradesh 282007, India";
const MAPS_URL = "https://maps.google.com/?q=Shanti+Puram+Shahganj+Taj+Nagri+19+Sikandra+Bodla+Rd+Sikandra+Agra+282007";

const Contact = () => {
  const [form, setForm] = useState({ name: "", phone: "", city: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { data: content } = usePageContent("contact");
  const { data: settings } = useSiteSettings();
  const main = (content?.main as Record<string, any>) || {};

  const address = settings?.address || FULL_ADDRESS;
  const mapsEmbedUrl = settings?.maps_embed_url || main.maps_url || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await supabase.from("inquiries").insert({
      name: form.name,
      phone: form.phone,
      city: form.city,
      message: form.message || null,
    });

    setSubmitting(false);

    if (error) {
      toast({ title: "Error", description: "Could not submit. Please try again.", variant: "destructive" });
      return;
    }

    toast({ title: "Submitted!", description: "Your inquiry has been received. We'll contact you soon." });
    openWhatsApp(form.name, form.phone, form.city, form.message);
    setForm({ name: "", phone: "", city: "", message: "" });
  };

  const contacts = [
    { icon: Phone, label: "Phone ", value: settings?.phone_primary || "+91 76975 55159", href: `tel:${(settings?.phone_primary || "+917697555159").replace(/\s/g, "")}` },
    { icon: Phone, label: "Phone", value: settings?.phone_alt1 || "+91 88780 36772", href: `tel:${(settings?.phone_alt1 || "+918878036772").replace(/\s/g, "")}` },
    { icon: Phone, label: "Phone", value: settings?.phone_alt2 || "+91 76975 11159", href: `tel:${(settings?.phone_alt2 || "+917697511159").replace(/\s/g, "")}` },
    { icon: Mail, label: "Email", value: settings?.email1 || "atulyaremedies@gmail.com", href: `mailto:${settings?.email1 || "atulyaremedies@gmail.com"}` },
    { icon: Mail, label: "Email 2", value: settings?.email2 || "Info@atulyaremedies.com", href: `mailto:${settings?.email2 || "Info@atulyaremedies.com"}` },
    { icon: MapPin, label: "Address", value: address, href: MAPS_URL },
    { icon: Clock, label: "Hours", value: "Mon – Sat: 9:00 AM – 6:00 PM" },
  ];

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <SectionHeading
          title={main.title || "Contact Us"}
          subtitle={main.subtitle || "Get in touch with Atulya Remedies for product enquiries or any questions."}
        />

        <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
          <div>
            <div className="space-y-6 mb-8">
              {contacts.map((c) => (
                <div key={c.label + c.value} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                    <c.icon className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <div className="font-heading font-semibold text-sm text-foreground">{c.label}</div>
                    {c.href ? (
                      <a href={c.href} target={c.label === "Address" ? "_blank" : undefined} rel={c.label === "Address" ? "noopener noreferrer" : undefined} className="text-sm text-muted-foreground hover:text-secondary transition-colors">{c.value}</a>
                    ) : (
                      <div className="text-sm text-muted-foreground">{c.value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="mb-6 gap-2 border-secondary text-secondary hover:bg-secondary/10">
                <Navigation className="w-4 h-4" />
                Get Directions
              </Button>
            </a>

            {mapsEmbedUrl && (
              <div className="rounded-lg overflow-hidden shadow-card">
                <iframe
                  title="Atulya Remedies Location"
                  src={mapsEmbedUrl}
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </div>

          <div>
            <form onSubmit={handleSubmit} className="space-y-4 bg-card p-6 md:p-8 rounded-lg shadow-card">
              <h3 className="font-heading font-bold text-lg text-foreground mb-2">{main.form_title || "Send Us a Message"}</h3>
              <Input placeholder="Your Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="Phone Number" type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <Input placeholder="City" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              <Textarea placeholder="Your Message (optional)" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} />
              <Button type="submit" className="w-full bg-gradient-accent text-accent-foreground font-semibold" size="lg" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit & Chat on WhatsApp"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
