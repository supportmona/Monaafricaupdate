import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";
import { Calendar, Clock, Check, Video, Shield, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";

export default function ReservationPage() {
  useEffect(() => {
    // Charger le script Calendly
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const benefits = [
    {
      icon: Video,
      title: "Consultation en ligne",
      description: "Rejoignez votre séance depuis n'importe où via notre plateforme sécurisée"
    },
    {
      icon: Shield,
      title: "100% Confidentiel",
      description: "Vos échanges sont cryptés de bout en bout et totalement confidentiels"
    },
    {
      icon: Clock,
      title: "Flexible",
      description: "Annulation ou report gratuit jusqu'à 24h avant votre rendez-vous"
    },
    {
      icon: Check,
      title: "Sans engagement",
      description: "Session d'Orientation offerte pour découvrir M.O.N.A sans engagement"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <NavigationBar />

      {/* ═══════════════════════════════════════════════ */}
      {/* SECTION HERO */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="pt-32 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-beige/20 border border-beige/30 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-sm font-sans font-medium text-anthracite uppercase tracking-wide">
                Réservation en ligne
              </span>
            </div>

            {/* Titre principal */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-anthracite mb-6">
              Réservez votre Session d'Orientation
            </h1>

            {/* Sous-titre */}
            <p className="text-lg md:text-xl text-[#6B6B6B] font-sans max-w-3xl mx-auto mb-8">
              Choisissez le créneau qui vous convient et découvrez comment M.O.N.A peut vous accompagner dans votre parcours de bien-être
            </p>

            {/* Badge confiance */}
            <div className="flex flex-wrap justify-center items-center gap-6">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-[#10B981]" />
                <span className="text-sm font-sans text-anthracite font-medium">Session gratuite de 15 min</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-[#10B981]" />
                <span className="text-sm font-sans text-anthracite font-medium">Sans engagement</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-[#10B981]" />
                <span className="text-sm font-sans text-anthracite font-medium">Réponse immédiate</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* SECTION AVANTAGES */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-12 bg-beige">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-6 rounded-xl text-center"
                >
                  <div className="w-12 h-12 bg-anthracite/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-anthracite" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-anthracite mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-[#6B6B6B] font-sans leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* SECTION CALENDLY WIDGET */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
          >
            {/* Widget Calendly M.O.N.A */}
            <div
              className="calendly-inline-widget"
              data-url="https://calendly.com/mona-africacontact?hide_gdpr_banner=1&primary_color=2d2d2d"
              style={{ minWidth: "320px", height: "700px" }}
            />
          </motion.div>

          {/* Support & Contact */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-8 p-6 bg-beige/30 rounded-xl border border-beige/50"
          >
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-anthracite flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-base font-serif font-bold text-anthracite mb-2">
                  Besoin d'aide pour réserver ?
                </h4>
                <p className="text-sm text-[#6B6B6B] font-sans leading-relaxed">
                  Notre équipe est disponible pour vous accompagner. Contactez-nous à{" "}
                  <a href="mailto:contact@monafrica.net" className="text-anthracite font-medium underline hover:text-terracotta transition-colors">
                    contact@monafrica.net
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* SECTION CE QUI SE PASSE ENSUITE */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-16 bg-beige">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-anthracite mb-4">
              Ce qui se passe ensuite
            </h2>
            <p className="text-lg text-[#6B6B6B] font-sans">
              Votre parcours avec M.O.N.A en 4 étapes simples
            </p>
          </motion.div>

          <div className="space-y-8">
            {[
              {
                number: "1",
                title: "Confirmation immédiate",
                description: "Vous recevez un email de confirmation avec le lien de connexion sécurisé à votre séance."
              },
              {
                number: "2",
                title: "Rappel automatique",
                description: "Nous vous envoyons un rappel 24h avant votre rendez-vous avec toutes les informations nécessaires."
              },
              {
                number: "3",
                title: "Session d'Orientation",
                description: "Rencontrez votre conseiller qui comprendra vos besoins et vous présentera notre approche personnalisée."
              },
              {
                number: "4",
                title: "Matching personnalisé",
                description: "Nous vous connectons avec l'expert parfait pour votre situation et vos objectifs de bien-être."
              }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-6"
              >
                <div className="w-12 h-12 bg-anthracite rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-serif font-bold text-xl">
                    {step.number}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-serif font-bold text-anthracite mb-2">
                    {step.title}
                  </h3>
                  <p className="text-[#6B6B6B] font-sans leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* SECTION FAQ RAPIDE */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-anthracite mb-4">
              Questions fréquentes
            </h2>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                question: "La Session d'Orientation est-elle vraiment gratuite ?",
                answer: "Oui, totalement gratuite et sans engagement. C'est notre façon de vous faire découvrir M.O.N.A et de comprendre vos besoins avant tout engagement."
              },
              {
                question: "Que se passe-t-il si je dois annuler ?",
                answer: "Vous pouvez annuler ou reporter votre rendez-vous gratuitement jusqu'à 24h avant l'heure prévue, directement depuis l'email de confirmation."
              },
              {
                question: "Ai-je besoin d'installer un logiciel ?",
                answer: "Non, notre plateforme de visioconférence fonctionne directement dans votre navigateur. Vous recevrez un lien sécurisé pour rejoindre la séance."
              },
              {
                question: "Combien de temps dure la session ?",
                answer: "La Session d'Orientation dure 15 minutes. C'est le temps idéal pour faire connaissance et répondre à toutes vos questions."
              }
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white border border-gray-200 rounded-xl p-6"
              >
                <h3 className="text-lg font-serif font-bold text-anthracite mb-3">
                  {faq.question}
                </h3>
                <p className="text-[#6B6B6B] font-sans leading-relaxed">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}