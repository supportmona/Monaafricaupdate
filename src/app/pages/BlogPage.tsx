import FooterSection from "@/app/components/FooterSection";
import { Sparkles } from "lucide-react";
import NavigationBar from "@/app/components/NavigationBar";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-beige/10 to-white min-h-[80vh] flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-terracotta/10 border border-terracotta/20 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-terracotta" />
              <span className="text-sm text-terracotta font-sans uppercase tracking-wider">Bientôt</span>
            </div>

            {/* Titre principal */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif text-anthracite mb-8 leading-tight">
              Notre <span className="italic text-terracotta">Blog</span> arrive bientôt
            </h1>

            {/* Sous-titre */}
            <p className="text-lg sm:text-xl text-muted-foreground font-sans mb-12 leading-relaxed">
              Nous préparons du contenu exclusif sur la santé mentale, le bien-être et l'excellence personnelle adapté au contexte africain francophone.
            </p>

            {/* Ligne de séparation style Dialogue */}
            <div className="w-32 h-[2px] bg-anthracite mx-auto mb-8" />

            {/* Message additionnel */}
            <p className="text-sm text-muted-foreground font-sans">
              En attendant, explorez nos ressources premium et découvrez nos experts certifiés.
            </p>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}