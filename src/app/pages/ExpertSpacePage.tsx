import { UserCheck, Shield, Calendar, FileText, Settings, BarChart3, Users, Clock, Lock, Mail, AlertCircle, Monitor, ArrowRight, CheckCircle2, Video, MessageSquare } from "lucide-react";
import { useNavigate, Link } from "react-router";
import { useState, useEffect } from "react";
import { useExpertAuth } from "@/app/contexts/ExpertAuthContext";
import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";
import { Alert, AlertDescription } from "@/app/components/ui/alert";

export default function ExpertSpacePage() {
  const navigate = useNavigate();
  const { user, loading } = useExpertAuth();

  // Si déjà connecté, rediriger vers le portail
  useEffect(() => {
    if (!loading && user) {
      navigate("/portal-expert");
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige via-white to-beige/50">
      {/* Header M.O.N.A */}
      <NavigationBar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-terracotta/10 border border-terracotta/20 rounded-full mb-6">
            <Shield className="w-4 h-4 text-terracotta" />
            <span className="text-sm font-medium text-terracotta font-sans">
              Portail Experts M.O.N.A
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-anthracite mb-6">
            Votre espace professionnel
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground font-sans mb-8">
            Une plateforme intuitive pour accompagner vos membres avec excellence et suivre votre activité en temps réel
          </p>

          {!loading && !user && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/expert/login"
                className="w-full sm:w-auto px-8 py-4 bg-terracotta text-white rounded-xl hover:bg-terracotta/90 transition-all shadow-lg hover:shadow-xl font-sans font-medium text-lg inline-flex items-center justify-center gap-2"
              >
                Se connecter
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link
                to="/postuler"
                className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-terracotta text-terracotta rounded-xl hover:bg-terracotta/5 transition-all font-sans font-medium text-lg"
              >
                Devenir expert
              </Link>
            </div>
          )}

          {!loading && user && (
            <Link
              to="/portal-expert"
              className="inline-flex items-center gap-2 px-8 py-4 bg-terracotta text-white rounded-xl hover:bg-terracotta/90 transition-all shadow-lg hover:shadow-xl font-sans font-medium text-lg"
            >
              Accéder au portail
              <ArrowRight className="w-5 h-5" />
            </Link>
          )}

          {/* Lien admin */}
          {!loading && !user && (
            <div className="mt-8 pt-8 border-t border-beige/30">
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-terracotta transition-colors font-sans"
              >
                <Shield className="w-4 h-4" />
                Portail Administratif M.O.N.A
              </Link>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {/* Tableau de bord */}
          <div className="bg-white rounded-2xl shadow-sm border border-border p-6 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-terracotta/10 rounded-xl flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-terracotta" />
            </div>
            <h3 className="text-xl font-serif text-anthracite mb-2">
              Tableau de bord
            </h3>
            <p className="text-muted-foreground font-sans text-sm">
              Suivez vos indicateurs clés : consultations, revenus, satisfaction membres
            </p>
          </div>

          {/* Agenda intelligent */}
          <div className="bg-white rounded-2xl shadow-sm border border-border p-6 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-gold" />
            </div>
            <h3 className="text-xl font-serif text-anthracite mb-2">
              Agenda intelligent
            </h3>
            <p className="text-muted-foreground font-sans text-sm">
              Gérez vos disponibilités et consultations avec synchronisation automatique
            </p>
          </div>

          {/* Base membres */}
          <div className="bg-white rounded-2xl shadow-sm border border-border p-6 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-serif text-anthracite mb-2">
              Base membres
            </h3>
            <p className="text-muted-foreground font-sans text-sm">
              Accédez aux dossiers, historiques et notes de vos membres
            </p>
          </div>

          {/* Téléconsultation */}
          <div className="bg-white rounded-2xl shadow-sm border border-border p-6 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Video className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-serif text-anthracite mb-2">
              Téléconsultation
            </h3>
            <p className="text-muted-foreground font-sans text-sm">
              Consultations vidéo sécurisées avec enregistrement et transcription
            </p>
          </div>

          {/* Messagerie interne */}
          <div className="bg-white rounded-2xl shadow-sm border border-border p-6 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-serif text-anthracite mb-2">
              Messagerie interne
            </h3>
            <p className="text-muted-foreground font-sans text-sm">
              Communiquez avec vos membres et l'équipe M.O.N.A en toute sécurité
            </p>
          </div>

          {/* Support technique */}
          <div className="bg-white rounded-2xl shadow-sm border border-border p-6 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
              <Settings className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-serif text-anthracite mb-2">
              Support technique
            </h3>
            <p className="text-muted-foreground font-sans text-sm">
              Système de tickets pour toute question technique ou administrative
            </p>
          </div>
        </div>

        {/* Avantages */}
        <div className="bg-white rounded-2xl shadow-sm border border-border p-8 lg:p-12">
          <h2 className="text-3xl font-serif text-anthracite mb-8 text-center">
            Pourquoi rejoindre M.O.N.A ?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-terracotta flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-anthracite font-sans mb-1">
                  Rémunération attractive
                </h4>
                <p className="text-sm text-muted-foreground font-sans">
                  Tarifs compétitifs avec paiements sécurisés et ponctuels
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-terracotta flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-anthracite font-sans mb-1">
                  Flexibilité totale
                </h4>
                <p className="text-sm text-muted-foreground font-sans">
                  Gérez votre planning selon vos disponibilités
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-terracotta flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-anthracite font-sans mb-1">
                  Matching culturel
                </h4>
                <p className="text-sm text-muted-foreground font-sans">
                  Rencontrez des membres alignés avec vos expertises et valeurs
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-terracotta flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-anthracite font-sans mb-1">
                  Accompagnement continu
                </h4>
                <p className="text-sm text-muted-foreground font-sans">
                  Support technique et administratif dédié
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-terracotta flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-anthracite font-sans mb-1">
                  Outils professionnels
                </h4>
                <p className="text-sm text-muted-foreground font-sans">
                  Plateforme moderne avec téléconsultation intégrée
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-terracotta flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-anthracite font-sans mb-1">
                  Impact social
                </h4>
                <p className="text-sm text-muted-foreground font-sans">
                  Contribuez au bien-être mental en Afrique
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-serif text-anthracite mb-4">
            Prêt à rejoindre notre communauté d'experts ?
          </h3>
          <p className="text-muted-foreground font-sans mb-8 max-w-2xl mx-auto">
            Rejoignez des centaines d'experts qui transforment déjà des vies à travers l'Afrique
          </p>
          <Link
            to="/postuler"
            className="inline-flex items-center gap-2 px-8 py-4 bg-terracotta text-white rounded-xl hover:bg-terracotta/90 transition-all shadow-lg hover:shadow-xl font-sans font-medium text-lg"
          >
            Postuler maintenant
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <FooterSection />
    </div>
  );
}