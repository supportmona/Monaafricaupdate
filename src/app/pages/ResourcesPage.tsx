import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";
import { motion } from "motion/react";
import { BookOpen, FileText, Video, Download, TrendingUp, Heart, Lock, Crown } from "lucide-react";
import { Link } from "react-router";

export default function ResourcesPage() {
  const categories = [
    {
      icon: BookOpen,
      name: "Santé mentale",
      count: 12,
    },
    {
      icon: Heart,
      name: "Bien-être",
      count: 8,
      accessType: "coming-soon",
    },
    {
      icon: TrendingUp,
      name: "Pratique",
      count: 10,
    },
  ];

  const resources = [
    {
      category: "Santé mentale",
      items: [
        { name: "Guide du bien-être au travail", isPremium: false },
        { name: "Comprendre l'anxiété", isPremium: false },
        { name: "Techniques de relaxation", isPremium: true },
        { name: "Gérer le stress quotidien", isPremium: true },
      ],
    },
    {
      category: "Bien-être",
      items: [
        { name: "Introduction à la méditation", isPremium: true },
        { name: "Gestion des émotions", isPremium: true },
        { name: "Sommeil et santé mentale", isPremium: true },
        { name: "Équilibre vie pro/perso", isPremium: true },
      ],
    },
    {
      category: "Pratique",
      items: [
        { name: "Journal de gratitude", isPremium: false },
        { name: "Exercices de respiration", isPremium: false },
        { name: "Plan d'action bien-être", isPremium: true },
        { name: "Fiches pratiques", isPremium: true },
      ],
    },
  ];

  const stats = [
    { icon: Heart, value: "500+", label: "Articles" },
    { icon: Video, value: "100+", label: "Vidéos" },
    { icon: Download, value: "50+", label: "Guides PDF" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />

      {/* Hero Section */}
      <section className="pt-24 sm:pt-28 lg:pt-32 pb-8 sm:pb-12 lg:pb-16 bg-gradient-to-b from-beige/30 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-terracotta/10 border border-terracotta/20 rounded-full mb-6">
              <BookOpen className="w-4 h-4 text-terracotta" />
              <span className="text-sm text-terracotta font-sans uppercase tracking-wider">Ressources</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-serif text-anthracite mb-6">
              Ressources pour votre santé mentale
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground font-sans leading-relaxed">
              Découvrez nos guides pratiques, vidéos et documents pour améliorer votre bien-être mental.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-12 max-w-4xl mx-auto"
          >
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="text-center p-4 sm:p-6 bg-white rounded-xl border border-beige/30">
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-terracotta mx-auto mb-3" />
                  <div className="text-xl sm:text-2xl lg:text-3xl font-serif text-anthracite mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-sans">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Freemium Info Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 bg-gradient-to-r from-terracotta/5 to-beige/30 border border-terracotta/20 rounded-2xl p-6 sm:p-8"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 bg-terracotta/10 rounded-lg">
                  <Crown className="w-6 h-6 text-terracotta" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-serif text-anthracite mb-2">
                    Ressources Gratuites & Membres
                  </h3>
                  <p className="text-sm text-muted-foreground font-sans">
                    Profitez de ressources gratuites ou déverrouillez l'accès complet avec Cercle M.O.N.A
                  </p>
                </div>
              </div>
              <Link 
                to="/cercle"
                className="flex-shrink-0 px-6 py-3 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-all duration-200 font-sans text-sm whitespace-nowrap"
              >
                Devenir membre
              </Link>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {categories.map((category, idx) => {
              const Icon = category.icon;
              const hasPremiumContent = resources.find(res => res.category === category.name)?.items.some(item => item.isPremium);
              const freeCount = resources.find(res => res.category === category.name)?.items.filter(item => !item.isPremium).length || 0;
              const premiumCount = resources.find(res => res.category === category.name)?.items.filter(item => item.isPremium).length || 0;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-2xl p-6 sm:p-8 border border-beige/30 hover:border-terracotta/30 transition-all duration-300 hover:shadow-lg relative"
                >
                  {/* Premium Badge - Removed per user request */}
                  
                  <div className="inline-flex p-3 bg-terracotta/10 rounded-lg mb-4">
                    <Icon className="w-6 h-6 text-terracotta" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif text-anthracite mb-3">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground font-sans mb-6">
                    {category.count} ressources disponibles
                  </p>
                  
                  {/* Access Info for Freemium categories */}
                  {hasPremiumContent && (
                    <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground font-sans">
                      <span>{freeCount} gratuits</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        {premiumCount} membres
                      </span>
                    </div>
                  )}
                  
                  <ul className="space-y-3">
                    {resources.find(res => res.category === category.name)?.items.map((item, itemIdx) => (
                      <li
                        key={itemIdx}
                        className="flex items-center gap-3 text-sm text-anthracite font-sans"
                      >
                        <div className="w-1.5 h-1.5 bg-terracotta rounded-full flex-shrink-0" />
                        {item.name}
                        {item.isPremium && (
                          <Lock className="w-4 h-4 text-terracotta ml-2" />
                        )}
                      </li>
                    ))}
                  </ul>
                  {category.accessType === "coming-soon" ? (
                    <button 
                      className="mt-6 w-full px-4 py-3 rounded-lg transition-all duration-200 font-sans text-sm bg-gray-100 text-gray-400 cursor-not-allowed"
                      disabled
                    >
                      Bientôt disponible
                    </button>
                  ) : (
                    <Link
                      to={`/resources/${category.name === "Guides & Articles" ? "guides" : "documents"}`}
                      className="mt-6 w-full px-4 py-3 bg-beige/30 text-anthracite hover:bg-beige/50 rounded-lg transition-all duration-200 font-sans text-sm flex items-center justify-center"
                    >
                      Explorer
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-beige/30 to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <TrendingUp className="w-12 h-12 text-terracotta mx-auto mb-6" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-anthracite mb-4">
              Besoin d'un accompagnement personnalisé ?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground font-sans mb-8">
              Nos experts en santé mentale sont là pour vous accompagner dans votre parcours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/experts"
                className="px-8 py-4 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-all duration-200 shadow-lg font-sans"
              >
                Trouver un expert
              </Link>
              <Link 
                to="/services"
                className="px-8 py-4 bg-white text-anthracite border-2 border-beige rounded-lg hover:border-terracotta/30 transition-all duration-200 font-sans"
              >
                En savoir plus
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}