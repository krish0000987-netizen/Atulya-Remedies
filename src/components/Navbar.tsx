import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoImg from "@/assets/logo.png";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Products", to: "/products" },
  { label: "Gallery", to: "/gallery" },
  { label: "Certifications", to: "/certifications" },
  { label: "Contact", to: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex flex-col items-start group">
          <img
            src={logoImg}
            alt="Atulya Remedies Pvt Ltd"
            className="h-10 md:h-14 w-auto object-contain transition-transform group-hover:scale-[1.02]"
          />
          <div className="w-full max-w-[120px] md:max-w-[170px] mt-0.5 ml-1">
            <div className="h-px bg-secondary/30 w-full mb-1" />
            <span className="hidden sm:block text-[7px] md:text-[9px] text-muted-foreground font-semibold italic leading-none tracking-tight">
              "Medicine is our business, Your health is our mission"
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                location.pathname === l.to
                  ? "text-secondary bg-secondary/10"
                  : "text-foreground/70 hover:text-secondary hover:bg-secondary/5"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a href="tel:+917697555159" className="flex items-center gap-1.5 text-sm font-medium text-foreground/70 hover:text-secondary transition-colors">
            <Phone className="w-4 h-4" />
            +91 76975 55159
          </a>
          <Link to="/contact">
            <Button className="bg-gradient-accent text-accent-foreground font-semibold px-5">
              Contact Us
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden p-2 text-foreground" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-card border-b border-border animate-fade-in">
          <nav className="container py-4 flex flex-col gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === l.to
                    ? "text-secondary bg-secondary/10"
                    : "text-foreground/70 hover:text-secondary"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link to="/contact" onClick={() => setOpen(false)}>
              <Button className="w-full mt-2 bg-gradient-accent text-accent-foreground font-semibold">
                Contact Us
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
