import { Menu, X, ChevronDown, Play } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useLocation } from "react-router";

export default function NavigationBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // MISE À JOUR : Tous les liens Entreprise pointent vers /entreprise/login (Mars 2026)
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Close menu when changing page
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [useLocation().pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Barre de navigation fixe - Desktop */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <div className="flex flex-col">
                <h1 className="text-2xl text-anthracite font-serif tracking-wide">
                  M.O.N.A
                </h1>
                <p className="text-[9px] text-anthracite/50 font-sans tracking-wider">
                  Mieux-être, Optimisation & Neuro-Apaisement
                </p>
              </div>
            </Link>

            {/* Navigation Desktop - Cachée sur mobile */}
            <div className="hidden lg:flex items-center gap-2 flex-1 justify-center">
              {/* Plateforme M.O.N.A */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDropdown(activeDropdown === 'platform' ? null : 'platform');
                  }}
                  className="px-3 py-2 text-sm text-anthracite font-sans hover:text-anthracite/70 transition-colors duration-200 flex items-center gap-1"
                >
                  Plateforme M.O.N.A
                  <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'platform' ? 'rotate-180' : ''}`} />
                </button>

                {/* Mega Menu - Plateforme */}
                <AnimatePresence>
                  {activeDropdown === 'platform' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-[600px] bg-white rounded-xl shadow-2xl border border-beige/20 p-6"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="grid grid-cols-3 gap-6">
                        {/* Colonne 1 - Aperçu */}
                        <div>
                          <h3 className="text-xs font-sans font-bold text-gold mb-3 uppercase tracking-wide">Aperçu</h3>
                          <div className="space-y-2">
                            <Link to="/" className="block text-sm font-sans text-anthracite hover:text-terracotta py-1">
                              Plateforme complète
                            </Link>
                            <Link to="/about" className="block text-sm font-sans text-anthracite hover:text-terracotta py-1">
                              À propos
                            </Link>
                            <Link to="/services" className="block text-sm font-sans text-anthracite hover:text-terracotta py-1">
                              Fonctionnalités
                            </Link>
                          </div>
                        </div>

                        {/* Colonne 2 - Nos Services */}
                        <div>
                          <h3 className="text-xs font-sans font-bold text-gold mb-3 uppercase tracking-wide">Programmes de Soins</h3>
                          <div className="space-y-2">
                            <Link to="/sante-mentale" className="block text-sm font-sans text-anthracite hover:text-terracotta py-1">
                              Santé Mentale+
                            </Link>
                            <Link to="/soins-primaires" className="block text-sm font-sans text-anthracite hover:text-terracotta py-1">
                              Soins Primaires
                            </Link>
                            <Link to="/cercle" className="block text-sm font-sans text-anthracite hover:text-terracotta py-1">
                              Le Cercle M.O.N.A
                            </Link>
                          </div>
                        </div>

                        {/* Colonne 3 - Africa-Ready */}
                        <div>
                          <h3 className="text-xs font-sans font-bold text-gold mb-3 uppercase tracking-wide">Africa-Ready</h3>
                          <div className="space-y-2">
                            <Link to="/services#offline" className="block text-sm font-sans text-anthracite hover:text-terracotta py-1">
                              Offline-First
                            </Link>
                            <Link to="/mobile-money" className="block text-sm font-sans text-anthracite hover:text-terracotta py-1">
                              Mobile Money
                            </Link>
                            <Link to="/chiffrement-e2e" className="block text-sm font-sans text-anthracite hover:text-terracotta py-1">
                              Chiffrement E2E
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Pourquoi M.O.N.A */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDropdown(activeDropdown === 'why' ? null : 'why');
                  }}
                  className="px-3 py-2 text-sm text-anthracite font-sans hover:text-anthracite/70 transition-colors duration-200 flex items-center gap-1"
                >
                  Pourquoi M.O.N.A
                  <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'why' ? 'rotate-180' : ''}`} />
                </button>

                {/* Mega Menu - Pourquoi */}
                <AnimatePresence>
                  {activeDropdown === 'why' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-[600px] bg-white rounded-xl shadow-2xl border border-beige/20 p-6"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="grid grid-cols-3 gap-6">
                        {/* Colonne 1 - L'expérience */}
                        <div>
                          <h3 className="text-xs font-sans font-bold text-gold mb-3 uppercase tracking-wide">L'expérience M.O.N.A</h3>
                          <div className="space-y-2">
                            <Link to="/membres" className="block text-sm font-sans text-anthracite hover:text-terracotta py-1">
                              Pour les Membres
                            </Link>
                            <Link to="/experts" className="block text-sm font-sans text-anthracite hover:text-terracotta py-1">
                              Pour les Experts
                            </Link>
                            <Link to="/business" className="block text-sm font-sans text-anthracite hover:text-terracotta py-1">
                              Pour les Entreprises
                            </Link>
                          </div>
                        </div>

                        {/* Colonne 2 - Pourquoi nous */}
                        <div>
                          <h3 className="text-xs font-sans font-bold text-gold mb-3 uppercase tracking-wide">Pourquoi M.O.N.A</h3>
                          <div className="space-y-2">
                            <Link to="/vision-africa-first" className="block text-sm font-sans text-anthracite hover:text-terracotta py-1">
                              Vision Africa-First
                            </Link>
                            <Link to="/etudiants" className="block text-sm font-sans text-anthracite hover:text-terracotta py-1">
                              Offres étudiantes
                            </Link>
                            <Link to="/about" className="block text-sm font-sans text-anthracite hover:text-terracotta py-1">
                              Notre histoire
                            </Link>
                          </div>
                        </div>

                        {/* Colonne 3 - Travailler avec nous */}
                        <div>
                          <h3 className="text-xs font-sans font-bold text-gold mb-3 uppercase tracking-wide">Travailler avec nous</h3>
                          <div className="space-y-2">
                            <Link to="/espace-expert" className="block text-sm font-sans text-anthracite hover:text-terracotta py-1">
                              Devenir Expert
                            </Link>
                            <Link to="/carrieres" className="block text-sm font-sans text-anthracite hover:text-terracotta py-1">
                              Carrières
                            </Link>
                            <Link to="/partenariats" className="block text-sm font-sans text-anthracite hover:text-terracotta py-1">
                              Devenir Partenaire
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Ressources */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDropdown(activeDropdown === 'resources' ? null : 'resources');
                  }}
                  className="px-3 py-2 text-sm text-anthracite font-sans hover:text-anthracite/70 transition-colors duration-200 flex items-center gap-1"
                >
                  Ressources
                  <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'resources' ? 'rotate-180' : ''}`} />
                </button>

                {/* Mega Menu - Ressources */}
                <AnimatePresence>
                  {activeDropdown === 'resources' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-[600px] bg-white rounded-xl shadow-2xl border border-beige/20 p-6"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="grid grid-cols-3 gap-6">
                        {/* Colonne 1 - Bibliothèque */}
                        <div>
                          <h3 className="text-xs font-sans font-bold text-gold mb-3 uppercase tracking-wide">Bibliothèque</h3>
                          <div className="space-y-2">
                            <Link to="/bibliotheque" className="block text-sm font-sans text-anthracite hover:text-terracotta py-1">
                              Tous les contenus
                            </Link>
                            <Link to="/bibliotheque?type=articles" className="block text-sm font-sans text-anthracite hover:text-terracotta py-1">
                              Articles
                            </Link>
                            <Link to="/bibliotheque?type=videos" className="block text-sm font-sans text-anthracite hover:text-terracotta py-1">
                              Vidéos
                            </Link>
                            <Link to="/bibliotheque?type=podcasts" className="block text-sm font-sans text-anthracite hover:text-terracotta py-1">
                              Podcasts
                            </Link>
                          </div>
                        </div>

                        {/* Colonne 2 - Blog */}
                        <div>
                          <h3 className="text-xs font-sans font-bold text-gold mb-3 uppercase tracking-wide">Blog</h3>
                          <div className="space-y-2">
                            <Link to="/blog" className="block text-sm font-sans text-anthracite hover:text-terracotta py-1">
                              Tous les articles
                            </Link>
                            <Link to="/blog?category=actualites" className="block text-sm font-sans text-anthracite hover:text-terracotta py-1">
                              Actualités
                            </Link>
                            <Link to="/blog?category=temoignages" className="block text-sm font-sans text-anthracite hover:text-terracotta py-1">
                              Témoignages
                            </Link>
                          </div>
                        </div>

                        {/* Colonne 3 - Centre d'aide */}
                        <div>
                          <h3 className="text-xs font-sans font-bold text-gold mb-3 uppercase tracking-wide">Centre d'aide</h3>
                          <div className="space-y-2">
                            <Link to="/help" className="block text-sm font-sans text-anthracite hover:text-terracotta py-1">
                              Toutes les questions
                            </Link>
                            <Link to="/help?category=compte" className="block text-sm font-sans text-anthracite hover:text-terracotta py-1">
                              Mon compte
                            </Link>
                            <Link to="/help?category=consultations" className="block text-sm font-sans text-anthracite hover:text-terracotta py-1">
                              Consultations
                            </Link>
                            <Link to="/contact" className="block text-sm font-sans text-anthracite hover:text-terracotta py-1">
                              Nous contacter
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Tarification */}
              <Link
                to="/tarifs"
                className="px-4 py-2 text-anthracite font-sans font-medium hover:text-terracotta transition-colors duration-200 relative inline-flex items-center gap-2"
              >
                Tarification
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gold/20 text-gold text-[10px] font-sans font-bold rounded-full uppercase tracking-wide">
                  Étudiants
                </span>
              </Link>

              {/* CTAs Desktop */}
              <div className="hidden lg:flex items-center gap-4">
                {/* Connexion */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDropdown(activeDropdown === 'connexion' ? null : 'connexion');
                    }}
                    className="px-3 py-2 text-sm text-anthracite font-sans hover:text-anthracite/70 transition-colors duration-200 flex items-center gap-1"
                  >
                    Connexion
                    <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'connexion' ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown - Connexion */}
                  <AnimatePresence>
                    {activeDropdown === 'connexion' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-beige/20 p-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="space-y-2">
                          <Link to="/login" className="block text-sm font-sans text-anthracite hover:text-terracotta py-1">
                            Membre
                          </Link>
                          <Link to="/expert/login" className="block text-sm font-sans text-anthracite hover:text-terracotta py-1">
                            Expert
                          </Link>
                          <Link to="/entreprise/login" className="block text-sm font-sans text-anthracite hover:text-terracotta py-1">
                            Entreprise
                          </Link>
                          <Link to="/admin/login" className="block text-sm font-sans text-anthracite hover:text-terracotta py-1">
                            Admin
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link
                  to="/demo"
                  className="px-6 py-2.5 bg-anthracite text-white rounded-full hover:bg-anthracite/90 transition-all duration-200 font-sans text-sm text-[10px]"
                >
                  Demandez une démo
                </Link>
              </div>
            </div>

            {/* Bouton hamburger - Mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-beige/20 transition-colors duration-200"
              aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {mobileMenuOpen ? (
                <X size={28} className="text-anthracite" />
              ) : (
                <Menu size={28} className="text-anthracite" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Menu Hamburger - Mobile */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 bg-white z-[60] overflow-y-auto lg:hidden"
          >
            {/* Header du menu */}
            <div className="sticky top-0 bg-white border-b border-beige/20 px-6 py-5 flex items-center justify-between z-10">
              <h1 className="text-xl text-anthracite font-serif tracking-wide">
                M.O.N.A
              </h1>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-beige/20 rounded-lg transition-colors duration-200"
                aria-label="Fermer le menu"
              >
                <X size={28} className="text-anthracite" />
              </button>
            </div>

            {/* Contenu du menu */}
            <div className="px-6 py-8 pb-24">
              {/* 1. PLATEFORME M.O.N.A */}
              <div className="mb-8">
                <h3 className="text-sm font-sans font-bold text-gold mb-4 tracking-wide uppercase">
                  Plateforme M.O.N.A
                </h3>
                <div className="space-y-3 pl-4">
                  <Link
                    to="/"
                    className="block text-base font-sans text-anthracite hover:text-terracotta transition-colors duration-200 py-1"
                  >
                    Plateforme complète
                  </Link>
                </div>
              </div>

              {/* Séparateur */}
              <div className="border-t border-beige/30 my-6"></div>

              {/* 2. PROGRAMMES DE SOINS */}
              <div className="mb-8">
                <h3 className="text-sm font-sans font-bold text-gold mb-4 tracking-wide uppercase">
                  Programmes de Soins
                </h3>
                <div className="space-y-3 pl-4">
                  <Link
                    to="/sante-mentale"
                    className="block text-base font-sans text-anthracite hover:text-terracotta transition-colors duration-200 py-1"
                  >
                    Santé Mentale+
                  </Link>
                  <Link
                    to="/soins-primaires"
                    className="block text-base font-sans text-anthracite hover:text-terracotta transition-colors duration-200 py-1"
                  >
                    Soins Primaires
                  </Link>
                  <Link
                    to="/cercle"
                    className="block text-base font-sans text-anthracite hover:text-terracotta transition-colors duration-200 py-1"
                  >
                    Le Cercle M.O.N.A
                  </Link>
                </div>
              </div>

              {/* Séparateur */}
              <div className="border-t border-beige/30 my-6"></div>

              {/* 3. POURQUOI M.O.N.A */}
              <div className="mb-8">
                <h3 className="text-sm font-sans font-bold text-gold mb-4 tracking-wide uppercase">
                  Pourquoi M.O.N.A
                </h3>
                <div className="space-y-3 pl-4">
                  <Link
                    to="/membres"
                    className="block text-base font-sans text-anthracite hover:text-terracotta transition-colors duration-200 py-1"
                  >
                    Pour les Membres
                  </Link>
                  <Link
                    to="/experts"
                    className="block text-base font-sans text-anthracite hover:text-terracotta transition-colors duration-200 py-1"
                  >
                    Pour les Experts
                  </Link>
                  <Link
                    to="/business"
                    className="block text-base font-sans text-anthracite hover:text-terracotta transition-colors duration-200 py-1"
                  >
                    Pour les Entreprises
                  </Link>
                </div>
              </div>

              {/* Séparateur */}
              <div className="border-t border-beige/30 my-6"></div>

              {/* 4. RESSOURCES */}
              <div className="mb-8">
                <h3 className="text-sm font-sans font-bold text-gold mb-4 tracking-wide uppercase">
                  Ressources
                </h3>
                <div className="space-y-3 pl-4">
                  <Link
                    to="/ressources"
                    className="block text-base font-sans text-anthracite hover:text-terracotta transition-colors duration-200 py-1"
                  >
                    Bibliothèque
                  </Link>
                  <Link
                    to="/blog"
                    className="block text-base font-sans text-anthracite hover:text-terracotta transition-colors duration-200 py-1"
                  >
                    Blog
                  </Link>
                  <Link
                    to="/aide"
                    className="block text-base font-sans text-anthracite hover:text-terracotta transition-colors duration-200 py-1"
                  >
                    Centre d'aide
                  </Link>
                </div>
              </div>

              {/* Séparateur */}
              <div className="border-t border-beige/30 my-6"></div>

              {/* 5. CONNEXION */}
              <div className="mb-8">
                <h3 className="text-sm font-sans font-bold text-gold mb-4 tracking-wide uppercase">
                  Connexion
                </h3>
                <div className="space-y-3 pl-4">
                  <Link
                    to="/login"
                    className="block text-base font-sans text-anthracite hover:text-terracotta transition-colors duration-200 py-1"
                  >
                    Membre
                  </Link>
                  <Link
                    to="/expert/login"
                    className="block text-base font-sans text-anthracite hover:text-terracotta transition-colors duration-200 py-1"
                  >
                    Expert
                  </Link>
                  <Link
                    to="/entreprise/login"
                    className="block text-base font-sans text-anthracite hover:text-terracotta transition-colors duration-200 py-1"
                  >
                    Entreprise
                  </Link>
                  <Link
                    to="/admin/login"
                    className="block text-base font-sans text-anthracite hover:text-terracotta transition-colors duration-200 py-1"
                  >
                    Admin
                  </Link>
                </div>
              </div>

              {/* Séparateur */}
              <div className="border-t border-beige/30 my-6"></div>

              {/* 6. LIENS RAPIDES */}
              <div className="mb-8">
                <div className="space-y-3">
                  <Link
                    to="/tarifs"
                    className="block text-base font-sans text-anthracite hover:text-terracotta transition-colors duration-200 py-1"
                  >
                    Tarification
                  </Link>
                  <Link
                    to="/espace-expert"
                    className="block text-base font-sans text-anthracite hover:text-terracotta transition-colors duration-200 py-1"
                  >
                    Devenir Expert
                  </Link>
                </div>
              </div>

              {/* CTAs en bas du menu */}
              <div className="space-y-4 pt-6 mt-8 border-t border-beige/30">
                <Link
                  to="/demo"
                  className="w-full px-6 py-4 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-all duration-200 font-sans text-base shadow-lg text-center block"
                >
                  Demandez une démo
                </Link>
                <Link
                  to="/onboarding"
                  className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-gold/10 border-2 border-gold/20 text-anthracite rounded-lg hover:bg-gold/20 transition-all duration-200 font-sans text-base shadow-sm"
                >
                  Commencer maintenant
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}