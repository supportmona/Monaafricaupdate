import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";

export default function ConditionsPage() {
  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      <NavigationBar />
      
      {/* Hero Section */}
      <section className="bg-[#1A1A1A] text-white py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="inline-block bg-white text-[#1A1A1A] px-4 py-1 text-xs font-semibold tracking-[0.2em] uppercase mb-6">
            CONDITIONS D'UTILISATION
          </div>
          <h1 className="text-5xl lg:text-7xl font-light mb-6">
            Cadre d'utilisation de nos <span className="italic">services</span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl">
            Les règles qui régissent votre accès et votre utilisation de la plateforme M.O.N.A
          </p>
          <p className="text-sm text-white/50 mt-4">
            Dernière mise à jour : 3 février 2026 • Version 2.1
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          
          {/* Introduction */}
          <div className="mb-16">
            <div className="bg-white p-8 rounded-lg border border-[#D4C5B9]">
              <p className="text-[#1A1A1A]/80 text-lg leading-relaxed mb-4">
                Bienvenue sur M.O.N.A (Mieux-être, Optimisation & Neuro-Apaisement), votre plateforme d'accompagnement en santé mentale. En accédant à nos services, vous acceptez d'être lié(e) par les présentes Conditions d'Utilisation.
              </p>
              <p className="text-[#1A1A1A]/80 text-lg leading-relaxed">
                <strong className="text-[#1A1A1A]">Important :</strong> Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services. Pour les utilisateurs mineurs, l'accord d'un représentant légal est obligatoire.
              </p>
            </div>
          </div>

          {/* Définitions */}
          <div className="mb-16">
            <div className="h-[1px] bg-[#1A1A1A] mb-8"></div>
            <h2 className="text-3xl lg:text-4xl font-light mb-8">
              <span className="italic">Définitions</span>
            </h2>
            <div className="prose prose-lg max-w-none text-[#1A1A1A]/80">
              <ul className="list-disc pl-6 mb-4">
                <li><strong className="text-[#1A1A1A]">"Services" :</strong> Ensemble des fonctionnalités proposées par M.O.N.A (Score Mental, Smart Matching, Passeport Santé, consultations, Cercle M.O.N.A, carte NFC)</li>
                <li><strong className="text-[#1A1A1A]">"Utilisateur" / "Vous" :</strong> Toute personne accédant à la plateforme M.O.N.A</li>
                <li><strong className="text-[#1A1A1A]">"Professionnel" :</strong> Psychologue, psychiatre ou thérapeute membre du réseau M.O.N.A</li>
                <li><strong className="text-[#1A1A1A]">"Membre" :</strong> Utilisateur ayant souscrit à un abonnement payant</li>
                <li><strong className="text-[#1A1A1A]">"Compte" :</strong> Espace personnel sécurisé de l'Utilisateur</li>
              </ul>
            </div>
          </div>

          {/* Acceptation */}
          <div className="mb-16">
            <div className="h-[1px] bg-[#1A1A1A] mb-8"></div>
            <h2 className="text-3xl lg:text-4xl font-light mb-8">
              Acceptation des <span className="italic">conditions</span>
            </h2>
            <div className="prose prose-lg max-w-none text-[#1A1A1A]/80">
              <p className="mb-4">
                L'utilisation de la plateforme implique l'acceptation pleine et entière des présentes Conditions, ainsi que de notre <a href="/confidentialite" className="text-[#1A1A1A] underline hover:no-underline">Politique de Confidentialité</a> et de notre <a href="/rgpd" className="text-[#1A1A1A] underline hover:no-underline">Politique RGPD</a>.
              </p>
              <p className="mb-4">
                M.O.N.A se réserve le droit de modifier ces conditions à tout moment. Les modifications substantielles vous seront notifiées par email 30 jours avant leur entrée en vigueur. La poursuite de votre utilisation après notification constitue une acceptation des nouvelles conditions.
              </p>
            </div>
          </div>

          {/* Création de compte */}
          <div className="mb-16">
            <div className="h-[1px] bg-[#1A1A1A] mb-8"></div>
            <h2 className="text-3xl lg:text-4xl font-light mb-8">
              Création et gestion du <span className="italic">compte</span>
            </h2>
            <div className="prose prose-lg max-w-none text-[#1A1A1A]/80">
              <h3 className="text-2xl font-light mb-4 text-[#1A1A1A]">Conditions d'inscription</h3>
              <ul className="list-disc pl-6 mb-6">
                <li>Âge minimum : 16 ans (avec accord parental) ou 18 ans (sans accord)</li>
                <li>Fournir des informations exactes, complètes et à jour</li>
                <li>Un seul compte par personne</li>
                <li>Interdiction de créer un compte pour une tierce personne sans mandat</li>
              </ul>

              <h3 className="text-2xl font-light mb-4 text-[#1A1A1A]">Sécurité du compte</h3>
              <p className="mb-4">Vous êtes responsable de :</p>
              <ul className="list-disc pl-6 mb-6">
                <li>La confidentialité de vos identifiants (mot de passe, 2FA)</li>
                <li>Toute activité effectuée sous votre compte</li>
                <li>La notification immédiate en cas d'utilisation non autorisée</li>
              </ul>

              <h3 className="text-2xl font-light mb-4 text-[#1A1A1A]">Suspension et résiliation</h3>
              <p className="mb-4">M.O.N.A peut suspendre ou résilier votre compte en cas de :</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Violation des présentes Conditions</li>
                <li>Activité frauduleuse ou illégale</li>
                <li>Non-paiement des services</li>
                <li>Comportement inapproprié envers les Professionnels ou autres utilisateurs</li>
              </ul>
            </div>
          </div>

          {/* Description des services */}
          <div className="mb-16">
            <div className="h-[1px] bg-[#1A1A1A] mb-8"></div>
            <h2 className="text-3xl lg:text-4xl font-light mb-8">
              Description des <span className="italic">services</span>
            </h2>
            <div className="prose prose-lg max-w-none text-[#1A1A1A]/80">
              <h3 className="text-2xl font-light mb-4 text-[#1A1A1A]">1. Score Mental M.O.N.A®</h3>
              <p className="mb-4">
                Évaluation psychométrique scientifiquement validée mesurant votre bien-être mental sur une échelle de 0 à 100. Ce score est indicatif et ne constitue pas un diagnostic médical.
              </p>

              <h3 className="text-2xl font-light mb-4 text-[#1A1A1A]">2. Smart Matching</h3>
              <p className="mb-4">
                Algorithme d'appariement avec des Professionnels basé sur 40+ critères (spécialisation, approche thérapeutique, langue, culture, disponibilité). Les recommandations sont transparentes et explicables sur demande.
              </p>

              <h3 className="text-2xl font-light mb-4 text-[#1A1A1A]">3. Passeport Santé Mentale</h3>
              <p className="mb-4">
                Dossier numérique centralisé et portable (export possible) contenant vos évaluations, objectifs, historique thérapeutique. Vous contrôlez l'accès aux Professionnels.
              </p>

              <h3 className="text-2xl font-light mb-4 text-[#1A1A1A]">4. Consultations</h3>
              <p className="mb-4">
                Sessions vidéo sécurisées (chiffrement de bout en bout) avec des Professionnels agréés. Durée standard : 50 minutes. Annulation gratuite jusqu'à 24h avant le rendez-vous.
              </p>

              <h3 className="text-2xl font-light mb-4 text-[#1A1A1A]">5. Cercle M.O.N.A®</h3>
              <p className="mb-4">
                Communauté premium avec événements exclusifs, contenus experts, ateliers thématiques. Modération stricte pour garantir un environnement bienveillant.
              </p>

              <h3 className="text-2xl font-light mb-4 text-[#1A1A1A]">6. Carte NFC Mieux-être</h3>
              <p className="mb-4">
                Dispositif connecté optionnel pour accès rapide à vos données de santé, protocoles de crise, contacts d'urgence.
              </p>

              <p className="bg-[#F5F1ED] p-4 rounded-lg border-l-4 border-[#1A1A1A] mt-6">
                <strong className="text-[#1A1A1A]">Avertissement médical :</strong> M.O.N.A n'est PAS un service d'urgence. En cas de crise suicidaire ou danger immédiat, contactez immédiatement les services d'urgence (911, 15, 112 selon votre pays).
              </p>
            </div>
          </div>

          {/* Obligations de l'utilisateur */}
          <div className="mb-16">
            <div className="h-[1px] bg-[#1A1A1A] mb-8"></div>
            <h2 className="text-3xl lg:text-4xl font-light mb-8">
              Obligations de <span className="italic">l'utilisateur</span>
            </h2>
            <div className="prose prose-lg max-w-none text-[#1A1A1A]/80">
              <p className="mb-4">Vous vous engagez à :</p>
              <h3 className="text-2xl font-light mb-4 text-[#1A1A1A]">Comportement approprié</h3>
              <ul className="list-disc pl-6 mb-6">
                <li>Fournir des informations de santé complètes et honnêtes aux Professionnels</li>
                <li>Respecter les horaires de rendez-vous (pénalités en cas d'absence injustifiée)</li>
                <li>Traiter les Professionnels et autres utilisateurs avec respect</li>
                <li>Ne pas enregistrer les sessions sans consentement explicite</li>
              </ul>

              <h3 className="text-2xl font-light mb-4 text-[#1A1A1A]">Usage interdit</h3>
              <ul className="list-disc pl-6 mb-6">
                <li>❌ Partager votre compte ou vos identifiants</li>
                <li>❌ Utiliser les Services à des fins illégales ou frauduleuses</li>
                <li>❌ Tenter de contourner les mesures de sécurité</li>
                <li>❌ Extraire des données via scraping ou bots</li>
                <li>❌ Harceler, menacer ou discriminer d'autres utilisateurs</li>
                <li>❌ Publier du contenu offensant, diffamatoire ou pornographique</li>
                <li>❌ Usurper l'identité d'un Professionnel</li>
              </ul>

              <h3 className="text-2xl font-light mb-4 text-[#1A1A1A]">Propriété intellectuelle</h3>
              <p className="mb-4">
                Vous reconnaissez que tous les contenus M.O.N.A (algorithmes, questionnaires, designs, textes) sont protégés par le droit d'auteur. Toute reproduction nécessite une autorisation écrite préalable.
              </p>
            </div>
          </div>

          {/* Tarifs et paiements */}
          <div className="mb-16">
            <div className="h-[1px] bg-[#1A1A1A] mb-8"></div>
            <h2 className="text-3xl lg:text-4xl font-light mb-8">
              Tarifs et <span className="italic">paiements</span>
            </h2>
            <div className="prose prose-lg max-w-none text-[#1A1A1A]/80">
              <h3 className="text-2xl font-light mb-4 text-[#1A1A1A]">Modèle tarifaire</h3>
              <ul className="list-disc pl-6 mb-6">
                <li><strong className="text-[#1A1A1A]">Freemium :</strong> Score Mental, Smart Matching, Bibliothèque (gratuit)</li>
                <li><strong className="text-[#1A1A1A]">Abonnements :</strong> Mensuel ou annuel, renouvelable automatiquement</li>
                <li><strong className="text-[#1A1A1A]">Pay-per-use :</strong> Consultations à l'unité (prix affiché TTC)</li>
                <li><strong className="text-[#1A1A1A]">B2B :</strong> Tarifs entreprise sur devis</li>
              </ul>

              <h3 className="text-2xl font-light mb-4 text-[#1A1A1A]">Conditions de paiement</h3>
              <ul className="list-disc pl-6 mb-6">
                <li>Paiement par carte bancaire (Visa, Mastercard) via Stripe</li>
                <li>Prélèvement automatique pour les abonnements (sauf résiliation)</li>
                <li>Factures disponibles dans votre espace membre</li>
                <li>Devise : CAD, EUR, ou USD selon votre localisation</li>
              </ul>

              <h3 className="text-2xl font-light mb-4 text-[#1A1A1A]">Résiliation et remboursements</h3>
              <ul className="list-disc pl-6 mb-4">
                <li><strong className="text-[#1A1A1A]">Résiliation :</strong> À tout moment via votre espace membre (effet à la prochaine échéance)</li>
                <li><strong className="text-[#1A1A1A]">Remboursement abonnement :</strong> Au prorata si résiliation dans les 14 jours (droit de rétractation UE)</li>
                <li><strong className="text-[#1A1A1A]">Remboursement consultation :</strong> Si annulation 24h+ avant ou incident technique imputable à M.O.N.A</li>
                <li><strong className="text-[#1A1A1A]">No-show :</strong> Consultation non remboursée si absence sans préavis</li>
              </ul>

              <p className="bg-[#F5F1ED] p-4 rounded-lg border-l-4 border-[#1A1A1A]">
                <strong className="text-[#1A1A1A]">Remboursement santé :</strong> Certaines consultations peuvent être prises en charge par votre mutuelle ou assurance. Contactez votre organisme pour vérifier l'éligibilité.
              </p>
            </div>
          </div>

          {/* Responsabilité */}
          <div className="mb-16">
            <div className="h-[1px] bg-[#1A1A1A] mb-8"></div>
            <h2 className="text-3xl lg:text-4xl font-light mb-8">
              Responsabilité et <span className="italic">garanties</span>
            </h2>
            <div className="prose prose-lg max-w-none text-[#1A1A1A]/80">
              <h3 className="text-2xl font-light mb-4 text-[#1A1A1A]">Responsabilité de M.O.N.A</h3>
              <p className="mb-4">M.O.N.A s'engage à :</p>
              <ul className="list-disc pl-6 mb-6">
                <li>Fournir des Services de qualité avec une disponibilité de 99,5% (hors maintenance planifiée)</li>
                <li>Vérifier les qualifications des Professionnels (diplômes, assurance RC pro)</li>
                <li>Protéger vos données selon les normes RGPD</li>
                <li>Assurer un support client réactif (réponse sous 48h ouvrées)</li>
              </ul>

              <h3 className="text-2xl font-light mb-4 text-[#1A1A1A]">Limitation de responsabilité</h3>
              <p className="mb-4">M.O.N.A ne peut être tenue responsable :</p>
              <ul className="list-disc pl-6 mb-6">
                <li>Du contenu des consultations (responsabilité exclusive des Professionnels)</li>
                <li>Des résultats thérapeutiques (absence de garantie de guérison)</li>
                <li>Des interruptions de service dues à des causes externes (panne Internet, cyberattaques)</li>
                <li>Des dommages indirects (perte de revenus, préjudice moral) sauf faute lourde prouvée</li>
                <li>Des interactions entre utilisateurs (Cercle M.O.N.A)</li>
              </ul>

              <p className="bg-[#F5F1ED] p-4 rounded-lg border-l-4 border-[#1A1A1A]">
                <strong className="text-[#1A1A1A]">Clause importante :</strong> Les Services M.O.N.A complètent mais ne remplacent JAMAIS un suivi médical traditionnel. En cas de pathologie grave (dépression sévère, troubles psychotiques), une prise en charge hospitalière peut être nécessaire.
              </p>

              <h3 className="text-2xl font-light mb-4 text-[#1A1A1A]">Assurances</h3>
              <p className="mb-4">
                M.O.N.A souscrit une assurance Responsabilité Civile Professionnelle couvrant les dommages causés dans le cadre de l'exploitation de la plateforme (plafond : 5 M€).
              </p>
            </div>
          </div>

          {/* Données personnelles */}
          <div className="mb-16">
            <div className="h-[1px] bg-[#1A1A1A] mb-8"></div>
            <h2 className="text-3xl lg:text-4xl font-light mb-8">
              Données <span className="italic">personnelles</span>
            </h2>
            <div className="prose prose-lg max-w-none text-[#1A1A1A]/80">
              <p className="mb-4">
                Le traitement de vos données personnelles et de santé est régi par notre <a href="/confidentialite" className="text-[#1A1A1A] underline hover:no-underline">Politique de Confidentialité</a> et notre <a href="/rgpd" className="text-[#1A1A1A] underline hover:no-underline">Politique RGPD</a>.
              </p>
              <p className="mb-4">
                <strong className="text-[#1A1A1A]">Points clés :</strong>
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Consentement explicite requis pour les données de santé</li>
                <li>Droit d'accès, rectification, effacement, portabilité</li>
                <li>Chiffrement de bout en bout des communications avec les Professionnels</li>
                <li>Conservation limitée (10 ans pour les données de santé, obligation légale)</li>
              </ul>
            </div>
          </div>

          {/* Propriété intellectuelle */}
          <div className="mb-16">
            <div className="h-[1px] bg-[#1A1A1A] mb-8"></div>
            <h2 className="text-3xl lg:text-4xl font-light mb-8">
              Propriété <span className="italic">intellectuelle</span>
            </h2>
            <div className="prose prose-lg max-w-none text-[#1A1A1A]/80">
              <p className="mb-4">
                Tous les éléments de la plateforme (code source, bases de données, logos, charte graphique, algorithmes) sont la propriété exclusive de M.O.N.A Health Technologies Inc. et protégés par :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Droit d'auteur (Copyright © 2024-2026 M.O.N.A)</li>
                <li>Marques déposées (Canada, UE, Afrique)</li>
                <li>Brevets en cours (algorithme Smart Matching)</li>
              </ul>
              <p className="mb-4">
                <strong className="text-[#1A1A1A]">Licence d'utilisation :</strong> M.O.N.A vous accorde une licence personnelle, non exclusive, non transférable et révocable pour utiliser les Services dans le cadre des présentes Conditions.
              </p>
              <p>
                Toute violation entraînera des poursuites judiciaires.
              </p>
            </div>
          </div>

          {/* Force majeure */}
          <div className="mb-16">
            <div className="h-[1px] bg-[#1A1A1A] mb-8"></div>
            <h2 className="text-3xl lg:text-4xl font-light mb-8">
              Force <span className="italic">majeure</span>
            </h2>
            <div className="prose prose-lg max-w-none text-[#1A1A1A]/80">
              <p className="mb-4">
                M.O.N.A ne saurait être tenue responsable de l'inexécution de ses obligations en cas de force majeure, incluant mais non limité à :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Catastrophes naturelles, guerres, épidémies</li>
                <li>Pannes généralisées d'Internet ou d'électricité</li>
                <li>Cyberattaques massives (DDoS, ransomware)</li>
                <li>Décisions gouvernementales ou réglementaires imprévisibles</li>
              </ul>
              <p>
                En cas de force majeure prolongée (+30 jours), les deux parties peuvent résilier le contrat sans pénalité.
              </p>
            </div>
          </div>

          {/* Droit applicable */}
          <div className="mb-16">
            <div className="h-[1px] bg-[#1A1A1A] mb-8"></div>
            <h2 className="text-3xl lg:text-4xl font-light mb-8">
              Droit applicable et <span className="italic">litiges</span>
            </h2>
            <div className="prose prose-lg max-w-none text-[#1A1A1A]/80">
              <h3 className="text-2xl font-light mb-4 text-[#1A1A1A]">Droit applicable</h3>
              <p className="mb-4">
                Les présentes Conditions sont régies par le droit de la province de Québec (Canada), à l'exception des règles de conflit de lois. Pour les utilisateurs européens, le RGPD s'applique de manière cumulative.
              </p>

              <h3 className="text-2xl font-light mb-4 text-[#1A1A1A]">Résolution des litiges</h3>
              <p className="mb-4">
                En cas de différend, nous encourageons une résolution amiable via notre service client (contact@monafrica.net).
              </p>
              <p className="mb-4">
                <strong className="text-[#1A1A1A]">Médiation :</strong> Vous pouvez saisir un médiateur de la consommation (gratuit pour les particuliers) :
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li><strong className="text-[#1A1A1A]">Canada :</strong> Centre canadien d'arbitrage commercial (CCAC)</li>
                <li><strong className="text-[#1A1A1A]">UE :</strong> Plateforme de résolution des litiges en ligne (ec.europa.eu/consumers/odr)</li>
              </ul>

              <h3 className="text-2xl font-light mb-4 text-[#1A1A1A]">Juridiction compétente</h3>
              <p className="mb-4">
                À défaut d'accord amiable ou de médiation, tout litige sera soumis à la compétence exclusive des tribunaux de Montréal (Québec), sauf dispositions impératives contraires (notamment pour les consommateurs européens qui peuvent saisir les tribunaux de leur lieu de résidence).
              </p>
            </div>
          </div>

          {/* Divisibilité */}
          <div className="mb-16">
            <div className="h-[1px] bg-[#1A1A1A] mb-8"></div>
            <h2 className="text-3xl lg:text-4xl font-light mb-8">
              Dispositions <span className="italic">finales</span>
            </h2>
            <div className="prose prose-lg max-w-none text-[#1A1A1A]/80">
              <h3 className="text-2xl font-light mb-4 text-[#1A1A1A]">Divisibilité</h3>
              <p className="mb-4">
                Si une clause des présentes Conditions est jugée invalide ou inapplicable, les autres clauses restent pleinement en vigueur.
              </p>

              <h3 className="text-2xl font-light mb-4 text-[#1A1A1A]">Non-renonciation</h3>
              <p className="mb-4">
                Le fait pour M.O.N.A de ne pas exercer un droit prévu par les présentes Conditions ne constitue pas une renonciation à ce droit.
              </p>

              <h3 className="text-2xl font-light mb-4 text-[#1A1A1A]">Intégralité de l'accord</h3>
              <p className="mb-4">
                Les présentes Conditions, ainsi que la Politique de Confidentialité et la Politique RGPD, constituent l'intégralité de l'accord entre vous et M.O.N.A.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white p-8 rounded-lg border border-[#D4C5B9]">
            <h3 className="text-2xl font-light mb-4">
              Une <span className="italic">question</span> sur ces conditions ?
            </h3>
            <p className="text-[#1A1A1A]/80 mb-6">
              Notre équipe juridique est disponible pour toute demande de clarification ou modification contractuelle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="mailto:legal@monafrica.net"
                className="inline-block bg-[#1A1A1A] text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-[#1A1A1A]/90 transition-colors text-center"
              >
                Contacter le service juridique
              </a>
              <a 
                href="/confidentialite"
                className="inline-block bg-white text-[#1A1A1A] px-8 py-4 rounded-full text-sm font-medium border-2 border-[#1A1A1A] hover:bg-[#F5F1ED] transition-colors text-center"
              >
                Politique de confidentialité
              </a>
            </div>
          </div>

        </div>
      </section>
      <FooterSection />
    </div>
  );
}