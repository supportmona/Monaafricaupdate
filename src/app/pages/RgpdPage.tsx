import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";

export default function RgpdPage() {
  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      <NavigationBar />
      
      {/* Hero Section */}
      <section className="bg-[#1A1A1A] text-white py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="inline-block bg-white text-[#1A1A1A] px-4 py-1 text-xs font-semibold tracking-[0.2em] uppercase mb-6">
            CONFORMITÉ RGPD
          </div>
          <h1 className="text-5xl lg:text-7xl font-light mb-6">
            Vos droits, notre <span className="italic">engagement</span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl">
            Guide complet sur vos droits RGPD et comment les exercer sur M.O.N.A
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <div className="bg-white/10 px-4 py-2 rounded-full text-sm">
              🇪🇺 Conforme RGPD
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-full text-sm">
              🇨🇦 Conforme LPRPDE
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-full text-sm">
              🌍 Standards internationaux
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          
          {/* Introduction */}
          <div className="mb-16">
            <div className="bg-white p-8 rounded-lg border border-[#D4C5B9]">
              <p className="text-[#1A1A1A]/80 text-lg leading-relaxed mb-4">
                Le Règlement Général sur la Protection des Données (RGPD) vous confère des droits fondamentaux sur vos données personnelles. Chez M.O.N.A, nous allons au-delà de la simple conformité : nous faisons de la protection de vos données une priorité éthique absolue.
              </p>
              <p className="text-[#1A1A1A]/80 text-lg leading-relaxed">
                <strong className="text-[#1A1A1A]">Cette page explique en langage clair comment exercer vos droits RGPD sur notre plateforme.</strong>
              </p>
            </div>
          </div>

          {/* Les 8 droits RGPD */}
          <div className="mb-16">
            <div className="h-[1px] bg-[#1A1A1A] mb-8"></div>
            <h2 className="text-3xl lg:text-4xl font-light mb-8">
              Vos 8 droits <span className="italic">fondamentaux</span> RGPD
            </h2>

            {/* Droit d'accès */}
            <div className="mb-12 bg-white p-8 rounded-lg border border-[#D4C5B9]">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-[#1A1A1A] text-white w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-xl font-light">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-light mb-2 text-[#1A1A1A]">
                    Droit d'<span className="italic">accès</span>
                  </h3>
                  <p className="text-[#1A1A1A]/60 text-sm uppercase tracking-wider mb-4">
                    Article 15 RGPD
                  </p>
                </div>
              </div>
              <div className="prose prose-lg max-w-none text-[#1A1A1A]/80">
                <p className="mb-4">
                  <strong className="text-[#1A1A1A]">Ce que c'est :</strong> Obtenir la confirmation que vos données sont traitées et en recevoir une copie complète.
                </p>
                <p className="mb-4">
                  <strong className="text-[#1A1A1A]">Ce que vous recevrez :</strong>
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Export de toutes vos données (format JSON structuré)</li>
                  <li>Finalités du traitement</li>
                  <li>Catégories de données collectées</li>
                  <li>Destinataires des données (sous-traitants, partenaires)</li>
                  <li>Durée de conservation prévue</li>
                  <li>Source des données (si non collectées directement)</li>
                </ul>
                <p className="mb-4">
                  <strong className="text-[#1A1A1A]">Comment exercer :</strong>
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Via votre espace membre : Paramètres → Mes données → "Télécharger mes données"</li>
                  <li>Par email au DPO : dpo@monafrica.net (joindre pièce d'identité)</li>
                </ul>
                <p className="bg-[#F5F1ED] p-4 rounded-lg text-sm">
                  ⏱️ <strong className="text-[#1A1A1A]">Délai de réponse :</strong> 1 mois maximum (prolongeable de 2 mois si demande complexe, avec notification)
                </p>
              </div>
            </div>

            {/* Droit de rectification */}
            <div className="mb-12 bg-white p-8 rounded-lg border border-[#D4C5B9]">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-[#1A1A1A] text-white w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-xl font-light">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-light mb-2 text-[#1A1A1A]">
                    Droit de <span className="italic">rectification</span>
                  </h3>
                  <p className="text-[#1A1A1A]/60 text-sm uppercase tracking-wider mb-4">
                    Article 16 RGPD
                  </p>
                </div>
              </div>
              <div className="prose prose-lg max-w-none text-[#1A1A1A]/80">
                <p className="mb-4">
                  <strong className="text-[#1A1A1A]">Ce que c'est :</strong> Corriger des données inexactes ou compléter des données incomplètes.
                </p>
                <p className="mb-4">
                  <strong className="text-[#1A1A1A]">Exemples d'utilisation :</strong>
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Changer votre adresse email ou téléphone</li>
                  <li>Mettre à jour votre historique médical</li>
                  <li>Corriger une erreur dans votre Score Mental</li>
                </ul>
                <p className="mb-4">
                  <strong className="text-[#1A1A1A]">Comment exercer :</strong>
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Directement dans votre profil pour les informations basiques</li>
                  <li>Via le DPO pour les données de santé sensibles</li>
                </ul>
                <p className="bg-[#F5F1ED] p-4 rounded-lg text-sm">
                  ⏱️ <strong className="text-[#1A1A1A]">Délai de traitement :</strong> Immédiat pour les modifications simples, 1 mois pour les données sensibles
                </p>
              </div>
            </div>

            {/* Droit à l'effacement */}
            <div className="mb-12 bg-white p-8 rounded-lg border border-[#D4C5B9]">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-[#1A1A1A] text-white w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-xl font-light">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-light mb-2 text-[#1A1A1A]">
                    Droit à l'<span className="italic">effacement</span> ("droit à l'oubli")
                  </h3>
                  <p className="text-[#1A1A1A]/60 text-sm uppercase tracking-wider mb-4">
                    Article 17 RGPD
                  </p>
                </div>
              </div>
              <div className="prose prose-lg max-w-none text-[#1A1A1A]/80">
                <p className="mb-4">
                  <strong className="text-[#1A1A1A]">Ce que c'est :</strong> Demander la suppression définitive de vos données personnelles.
                </p>
                <p className="mb-4">
                  <strong className="text-[#1A1A1A]">Conditions d'acceptation :</strong>
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>✅ Les données ne sont plus nécessaires aux finalités initiales</li>
                  <li>✅ Vous retirez votre consentement (sans autre base légale)</li>
                  <li>✅ Vous vous opposez au traitement (sans intérêt légitime prépondérant)</li>
                  <li>✅ Les données ont été traitées illicitement</li>
                  <li>✅ Obligation légale de suppression</li>
                </ul>
                <p className="mb-4">
                  <strong className="text-[#1A1A1A]">Exceptions (impossibilité d'effacement) :</strong>
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>❌ Obligation légale de conservation (ex: dossiers médicaux 10 ans)</li>
                  <li>❌ Constatation, exercice ou défense de droits en justice</li>
                  <li>❌ Motif d'intérêt public (santé publique)</li>
                </ul>
                <p className="mb-4">
                  <strong className="text-[#1A1A1A]">Comment exercer :</strong>
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Paramètres → Confidentialité → "Supprimer mon compte"</li>
                  <li>Email au DPO pour demande motivée d'effacement partiel</li>
                </ul>
                <p className="bg-[#F5F1ED] p-4 rounded-lg text-sm">
                  ⚠️ <strong className="text-[#1A1A1A]">Important :</strong> La suppression du compte entraîne la perte définitive de l'accès à vos données de santé. Pensez à exporter avant.
                </p>
              </div>
            </div>

            {/* Droit à la limitation */}
            <div className="mb-12 bg-white p-8 rounded-lg border border-[#D4C5B9]">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-[#1A1A1A] text-white w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-xl font-light">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-light mb-2 text-[#1A1A1A]">
                    Droit à la <span className="italic">limitation</span> du traitement
                  </h3>
                  <p className="text-[#1A1A1A]/60 text-sm uppercase tracking-wider mb-4">
                    Article 18 RGPD
                  </p>
                </div>
              </div>
              <div className="prose prose-lg max-w-none text-[#1A1A1A]/80">
                <p className="mb-4">
                  <strong className="text-[#1A1A1A]">Ce que c'est :</strong> "Geler" temporairement le traitement de vos données (conservation uniquement, sans utilisation).
                </p>
                <p className="mb-4">
                  <strong className="text-[#1A1A1A]">Quand l'utiliser :</strong>
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Vous contestez l'exactitude des données (le temps de vérification)</li>
                  <li>Le traitement est illicite mais vous préférez la limitation à l'effacement</li>
                  <li>M.O.N.A n'a plus besoin des données mais vous en avez besoin pour un litige</li>
                  <li>Vous vous êtes opposé au traitement (le temps de vérifier l'intérêt légitime)</li>
                </ul>
                <p className="mb-4">
                  <strong className="text-[#1A1A1A]">Conséquences :</strong>
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Vos données sont conservées mais ne peuvent plus être utilisées</li>
                  <li>Le Smart Matching, Score Mental et recommandations seront désactivés</li>
                  <li>Vous serez notifié avant toute levée de limitation</li>
                </ul>
              </div>
            </div>

            {/* Droit à la portabilité */}
            <div className="mb-12 bg-white p-8 rounded-lg border border-[#D4C5B9]">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-[#1A1A1A] text-white w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-xl font-light">
                  5
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-light mb-2 text-[#1A1A1A]">
                    Droit à la <span className="italic">portabilité</span>
                  </h3>
                  <p className="text-[#1A1A1A]/60 text-sm uppercase tracking-wider mb-4">
                    Article 20 RGPD
                  </p>
                </div>
              </div>
              <div className="prose prose-lg max-w-none text-[#1A1A1A]/80">
                <p className="mb-4">
                  <strong className="text-[#1A1A1A]">Ce que c'est :</strong> Récupérer vos données dans un format structuré, couramment utilisé et lisible par machine pour les transférer à un autre service.
                </p>
                <p className="mb-4">
                  <strong className="text-[#1A1A1A]">Données concernées :</strong>
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Données que vous avez fournies (profil, questionnaires, historique)</li>
                  <li>Basées sur le consentement ou l'exécution d'un contrat</li>
                  <li>Traitées de manière automatisée</li>
                </ul>
                <p className="mb-4">
                  <strong className="text-[#1A1A1">Format de portabilité M.O.N.A :</strong>
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>JSON structuré (standard FHIR pour les données de santé)</li>
                  <li>CSV pour les données tabulaires</li>
                  <li>PDF pour les rapports et consultations</li>
                </ul>
                <p className="mb-4">
                  <strong className="text-[#1A1A1A]">Comment exercer :</strong>
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Paramètres → Portabilité → "Exporter mes données"</li>
                  <li>Possibilité de transférer directement vers un autre service compatible (API à venir)</li>
                </ul>
              </div>
            </div>

            {/* Droit d'opposition */}
            <div className="mb-12 bg-white p-8 rounded-lg border border-[#D4C5B9]">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-[#1A1A1A] text-white w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-xl font-light">
                  6
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-light mb-2 text-[#1A1A1A]">
                    Droit d'<span className="italic">opposition</span>
                  </h3>
                  <p className="text-[#1A1A1A]/60 text-sm uppercase tracking-wider mb-4">
                    Article 21 RGPD
                  </p>
                </div>
              </div>
              <div className="prose prose-lg max-w-none text-[#1A1A1A]/80">
                <p className="mb-4">
                  <strong className="text-[#1A1A1A]">Ce que c'est :</strong> Refuser un traitement basé sur l'intérêt légitime de M.O.N.A ou à des fins de prospection commerciale.
                </p>
                <p className="mb-4">
                  <strong className="text-[#1A1A1A]">Cas d'usage :</strong>
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li><strong className="text-[#1A1A1A]">Marketing :</strong> Se désabonner des newsletters, offres promotionnelles (droit absolu)</li>
                  <li><strong className="text-[#1A1A1A]">Profilage :</strong> Refuser l'analyse comportementale pour les recommandations</li>
                  <li><strong className="text-[#1A1A1A]">Statistiques :</strong> Refuser l'utilisation de vos données à des fins d'amélioration du service (anonymisées)</li>
                </ul>
                <p className="mb-4">
                  <strong className="text-[#1A1A1A]">Conséquences :</strong>
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Opposition au marketing : Acceptée systématiquement</li>
                  <li>Opposition au profilage : Acceptée, mais impact sur la qualité du Smart Matching</li>
                  <li>Opposition à d'autres traitements : M.O.N.A peut refuser si elle démontre un intérêt légitime prépondérant</li>
                </ul>
                <p className="mb-4">
                  <strong className="text-[#1A1A1A]">Comment exercer :</strong>
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Lien "Se désabonner" dans chaque email marketing</li>
                  <li>Paramètres → Notifications → Gérer mes préférences</li>
                  <li>Email au DPO pour opposition globale</li>
                </ul>
              </div>
            </div>

            {/* Droit de retrait du consentement */}
            <div className="mb-12 bg-white p-8 rounded-lg border border-[#D4C5B9]">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-[#1A1A1A] text-white w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-xl font-light">
                  7
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-light mb-2 text-[#1A1A1A]">
                    Droit de <span className="italic">retrait</span> du consentement
                  </h3>
                  <p className="text-[#1A1A1A]/60 text-sm uppercase tracking-wider mb-4">
                    Article 7(3) RGPD
                  </p>
                </div>
              </div>
              <div className="prose prose-lg max-w-none text-[#1A1A1A]/80">
                <p className="mb-4">
                  <strong className="text-[#1A1A1A]">Ce que c'est :</strong> Retirer à tout moment votre consentement pour un traitement spécifique, sans justification ni pénalité.
                </p>
                <p className="mb-4">
                  <strong className="text-[#1A1A1A]">Traitements concernés :</strong>
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Collecte et traitement de vos données de santé sensibles</li>
                  <li>Cookies analytiques et fonctionnels</li>
                  <li>Partage de données avec des partenaires B2B</li>
                  <li>Participation à des études ou recherches (anonymisées)</li>
                </ul>
                <p className="mb-4">
                  <strong className="text-[#1A1A1A]">Conséquences :</strong>
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Le retrait n'affecte pas la licéité du traitement effectué avant le retrait</li>
                  <li>Si le consentement était la seule base légale, le traitement s'arrêtera</li>
                  <li>Impact possible sur la qualité des Services (ex : Score Mental nécessite vos données)</li>
                </ul>
                <p className="mb-4">
                  <strong className="text-[#1A1A1A]">Comment exercer :</strong>
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Paramètres → Consentements → Gérer mes autorisations</li>
                  <li>Bandeau cookies (pied de page) pour les traceurs</li>
                </ul>
              </div>
            </div>

            {/* Droit de contester les décisions automatisées */}
            <div className="mb-12 bg-white p-8 rounded-lg border border-[#D4C5B9]">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-[#1A1A1A] text-white w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-xl font-light">
                  8
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-light mb-2 text-[#1A1A1A]">
                    Droit de <span className="italic">contestation</span> des décisions automatisées
                  </h3>
                  <p className="text-[#1A1A1A]/60 text-sm uppercase tracking-wider mb-4">
                    Article 22 RGPD
                  </p>
                </div>
              </div>
              <div className="prose prose-lg max-w-none text-[#1A1A1A]/80">
                <p className="mb-4">
                  <strong className="text-[#1A1A1A]">Ce que c'est :</strong> Ne pas faire l'objet d'une décision fondée exclusivement sur un traitement automatisé (y compris le profilage) produisant des effets juridiques ou significatifs.
                </p>
                <p className="mb-4">
                  <strong className="text-[#1A1A1A]">Chez M.O.N.A, cela concerne :</strong>
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li><strong className="text-[#1A1A1A]">Smart Matching :</strong> Algorithme d'appariement avec les Professionnels</li>
                  <li><strong className="text-[#1A1A1A]">Score Mental :</strong> Calcul automatisé de votre bien-être</li>
                  <li><strong className="text-[#1A1A1A]">Recommandations :</strong> Suggestions de contenus ou services personnalisés</li>
                </ul>
                <p className="mb-4">
                  <strong className="text-[#1A1A1A]">Vos garanties M.O.N.A :</strong>
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>✅ <strong className="text-[#1A1A1A]">Transparence :</strong> Explication des critères utilisés (sur demande)</li>
                  <li>✅ <strong className="text-[#1A1A1A]">Intervention humaine :</strong> Vous pouvez demander une révision manuelle par un expert</li>
                  <li>✅ <strong className="text-[#1A1A1A]">Contestation :</strong> Possibilité de remettre en cause le résultat algorithmique</li>
                  <li>✅ <strong className="text-[#1A1A1A]">Absence de décisions entièrement automatisées :</strong> Nos algorithmes assistent mais ne remplacent jamais le jugement humain (Professionnel ou expert M.O.N.A)</li>
                </ul>
                <p className="mb-4">
                  <strong className="text-[#1A1A1A]">Comment exercer :</strong>
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Cliquer sur "Pourquoi ce résultat ?" dans l'interface Smart Matching</li>
                  <li>Contacter le support pour demander une révision humaine</li>
                  <li>Email au DPO pour contestation formelle</li>
                </ul>
              </div>
            </div>

          </div>

          {/* Comment exercer vos droits */}
          <div className="mb-16">
            <div className="h-[1px] bg-[#1A1A1A] mb-8"></div>
            <h2 className="text-3xl lg:text-4xl font-light mb-8">
              Comment <span className="italic">exercer</span> vos droits ?
            </h2>
            <div className="prose prose-lg max-w-none text-[#1A1A1A]/80">
              <h3 className="text-2xl font-light mb-4 text-[#1A1A1A]">Méthode 1 : Interface en ligne (recommandé)</h3>
              <p className="mb-4">La plupart de vos droits sont exercables directement depuis votre espace membre :</p>
              <ul className="list-disc pl-6 mb-6">
                <li><strong className="text-[#1A1A1A]">Accès & Portabilité :</strong> Paramètres → Mes données</li>
                <li><strong className="text-[#1A1A1A]">Rectification :</strong> Profil → Modifier mes informations</li>
                <li><strong className="text-[#1A1A1A]">Opposition marketing :</strong> Paramètres → Notifications</li>
                <li><strong className="text-[#1A1A1A]">Retrait consentement :</strong> Paramètres → Consentements</li>
                <li><strong className="text-[#1A1A1A]">Effacement :</strong> Paramètres → Confidentialité → Supprimer mon compte</li>
              </ul>

              <h3 className="text-2xl font-light mb-4 text-[#1A1A1A]">Contact du DPO</h3>
              <p className="mb-4">Pour les demandes complexes, contactez notre délégué à la protection des données :</p>
              <div className="bg-[#F5F1ED] p-6 rounded-lg mb-6">
                <p className="mb-2"><strong className="text-[#1A1A1A]">Délégué à la Protection des Données (DPO)</strong></p>
                <p className="mb-2">Email : <a href="mailto:dpo@monafrica.net" className="text-[#1A1A1A] underline">dpo@monafrica.net</a></p>
              </div>

              <h3 className="text-2xl font-light mb-4 text-[#1A1A1A]">Informations à fournir</h3>
              <p className="mb-4">Pour traiter votre demande rapidement, merci de joindre :</p>
              <ul className="list-disc pl-6 mb-6">
                <li>Copie recto d'une pièce d'identité (pour vérification)</li>
                <li>Description précise de votre demande</li>
                <li>Numéro de compte M.O.N.A (si applicable)</li>
              </ul>

              <h3 className="text-2xl font-light mb-4 text-[#1A1A1A]">Délais de traitement</h3>
              <ul className="list-disc pl-6 mb-4">
                <li><strong className="text-[#1A1A1A]">Standard :</strong> 1 mois maximum à compter de la réception de votre demande</li>
                <li><strong className="text-[#1A1A1A]">Demandes complexes :</strong> Prolongation de 2 mois possible (avec notification explicative)</li>
                <li><strong className="text-[#1A1A1A]">Demandes urgentes :</strong> Traitement prioritaire en cas de violation de données</li>
              </ul>

              <h3 className="text-2xl font-light mb-4 text-[#1A1A1A]">Gratuité</h3>
              <p className="mb-4">
                L'exercice de vos droits est <strong className="text-[#1A1A1A]">entièrement gratuit</strong>. M.O.N.A peut facturer des frais raisonnables uniquement en cas de demandes manifestement infondées ou excessives (multiples demandes identiques).
              </p>
            </div>
          </div>

          {/* Réclamation */}
          <div className="mb-16">
            <div className="h-[1px] bg-[#1A1A1A] mb-8"></div>
            <h2 className="text-3xl lg:text-4xl font-light mb-8">
              Introduire une <span className="italic">réclamation</span>
            </h2>
            <div className="prose prose-lg max-w-none text-[#1A1A1A]/80">
              <p className="mb-4">
                Si vous estimez que M.O.N.A ne respecte pas vos droits RGPD ou que notre réponse à votre demande est insatisfaisante, vous pouvez saisir l'autorité de contrôle compétente :
              </p>

              <h3 className="text-2xl font-light mb-4 text-[#1A1A1A]">Autorités européennes</h3>
              <div className="bg-[#F5F1ED] p-6 rounded-lg mb-6">
                <p className="mb-2"><strong className="text-[#1A1A1A]">CNIL (France)</strong></p>
                <p className="mb-2">Commission Nationale de l'Informatique et des Libertés</p>
                <p className="mb-2">🌐 <a href="https://www.cnil.fr" className="text-[#1A1A1A] underline" target="_blank" rel="noopener noreferrer">www.cnil.fr</a></p>
                <p>📮 3 Place de Fontenoy, TSA 80715, 75334 Paris Cedex 07, France</p>
              </div>

              <h3 className="text-2xl font-light mb-4 text-[#1A1A1A]">Autorité canadienne</h3>
              <div className="bg-[#F5F1ED] p-6 rounded-lg mb-6">
                <p className="mb-2"><strong className="text-[#1A1A1A]">Commissariat à la protection de la vie privée du Canada</strong></p>
                <p className="mb-2">🌐 <a href="https://www.priv.gc.ca" className="text-[#1A1A1A] underline" target="_blank" rel="noopener noreferrer">www.priv.gc.ca</a></p>
                <p>📮 30 rue Victoria, Gatineau, QC K1A 1H3, Canada</p>
              </div>

              <p className="mt-6">
                Vous pouvez également saisir l'autorité de protection des données de votre pays de résidence. La liste complète est disponible sur <a href="https://edpb.europa.eu" className="text-[#1A1A1A] underline" target="_blank" rel="noopener noreferrer">edpb.europa.eu</a>.
              </p>
            </div>
          </div>

          {/* Sécurité et conformité */}
          <div className="mb-16">
            <div className="h-[1px] bg-[#1A1A1A] mb-8"></div>
            <h2 className="text-3xl lg:text-4xl font-light mb-8">
              Sécurité et <span className="italic">conformité</span>
            </h2>
            <div className="prose prose-lg max-w-none text-[#1A1A1A]/80">
              <h3 className="text-2xl font-light mb-4 text-[#1A1A1A]">Mesures techniques et organisationnelles</h3>
              <ul className="list-disc pl-6 mb-6">
                <li><strong className="text-[#1A1A1A]">Chiffrement :</strong> TLS 1.3 (transit) + AES-256 (stockage)</li>
                <li><strong className="text-[#1A1A1A]">Pseudonymisation :</strong> Séparation des identités et des données de santé</li>
                <li><strong className="text-[#1A1A1A]">Contrôle d'accès :</strong> Authentification multi-facteurs, principe du moindre privilège</li>
                <li><strong className="text-[#1A1A1A]">Audits :</strong> Audits de sécurité trimestriels par des experts externes</li>
                <li><strong className="text-[#1A1A1A]">Formation :</strong> Sensibilisation RGPD obligatoire pour tous les employés M.O.N.A</li>
              </ul>

              <h3 className="text-2xl font-light mb-4 text-[#1A1A1A]">Analyse d'impact (PIA)</h3>
              <p className="mb-4">
                M.O.N.A a réalisé une Analyse d'Impact relative à la Protection des Données (AIPD/DPIA) pour tous les traitements à risque élevé (Smart Matching, Score Mental). Résultats disponibles sur demande auprès du DPO.
              </p>

              <h3 className="text-2xl font-light mb-4 text-[#1A1A1A]">Violations de données</h3>
              <p className="mb-4">
                En cas de violation de données personnelles susceptible d'engendrer un risque élevé pour vos droits et libertés, M.O.N.A s'engage à :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Notifier la CNIL sous 72 heures</li>
                <li>Vous informer dans les meilleurs délais avec conseils de protection</li>
                <li>Documenter l'incident dans un registre interne</li>
              </ul>
            </div>
          </div>

          {/* Contact DPO */}
          <div className="bg-white p-8 rounded-lg border border-[#D4C5B9]">
            <h3 className="text-2xl font-light mb-4">
              Besoin d'<span className="italic">aide</span> pour exercer vos droits ?
            </h3>
            <p className="text-[#1A1A1A]/80 mb-6">
              Notre Délégué à la Protection des Données est votre interlocuteur privilégié pour toute question relative au RGPD et à la protection de votre vie privée.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="mailto:dpo@monafrica.net"
                className="inline-block bg-[#1A1A1A] text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-[#1A1A1A]/90 transition-colors text-center"
              >
                Contacter le DPO
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