import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";
import { Mail, Phone, MapPin, MessageCircle, Send, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Question générale",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/contact/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            subject: formData.subject,
            message: formData.message,
            category: formData.subject,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitSuccess(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "Question générale",
          message: "",
        });
        // Réinitialiser le succès après 5 secondes
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        setSubmitError(data.error || "Erreur lors de l'envoi du message");
      }
    } catch (error) {
      console.error("Erreur envoi formulaire:", error);
      setSubmitError("Erreur de connexion. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const offices = [
    {
      city: "Kinshasa",
      country: "RD Congo",
      address: "Avenue de la Liberté, Gombe",
      phone: "+243 81 234 5678",
      email: "contact@monafrica.net",
    },
    {
      city: "Dakar",
      country: "Sénégal",
      address: "Plateau, Avenue Léopold Sédar Senghor",
      phone: "+221 77 XXX XXXX",
      email: "contact@monafrica.net",
    },
    {
      city: "Abidjan",
      country: "Côte d'Ivoire",
      address: "Plateau, Boulevard Carde",
      phone: "+225 07 XXX XXXX",
      email: "contact@monafrica.net",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      
      {/* Hero - Compact */}
      <section className="pt-24 sm:pt-28 pb-8 sm:pb-12 bg-gradient-to-b from-background to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <div className="mb-8">
              <p className="text-[11px] sm:text-xs tracking-[0.2em] uppercase text-foreground font-sans font-medium mb-3">
                NOUS CONTACTER
              </p>
              <div className="w-24 h-[2px] bg-foreground mx-auto" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif text-foreground mb-6 leading-tight">
              Nous sommes{" "}
              <span className="italic">à votre écoute</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-foreground/70 font-sans max-w-3xl mx-auto px-4 leading-relaxed">
              Notre équipe est disponible pour répondre à toutes vos questions.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info & Form - Compact */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {/* Contact Form */}
            <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl border border-beige/30">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif text-anthracite mb-4 sm:mb-6">Envoyez-nous un message</h2>
              <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-xs sm:text-sm font-sans mb-1.5 sm:mb-2 text-foreground">Nom complet</label>
                  <input
                    type="text"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-beige/30 rounded-lg focus:outline-none focus:border-terracotta font-sans text-sm sm:text-base"
                    placeholder="Votre nom"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-sans mb-1.5 sm:mb-2 text-foreground">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-beige/30 rounded-lg focus:outline-none focus:border-terracotta font-sans text-sm sm:text-base"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-sans mb-1.5 sm:mb-2 text-foreground">Téléphone</label>
                  <input
                    type="tel"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-beige/30 rounded-lg focus:outline-none focus:border-terracotta font-sans text-sm sm:text-base"
                    placeholder="Votre numéro de téléphone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-sans mb-1.5 sm:mb-2 text-foreground">Sujet</label>
                  <select
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-beige/30 rounded-lg focus:outline-none focus:border-terracotta font-sans text-sm sm:text-base"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  >
                    <option>Question générale</option>
                    <option>Partenariat</option>
                    <option>Solution B2B</option>
                    <option>Support technique</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-sans mb-1.5 sm:mb-2 text-foreground">Message</label>
                  <textarea
                    rows={5}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-beige/30 rounded-lg focus:outline-none focus:border-terracotta font-sans text-sm sm:text-base"
                    placeholder="Votre message..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>
                {isSubmitting ? (
                  <button 
                    type="submit"
                    disabled
                    className="w-full px-6 py-3 bg-terracotta/70 text-white rounded-lg font-sans flex items-center justify-center gap-2 cursor-not-allowed"
                  >
                    <Send className="w-5 h-5 animate-pulse" />
                    Envoi en cours...
                  </button>
                ) : (
                  <button 
                    type="submit"
                    className="w-full px-6 py-3 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 font-sans flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Envoyer
                  </button>
                )}
                {submitSuccess && (
                  <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 font-sans text-sm">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <span>Message envoyé avec succès ! Nous vous répondrons dans les 48 heures.</span>
                  </div>
                )}
                {submitError && (
                  <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 font-sans text-sm">
                    <MessageCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}
              </form>
            </div>

            {/* Quick Contact */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-beige/30">
                <MessageCircle className="w-12 h-12 text-terracotta mb-4" />
                <h3 className="text-xl font-serif text-anthracite mb-2">Support Disponible</h3>
                <p className="text-muted-foreground font-sans mb-4">
                  Besoin d'aide ? Notre équipe est là pour vous accompagner.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-beige/30">
                <Phone className="w-12 h-12 text-terracotta mb-4" />
                <h3 className="text-xl font-serif text-anthracite mb-2">Ligne d'urgence</h3>
                <p className="text-muted-foreground font-sans mb-4">
                  En cas de crise, contactez notre ligne d'écoute prioritaire.
                </p>
                <a
                  href="tel:+243"
                  className="text-lg text-terracotta hover:underline font-sans"
                >
                  +243 XX XXX XXXX
                </a>
              </div>
            </div>
          </div>

          {/* Offices */}
          <div>
            <h2 className="text-3xl font-serif text-anthracite mb-8 text-center">Nos Bureaux</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {offices.map((office, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-2xl border border-beige/30 text-center"
                >
                  <MapPin className="w-10 h-10 text-terracotta mx-auto mb-4" />
                  <h3 className="text-xl font-serif text-anthracite mb-1">{office.city}</h3>
                  <p className="text-sm text-gold mb-4 font-sans">{office.country}</p>
                  <p className="text-sm text-muted-foreground mb-3 font-sans">{office.address}</p>
                  <p className="text-sm text-foreground mb-1 font-sans">{office.phone}</p>
                  <p className="text-sm text-foreground font-sans">{office.email}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}