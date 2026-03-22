import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";
import { ArrowLeft, Shield, Lock, Server, CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";

export default function DonneesSecuriseesPage() {
  const securityFeatures = [
    { icon: Lock, title: "Chiffrement de bout en bout (E2E)", desc: "Toutes vos conversations vidéo et messages sont chiffrés. Personne, même M.O.N.A, ne peut y accéder." },
    { icon: Server, title: "Serveurs sécurisés certifiés", desc: "Hébergement en Europe (RGPD) avec certification ISO 27001 et SOC 2 Type II." },
    { icon: Shield, title: "Authentification renforcée", desc: "Connexion sécurisée avec option 2FA (double authentification) pour protéger votre compte." }
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      
      <section className="pt-32 pb-8 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/help" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-terracotta transition-colors font-sans">
            <ArrowLeft className="w-4 h-4" />Retour au Centre d'Aide</Link>
        </div>
      </section>

      <section className="pb-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-block px-4 py-2 bg-anthracite/10 border border-anthracite/20 rounded-full mb-6">
              <span className="text-sm text-anthracite font-sans font-medium">Confidentialité & Sécurité</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-serif text-anthracite mb-6">Mes données sont-elles sécurisées ?</h1>
            <p className="text-lg text-muted-foreground font-sans">Oui, absolument. La sécurité de vos données est notre priorité numéro un. Nous utilisons les technologies de protection les plus avancées du secteur médical.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-b from-white to-beige/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif text-anthracite mb-8">Nos garanties de sécurité</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {securityFeatures.map((feature, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="bg-white border border-beige/30 rounded-xl p-6">
                <div className="w-12 h-12 bg-anthracite/10 rounded-full flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-anthracite" />
                </div>
                <h3 className="text-lg font-serif text-anthracite mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground font-sans">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-anthracite/5 via-beige/10 to-gold/5 border border-beige/30 rounded-2xl p-8">
            <h3 className="text-2xl font-serif text-anthracite mb-4">Conformité réglementaire</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                <span className="text-base text-anthracite font-sans"><strong>RGPD :</strong> Conformité totale au Règlement Général sur la Protection des Données européen</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                <span className="text-base text-anthracite font-sans"><strong>FHIR :</strong> Vos données de santé suivent le standard international HL7 FHIR pour l'interopérabilité</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                <span className="text-base text-anthracite font-sans"><strong>ISO 27001 :</strong> Certification internationale de sécurité des systèmes d'information</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                <span className="text-base text-anthracite font-sans"><strong>SOC 2 Type II :</strong> Audit indépendant de nos contrôles de sécurité</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-serif text-anthracite mb-6">Vos droits sur vos données</h2>
            <div className="bg-white border border-beige/30 rounded-2xl p-8">
              <p className="text-base text-muted-foreground font-sans leading-relaxed mb-6">Vous gardez le contrôle total sur vos informations :</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-terracotta mt-1">•</span>
                  <span className="text-base text-anthracite font-sans"><strong>Droit d'accès :</strong> Téléchargez toutes vos données à tout moment depuis votre tableau de bord</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-terracotta mt-1">•</span>
                  <span className="text-base text-anthracite font-sans"><strong>Droit de rectification :</strong> Modifiez vos informations personnelles quand vous le souhaitez</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-terracotta mt-1">•</span>
                  <span className="text-base text-anthracite font-sans"><strong>Droit à l'oubli :</strong> Supprimez définitivement votre compte et toutes vos données associées</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-terracotta mt-1">•</span>
                  <span className="text-base text-anthracite font-sans"><strong>Droit à la portabilité :</strong> Exportez votre Passeport Santé (FHIR) vers une autre plateforme</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 text-center">
              <Link to="/help/acces-informations" className="inline-flex items-center gap-2 px-8 py-4 bg-anthracite text-white rounded-full hover:bg-anthracite/90 transition-all duration-200 font-sans font-semibold shadow-lg hover:shadow-xl group">
                Qui a accès à mes informations ?
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-white to-beige/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-serif text-anthracite mb-6">Articles associés</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link to="/help/acces-informations" className="p-6 bg-white hover:bg-beige/5 border border-beige/30 rounded-xl transition-all duration-200 group">
              <h3 className="text-lg font-serif text-anthracite group-hover:text-terracotta transition-colors mb-2">Qui a accès à mes informations ?</h3>
              <p className="text-sm text-muted-foreground font-sans">Découvrez qui peut voir vos données personnelles.</p>
            </Link>
            <Link to="/help/chiffrement-e2e" className="p-6 bg-white hover:bg-beige/5 border border-beige/30 rounded-xl transition-all duration-200 group">
              <h3 className="text-lg font-serif text-anthracite group-hover:text-terracotta transition-colors mb-2">Comment fonctionne le chiffrement E2E ?</h3>
              <p className="text-sm text-muted-foreground font-sans">Comprendre la technologie qui protège vos échanges.</p>
            </Link>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}