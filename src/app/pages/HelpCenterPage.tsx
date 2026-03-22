import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";
import { Search, BookOpen, CreditCard, Video, Shield, Smartphone, ArrowRight, HelpCircle } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { useState } from "react";

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      icon: BookOpen,
      title: "Démarrer avec M.O.N.A",
      description: "Tout ce dont vous avez besoin pour bien commencer",
      color: "terracotta",
      articles: [
        {
          title: "Comment créer mon compte ?",
          link: "/help/creer-compte",
          keywords: "inscription créer compte nouveau utilisateur"
        },
        {
          title: "Comment réserver ma première consultation ?",
          link: "/help/premiere-consultation",
          keywords: "réservation première séance rendez-vous consultation"
        },
        {
          title: "Comment fonctionne le Smart Matching ?",
          link: "/help/smart-matching",
          keywords: "matching algorithme expert thérapeute recommandation"
        }
      ]
    },
    {
      icon: CreditCard,
      title: "Paiements & Abonnements",
      description: "Gérez vos paiements et abonnements en toute simplicité",
      color: "gold",
      articles: [
        {
          title: "Quels moyens de paiement acceptez-vous ?",
          link: "/help/moyens-paiement",
          keywords: "paiement carte mobile money virement bancaire"
        },
        {
          title: "Comment payer par Mobile Money ?",
          link: "/help/mobile-money",
          keywords: "mobile money orange mtn moov airtel paiement"
        },
        {
          title: "Puis-je annuler mon abonnement ?",
          link: "/help/annuler-abonnement",
          keywords: "annulation résiliation abonnement remboursement"
        }
      ]
    },
    {
      icon: Video,
      title: "Consultations",
      description: "Informations sur vos séances avec nos experts",
      color: "terracotta",
      articles: [
        {
          title: "Comment se déroule une séance en ligne ?",
          link: "/help/seance-en-ligne",
          keywords: "séance visio vidéo consultation en ligne déroulement"
        },
        {
          title: "Puis-je changer de thérapeute ?",
          link: "/help/changer-therapeute",
          keywords: "changer thérapeute expert psychologue remplacer"
        },
        {
          title: "Que faire en cas d'urgence ?",
          link: "/help/urgence",
          keywords: "urgence crise aide immédiate numéro"
        }
      ]
    },
    {
      icon: Shield,
      title: "Confidentialité & Sécurité",
      description: "Votre sécurité et votre vie privée sont nos priorités",
      color: "anthracite",
      articles: [
        {
          title: "Mes données sont-elles sécurisées ?",
          link: "/help/donnees-securisees",
          keywords: "sécurité données protection chiffrement rgpd"
        },
        {
          title: "Qui a accès à mes informations ?",
          link: "/help/acces-informations",
          keywords: "accès données confidentialité vie privée"
        },
        {
          title: "Comment fonctionne le chiffrement E2E ?",
          link: "/help/chiffrement-e2e",
          keywords: "chiffrement e2e encryption sécurité bout en bout"
        }
      ]
    },
    {
      icon: Smartphone,
      title: "Application Mobile",
      description: "Utilisez M.O.N.A partout, même sans connexion",
      color: "beige",
      articles: [
        {
          title: "L'app fonctionne-t-elle hors ligne ?",
          link: "/help/fonctionnement-offline",
          keywords: "offline hors ligne sans connexion application mobile"
        },
        {
          title: "Comment télécharger l'application ?",
          link: "/help/telecharger-app",
          keywords: "télécharger installer app application mobile ios android"
        },
        {
          title: "Quelles fonctionnalités offline ?",
          link: "/help/fonctionnalites-offline",
          keywords: "fonctionnalités offline hors ligne sans connexion"
        }
      ]
    }
  ];

  // Filter categories based on search query
  const filteredCategories = categories.map(category => {
    if (!searchQuery.trim()) {
      return category;
    }

    const query = searchQuery.toLowerCase();
    const matchingArticles = category.articles.filter(article => {
      const titleMatch = article.title.toLowerCase().includes(query);
      const keywordsMatch = article.keywords.toLowerCase().includes(query);
      const categoryMatch = category.title.toLowerCase().includes(query);
      return titleMatch || keywordsMatch || categoryMatch;
    });

    return {
      ...category,
      articles: matchingArticles
    };
  }).filter(category => category.articles.length > 0);

  const hasSearchResults = searchQuery.trim() !== "";
  const noResults = hasSearchResults && filteredCategories.length === 0;

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      terracotta: "text-terracotta bg-terracotta/10",
      gold: "text-gold bg-gold/10",
      anthracite: "text-anthracite bg-anthracite/10",
      beige: "text-beige bg-beige/20"
    };
    return colors[color] || colors.terracotta;
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-white via-beige/5 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-terracotta/10 border border-terracotta/20 rounded-full mb-6">
              <HelpCircle className="w-4 h-4 text-terracotta" />
              <span className="text-sm text-terracotta font-sans font-medium">Centre d'Aide</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-serif text-anthracite mb-6">
              Comment pouvons-nous <span className="italic text-terracotta">vous aider</span> ?
            </h1>
            <p className="text-xl text-muted-foreground font-sans max-w-2xl mx-auto mb-8">
              Trouvez rapidement des réponses à vos questions.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher dans le centre d'aide..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 border border-beige/30 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta transition-all font-sans"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {hasSearchResults && (
            <div className="mb-8">
              <p className="text-lg text-anthracite font-sans">
                {noResults ? (
                  <>Aucun résultat pour <span className="font-semibold text-terracotta">"{searchQuery}"</span></>
                ) : (
                  <>Résultats pour <span className="font-semibold text-terracotta">"{searchQuery}"</span> ({filteredCategories.reduce((acc, cat) => acc + cat.articles.length, 0)} article{filteredCategories.reduce((acc, cat) => acc + cat.articles.length, 0) > 1 ? 's' : ''})</>
                )}
              </p>
            </div>
          )}

          {noResults ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 bg-beige/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-beige" />
              </div>
              <h3 className="text-2xl font-serif text-anthracite mb-4">
                Aucun article trouvé
              </h3>
              <p className="text-base text-muted-foreground font-sans mb-8 max-w-md mx-auto">
                Essayez avec d'autres mots-clés ou parcourez toutes les catégories ci-dessous.
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-all duration-200 font-sans font-semibold"
              >
                Effacer la recherche
              </button>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              {filteredCategories.map((category, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="bg-white border border-beige/30 rounded-2xl p-8 hover:shadow-lg transition-all duration-300"
                >
                  {/* Category Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${getColorClass(category.color)}`}>
                      <category.icon className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-serif text-anthracite mb-2">
                        {category.title}
                      </h2>
                      <p className="text-sm text-muted-foreground font-sans">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  {/* Articles List */}
                  <div className="space-y-3">
                    {category.articles.map((article, articleIdx) => (
                      <Link
                        key={articleIdx}
                        to={article.link}
                        className="flex items-center justify-between p-4 bg-beige/5 hover:bg-beige/10 rounded-xl transition-all duration-200 group"
                      >
                        <span className="text-base text-anthracite font-sans group-hover:text-terracotta transition-colors">
                          {article.title}
                        </span>
                        <ArrowRight className="w-5 h-5 text-anthracite/30 group-hover:text-terracotta group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-br from-beige/20 via-beige/10 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-beige/30 rounded-2xl p-12 text-center shadow-lg"
          >
            <h2 className="text-3xl font-serif text-anthracite mb-4">
              Vous ne trouvez pas ce que vous cherchez ?
            </h2>
            <p className="text-lg text-muted-foreground font-sans mb-8">
              Notre équipe est disponible pour répondre à toutes vos questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-all duration-200 font-sans font-semibold shadow-lg hover:shadow-xl"
              >
                Contactez-nous
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/onboarding"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-beige/50 text-anthracite rounded-full hover:bg-beige/10 transition-all duration-200 font-sans font-semibold"
              >
                Réserver une session
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}