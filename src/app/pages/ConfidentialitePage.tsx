import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      <NavigationBar />
      
      {/* Hero Section */}
      <section className="bg-[#1A1A1A] text-white py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="inline-block bg-white text-[#1A1A1A] px-4 py-1 text-xs font-semibold tracking-[0.2em] uppercase mb-6">
            POLITIQUE DE CONFIDENTIALITÉ
          </div>
          <h1 className="text-5xl lg:text-7xl font-light mb-6">
            Vos données, notre <span className="italic">responsabilité</span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl">
            Transparence totale sur la collecte, l'utilisation et la protection de vos données personnelles
          </p>
          <p className="text-sm text-white/50 mt-4">
            Dernière mise à jour : 3 février 2026
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          
          {/* Introduction */}
          <div className="mb-16">
            <div className="bg-white p-8 rounded-lg border border-[#D4C5B9]">
              <p className="text-[#1A1A1A]/80 text-lg leading-relaxed">
                Chez M.O.N.A (Mieux-être, Optimisation & Neuro-Apaisement), la protection de vos données personnelles est une priorité absolue. Cette politique explique en toute transparence comment nous collectons, utilisons, stockons et protégeons vos informations dans le respect des réglementations africaines sur la protection des données (Sénégal, Côte d'Ivoire, Gabon, Cameroun), de la Convention de Malabo de l'Union Africaine, du RGPD européen et de la LPRPDE canadienne.
              </p>
            </div>
          </div>

          {/* Responsable du traitement */}
          <div className="mb-16">
            <div className="h-[1px] bg-[#1A1A1A] mb-8"></div>
            <h2 className="text-3xl lg:text-4xl font-light mb-8">
              Responsable du <span className="italic">traitement</span>
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-[#1A1A1A]/80 mb-4">
                <strong className="text-[#1A1A1A]">M.O.N.A Health Technologies Africa</strong>
              </p>
              <p className="text-[#1A1A1A]/80 mb-4">
                <strong className="text-[#1A1A1A]">Siège principal :</strong><br />
                Avenue de la Justice 45, Gombe<br />
                Kinshasa, République Démocratique du Congo
              </p>
              <p className="text-[#1A1A1A]/80 mb-4">
                <strong className="text-[#1A1A1A]">Bureaux régionaux :</strong><br />
                Dakar, Abidjan, Libreville, Brazzaville, Yaoundé
              </p>
              <p className="text-[#1A1A1A]/80 mb-4">
                <strong className="text-[#1A1A1A]">Délégué à la Protection des Données (DPO) :</strong><br />
                Email : dpo@monafrica.net
              </p>
            </div>
          </div>

          {/* Données collectées */}
          <div className="mb-16">
            <div className="h-[1px] bg-[#1A1A1A] mb-8"></div>
            <h2 className="text-3xl lg:text-4xl font-light mb-8">
              Données <span className="italic">collectées</span>
            </h2>
            <div className="prose prose-lg max-w-none text-[#1A1A1A]/80">
              <h3 className="text-2xl font-light mb-4 text-[#1A1A1A]">Données d'identification</h3>
              <ul className="list-disc pl-6 mb-6">
                <li>Nom, prénom, date de naissance</li>
                <li>Adresse email, numéro de téléphone</li>
                <li>Adresse postale (si applicable)</li>
                <li>Identifiant unique de compte</li>
              </ul>

              <h3 className="text-2xl font-light mb-4 text-[#1A1A1A]">Données de santé</h3>
              <p className="mb-4">
                <strong className="text-[#1A1A1A]">Données sensibles - Protection renforcée</strong>
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>Score Mental M.O.N.A et résultats d'évaluations</li>
                <li>Historique des consultations et notes thérapeutiques</li>
                <li>Objectifs de santé mentale et plan de soins</li>
                <li>Données biométriques (si utilisation du dispositif NFC)</li>
              </ul>

              <h3 className="text-2xl font-light mb-4 text-[#1A1A1A]">Données techniques</h3>
              <ul className="list-disc pl-6 mb-6">
                <li>Adresse IP, type de navigateur, système d'exploitation</li>
                <li>Données de navigation et d'utilisation de la plateforme</li>
                <li>Cookies et identifiants de session</li>
                <li>Logs de connexion et données d'authentification</li>
              </ul>

              <h3 className="text-2xl font-light mb-4 text-[#1A1A1A]">Données de paiement</h3>
              <ul className="list-disc pl-6 mb-6">
                <li>Informations de facturation (via prestataires sécurisés)</li>
                <li>Historique des transactions (anonymisées après 5 ans)</li>
              </ul>
            </div>
          </div>

          {/* Finalités du traitement */}
          <div className="mb-16">
            <div className="h-[1px] bg-[#1A1A1A] mb-8"></div>
            <h2 className="text-3xl lg:text-4xl font-light mb-8">
              Finalités du <span className="italic">traitement</span>
            </h2>
            <div className="prose prose-lg max-w-none text-[#1A1A1A]/80">
              <p className="mb-4">Nous utilisons vos données exclusivement pour :</p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong className="text-[#1A1A1A]">Fourniture des services :</strong> Accompagnement psychologique, Smart Matching, Passeport Santé</li>
                <li><strong className="text-[#1A1A1A]">Personnalisation :</strong> Recommandations adaptées via algorithmes (transparents et explicables)</li>
                <li><strong className="text-[#1A1A1A]">Communication :</strong> Rappels de rendez-vous, suivi thérapeutique, newsletters (avec consentement)</li>
                <li><strong className="text-[#1A1A1A]">Amélioration continue :</strong> Analyses statistiques anonymisées pour optimiser nos services</li>
                <li><strong className="text-[#1A1A1A]">Conformité légale :</strong> Respect des obligations réglementaires en santé</li>
                <li><strong className="text-[#1A1A1A]">Sécurité :</strong> Prévention de la fraude et protection de la plateforme</li>
              </ul>
              <p className="bg-[#F5F1ED] p-4 rounded-lg border-l-4 border-[#1A1A1A]">
                <strong className="text-[#1A1A1A]">Engagement M.O.N.A :</strong> Vos données de santé ne sont JAMAIS vendues, louées ou partagées à des fins commerciales tierces.
              </p>
            </div>
          </div>

          {/* Base légale */}
          <div className="mb-16">
            <div className="h-[1px] bg-[#1A1A1A] mb-8"></div>
            <h2 className="text-3xl lg:text-4xl font-light mb-8">
              Base <span className="italic">légale</span> du traitement
            </h2>
            <div className="prose prose-lg max-w-none text-[#1A1A1A]/80">
              <ul className="list-disc pl-6 mb-4">
                <li><strong className="text-[#1A1A1A]">Exécution du contrat :</strong> Fourniture des services souscrits</li>
                <li><strong className="text-[#1A1A1A]">Consentement explicite :</strong> Données sensibles de santé (révocable à tout moment)</li>
                <li><strong className="text-[#1A1A1A]">Intérêt légitime :</strong> Amélioration de nos services, sécurité de la plateforme</li>
                <li><strong className="text-[#1A1A1A]">Obligation légale :</strong> Conservation des dossiers médicaux, lutte anti-blanchiment</li>
              </ul>
            </div>
          </div>

          {/* Partage des données */}
          <div className="mb-16">
            <div className="h-[1px] bg-[#1A1A1A] mb-8"></div>
            <h2 className="text-3xl lg:text-4xl font-light mb-8">
              Partage des <span className="italic">données</span>
            </h2>
            <div className="prose prose-lg max-w-none text-[#1A1A1A]/80">
              <p className="mb-4">Vos données peuvent être partagées avec :</p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong className="text-[#1A1A1A]">Professionnels de santé :</strong> Psychologues, psychiatres du réseau M.O.N.A (avec votre consentement)</li>
                <li><strong className="text-[#1A1A1A]">Prestataires techniques :</strong> AWS (hébergement sécurisé), Stripe (paiements), Twilio (notifications)</li>
                <li><strong className="text-[#1A1A1A]">Partenaires B2B :</strong> Employeurs ou assureurs (uniquement données anonymisées et agrégées)</li>
                <li><strong className="text-[#1A1A1A]">Autorités légales :</strong> Sur réquisition judiciaire ou légale impérative</li>
              </ul>
              <p className="mb-4">
                <strong className="text-[#1A1A1A]">Garanties contractuelles :</strong> Tous nos sous-traitants signent des accords de confidentialité stricts et sont conformes RGPD/HIPAA.
              </p>
            </div>
          </div>

          {/* Transferts internationaux */}
          <div className="mb-16">
            <div className="h-[1px] bg-[#1A1A1A] mb-8"></div>
            <h2 className="text-3xl lg:text-4xl font-light mb-8">
              Transferts <span className="italic">internationaux</span>
            </h2>
            <div className="prose prose-lg max-w-none text-[#1A1A1A]/80">
              <p className="mb-4">
                Vos données peuvent être transférées entre le Canada, l'Europe et l'Afrique. Nous garantissons un niveau de protection équivalent via :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Clauses Contractuelles Types (CCT) de la Commission européenne</li>
                <li>Certification Privacy Shield (pour les USA, en complément)</li>
                <li>Hébergement en Europe pour les données des utilisateurs UE</li>
                <li>Chiffrement de bout en bout lors des transferts</li>
              </ul>
            </div>
          </div>

          {/* Durée de conservation */}
          <div className="mb-16">
            <div className="h-[1px] bg-[#1A1A1A] mb-8"></div>
            <h2 className="text-3xl lg:text-4xl font-light mb-8">
              Durée de <span className="italic">conservation</span>
            </h2>
            <div className="prose prose-lg max-w-none text-[#1A1A1A]/80">
              <ul className="list-disc pl-6 mb-4">
                <li><strong className="text-[#1A1A1A]">Données de santé :</strong> 10 ans après la dernière consultation (obligation légale)</li>
                <li><strong className="text-[#1A1A1A]">Données de compte actif :</strong> Durée de la relation contractuelle + 3 ans</li>
                <li><strong className="text-[#1A1A1A]">Données de facturation :</strong> 10 ans (obligations fiscales)</li>
                <li><strong className="text-[#1A1A1A]">Cookies analytiques :</strong> 13 mois maximum</li>
                <li><strong className="text-[#1A1A1A]">Logs techniques :</strong> 12 mois (sécurité)</li>
              </ul>
              <p className="mt-4">
                Passé ces délais, vos données sont anonymisées ou supprimées définitivement de nos systèmes.
              </p>
            </div>
          </div>

          {/* Sécurité */}
          <div className="mb-16">
            <div className="h-[1px] bg-[#1A1A1A] mb-8"></div>
            <h2 className="text-3xl lg:text-4xl font-light mb-8">
              Mesures de <span className="italic">sécurité</span>
            </h2>
            <div className="prose prose-lg max-w-none text-[#1A1A1A]/80">
              <p className="mb-4">Protection de niveau hospitalier :</p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong className="text-[#1A1A1A]">Chiffrement :</strong> TLS 1.3 pour les transmissions, AES-256 au repos</li>
                <li><strong className="text-[#1A1A1A]">Authentification :</strong> Multi-facteurs (2FA) obligatoire pour les comptes sensibles</li>
                <li><strong className="text-[#1A1A1A]">Accès restreint :</strong> Principe du moindre privilège, traçabilité des accès</li>
                <li><strong className="text-[#1A1A1A]">Surveillance :</strong> Détection d'intrusion 24/7, audits de sécurité trimestriels</li>
                <li><strong className="text-[#1A1A1A]">Certification :</strong> ISO 27001 (en cours), SOC 2 Type II</li>
              </ul>
              <p className="bg-[#F5F1ED] p-4 rounded-lg border-l-4 border-[#1A1A1A]">
                <strong className="text-[#1A1A1A]">En cas de violation :</strong> Notification sous 72h à la CNIL/autorité compétente et aux utilisateurs concernés.
              </p>
            </div>
          </div>

          {/* Vos droits */}
          <div className="mb-16">
            <div className="h-[1px] bg-[#1A1A1A] mb-8"></div>
            <h2 className="text-3xl lg:text-4xl font-light mb-8">
              Vos <span className="italic">droits</span> RGPD
            </h2>
            <div className="prose prose-lg max-w-none text-[#1A1A1A]/80">
              <p className="mb-4">Vous disposez des droits suivants (exercice gratuit sous 1 mois) :</p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong className="text-[#1A1A1A]">Accès :</strong> Obtenir une copie de vos données personnelles</li>
                <li><strong className="text-[#1A1A1A]">Rectification :</strong> Corriger des données inexactes ou incomplètes</li>
                <li><strong className="text-[#1A1A1A]">Effacement :</strong> Supprimer vos données (sous conditions légales)</li>
                <li><strong className="text-[#1A1A1A]">Limitation :</strong> Restreindre certains traitements</li>
                <li><strong className="text-[#1A1A1A]">Portabilité :</strong> Récupérer vos données dans un format structuré</li>
                <li><strong className="text-[#1A1A1A]">Opposition :</strong> Refuser certains traitements (marketing, profilage)</li>
                <li><strong className="text-[#1A1A1A]">Retrait du consentement :</strong> À tout moment, sans justification</li>
                <li><strong className="text-[#1A1A1A]">Décisions automatisées :</strong> Contester le Smart Matching et obtenir une intervention humaine</li>
              </ul>
              <p className="mb-4">
                <strong className="text-[#1A1A1A]">Exercice de vos droits :</strong>
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Via votre espace membre (rubrique "Mes données")</li>
                <li>Par email : dpo@monafrica.net</li>
              </ul>
              <div className="bg-[#F5F1ED] p-4 rounded-lg border-l-4 border-[#1A1A1A]">
                <p className="mb-2">
                  <strong className="text-[#1A1A1A]">Réclamation :</strong> En cas de désaccord, vous pouvez saisir les autorités de protection des données compétentes :
                </p>
                <ul className="list-disc pl-6 mt-2">
                  <li><strong>Sénégal :</strong> Commission de Protection des Données Personnelles (CDP)</li>
                  <li><strong>Côte d'Ivoire :</strong> Autorité de Régulation des Télécommunications/TIC (ARTCI)</li>
                  <li><strong>Gabon :</strong> Commission Nationale de l'Informatique et des Libertés (CNIL Gabon)</li>
                  <li><strong>France/UE :</strong> CNIL</li>
                  <li><strong>Canada :</strong> Commissariat à la protection de la vie privée</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Cookies */}
          <div className="mb-16">
            <div className="h-[1px] bg-[#1A1A1A] mb-8"></div>
            <h2 className="text-3xl lg:text-4xl font-light mb-8">
              Gestion des <span className="italic">cookies</span>
            </h2>
            <div className="prose prose-lg max-w-none text-[#1A1A1A]/80">
              <p className="mb-4">Nous utilisons 3 types de cookies :</p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong className="text-[#1A1A1A]">Essentiels :</strong> Authentification, sécurité (pas de consentement requis)</li>
                <li><strong className="text-[#1A1A1A]">Fonctionnels :</strong> Préférences linguistiques, personnalisation (consentement via bandeau)</li>
                <li><strong className="text-[#1A1A1A]">Analytiques :</strong> Google Analytics anonymisé (consentement explicite requis)</li>
              </ul>
              <p className="mb-4">
                <strong className="text-[#1A1A1A]">Gérer vos préférences :</strong>
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Via le bandeau de consentement (première visite)</li>
                <li>Dans les paramètres de votre navigateur</li>
                <li>Via le lien "Gérer les cookies" en pied de page</li>
              </ul>
            </div>
          </div>

          {/* Modifications */}
          <div className="mb-16">
            <div className="h-[1px] bg-[#1A1A1A] mb-8"></div>
            <h2 className="text-3xl lg:text-4xl font-light mb-8">
              Modifications de la <span className="italic">politique</span>
            </h2>
            <div className="prose prose-lg max-w-none text-[#1A1A1A]/80">
              <p className="mb-4">
                Cette politique peut être mise à jour pour refléter les évolutions réglementaires ou de nos services. Toute modification substantielle vous sera notifiée par email 30 jours avant son entrée en vigueur.
              </p>
              <p>
                Consultez régulièrement cette page pour rester informé(e).
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white p-8 rounded-lg border border-[#D4C5B9]">
            <h3 className="text-2xl font-light mb-4">
              Une <span className="italic">question</span> sur vos données ?
            </h3>
            <p className="text-[#1A1A1A]/80 mb-6">
              Notre Délégué à la Protection des Données est à votre écoute pour toute demande relative à votre vie privée.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="mailto:dpo@monafrica.net"
                className="inline-block bg-[#1A1A1A] text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-[#1A1A1A]/90 transition-colors text-center"
              >
                Contacter le DPO
              </a>
              <a 
                href="/rgpd"
                className="inline-block bg-white text-[#1A1A1A] px-8 py-4 rounded-full text-sm font-medium border-2 border-[#1A1A1A] hover:bg-[#F5F1ED] transition-colors text-center"
              >
                Vos droits RGPD
              </a>
            </div>
          </div>

        </div>
      </section>

      <FooterSection />
    </div>
  );
}