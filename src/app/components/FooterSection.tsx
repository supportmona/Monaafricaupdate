import { Mail, MapPin, Linkedin, Twitter, Instagram, Sparkles } from "lucide-react";
import { Link } from "react-router";

export default function FooterSection() {
  const footerLinks = {
    Plateforme: [
      { label: "Aperçu", href: "/" },
      { label: "Nos Services", href: "/services" },
      { label: "Smart Matching", href: "/services#matching" },
      { label: "Passeport Santé", href: "/services#passeport" },
      { label: "Tarification", href: "/tarifs" },
    ],
    Solutions: [
      { label: "Pour les Membres", href: "/membres" },
      { label: "Pour les Experts", href: "/experts" },
      { label: "Pour les Entreprises", href: "/business" },
      { label: "Le Cercle M.O.N.A", href: "/cercle" },
    ],
    Ressources: [
      { label: "Blog", href: "/blog" },
      { label: "Centre d'aide", href: "/aide" },
      { label: "Bibliothèque", href: "/bibliotheque" },
      { label: "Carrières", href: "/carrieres" },
      { label: "Contact", href: "/contact" },
    ],
    Légal: [
      { label: "Mentions légales", href: "/legal" },
      { label: "Confidentialité", href: "/confidentialite" },
      { label: "Conditions d'utilisation", href: "/conditions" },
      { label: "RGPD", href: "/rgpd" },
    ],
  };

  return (
    <footer className="bg-anthracite text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <h3 className="text-2xl font-serif tracking-wide">
                M.O.N.A
              </h3>
              <p className="text-xs text-white/50 font-sans mt-1">
                Mieux-être, Optimisation & Neuro-Apaisement
              </p>
            </div>
            <p className="text-sm text-white/70 font-sans mb-6 leading-relaxed">
              La plateforme premium de santé mentale et de soins primaires pensée pour l'Afrique francophone.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3 mb-6">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-terracotta flex items-center justify-center transition-all duration-200"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-terracotta flex items-center justify-center transition-all duration-200"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-terracotta flex items-center justify-center transition-all duration-200"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>

            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-white/70 font-sans">
                <Mail className="w-4 h-4 text-terracotta flex-shrink-0" />
                <a href="mailto:contact@monafrica.net" className="hover:text-terracotta transition-colors">
                  contact@monafrica.net
                </a>
              </div>
              <div className="flex items-start gap-2 text-sm text-white/70 font-sans">
                <MapPin className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
                <span>Disponible dans plusieurs villes d'Afrique francophone</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-sans font-bold text-white mb-4 uppercase tracking-wide">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-white/70 hover:text-terracotta transition-colors duration-200 font-sans"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <p className="text-sm text-white/50 font-sans text-center md:text-left">
            © 2026 M.O.N.A. Tous droits réservés.
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-white/50 font-sans">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-white/30 rounded-full"></span>
              E2E
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-white/30 rounded-full"></span>
              FHIR
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-white/30 rounded-full"></span>
              GDPR
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-white/30 rounded-full"></span>
              Afrique
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}