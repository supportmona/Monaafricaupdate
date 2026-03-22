import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";
import { ArrowLeft, Eye, User, Building2, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";

export default function AccesInformationsPage() {
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
            <h1 className="text-4xl lg:text-5xl font-serif text-anthracite mb-6">Qui a accès à mes informations ?</h1>
            <p className="text-lg text-muted-foreground font-sans">La confidentialité est au cœur de notre mission. Vos informations sont strictement limitées aux personnes essentielles à votre accompagnement thérapeutique.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-b from-white to-beige/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-4 mb-6">
              <CheckCircle className="w-8 h-8 text-terracotta" />
              <h2 className="text-3xl font-serif text-anthracite">Qui PEUT voir vos données</h2>
            </div>
            <div className="space-y-6">
              <div className="bg-white border border-beige/30 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <User className="w-6 h-6 text-terracotta flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-serif text-anthracite mb-2">Votre expert dédié uniquement</h3>
                    <p className="text-base text-muted-foreground font-sans leading-relaxed">
                      Seul le thérapeute avec qui vous avez une relation active peut accéder à votre dossier médical (Passeport Santé FHIR), vos notes de séances et vos messages. Aucun autre expert de la plateforme ne peut voir vos informations.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-beige/30 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <Eye className="w-6 h-6 text-terracotta flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-serif text-anthracite mb-2">Vous, bien sûr</h3>
                    <p className="text-base text-muted-foreground font-sans leading-relaxed">
                      Vous avez un accès total à toutes vos données à tout moment depuis votre tableau de bord. Vous pouvez télécharger, modifier ou supprimer vos informations quand vous le souhaitez.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-beige/30 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <Building2 className="w-6 h-6 text-terracotta flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-serif text-anthracite mb-2">Votre employeur (cas B2B uniquement)</h3>
                    <p className="text-base text-muted-foreground font-sans leading-relaxed mb-3">
                      Si vous accédez à M.O.N.A via votre entreprise, votre employeur ne voit JAMAIS vos données personnelles ou médicales. Il reçoit uniquement des rapports anonymisés et agrégés pour mesurer l'impact global du programme :
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-terracotta mt-1">•</span>
                        <span className="text-sm text-anthracite font-sans">Taux d'utilisation global (ex: 45% des employés ont utilisé le service)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-terracotta mt-1">•</span>
                        <span className="text-sm text-anthracite font-sans">Indicateurs de bien-être agrégés (sans identité)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-terracotta mt-1">•</span>
                        <span className="text-sm text-anthracite font-sans">ROI du programme (réduction absentéisme, turnover)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-4 mb-6">
              <XCircle className="w-8 h-8 text-red-500" />
              <h2 className="text-3xl font-serif text-anthracite">Qui NE PEUT PAS voir vos données</h2>
            </div>
            <div className="bg-gradient-to-br from-red-50/50 via-beige/10 to-white border border-red-100 rounded-2xl p-8">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-base text-anthracite font-sans"><strong>Les autres membres M.O.N.A</strong> : vos informations ne sont jamais partagées avec d'autres utilisateurs</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-base text-anthracite font-sans"><strong>Les autres experts M.O.N.A</strong> : seul votre thérapeute actif a accès</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-base text-anthracite font-sans"><strong>Les équipes administratives M.O.N.A</strong> : nous ne consultons jamais le contenu de vos séances ou messages</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-base text-anthracite font-sans"><strong>Les partenaires commerciaux</strong> : nous ne vendons ni ne partageons jamais vos données avec des tiers</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-base text-anthracite font-sans"><strong>Les autorités</strong> : sauf obligation légale stricte (mandat judiciaire), nous ne communiquons rien</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="bg-gradient-to-br from-anthracite/5 via-beige/10 to-gold/5 border border-beige/30 rounded-2xl p-8">
              <h3 className="text-2xl font-serif text-anthracite mb-4">Et le chiffrement dans tout ça ?</h3>
              <p className="text-base text-muted-foreground font-sans leading-relaxed mb-4">
                Grâce au chiffrement de bout en bout (E2E), même nous ne pouvons pas lire le contenu de vos conversations vidéo ou messages. Les données sont chiffrées sur votre appareil et ne peuvent être déchiffrées que par votre thérapeute.
              </p>
              <Link to="/help/chiffrement-e2e" className="inline-flex items-center gap-2 text-terracotta hover:text-terracotta/80 transition-colors font-sans font-semibold">
                En savoir plus sur le chiffrement E2E
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-white to-beige/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-serif text-anthracite mb-6">Articles associés</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link to="/help/donnees-securisees" className="p-6 bg-white hover:bg-beige/5 border border-beige/30 rounded-xl transition-all duration-200 group">
              <h3 className="text-lg font-serif text-anthracite group-hover:text-terracotta transition-colors mb-2">Mes données sont-elles sécurisées ?</h3>
              <p className="text-sm text-muted-foreground font-sans">Découvrez nos mesures de sécurité.</p>
            </Link>
            <Link to="/help/chiffrement-e2e" className="p-6 bg-white hover:bg-beige/5 border border-beige/30 rounded-xl transition-all duration-200 group">
              <h3 className="text-lg font-serif text-anthracite group-hover:text-terracotta transition-colors mb-2">Comment fonctionne le chiffrement E2E ?</h3>
              <p className="text-sm text-muted-foreground font-sans">Comprenez la technologie qui vous protège.</p>
            </Link>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
