import { Link } from "react-router-dom";
import { Phone, MapPin, Mail, Facebook, Instagram, Youtube } from "lucide-react";
import logoImg from "@/assets/logo.png";

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/atulya.remedies", icon: Facebook },
  { label: "Instagram", href: "https://www.instagram.com/atulyaremedies", icon: Instagram },
  { label: "YouTube", href: "https://youtube.com/@atulyaremedies", icon: Youtube },
  { label: "Threads", href: "https://www.threads.com/@atulyaremedies", icon: () => <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.59 12c.025 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.18.408-2.285 1.33-3.11.88-.788 2.12-1.272 3.583-1.4.968-.084 1.87-.036 2.721.125-.08-.56-.247-1.03-.504-1.397-.376-.538-.956-.838-1.723-.895-1.502-.048-2.408.378-3.078.679l-.148.07-.894-1.728.174-.084c.776-.37 2.048-.977 3.946-.917 1.258.04 2.272.514 2.932 1.37.55.71.88 1.63.988 2.756.272.137.533.287.782.452 1.097.727 1.908 1.636 2.344 2.63.8 1.816.86 4.8-1.35 6.968-1.804 1.77-4.016 2.545-7.164 2.57ZM14.71 14.5a7.3 7.3 0 0 0-2.24-.106c-1.065.093-1.94.416-2.493.92-.484.44-.706 1.009-.662 1.693.042.75.36 1.295.945 1.674.655.425 1.482.6 2.33.548 1.09-.059 1.943-.462 2.536-1.2.43-.535.734-1.264.88-2.164a4.456 4.456 0 0 0-1.296-1.365Z"/></svg> },
  { label: "Google Business", href: "https://share.google/eyqHfdDda1a7j0bu6", icon: () => <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg> },
];

const Footer = () => (
  <footer className="bg-primary text-primary-foreground">
    <div className="container py-12 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="flex flex-col items-start mb-4">
            <img src={logoImg} alt="Atulya Remedies Pvt Ltd" className="h-14 w-auto mb-1" />
            <div className="w-full max-w-[200px] mt-1 ml-1 pt-1 border-t border-secondary/20">
              <p className="text-secondary text-[10px] font-semibold italic">
                "Medicine is our business, Your health is our mission"
              </p>
            </div>
          </div>
          <p className="text-primary-foreground/70 text-sm leading-relaxed mb-4">
            WHO-GMP & ISO 9001:2015 certified pharmaceutical company providing quality healthcare products across India.
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary/20 hover:text-secondary transition-colors">
                <s.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-heading font-semibold mb-4">Quick Links</h4>
          <nav className="flex flex-col gap-2">
            {[
              { label: "About Us", to: "/about" },
              { label: "Products", to: "/products" },
              { label: "Gallery", to: "/gallery" },
              { label: "Certifications", to: "/certifications" },
              { label: "Contact", to: "/contact" },
            ].map((l) => (
              <Link key={l.to} to={l.to} className="text-sm text-primary-foreground/70 hover:text-secondary transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h4 className="font-heading font-semibold mb-4">Our Products</h4>
          <nav className="flex flex-col gap-2">
            <Link to="/products" className="text-sm text-primary-foreground/70 hover:text-secondary transition-colors">Yazyme Syrup</Link>
            <Link to="/products" className="text-sm text-primary-foreground/70 hover:text-secondary transition-colors">Lycopenya Capsules</Link>
            <Link to="/products" className="text-sm text-primary-foreground/70 hover:text-secondary transition-colors">Lucomya Syrup</Link>
          </nav>
        </div>

        <div>
          <h4 className="font-heading font-semibold mb-4">Contact</h4>
          <div className="flex flex-col gap-3 text-sm text-primary-foreground/70">
            <a href="tel:+917697555159" className="flex items-start gap-2 hover:text-secondary transition-colors">
              <Phone className="w-4 h-4 mt-0.5 shrink-0" />
              +91 76975 55159 
            </a>
            <a href="tel:+918878036772" className="flex items-start gap-2 hover:text-secondary transition-colors">
              <Phone className="w-4 h-4 mt-0.5 shrink-0" />
              +91 88780 36772
            </a>
            <a href="tel:+917697511159" className="flex items-start gap-2 hover:text-secondary transition-colors">
              <Phone className="w-4 h-4 mt-0.5 shrink-0" />
              +91 76975 11159
            </a>
            <a href="mailto:atulyaremedies@gmail.com" className="flex items-start gap-2 hover:text-secondary transition-colors">
              <Mail className="w-4 h-4 mt-0.5 shrink-0" />
              atulyaremedies@gmail.com
            </a>
            <a href="mailto:Info@atulyaremedies.com" className="flex items-start gap-2 hover:text-secondary transition-colors">
              <Mail className="w-4 h-4 mt-0.5 shrink-0" />
              Info@atulyaremedies.com
            </a>
            <a href="https://maps.google.com/?q=Shanti+Puram+Shahganj+Taj+Nagri+19+Sikandra+Bodla+Rd+Sikandra+Agra+282007" target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 hover:text-secondary transition-colors">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
              Shanti Puram, Shahganj Taj Nagri, 19, Sikandra Bodla Rd, near Awas Vikash Colony, Sector 6-C, Sector 6, Avas Vikas Colony, Sikandra, Agra, Uttar Pradesh 282007
            </a>
          </div>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-primary-foreground/10 text-center text-sm text-primary-foreground/50">
        © {new Date().getFullYear()} Atulya Remedies Pvt Ltd. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
