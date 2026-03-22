import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";
import { ArrowLeft, Check, Mail, Lock, User, Smartphone } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";

export default function CreerComptePage() {
  return (
    <div className="min-h-screen bg-white">
      <NavigationBar />

      <section className="pt-32 pb-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Link
            to="/help"
            className="inline-flex items-center gap-2 text-sm font-sans text-[#6B6B6B] hover:text-anthracite transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au Centre d'Aide
          </Link>

          {/* Titre */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-terracotta/10 rounded-full mb-6">
              <User className="w-4 h-4 text-terracotta" />
              <span className="text-sm font-sans font-medium text-terracotta uppercase tracking-wide">
                Démarrer avec M.O.N.A
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-serif font-bold text-anthracite mb-6">
              Comment créer mon compte ?
            </h1>

            <p className="text-lg text-[#6B6B6B] font-sans leading-relaxed">
              Créer votre compte M.O.N.A ne prend que quelques minutes. Suivez ces étapes simples pour rejoindre notre communauté.
            </p>
          </motion.div>

          {/* Contenu */}
          <div className="space-y-12">
            {/* Étapes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-serif font-bold text-anthracite mb-6">
                Créer votre compte en 4 étapes
              </h2>

              <div className="space-y-6">
                {[
                  {
                    number: "1",
                    title: "Accédez à la page d'inscription",
                    description: "Cliquez sur le bouton 'Commencer' en haut à droite du site ou rendez-vous directement sur la page d'onboarding.",
                    icon: Smartphone
                  },
                  {
                    number: "2",
                    title: "Remplissez vos informations",
                    description: "Entrez votre nom, prénom, adresse email et créez un mot de passe sécurisé (minimum 8 caractères avec lettres et chiffres).",
                    icon: User
                  },
                  {
                    number: "3",
                    title: "Vérifiez votre email",
                    description: "Consultez votre boîte de réception et cliquez sur le lien de confirmation. Pensez à vérifier vos spams si vous ne recevez rien.",
                    icon: Mail
                  },
                  {
                    number: "4",
                    title: "Complétez votre profil",
                    description: "Répondez à quelques questions sur vos besoins et préférences pour activer notre Smart Matching personnalisé.",
                    icon: Check
                  }
                ].map((step, idx) => {
                  const Icon = step.icon;
                  return (
                    <div key={idx} className="flex items-start gap-4 p-6 bg-beige/20 rounded-xl">
                      <div className="w-12 h-12 bg-anthracite rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-serif font-bold text-xl">
                          {step.number}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className="w-5 h-5 text-terracotta" />
                          <h3 className="text-lg font-serif font-bold text-anthracite">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-[#6B6B6B] font-sans leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Informations nécessaires */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white border border-gray-200 rounded-xl p-8"
            >
              <h2 className="text-2xl font-serif font-bold text-anthracite mb-6">
                Informations nécessaires
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { label: "Nom et prénom", required: true },
                  { label: "Adresse email valide", required: true },
                  { label: "Mot de passe sécurisé", required: true },
                  { label: "Numéro de téléphone", required: false },
                  { label: "Date de naissance", required: false },
                  { label: "Pays de résidence", required: true }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-[#10B981] flex-shrink-0" />
                    <div>
                      <span className="text-anthracite font-sans font-medium">
                        {item.label}
                      </span>
                      {item.required && (
                        <span className="ml-2 text-xs text-terracotta font-sans">
                          (requis)
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Conseils de sécurité */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-anthracite/5 border border-anthracite/10 rounded-xl p-8"
            >
              <div className="flex items-start gap-4">
                <Lock className="w-6 h-6 text-anthracite flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-serif font-bold text-anthracite mb-3">
                    Conseils pour un mot de passe sécurisé
                  </h3>
                  <ul className="space-y-2">
                    {[
                      "Minimum 8 caractères",
                      "Combinez majuscules, minuscules, chiffres et caractères spéciaux",
                      "N'utilisez pas d'informations personnelles évidentes",
                      "Évitez les mots de passe courants comme '12345678' ou 'password'",
                      "Ne réutilisez jamais un mot de passe utilisé ailleurs"
                    ].map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-terracotta font-sans">•</span>
                        <span className="text-[#6B6B6B] font-sans leading-relaxed">
                          {tip}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* FAQ rapide */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-serif font-bold text-anthracite mb-6">
                Questions fréquentes
              </h2>

              <div className="space-y-4">
                {[
                  {
                    question: "L'inscription est-elle gratuite ?",
                    answer: "Oui, la création de compte est 100% gratuite. Vous ne payez que lorsque vous réservez une consultation ou souscrivez à un abonnement."
                  },
                  {
                    question: "Combien de temps prend la vérification email ?",
                    answer: "L'email de vérification arrive généralement en moins d'une minute. Si vous ne le recevez pas, vérifiez vos spams ou demandez un nouvel envoi."
                  },
                  {
                    question: "Puis-je créer plusieurs comptes ?",
                    answer: "Chaque personne ne peut avoir qu'un seul compte personnel. Cependant, les comptes entreprise peuvent gérer plusieurs utilisateurs."
                  },
                  {
                    question: "Mes données sont-elles sécurisées ?",
                    answer: "Absolument. Toutes vos données sont chiffrées de bout en bout (E2E) et stockées conformément au RGPD. Nous ne partageons jamais vos informations sans votre consentement."
                  }
                ].map((faq, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-serif font-bold text-anthracite mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-[#6B6B6B] font-sans leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-beige/30 rounded-xl p-8 text-center"
            >
              <h3 className="text-2xl font-serif font-bold text-anthracite mb-4">
                Prêt à commencer ?
              </h3>
              <p className="text-[#6B6B6B] font-sans mb-6">
                Rejoignez des milliers de personnes qui ont déjà choisi M.O.N.A
              </p>
              <Link
                to="/onboarding"
                className="inline-flex items-center justify-center px-8 py-4 bg-anthracite text-white rounded-full hover:bg-anthracite/90 transition-all duration-200 font-sans font-bold"
              >
                Créer mon compte gratuitement
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
