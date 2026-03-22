import { Resend } from "npm:resend@6.9.1";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Adresses email officielles M.O.N.A
const CONTACT_EMAIL = "contact@monafrica.net"; // Pour tout ce qui n'est pas technique
const SUPPORT_EMAIL = "support@monafrica.net"; // Pour tout ce qui est technique
const NOREPLY_EMAIL = "noreply@monafrica.net"; // Pour les emails automatiques

/**
 * Envoie un email de bienvenue à un expert approuvé
 */
export async function sendApprovalEmail(
  expertEmail: string,
  firstName: string,
  lastName: string
): Promise<{ success: boolean; error?: string }> {
  const expertName = `${firstName} ${lastName}`;
  
  try {
    await resend.emails.send({
      from: "M.O.N.A <noreply@monafrica.net>",
      to: expertEmail,
      subject: "🎉 Bienvenue dans la communauté M.O.N.A !",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                line-height: 1.6;
                color: #333333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #F9F7F4;
              }
              .container {
                background: white;
                border-radius: 16px;
                padding: 40px;
                box-shadow: 0 4px 12px rgba(199, 122, 90, 0.08);
              }
              .header {
                text-align: center;
                margin-bottom: 32px;
                padding-bottom: 24px;
                border-bottom: 2px solid #D4C4B0;
              }
              .logo {
                font-size: 32px;
                font-weight: 600;
                color: #C77A5A;
                margin-bottom: 8px;
              }
              .tagline {
                font-size: 14px;
                color: #B8A079;
                font-style: italic;
              }
              h1 {
                color: #C77A5A;
                font-size: 28px;
                margin: 24px 0 16px 0;
              }
              p {
                margin: 16px 0;
                color: #333333;
              }
              .highlight {
                background: linear-gradient(120deg, #F3E8DC 0%, transparent 100%);
                padding: 20px;
                border-left: 4px solid #C77A5A;
                margin: 24px 0;
                border-radius: 4px;
              }
              .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #C77A5A 0%, #B8A079 100%);
                color: white !important;
                text-decoration: none;
                padding: 14px 32px;
                border-radius: 8px;
                margin: 24px 0;
                font-weight: 600;
              }
              .footer {
                margin-top: 40px;
                padding-top: 24px;
                border-top: 1px solid #D4C4B0;
                text-align: center;
                font-size: 12px;
                color: #999;
              }
              .signature {
                margin-top: 32px;
                font-style: italic;
                color: #B8A079;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">M.O.N.A</div>
                <div class="tagline">Mieux-être • Optimisation • Neuro-Apaisement</div>
              </div>
              
              <h1>Félicitations ${expertName} ! 🎊</h1>
              
              <p>Nous sommes ravis de vous annoncer que votre candidature pour rejoindre la communauté M.O.N.A a été <strong>approuvée avec succès</strong>.</p>
              
              <div class="highlight">
                <p style="margin: 0;"><strong>Vous faites désormais partie d'une communauté d'excellence</strong> qui combine innovation technologique canadienne et ancrage stratégique en Afrique francophone.</p>
              </div>
              
              <p>En tant qu'expert M.O.N.A, vous aurez accès à :</p>
              <ul>
                <li>📱 Un portail expert dédié avec tableau de bord personnalisé</li>
                <li>👥 Un système de matching intelligent avec nos membres</li>
                <li>🔒 Des outils de téléconsultation sécurisés et FHIR-compatibles</li>
                <li>🌍 Une plateforme "Africa-Ready" avec mode offline-first</li>
                <li>💼 Des opportunités B2B avec nos partenaires entreprises</li>
              </ul>
              
              <p>Votre expertise en <strong>${expertName.split(" ")[2] || "santé mentale"}</strong> contribuera à offrir un accompagnement de qualité à nos membres dans nos trois hubs : Kinshasa, Dakar et Abidjan.</p>
              
              <p style="text-align: center;">
                <a href="https://monafrica.net/expert/login" class="cta-button">
                  Accéder à mon espace Expert
                </a>
              </p>
              
              <p>Notre équipe vous contactera prochainement pour finaliser votre onboarding et vous présenter nos outils de travail.</p>
              
              <p class="signature">
                Bienvenue dans la famille M.O.N.A ! 🌟<br>
                L'équipe M.O.N.A
              </p>
              
              <div class="footer">
                <p>M.O.N.A - Plateforme de santé mentale premium<br>
                Kinshasa • Dakar • Abidjan</p>
                <p style="margin-top: 8px;">Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log(`✅ Email d'approbation envoyé à ${expertEmail}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Erreur envoi email d'approbation:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Envoie un email de refus bienveillant à un candidat
 */
export async function sendRejectionEmail(
  candidateEmail: string,
  firstName: string,
  lastName: string
): Promise<{ success: boolean; error?: string }> {
  const candidateName = `${firstName} ${lastName}`;
  
  try {
    await resend.emails.send({
      from: "M.O.N.A <noreply@monafrica.net>",
      to: candidateEmail,
      subject: "Votre candidature M.O.N.A",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                line-height: 1.6;
                color: #333333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #F9F7F4;
              }
              .container {
                background: white;
                border-radius: 16px;
                padding: 40px;
                box-shadow: 0 4px 12px rgba(199, 122, 90, 0.08);
              }
              .header {
                text-align: center;
                margin-bottom: 32px;
                padding-bottom: 24px;
                border-bottom: 2px solid #D4C4B0;
              }
              .logo {
                font-size: 32px;
                font-weight: 600;
                color: #C77A5A;
                margin-bottom: 8px;
              }
              .tagline {
                font-size: 14px;
                color: #B8A079;
                font-style: italic;
              }
              h1 {
                color: #C77A5A;
                font-size: 28px;
                margin: 24px 0 16px 0;
              }
              p {
                margin: 16px 0;
                color: #333333;
              }
              .highlight {
                background: linear-gradient(120deg, #F3E8DC 0%, transparent 100%);
                padding: 20px;
                border-left: 4px solid #B8A079;
                margin: 24px 0;
                border-radius: 4px;
              }
              .footer {
                margin-top: 40px;
                padding-top: 24px;
                border-top: 1px solid #D4C4B0;
                text-align: center;
                font-size: 12px;
                color: #999;
              }
              .signature {
                margin-top: 32px;
                font-style: italic;
                color: #B8A079;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">M.O.N.A</div>
                <div class="tagline">Mieux-être • Optimisation • Neuro-Apaisement</div>
              </div>
              
              <h1>Cher(e) ${candidateName},</h1>
              
              <p>Nous tenions tout d'abord à vous remercier sincèrement pour l'intérêt que vous portez à M.O.N.A et pour le temps consacré à votre candidature.</p>
              
              <p>Après un examen attentif de votre profil, nous avons le regret de vous informer que nous ne pourrons malheureusement pas donner suite à votre candidature à ce stade.</p>
              
              <div class="highlight">
                <p style="margin: 0;">Cette décision ne reflète en aucun cas vos compétences ou votre valeur professionnelle. Notre sélection répond à des critères spécifiques liés à notre positionnement actuel et à la composition de notre équipe d'experts.</p>
              </div>
              
              <p>Nous vous encourageons vivement à :</p>
              <ul>
                <li>🔄 Soumettre une nouvelle candidature dans quelques mois, car nos besoins évoluent constamment</li>
                <li>🌟 Continuer à développer votre expertise dans votre domaine</li>
                <li>📬 Rester en contact avec nous pour de futures opportunités</li>
              </ul>
              
              <p>Nous conservons votre dossier dans notre base de données et n'hésiterons pas à vous recontacter si une opportunité correspondant à votre profil se présente.</p>
              
              <p>Nous vous souhaitons beaucoup de succès dans vos projets professionnels et espérons sincèrement avoir l'opportunité de collaborer avec vous à l'avenir.</p>
              
              <p class="signature">
                Avec toute notre considération,<br>
                L'équipe M.O.N.A
              </p>
              
              <div class="footer">
                <p>M.O.N.A - Plateforme de santé mentale premium<br>
                Kinshasa • Dakar • Abidjan</p>
                <p style="margin-top: 8px;">Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log(`✅ Email de refus envoyé à ${candidateEmail}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Erreur envoi email de refus:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Envoie un email d'invitation à un expert nouvellement créé par l'admin
 */
export async function sendExpertInvitationEmail(
  expertEmail: string,
  firstName: string,
  lastName: string,
  adminName?: string
): Promise<{ success: boolean; error?: string }> {
  const expertName = `${firstName} ${lastName}`;
  const signature = adminName 
    ? `À très bientôt sur M.O.N.A,<br>
      ${adminName}<br>
      Pour l'équipe M.O.N.A`
    : `À très bientôt sur M.O.N.A,<br>
      L'équipe M.O.N.A`;
  
  try {
    await resend.emails.send({
      from: "M.O.N.A <noreply@monafrica.net>",
      to: expertEmail,
      subject: "🎉 Bienvenue dans l'équipe M.O.N.A - Créez votre compte",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                line-height: 1.6;
                color: #333333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #F9F7F4;
              }
              .container {
                background: white;
                border-radius: 16px;
                padding: 40px;
                box-shadow: 0 4px 12px rgba(199, 122, 90, 0.08);
              }
              .header {
                text-align: center;
                margin-bottom: 32px;
                padding-bottom: 24px;
                border-bottom: 2px solid #D4C4B0;
              }
              .logo {
                font-size: 32px;
                font-weight: 600;
                color: #C77A5A;
                margin-bottom: 8px;
              }
              .tagline {
                font-size: 14px;
                color: #B8A079;
                font-style: italic;
              }
              h1 {
                color: #C77A5A;
                font-size: 28px;
                margin: 24px 0 16px 0;
              }
              p {
                margin: 16px 0;
                color: #333333;
              }
              .highlight {
                background: linear-gradient(120deg, #F3E8DC 0%, transparent 100%);
                padding: 20px;
                border-left: 4px solid #C77A5A;
                margin: 24px 0;
                border-radius: 4px;
              }
              .info-box {
                background: #F9F7F4;
                padding: 16px;
                border-radius: 8px;
                margin: 20px 0;
              }
              .info-box strong {
                color: #C77A5A;
              }
              .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #C77A5A 0%, #B8A079 100%);
                color: white !important;
                text-decoration: none;
                padding: 14px 32px;
                border-radius: 8px;
                margin: 24px 0;
                font-weight: 600;
              }
              .footer {
                margin-top: 40px;
                padding-top: 24px;
                border-top: 1px solid #D4C4B0;
                text-align: center;
                font-size: 12px;
                color: #999;
              }
              .signature {
                margin-top: 32px;
                font-style: italic;
                color: #B8A079;
              }
              .steps {
                counter-reset: step-counter;
                list-style: none;
                padding: 0;
              }
              .steps li {
                counter-increment: step-counter;
                margin: 16px 0;
                padding-left: 36px;
                position: relative;
              }
              .steps li:before {
                content: counter(step-counter);
                background: linear-gradient(135deg, #C77A5A 0%, #B8A079 100%);
                color: white;
                font-weight: bold;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                position: absolute;
                left: 0;
                top: 2px;
                font-size: 12px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">M.O.N.A</div>
                <div class="tagline">Mieux-être • Optimisation • Neuro-Apaisement</div>
              </div>

              <h1>Bienvenue dans l'équipe M.O.N.A !</h1>

              <p>Cher(e) <strong>${expertName}</strong>,</p>

              <p>
                Félicitations ! Notre équipe administrative vous a créé un compte expert sur la plateforme M.O.N.A.
                Nous sommes ravis de vous accueillir dans notre communauté de professionnels de la santé mentale.
              </p>

              <div class="highlight">
                <strong>🎯 Votre email professionnel :</strong><br>
                <span style="font-size: 18px; color: #C77A5A; font-weight: 600;">${expertEmail}</span>
              </div>

              <p><strong>📝 Prochaines étapes pour activer votre compte :</strong></p>

              <ol class="steps">
                <li>Cliquez sur le bouton ci-dessous pour accéder à la page d'inscription</li>
                <li>Utilisez l'adresse email <strong>${expertEmail}</strong></li>
                <li>Créez un mot de passe sécurisé (min. 8 caractères)</li>
                <li>Complétez votre profil professionnel</li>
                <li>Commencez à accompagner nos membres</li>
              </ol>

              <div style="text-align: center;">
                <a href="https://www.monafrica.net/expert-signup" class="cta-button">
                  Créer mon compte maintenant
                </a>
              </div>

              <div class="info-box">
                <p style="margin: 0;"><strong>💡 Important :</strong></p>
                <p style="margin: 8px 0 0 0;">
                  Vous devez utiliser l'adresse email <strong>${expertEmail}</strong> pour créer votre compte.
                  C'est votre identifiant unique sur la plateforme M.O.N.A.
                </p>
              </div>

              <p>
                Si vous avez des questions ou besoin d'assistance, notre équipe support est à votre disposition
                à <a href="mailto:support@monafrica.net" style="color: #C77A5A;">support@monafrica.net</a>.
              </p>

              <div class="signature">
                <p>${signature}</p>
              </div>

              <div class="footer">
                <p>
                  Cet email a été envoyé par M.O.N.A<br>
                  Kinshasa • Dakar • Abidjan<br>
                  <a href="https://www.monafrica.net" style="color: #C77A5A;">www.monafrica.net</a>
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log(`✅ Email d'invitation envoyé à ${expertEmail}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Erreur envoi email d'invitation:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Envoie un email de contact général (non technique)
 * Utilisé pour les demandes commerciales, partenariats, informations générales
 */
export async function sendContactEmail(
  senderName: string,
  senderEmail: string,
  senderPhone: string,
  subject: string,
  message: string,
  category: string = "général"
): Promise<{ success: boolean; error?: string }> {
  try {
    // Email de notification à l'équipe contact
    await resend.emails.send({
      from: `M.O.N.A Contact <${NOREPLY_EMAIL}>`,
      to: CONTACT_EMAIL,
      replyTo: senderEmail,
      subject: `📬 Nouveau message : ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                line-height: 1.6;
                color: #333333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #F9F7F4;
              }
              .container {
                background: white;
                border-radius: 16px;
                padding: 40px;
                box-shadow: 0 4px 12px rgba(199, 122, 90, 0.08);
              }
              .header {
                background: linear-gradient(135deg, #C77A5A 0%, #B8A079 100%);
                color: white;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 24px;
              }
              .info-box {
                background: #F3E8DC;
                padding: 16px;
                border-radius: 8px;
                margin: 16px 0;
              }
              .message-box {
                background: white;
                border: 2px solid #D4C4B0;
                padding: 20px;
                border-radius: 8px;
                margin: 16px 0;
              }
              .label {
                font-weight: 600;
                color: #C77A5A;
                margin-bottom: 4px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2 style="margin: 0;">📬 Nouveau message de contact</h2>
                <p style="margin: 8px 0 0 0; opacity: 0.9;">Catégorie : ${category}</p>
              </div>
              
              <div class="info-box">
                <div class="label">Expéditeur :</div>
                <div>${senderName}</div>
                
                <div class="label" style="margin-top: 12px;">Email :</div>
                <div><a href="mailto:${senderEmail}">${senderEmail}</a></div>
                
                <div class="label" style="margin-top: 12px;">Téléphone :</div>
                <div>${senderPhone || 'Non renseigné'}</div>
              </div>
              
              <div class="label">Sujet :</div>
              <div style="font-size: 18px; margin-bottom: 16px;">${subject}</div>
              
              <div class="label">Message :</div>
              <div class="message-box">
                ${message.replace(/\n/g, '<br>')}
              </div>
              
              <p style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #D4C4B0; font-size: 14px; color: #999;">
                Reçu le ${new Date().toLocaleDateString('fr-FR', { dateStyle: 'full' })} à ${new Date().toLocaleTimeString('fr-FR', { timeStyle: 'short' })}
              </p>
            </div>
          </body>
        </html>
      `,
    });

    // Email de confirmation à l'expéditeur
    await resend.emails.send({
      from: `M.O.N.A <${CONTACT_EMAIL}>`,
      to: senderEmail,
      subject: "✅ Votre message a bien été reçu",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                line-height: 1.6;
                color: #333333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #F9F7F4;
              }
              .container {
                background: white;
                border-radius: 16px;
                padding: 40px;
                box-shadow: 0 4px 12px rgba(199, 122, 90, 0.08);
              }
              .header {
                text-align: center;
                margin-bottom: 32px;
                padding-bottom: 24px;
                border-bottom: 2px solid #D4C4B0;
              }
              .logo {
                font-size: 32px;
                font-weight: 600;
                color: #C77A5A;
                margin-bottom: 8px;
              }
              .tagline {
                font-size: 14px;
                color: #B8A079;
                font-style: italic;
              }
              .highlight {
                background: linear-gradient(120deg, #F3E8DC 0%, transparent 100%);
                padding: 20px;
                border-left: 4px solid #C77A5A;
                margin: 24px 0;
                border-radius: 4px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">M.O.N.A</div>
                <div class="tagline">Mieux-être • Optimisation • Neuro-Apaisement</div>
              </div>
              
              <h2 style="color: #C77A5A;">Bonjour ${senderName} 👋</h2>
              
              <p>Nous avons bien reçu votre message concernant : <strong>${subject}</strong></p>
              
              <div class="highlight">
                <p style="margin: 0;">Notre équipe vous répondra dans les <strong>48 heures ouvrées</strong>. Pour toute urgence, n'hésitez pas à nous contacter directement par téléphone.</p>
              </div>
              
              <p>Informations de contact :</p>
              <ul>
                <li>📧 Email : ${CONTACT_EMAIL}</li>
                <li>📞 Téléphone : +243 81 234 5678</li>
                <li>🕐 Horaires : Lun-Ven 9h-18h (Kinshasa/Dakar/Abidjan)</li>
              </ul>
              
              <p style="margin-top: 32px; font-style: italic; color: #B8A079;">
                À très bientôt,<br>
                L'équipe M.O.N.A
              </p>
            </div>
          </body>
        </html>
      `,
    });

    console.log(`✅ Email de contact envoyé à ${CONTACT_EMAIL} depuis ${senderEmail}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Erreur envoi email de contact:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Envoie un email de support technique
 * Utilisé pour les problèmes techniques, bugs, demandes d'assistance
 */
export async function sendSupportEmail(
  senderName: string,
  senderEmail: string,
  senderPhone: string,
  subject: string,
  message: string,
  priority: "basse" | "normale" | "haute" | "urgente" = "normale",
  userType: string = "membre"
): Promise<{ success: boolean; error?: string }> {
  try {
    const priorityColors: { [key: string]: string } = {
      basse: "#10B981",
      normale: "#3B82F6",
      haute: "#F59E0B",
      urgente: "#EF4444"
    };

    // Email de notification à l'équipe support
    await resend.emails.send({
      from: `M.O.N.A Support <${NOREPLY_EMAIL}>`,
      to: SUPPORT_EMAIL,
      replyTo: senderEmail,
      subject: `🔧 [${priority.toUpperCase()}] ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                line-height: 1.6;
                color: #333333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #F9F7F4;
              }
              .container {
                background: white;
                border-radius: 16px;
                padding: 40px;
                box-shadow: 0 4px 12px rgba(199, 122, 90, 0.08);
              }
              .header {
                background: linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%);
                color: white;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 24px;
              }
              .priority-badge {
                display: inline-block;
                padding: 6px 12px;
                border-radius: 6px;
                font-weight: 600;
                font-size: 12px;
                text-transform: uppercase;
                background: ${priorityColors[priority]};
                color: white;
              }
              .info-box {
                background: #F3E8DC;
                padding: 16px;
                border-radius: 8px;
                margin: 16px 0;
              }
              .message-box {
                background: white;
                border: 2px solid #D4C4B0;
                padding: 20px;
                border-radius: 8px;
                margin: 16px 0;
                font-family: monospace;
                white-space: pre-wrap;
              }
              .label {
                font-weight: 600;
                color: #3B82F6;
                margin-bottom: 4px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2 style="margin: 0;">🔧 Nouvelle demande de support</h2>
                <p style="margin: 8px 0 0 0; opacity: 0.9;">
                  <span class="priority-badge">${priority}</span>
                </p>
              </div>
              
              <div class="info-box">
                <div class="label">Demandeur :</div>
                <div>${senderName} (${userType})</div>
                
                <div class="label" style="margin-top: 12px;">Email :</div>
                <div><a href="mailto:${senderEmail}">${senderEmail}</a></div>
                
                <div class="label" style="margin-top: 12px;">Téléphone :</div>
                <div>${senderPhone || 'Non renseigné'}</div>
                
                <div class="label" style="margin-top: 12px;">Priorité :</div>
                <div style="color: ${priorityColors[priority]}; font-weight: 600;">${priority.toUpperCase()}</div>
              </div>
              
              <div class="label">Sujet :</div>
              <div style="font-size: 18px; margin-bottom: 16px;">${subject}</div>
              
              <div class="label">Description du problème :</div>
              <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
              
              <p style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #D4C4B0; font-size: 14px; color: #999;">
                Ticket créé le ${new Date().toLocaleDateString('fr-FR', { dateStyle: 'full' })} à ${new Date().toLocaleTimeString('fr-FR', { timeStyle: 'short' })}
              </p>
            </div>
          </body>
        </html>
      `,
    });

    // Email de confirmation à l'expéditeur
    await resend.emails.send({
      from: `M.O.N.A Support <${SUPPORT_EMAIL}>`,
      to: senderEmail,
      subject: "✅ Votre demande de support a été enregistrée",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                line-height: 1.6;
                color: #333333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #F9F7F4;
              }
              .container {
                background: white;
                border-radius: 16px;
                padding: 40px;
                box-shadow: 0 4px 12px rgba(199, 122, 90, 0.08);
              }
              .header {
                text-align: center;
                margin-bottom: 32px;
                padding-bottom: 24px;
                border-bottom: 2px solid #D4C4B0;
              }
              .logo {
                font-size: 32px;
                font-weight: 600;
                color: #C77A5A;
                margin-bottom: 8px;
              }
              .tagline {
                font-size: 14px;
                color: #B8A079;
                font-style: italic;
              }
              .highlight {
                background: linear-gradient(120deg, #DBEAFE 0%, transparent 100%);
                padding: 20px;
                border-left: 4px solid #3B82F6;
                margin: 24px 0;
                border-radius: 4px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">M.O.N.A</div>
                <div class="tagline">Mieux-être • Optimisation • Neuro-Apaisement</div>
              </div>
              
              <h2 style="color: #3B82F6;">Bonjour ${senderName} 👋</h2>
              
              <p>Nous avons bien reçu votre demande de support concernant : <strong>${subject}</strong></p>
              
              <div class="highlight">
                <p style="margin: 0;"><strong>Priorité : ${priority.toUpperCase()}</strong></p>
                <p style="margin: 8px 0 0 0;">
                  ${priority === 'urgente' 
                    ? 'Notre équipe technique vous contactera dans les prochaines heures.' 
                    : priority === 'haute'
                    ? 'Notre équipe technique traitera votre demande dans les 24 heures.'
                    : 'Notre équipe technique vous répondra sous 48 heures ouvrées.'}
                </p>
              </div>
              
              <p>Pour un suivi optimal de votre demande :</p>
              <ul>
                <li>Conservez cet email comme référence</li>
                <li>Préparez tout élément complémentaire (captures d'écran, logs, etc.)</li>
                <li>Pour toute urgence critique, contactez-nous au +243 81 234 5678</li>
              </ul>
              
              <p>Informations de support :</p>
              <ul>
                <li>📧 Email : ${SUPPORT_EMAIL}</li>
                <li>📞 Téléphone : +243 81 234 5678</li>
                <li>🕐 Horaires : Lun-Ven 9h-18h (Kinshasa/Dakar/Abidjan)</li>
              </ul>
              
              <p style="margin-top: 32px; font-style: italic; color: #B8A079;">
                Notre équipe technique est à votre écoute,<br>
                L'équipe Support M.O.N.A
              </p>
            </div>
          </body>
        </html>
      `,
    });

    console.log(`✅ Email de support [${priority}] envoyé à ${SUPPORT_EMAIL} depuis ${senderEmail}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Erreur envoi email de support:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Envoie un email depuis l'équipe M.O.N.A vers un expert
 * Utilisé par les admins (contact@ ou support@) pour communiquer avec les experts
 */
export async function sendAdminToExpertEmail(
  fromAdmin: "contact@monafrica.net" | "support@monafrica.net",
  toExpertEmail: string,
  toExpertName: string,
  subject: string,
  message: string,
  cc?: string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const adminName = fromAdmin === CONTACT_EMAIL ? "Équipe Contact M.O.N.A" : "Équipe Support M.O.N.A";
    
    await resend.emails.send({
      from: `M.O.N.A <${fromAdmin}>`,
      to: toExpertEmail,
      cc: cc && cc.length > 0 ? cc : undefined,
      replyTo: fromAdmin,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                line-height: 1.6;
                color: #333333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #F9F7F4;
              }
              .container {
                background: white;
                border-radius: 16px;
                padding: 40px;
                box-shadow: 0 4px 12px rgba(199, 122, 90, 0.08);
              }
              .header {
                text-align: center;
                margin-bottom: 32px;
                padding-bottom: 24px;
                border-bottom: 2px solid #D4C4B0;
              }
              .logo {
                font-size: 32px;
                font-weight: 600;
                color: #C77A5A;
                margin-bottom: 8px;
              }
              .tagline {
                font-size: 14px;
                color: #B8A079;
                font-style: italic;
              }
              .from-badge {
                display: inline-block;
                padding: 6px 12px;
                background: linear-gradient(135deg, #C77A5A 0%, #B8A079 100%);
                color: white;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 600;
                margin-bottom: 20px;
              }
              .message-content {
                background: #F9F7F4;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                white-space: pre-wrap;
              }
              .footer {
                margin-top: 32px;
                padding-top: 24px;
                border-top: 1px solid #D4C4B0;
                font-size: 12px;
                color: #999;
                text-align: center;
              }
              .signature {
                margin-top: 24px;
                font-style: italic;
                color: #B8A079;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">M.O.N.A</div>
                <div class="tagline">Mieux-être • Optimisation • Neuro-Apaisement</div>
              </div>
              
              <div class="from-badge">De : ${adminName}</div>
              
              <h2 style="color: #C77A5A; margin-bottom: 8px;">Bonjour ${toExpertName} 👋</h2>
              
              ${cc && cc.length > 0 ? `<p style="font-size: 12px; color: #999; margin-top: 0;">CC: ${cc.join(', ')}</p>` : ''}
              
              <div class="message-content">
                ${message.replace(/\n/g, '<br>')}
              </div>
              
              <p style="margin-top: 24px;">
                Vous pouvez répondre directement à cet email. Notre équipe se tient à votre disposition pour toute question ou assistance.
              </p>
              
              <p class="signature">
                Cordialement,<br>
                ${adminName}
              </p>
              
              <div class="footer">
                <p>M.O.N.A - Plateforme de santé mentale premium<br>
                Kinshasa • Dakar • Abidjan</p>
                <p style="margin-top: 8px;">
                  📧 ${fromAdmin}<br>
                  📞 +243 81 234 5678<br>
                  🕐 Lun-Ven 9h-18h (GMT+1/GMT+2)
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log(`✅ Email admin envoyé depuis ${fromAdmin} vers ${toExpertEmail}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Erreur envoi email admin vers expert:`, error);
    return { success: false, error: error.message };
  }
}