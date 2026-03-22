import { Link } from "react-router";
import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";
import { motion } from "motion/react";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavigationBar />
      
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl"
        >
          {/* 404 Number */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="text-8xl sm:text-9xl font-serif text-terracotta/20 select-none">
              404
            </div>
          </motion.div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-anthracite mb-4">
            Page introuvable
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-muted-foreground font-sans mb-8 leading-relaxed">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
            Retournez à l'accueil ou explorez nos ressources.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-all duration-200 shadow-lg hover:shadow-xl font-sans"
            >
              <Home className="w-5 h-5" />
              Retour à l'accueil
            </Link>
            <Link
              to="/aide"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-anthracite border-2 border-beige rounded-lg hover:border-terracotta/30 transition-all duration-200 font-sans"
            >
              <Search className="w-5 h-5" />
              Centre d'aide
            </Link>
          </div>

          {/* Quick Links */}
          <div className="mt-12 pt-8 border-t border-beige/30">
            <p className="text-sm text-muted-foreground font-sans mb-4">
              Pages populaires :
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { label: "Nos Services", path: "/services" },
                { label: "Experts", path: "/experts" },
                { label: "Cercle M.O.N.A", path: "/cercle" },
                { label: "Tarifs", path: "/tarifs" },
                { label: "Contact", path: "/contact" },
              ].map((link, idx) => (
                <Link
                  key={idx}
                  to={link.path}
                  className="text-sm text-terracotta hover:text-terracotta/80 font-sans transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <FooterSection />
    </div>
  );
}