import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";
import { motion } from "motion/react";
import { 
  Shield, 
  Lock, 
  Key,
  Eye,
  EyeOff,
  Server,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  FileText,
  Cloud,
  AlertTriangle,
  Fingerprint,
  ShieldCheck,
  Zap,
  Award
} from "lucide-react";
import { Link } from "react-router";

export default function ChiffrementE2EPage() {
  const securityLayers = [
    {
      icon: Key,
      title: "Chiffrement de bout en bout",
      description: "Vos conversations et données de santé sont chiffrées localement sur votre appareil avant transmission. Seul vous et votre thérapeute avez les clés de déchiffrement.",
      technical: "AES-256-GCM + RSA-4096"
    },
    {
      icon: Fingerprint,
      title: "Authentification forte",
      description: "Accès protégé par authentification à deux facteurs (2FA) avec biométrie (empreinte digitale ou reconnaissance faciale) sur mobile.",
      technical: "TOTP + Biométrie native"
    },
    {
      icon: Server,
      title: "Zero-Knowledge Architecture",
      description: "M.O.N.A n'a jamais accès au contenu de vos échanges. Même nos serveurs ne peuvent pas lire vos messages ou notes médicales.",
      technical: "Sealed Box Encryption"
    },
    {
      icon: Cloud,
      title: "Stockage crypté",
      description: "Toutes vos données (notes, ordonnances, passeport santé) sont stockées chiffrées dans notre infrastructure conforme RGPD et certifiée ISO 27001.",
      technical: "PostgreSQL + pgcrypto"
    },
    {
      icon: ShieldCheck,
      title: "Conformité médicale",
      description: "Infrastructure certifiée pour héberger des données de santé (HDS en France, équivalent HIPAA). Audits de sécurité trimestriels.",
      technical: "ISO 27001 + SOC 2 Type II"
    },
    {
      icon: Zap,
      title: "Mode Offline sécurisé",
      description: "Même hors ligne, vos données locales sont protégées par chiffrement SQLite avec clé dérivée de votre mot de passe.",
      technical: "SQLCipher + PBKDF2"
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Génération de vos clés",
      description: "À la création de votre compte, M.O.N.A génère une paire de clés cryptographiques unique (publique/privée) directement sur votre appareil.",
      icon: Key
    },
    {
      step: "2",
      title: "Chiffrement local",
      description: "Lorsque vous envoyez un message ou créez une note, le contenu est chiffré avec la clé publique du destinataire avant de quitter votre appareil.",
      icon: Lock
    },
    {
      step: "3",
      title: "Transmission sécurisée",
      description: "Les données chiffrées transitent via TLS 1.3 sur nos serveurs. Personne, y compris M.O.N.A, ne peut lire le contenu pendant le transit.",
      icon: Shield
    },
    {
      step: "4",
      title: "Déchiffrement chez le destinataire",
      description: "Seul le destinataire (votre thérapeute) peut déchiffrer le message avec sa clé privée. Le déchiffrement se fait localement, jamais sur nos serveurs.",
      icon: Eye
    }
  ];

  const guarantees = [
    "Vos mots de passe ne sont JAMAIS stockés en clair (hachage bcrypt)",
    "Vos clés de chiffrement ne quittent JAMAIS votre appareil",
    "M.O.N.A ne peut PAS lire vos conversations ou données médicales",
    "Suppression définitive garantie sous 30 jours après fermeture de compte",
    "Aucune porte dérobée (backdoor) dans notre code source",
    "Audits de sécurité externes annuels publiés"
  ];

  const certifications = [
    {
      name: "ISO 27001",
      description: "Norme internationale de gestion de la sécurité de l'information",
      icon: Award
    },
    {
      name: "SOC 2 Type II",
      description: "Certification des contrôles de sécurité et de confidentialité",
      icon: CheckCircle2
    },
    {
      name: "RGPD Compliant",
      description: "Conformité totale au Règlement Général sur la Protection des Données",
      icon: Shield
    },
    {
      name: "HDS France",
      description: "Hébergement de Données de Santé certifié en France",
      icon: ShieldCheck
    }
  ];

  const faqs = [
    {
      question: "Qu'est-ce que le chiffrement de bout en bout (E2E) exactement ?",
      answer: "Le chiffrement E2E signifie que vos données sont chiffrées sur votre appareil AVANT d'être envoyées à nos serveurs. Seul vous et votre destinataire (votre thérapeute) avez les clés pour les déchiffrer. Même M.O.N.A ne peut pas lire vos messages, notes médicales ou ordonnances."
    },
    {
      question: "M.O.N.A peut-il voir mes conversations avec mon thérapeute ?",
      answer: "Non, absolument pas. Grâce au chiffrement E2E, vos conversations sont illisibles pour M.O.N.A, nos employés, nos administrateurs système, et même les autorités sans votre consentement explicite. Nous avons une architecture Zero-Knowledge."
    },
    {
      question: "Que se passe-t-il si je perds mon mot de passe ?",
      answer: "Si vous perdez votre mot de passe, vous perdez l'accès à vos clés de déchiffrement. Pour des raisons de sécurité maximale, M.O.N.A ne peut PAS récupérer votre mot de passe ou vos données chiffrées. C'est pourquoi nous recommandons fortement d'activer l'authentification à deux facteurs et de sauvegarder votre phrase de récupération."
    },
    {
      question: "Le chiffrement ralentit-il l'application ?",
      answer: "Non. Grâce aux processeurs modernes et nos optimisations, le chiffrement/déchiffrement se fait en quelques millisecondes de manière totalement transparente. Vous ne remarquerez aucune différence de performance."
    },
    {
      question: "Mes données sont-elles sécurisées même en mode Offline ?",
      answer: "Oui ! En mode Offline, vos données sont stockées localement dans une base SQLite chiffrée avec SQLCipher. La clé de chiffrement est dérivée de votre mot de passe et ne quitte jamais votre appareil."
    },
    {
      question: "Le chiffrement E2E fonctionne-t-il sur les appels vidéo ?",
      answer: "Oui. Nos consultations vidéo utilisent WebRTC avec DTLS-SRTP pour un chiffrement E2E des flux audio et vidéo. Vos consultations ne transitent jamais en clair sur Internet."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <NavigationBar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-anthracite via-anthracite/95 to-anthracite text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <div className="mb-8 inline-block">
              <p className="text-xs sm:text-sm tracking-[0.2em] uppercase text-gold font-sans font-medium mb-3">
                SÉCURITÉ MAXIMALE
              </p>
              <div className="w-32 h-[2px] bg-gold mx-auto" />
            </div>

            {/* Titre géant */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-serif text-white mb-6 leading-[1.1]">
              Chiffrement <span className="italic">de bout en bout</span>
            </h1>

            {/* Sous-titre */}
            <p className="text-lg sm:text-xl lg:text-2xl text-white/80 font-sans mb-10 leading-relaxed max-w-3xl mx-auto">
              Vos conversations et données de santé protégées par un chiffrement militaire. Même M.O.N.A ne peut pas les lire.
            </p>

            {/* Badge de sécurité */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full">
              <ShieldCheck className="w-5 h-5 text-gold" />
              <span className="text-sm font-sans font-medium text-white">
                AES-256 + RSA-4096 + Zero-Knowledge Architecture
              </span>
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/signup"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-anthracite rounded-full hover:bg-white/90 transition-all duration-200 font-sans font-semibold text-base shadow-xl"
              >
                Créer un compte sécurisé
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/help/chiffrement-e2e"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent border-2 border-white text-white rounded-full hover:bg-white hover:text-anthracite transition-all duration-200 font-sans font-semibold text-base"
              >
                Documentation technique
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Couches de sécurité */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-anthracite mb-4">
              Six couches de protection
            </h2>
            <p className="text-lg text-anthracite/60 font-sans max-w-2xl mx-auto">
              Une architecture de sécurité multicouche pour garantir la confidentialité absolue de vos données
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityLayers.map((layer, idx) => {
              const Icon = layer.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white border-2 border-beige/30 rounded-xl p-6 hover:border-terracotta/30 hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-terracotta/10 to-gold/10 rounded-full flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-terracotta" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-anthracite mb-2">
                    {layer.title}
                  </h3>
                  <p className="text-sm text-anthracite/70 font-sans leading-relaxed mb-3">
                    {layer.description}
                  </p>
                  <div className="pt-3 border-t border-beige/30">
                    <code className="text-xs text-terracotta/70 font-mono bg-beige/20 px-2 py-1 rounded">
                      {layer.technical}
                    </code>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-16 bg-beige">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-anthracite mb-4">
              Comment fonctionne le chiffrement E2E
            </h2>
            <p className="text-lg text-anthracite/60 font-sans max-w-2xl mx-auto">
              Comprendre la technologie qui protège vos données
            </p>
          </motion.div>

          <div className="space-y-6">
            {howItWorks.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm"
                >
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-anthracite rounded-full flex items-center justify-center mb-3">
                        <span className="text-white font-serif font-bold text-2xl">
                          {step.step}
                        </span>
                      </div>
                      <div className="w-14 h-14 bg-terracotta/10 rounded-full flex items-center justify-center">
                        <Icon className="w-7 h-7 text-terracotta" />
                      </div>
                    </div>
                    <div className="flex-1 pt-2">
                      <h3 className="text-xl font-serif font-bold text-anthracite mb-3">
                        {step.title}
                      </h3>
                      <p className="text-anthracite/70 font-sans leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Garanties */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-anthracite mb-4">
              Nos garanties de sécurité
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {guarantees.map((guarantee, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-start gap-3 bg-white border border-beige/30 rounded-lg p-4 hover:border-terracotta/30 hover:shadow-md transition-all duration-300"
              >
                <CheckCircle2 className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                <p className="text-sm text-anthracite/80 font-sans leading-relaxed">
                  {guarantee}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 p-6 bg-gradient-to-r from-gold/10 to-terracotta/10 border-2 border-gold/20 rounded-xl"
          >
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-serif font-bold text-anthracite mb-2">
                  Transparence totale
                </h3>
                <p className="text-sm text-anthracite/70 font-sans leading-relaxed">
                  Notre architecture de sécurité est auditée annuellement par des cabinets indépendants (PwC, Deloitte). Les rapports d'audit sont disponibles sur demande à <a href="mailto:security@monafrica.net" className="text-terracotta hover:text-gold transition-colors underline">security@monafrica.net</a>.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-gradient-to-br from-beige via-white to-beige/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-anthracite mb-4">
              Certifications et conformité
            </h2>
            <p className="text-lg text-anthracite/60 font-sans max-w-2xl mx-auto">
              Nos standards de sécurité reconnus internationalement
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, idx) => {
              const CertIcon = cert.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white border-2 border-beige/30 rounded-xl p-6 text-center hover:border-gold/30 hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CertIcon className="w-6 h-6 text-gold" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-anthracite mb-2">
                    {cert.name}
                  </h3>
                  <p className="text-xs text-anthracite/60 font-sans leading-relaxed">
                    {cert.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-anthracite mb-4">
              Questions fréquentes
            </h2>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white border border-beige/30 rounded-xl p-6 hover:border-terracotta/30 hover:shadow-lg transition-all duration-300"
              >
                <h3 className="text-lg font-serif font-bold text-anthracite mb-3">
                  {faq.question}
                </h3>
                <p className="text-anthracite/70 font-sans leading-relaxed">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center p-6 bg-beige/30 rounded-xl border border-beige/50"
          >
            <p className="text-anthracite/70 font-sans mb-4">
              Questions techniques sur notre infrastructure de sécurité ?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/help/chiffrement-e2e"
                className="inline-flex items-center gap-2 text-terracotta hover:text-gold transition-colors font-sans font-medium"
              >
                Documentation complète
                <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-anthracite/40">•</span>
              <a
                href="mailto:security@monafrica.net"
                className="inline-flex items-center gap-2 text-terracotta hover:text-gold transition-colors font-sans font-medium"
              >
                Contacter l'équipe sécurité
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-br from-anthracite via-anthracite to-anthracite/90 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Shield className="w-16 h-16 text-gold mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif mb-6">
              Votre confidentialité est <span className="italic">sacrée</span>
            </h2>
            <p className="text-lg sm:text-xl text-white/80 font-sans mb-8 max-w-2xl mx-auto">
              Rejoignez M.O.N.A et bénéficiez d'une protection de niveau militaire pour vos données de santé mentale
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-anthracite rounded-full hover:bg-white/90 transition-all duration-200 font-sans font-semibold shadow-xl"
              >
                Créer un compte sécurisé
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/confidentialite"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent border-2 border-white text-white rounded-full hover:bg-white hover:text-anthracite transition-all duration-200 font-sans font-semibold"
              >
                Politique de confidentialité
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}