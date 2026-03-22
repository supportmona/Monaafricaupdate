import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      <NavigationBar />
      
      {/* Hero Section */}
      <section className="bg-[#1A1A1A] text-white py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="inline-block bg-white text-[#1A1A1A] px-4 py-1 text-xs font-semibold tracking-[0.2em] uppercase mb-6">
            MENTIONS LÉGALES
          </div>
          <h1 className="text-5xl lg:text-7xl font-light mb-6">
            Informations <span className="italic">légales</span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl">
            Transparence et conformité au service de votre confiance
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          
          {/* Identification de l'entreprise */}
          <div className="mb-16">
            <div className="h-[1px] bg-[#1A1A1A] mb-8"></div>
            <h2 className="text-3xl lg:text-4xl font-light mb-8">
              Identification de <span className="italic">l'entreprise</span>
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-[#1A1A1A]/80 mb-4">
                <strong className="text-[#1A1A1A]">Raison sociale :</strong> M.O.N.A Health Technologies
              </p>
              <p className="text-[#1A1A1A]/80">
                <strong className="text-[#1A1A1A]">Contact :</strong> legal@monafrica.net
              </p>
            </div>
          </div>

          {/* Hébergement */}
          <div className="mb-16">
            <div className="h-[1px] bg-[#1A1A1A] mb-8"></div>
            <h2 className="text-3xl lg:text-4xl font-light mb-8">
              Hébergement du <span className="italic">site</span>
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-[#1A1A1A]/80 mb-4">
                <strong className="text-[#1A1A1A]">Localisation des données :</strong> Les données sont hébergées conformément aux réglementations locales sur la protection des données.
              </p>
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
                L'ensemble du contenu de ce site (textes, images, graphismes, logos, vidéos, logiciels, algorithmes) est la propriété exclusive de M.O.N.A Health Technologies Africa ou de ses partenaires. Toute reproduction, distribution, modification ou exploitation sans autorisation écrite préalable est strictement interdite et constitue une contrefaçon sanctionnée par les législations nationales et l'Accord de Bangui (OAPI).
              </p>
              <p className="mb-4">
                <strong className="text-[#1A1A1A]">Marques déposées (OAPI - Organisation Africaine de la Propriété Intellectuelle) :</strong>
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>M.O.N.A® (Mieux-être, Optimisation & Neuro-Apaisement)</li>
                <li>Score Mental M.O.N.A®</li>
                <li>Passeport Santé Mentale®</li>
                <li>Cercle M.O.N.A®</li>
              </ul>
              <p className="bg-[#F5F1ED] p-4 rounded-lg border-l-4 border-[#1A1A1A]">
                <strong className="text-[#1A1A1A]">Protection régionale :</strong> Nos marques sont protégées auprès de l'OAPI (Organisation Africaine de la Propriété Intellectuelle) couvrant 17 pays d'Afrique francophone, ainsi qu'auprès des offices nationaux de propriété intellectuelle.
              </p>
            </div>
          </div>

          {/* Responsabilité */}
          <div className="mb-16">
            <div className="h-[1px] bg-[#1A1A1A] mb-8"></div>
            <h2 className="text-3xl lg:text-4xl font-light mb-8">
              Limitation de <span className="italic">responsabilité</span>
            </h2>
            <div className="prose prose-lg max-w-none text-[#1A1A1A]/80">
              <p className="mb-4">
                M.O.N.A s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site. Toutefois, M.O.N.A ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition.
              </p>
              <p className="mb-4">
                M.O.N.A ne saurait être tenue responsable des dommages directs ou indirects résultant de l'accès au site ou de l'utilisation de celui-ci, incluant l'inaccessibilité, les pertes de données ou la présence de virus.
              </p>
              <div className="bg-[#F5F1ED] p-4 rounded-lg border-l-4 border-[#1A1A1A] mb-4">
                <p className="mb-2">
                  <strong className="text-[#1A1A1A]">Avertissement médical important :</strong> Les services de télémédecine et de santé mentale de M.O.N.A (incluant consultations psychologiques, psychiatriques et de médecine générale) ne remplacent pas une consultation médicale d'urgence en présentiel. En cas d'urgence psychiatrique, médicale ou vitale, contactez immédiatement les services d'urgence locaux :
                </p>
                <ul className="list-disc pl-6 mt-2">
                  <li><strong>RDC :</strong> 112 ou urgences locales</li>
                  <li><strong>Sénégal :</strong> 15 (SAMU) ou 1515</li>
                  <li><strong>Côte d'Ivoire :</strong> 185 ou 111</li>
                  <li><strong>Gabon :</strong> 1300</li>
                  <li><strong>Cameroun :</strong> 119</li>
                </ul>
              </div>
              <div className="bg-[#F5F1ED] p-4 rounded-lg border-l-4 border-[#A68B6F]">
                <p className="mb-2">
                  <strong className="text-[#1A1A1A]">Services de soins primaires :</strong> M.O.N.A propose des consultations de médecine générale en téléconsultation. Les prescriptions médicales délivrées par nos médecins sont conformes aux réglementations locales en vigueur. Les actes médicaux réalisés relèvent de la responsabilité professionnelle de chaque praticien agréé, et non de la plateforme M.O.N.A.
                </p>
              </div>
            </div>
          </div>

          {/* Cookies et tracking */}
          <div className="mb-16">
            <div className="h-[1px] bg-[#1A1A1A] mb-8"></div>
            <h2 className="text-3xl lg:text-4xl font-light mb-8">
              Cookies et <span className="italic">technologies</span> de suivi
            </h2>
            <div className="prose prose-lg max-w-none text-[#1A1A1A]/80">
              <p className="mb-4">
                Ce site utilise des cookies pour améliorer votre expérience de navigation et analyser l'utilisation du site. Vous pouvez gérer vos préférences en matière de cookies via le bandeau de consentement ou les paramètres de votre navigateur.
              </p>
              <p>
                Pour plus d'informations, consultez notre <a href="/confidentialite" className="text-[#1A1A1A] underline hover:no-underline">Politique de Confidentialité</a>.
              </p>
            </div>
          </div>

          {/* Droit applicable */}
          <div className="mb-16">
            <div className="h-[1px] bg-[#1A1A1A] mb-8"></div>
            <h2 className="text-3xl lg:text-4xl font-light mb-8">
              Droit applicable et <span className="italic">juridiction</span>
            </h2>
            <div className="prose prose-lg max-w-none text-[#1A1A1A]/80">
              <p className="mb-4">
                Les présentes mentions légales sont régies par les législations des pays africains où M.O.N.A opère, en fonction du lieu de résidence de l'utilisateur :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong className="text-[#1A1A1A]">RDC :</strong> Code civil congolais et législation sur les télécommunications</li>
                <li><strong className="text-[#1A1A1A]">Sénégal :</strong> Droit sénégalais et Code des obligations civiles et commerciales</li>
                <li><strong className="text-[#1A1A1A]">Côte d'Ivoire :</strong> Droit ivoirien et textes OHADA</li>
                <li><strong className="text-[#1A1A1A]">Gabon, Congo, Cameroun :</strong> Législations nationales respectives et textes OHADA</li>
              </ul>
              <p className="mb-4">
                <strong className="text-[#1A1A1A]">Juridiction compétente :</strong> En cas de litige, les tribunaux compétents sont ceux du pays de résidence de l'utilisateur, sauf dispositions impératives contraires.
              </p>
              <p>
                Pour les utilisateurs européens, le RGPD s'applique conformément à notre <a href="/rgpd" className="text-[#1A1A1A] underline hover:no-underline">politique RGPD</a>.
              </p>
            </div>
          </div>

          {/* Conformité réglementaire */}
          <div className="mb-16">
            <div className="h-[1px] bg-[#1A1A1A] mb-8"></div>
            <h2 className="text-3xl lg:text-4xl font-light mb-8">
              Conformité <span className="italic">réglementaire</span> africaine
            </h2>
            <div className="prose prose-lg max-w-none text-[#1A1A1A]/80">
              <p className="mb-4">
                M.O.N.A respecte les cadres réglementaires suivants :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong className="text-[#1A1A1A]">Sénégal :</strong> Loi n°2008-12 relative à la protection des données à caractère personnel</li>
                <li><strong className="text-[#1A1A1A]">Côte d'Ivoire :</strong> Loi n°2013-450 relative à la protection des données à caractère personnel</li>
                <li><strong className="text-[#1A1A1A]">Gabon :</strong> Loi n°001/2011 relative à la protection des données à caractère personnel</li>
                <li><strong className="text-[#1A1A1A]">Cameroun :</strong> Loi n°2010/012 relative à la cybersécurité et la cybercriminalité</li>
                <li><strong className="text-[#1A1A1A]">RDC :</strong> Conformité aux normes en vigueur et anticipation des textes en préparation</li>
                <li><strong className="text-[#1A1A1A]">Union Africaine :</strong> Convention de Malabo sur la cybersécurité et la protection des données</li>
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white p-8 rounded-lg border border-[#D4C5B9]">
            <h3 className="text-2xl font-light mb-4">
              Une <span className="italic">question</span> juridique ?
            </h3>
            <p className="text-[#1A1A1A]/80 mb-6">
              Notre équipe juridique est à votre disposition pour toute demande relative aux mentions légales.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <a 
                href="mailto:legal@monafrica.net"
                className="inline-block bg-[#1A1A1A] text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-[#1A1A1A]/90 transition-colors text-center"
              >
                Contacter le service juridique
              </a>
            </div>
            <p className="text-sm text-[#1A1A1A]/60">
              Email : legal@monafrica.net
            </p>
          </div>

        </div>
      </section>

      <FooterSection />
    </div>
  );
}