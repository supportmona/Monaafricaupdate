import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Calendar, Clock, Video, MapPin, ArrowLeft, Sparkles, Check } from "lucide-react";
import { Link } from "react-router";
import { useMemberAuth } from "@/app/contexts/MemberAuthContext";
import MemberHeader from "@/app/components/MemberHeader";

export default function MemberBookingPage() {
  const { user } = useMemberAuth();
  const [selectedType, setSelectedType] = useState<"mental" | "primary">("mental");
  const [showCalEmbed, setShowCalEmbed] = useState(false);

  useEffect(() => {
    // Charger le script Cal.com
    const script = document.createElement("script");
    script.src = "https://app.cal.com/embed/embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const consultationTypes = [
    {
      id: "mental",
      title: "Santé Mentale",
      description: "Psychologue, psychothérapeute ou psychiatre",
      icon: "🧠",
      features: [
        "Consultation vidéo sécurisée",
        "Smart Matching culturel",
        "Durée : 45-60 minutes",
        "Chiffrement E2E"
      ],
      calUrl: "https://cal.com/eunice.monadvisor"
    },
    {
      id: "primary",
      title: "Soins Primaires",
      description: "Médecin généraliste",
      icon: "⚕️",
      features: [
        "Téléconsultation médicale",
        "Ordonnance électronique",
        "Durée : 30 minutes",
        "Passeport Santé FHIR"
      ],
      calUrl: "https://cal.com/eunice.monadvisor"
    }
  ];

  const selectedConsultation = consultationTypes.find(t => t.id === selectedType);

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      <MemberHeader title="Réserver une consultation" showBack />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#A68B6F] to-[#D4C5B9] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>

          <div className="relative">
            <Sparkles className="w-10 h-10 mb-4" />
            <h1 className="text-3xl font-serif mb-3">
              Prenez rendez-vous avec un expert
            </h1>
            <p className="text-white/90 text-sm">
              Choisissez le type de consultation et réservez un créneau qui vous convient.
            </p>
          </div>
        </motion.div>

        {/* Type de consultation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 border border-[#D4C5B9]"
        >
          <h2 className="text-xl font-serif text-[#1A1A1A] mb-4">
            Type de consultation
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {consultationTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id as "mental" | "primary")}
                className={`relative p-6 rounded-2xl border-2 transition-all text-left ${
                  selectedType === type.id
                    ? "border-[#A68B6F] bg-[#F5F1ED]"
                    : "border-[#D4C5B9] bg-white hover:border-[#A68B6F]/50"
                }`}
              >
                {selectedType === type.id && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-[#A68B6F] rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}

                <div className="text-3xl mb-3">{type.icon}</div>
                <h3 className="text-lg font-serif text-[#1A1A1A] mb-2">
                  {type.title}
                </h3>
                <p className="text-sm text-[#1A1A1A]/60 mb-4">
                  {type.description}
                </p>

                <div className="space-y-2">
                  {type.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-[#A68B6F] rounded-full"></div>
                      <span className="text-xs text-[#1A1A1A]/70">{feature}</span>
                    </div>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Cal.com Embed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 border border-[#D4C5B9]"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-serif text-[#1A1A1A] mb-1">
                Choisissez votre créneau
              </h2>
              <p className="text-sm text-[#1A1A1A]/60">
                {selectedConsultation?.title}
              </p>
            </div>
            <Calendar className="w-6 h-6 text-[#A68B6F]" />
          </div>

          {/* Cal.com iframe - Remplacez l'URL par votre lien Cal.com réel */}
          <div className="rounded-2xl overflow-hidden border border-[#D4C5B9] min-h-[600px]">
            <iframe
              src={selectedConsultation?.calUrl}
              style={{ width: "100%", height: "700px", border: "none" }}
              title="Réserver une consultation"
            />
          </div>

          {/* Info supplémentaire */}
          <div className="mt-6 p-4 bg-[#F5F1ED] rounded-2xl">
            <p className="text-sm text-[#1A1A1A]/70 mb-3">
              <strong className="text-[#1A1A1A]">Bon à savoir :</strong>
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#A68B6F] flex-shrink-0 mt-0.5" />
                <span className="text-xs text-[#1A1A1A]/70">
                  Vous recevrez une confirmation par email avec le lien de la consultation
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#A68B6F] flex-shrink-0 mt-0.5" />
                <span className="text-xs text-[#1A1A1A]/70">
                  Vous pouvez annuler ou reprogrammer jusqu'à 24h avant
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#A68B6F] flex-shrink-0 mt-0.5" />
                <span className="text-xs text-[#1A1A1A]/70">
                  La consultation se fait via notre plateforme vidéo sécurisée (Daily.co)
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA - Alternative directe */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-3xl p-6 text-white"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-serif mb-2">
                Besoin d'aide pour réserver ?
              </h3>
              <p className="text-white/70 text-sm mb-4">
                Notre équipe est là pour vous accompagner dans la réservation de votre première consultation.
              </p>
              <a
                href="mailto:support@monafrica.net"
                className="inline-flex items-center gap-2 bg-white text-[#1A1A1A] rounded-full px-6 py-3 text-sm font-medium hover:bg-white/90 transition-colors"
              >
                Contacter le support
              </a>
            </div>
            <div className="hidden sm:block">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                <Video className="w-8 h-8" />
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Espacement pour la navigation bottom */}
      <div className="h-20"></div>
    </div>
  );
}