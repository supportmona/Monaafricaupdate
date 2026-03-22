import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";
import { ArrowRight, Check, Calendar, Mail, Phone, Building2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export default function DemoPage() {
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    employeeCount: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Demo request:", formData);
    // TODO: Envoyer à l'API
  };

  const benefits = [
    "Présentation personnalisée de la plateforme M.O.N.A",
    "Démonstration du Smart Matching culturel",
    "Découverte du Dashboard RH anonymisé",
    "Analyse de vos besoins spécifiques",
    "Proposition de tarification sur mesure",
    "Q&A avec notre équipe d'experts"
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-background via-beige/5 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-8">
                <p className="text-[11px] sm:text-xs tracking-[0.2em] uppercase text-foreground font-sans font-medium mb-3">
                  DÉMO PERSONNALISÉE
                </p>
                <div className="w-32 h-[2px] bg-foreground" />
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif text-foreground mb-6 leading-tight">
                Voyez M.O.N.A{" "}
                <span className="italic">en action</span>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-foreground/70 font-sans mb-8 leading-relaxed">
                Réservez une démonstration gratuite de 30 minutes avec notre équipe. 
                Nous vous montrons comment M.O.N.A s'adapte à vos besoins spécifiques.
              </p>

              {/* Benefits */}
              <div className="space-y-4">
                <h3 className="text-lg font-serif text-anthracite mb-4">
                  Ce que vous découvrirez :
                </h3>
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                    <span className="text-base text-anthracite font-sans">{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right - Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white rounded-2xl p-8 border border-beige/30 shadow-xl">
                <h2 className="text-2xl font-serif text-anthracite mb-6">
                  Demandez votre démo gratuite
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Company Name */}
                  <div>
                    <label className="block text-sm font-sans font-medium text-anthracite mb-2">
                      Nom de l'entreprise *
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="text"
                        required
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-beige/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta font-sans"
                        placeholder="Votre entreprise"
                      />
                    </div>
                  </div>

                  {/* Contact Name */}
                  <div>
                    <label className="block text-sm font-sans font-medium text-anthracite mb-2">
                      Votre nom complet *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      className="w-full px-4 py-3 border border-beige/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta font-sans"
                      placeholder="Prénom Nom"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-sans font-medium text-anthracite mb-2">
                      Email professionnel *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-beige/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta font-sans"
                        placeholder="vous@entreprise.com"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-sans font-medium text-anthracite mb-2">
                      Téléphone *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-beige/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta font-sans"
                        placeholder="+243 XXX XXX XXX"
                      />
                    </div>
                  </div>

                  {/* Employee Count */}
                  <div>
                    <label className="block text-sm font-sans font-medium text-anthracite mb-2">
                      Nombre d'employés *
                    </label>
                    <select
                      required
                      value={formData.employeeCount}
                      onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
                      className="w-full px-4 py-3 border border-beige/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta font-sans"
                    >
                      <option value="">Sélectionnez une option</option>
                      <option value="1-50">1-50 employés</option>
                      <option value="51-200">51-200 employés</option>
                      <option value="201-500">201-500 employés</option>
                      <option value="500+">500+ employés</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-sans font-medium text-anthracite mb-2">
                      Message (optionnel)
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border border-beige/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta font-sans resize-none"
                      placeholder="Décrivez vos besoins ou posez vos questions..."
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-all duration-200 font-sans font-semibold shadow-lg hover:shadow-xl group"
                  >
                    Demander ma démo
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <p className="text-xs text-muted-foreground font-sans text-center">
                    En soumettant ce formulaire, vous acceptez d'être contacté par notre équipe. 
                    Vos données sont protégées conformément à notre{" "}
                    <a href="/confidentialite" className="text-terracotta hover:underline">
                      politique de confidentialité
                    </a>.
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-serif text-anthracite mb-4">
              Rejoignez les organisations qui investissent dans leur capital humain
            </h2>
            <p className="text-lg text-muted-foreground font-sans mb-8">
              M.O.N.A accompagne des entreprises visionnaires à Kinshasa, Dakar et Abidjan 
              dans leur transformation bien-être.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mt-12">
              {[
                { metric: "Infrastructure", value: "Offline-First pour l'Afrique" },
                { metric: "Sécurité", value: "Chiffrement E2E + FHIR" },
                { metric: "Support", value: "Équipe dédiée 24/7" }
              ].map((item, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-2xl font-serif text-terracotta mb-2">
                    {item.value}
                  </div>
                  <div className="text-sm text-muted-foreground font-sans">
                    {item.metric}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}