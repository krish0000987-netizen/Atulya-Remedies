import { Target, Eye, Beaker } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { usePageContent } from "@/hooks/usePageContent";
import aboutImg from "@/assets/about-lab.jpg";

const defaultValues = [
  { title: "Our Mission", desc: "To provide affordable, high-quality pharmaceutical products that improve health outcomes for millions of Indians." },
  { title: "Our Vision", desc: "To become India's most trusted pharmaceutical company, known for quality, innovation, and integrity." },
  { title: "Quality First", desc: "Every product undergoes rigorous quality testing to meet the highest industry standards." },
];

const valueIcons = [Target, Eye, Beaker];

const About = () => {
  const { data: content } = usePageContent("about");
  const intro = (content?.intro as Record<string, any>) || {};
  const values = (content?.values as Record<string, any>) || {};

  const valueItems = Array.isArray(values.items) && values.items.length > 0 ? values.items : defaultValues;

  return (
    <>
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <SectionHeading
            title={intro.title || "About Atulya Remedies"}
            subtitle={intro.subtitle || "A trusted pharmaceutical company dedicated to delivering high-quality healthcare solutions across India."}
          />
          <div className="grid lg:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">
            <div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {intro.paragraph1 || "Atulya Remedies Pvt Ltd is a WHO-GMP and ISO 9001:2015 certified pharmaceutical company based in Agra, Uttar Pradesh. We are dedicated to delivering high-quality pharmaceutical and healthcare products."}
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {intro.paragraph2 || "We focus on maintaining quality, trust, and customer satisfaction through carefully selected products and strong industry standards. Our team of experienced professionals ensures excellence in every product we offer."}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {intro.paragraph3 || "With a presence across 20+ states, we continue to grow as a trusted name in Indian healthcare — committed to quality and healthcare excellence."}
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-elevated">
              <img src={intro.image_url || aboutImg} alt="Atulya Remedies healthcare products" loading="lazy" width={1200} height={800} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {valueItems.map((item: any, i: number) => {
              const Icon = valueIcons[i % valueIcons.length];
              return (
                <div key={item.title} className="bg-card rounded-lg p-8 shadow-card text-center">
                  <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-5">
                    <Icon className="w-7 h-7 text-secondary" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
