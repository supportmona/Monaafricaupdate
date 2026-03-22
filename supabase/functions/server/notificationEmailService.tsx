import { Resend } from "npm:resend@6.9.1";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

/**
 * Envoie une notification par email pour les consultations
 */
export async function sendConsultationNotificationEmail(
  recipientEmail: string,
  recipientName: string,
  notificationType: 'reminder' | 'confirmed' | 'cancelled' | 'rescheduled' | 'started',
  consultationDetails: {
    expertName: string;
    date: string;
    time: string;
    duration: number;
    roomUrl?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    let subject = '';
    let content = '';
    
    switch (notificationType) {
      case 'reminder':
        subject = `Rappel : Consultation avec ${consultationDetails.expertName}`;
        content = `
          <p>Bonjour <strong>${recipientName}</strong>,</p>
          
          <p>Ce message pour vous rappeler votre consultation à venir :</p>
          
          <div class="consultation-card">
            <div class="label">Expert :</div>
            <div class="value">${consultationDetails.expertName}</div>
            
            <div class="label" style="margin-top: 12px;">Date :</div>
            <div class="value">${consultationDetails.date}</div>
            
            <div class="label" style="margin-top: 12px;">Heure :</div>
            <div class="value">${consultationDetails.time}</div>
            
            <div class="label" style="margin-top: 12px;">Durée :</div>
            <div class="value">${consultationDetails.duration} minutes</div>
          </div>
          
          ${consultationDetails.roomUrl ? `
          <div style="text-align: center; margin: 32px 0;">
            <a href="${consultationDetails.roomUrl}" class="cta-button">
              Rejoindre la consultation
            </a>
          </div>
          ` : ''}
          
          <div class="highlight">
            <p style="margin: 0;"><strong>💡 Conseils avant votre consultation :</strong></p>
            <ul style="margin: 12px 0 0 0;">
              <li>Vérifiez votre connexion internet</li>
              <li>Installez-vous dans un endroit calme</li>
              <li>Testez votre caméra et microphone</li>
              <li>Rejoignez 5 minutes avant l'heure prévue</li>
            </ul>
          </div>
        `;
        break;
        
      case 'confirmed':
        subject = `Consultation confirmée avec ${consultationDetails.expertName}`;
        content = `
          <p>Bonjour <strong>${recipientName}</strong>,</p>
          
          <p>Votre consultation a été confirmée avec succès !</p>
          
          <div class="consultation-card">
            <div class="label">Expert :</div>
            <div class="value">${consultationDetails.expertName}</div>
            
            <div class="label" style="margin-top: 12px;">Date :</div>
            <div class="value">${consultationDetails.date}</div>
            
            <div class="label" style="margin-top: 12px;">Heure :</div>
            <div class="value">${consultationDetails.time}</div>
            
            <div class="label" style="margin-top: 12px;">Durée :</div>
            <div class="value">${consultationDetails.duration} minutes</div>
          </div>
          
          <div class="highlight">
            <p style="margin: 0;">Vous recevrez un rappel avant votre consultation pour ne rien oublier.</p>
          </div>
        `;
        break;
        
      case 'cancelled':
        subject = `Consultation annulée : ${consultationDetails.expertName}`;
        content = `
          <p>Bonjour <strong>${recipientName}</strong>,</p>
          
          <p>Nous vous informons que votre consultation prévue a été annulée :</p>
          
          <div class="consultation-card">
            <div class="label">Expert :</div>
            <div class="value">${consultationDetails.expertName}</div>
            
            <div class="label" style="margin-top: 12px;">Date initiale :</div>
            <div class="value">${consultationDetails.date} à ${consultationDetails.time}</div>
          </div>
          
          <div class="highlight">
            <p style="margin: 0;">Pour toute question ou pour reprogrammer, contactez-nous à support@monafrica.net</p>
          </div>
        `;
        break;
        
      case 'rescheduled':
        subject = `Consultation reprogrammée avec ${consultationDetails.expertName}`;
        content = `
          <p>Bonjour <strong>${recipientName}</strong>,</p>
          
          <p>Votre consultation a été reprogrammée à une nouvelle date :</p>
          
          <div class="consultation-card">
            <div class="label">Expert :</div>
            <div class="value">${consultationDetails.expertName}</div>
            
            <div class="label" style="margin-top: 12px;">Nouvelle date :</div>
            <div class="value">${consultationDetails.date}</div>
            
            <div class="label" style="margin-top: 12px;">Nouvelle heure :</div>
            <div class="value">${consultationDetails.time}</div>
            
            <div class="label" style="margin-top: 12px;">Durée :</div>
            <div class="value">${consultationDetails.duration} minutes</div>
          </div>
          
          <div class="highlight">
            <p style="margin: 0;">Vous recevrez un rappel avant votre nouvelle consultation.</p>
          </div>
        `;
        break;
        
      case 'started':
        subject = `Votre consultation commence maintenant !`;
        content = `
          <p>Bonjour <strong>${recipientName}</strong>,</p>
          
          <p>Votre consultation avec <strong>${consultationDetails.expertName}</strong> commence maintenant !</p>
          
          ${consultationDetails.roomUrl ? `
          <div style="text-align: center; margin: 32px 0;">
            <a href="${consultationDetails.roomUrl}" class="cta-button">
              Rejoindre maintenant
            </a>
          </div>
          ` : ''}
          
          <div class="highlight">
            <p style="margin: 0;">Votre expert vous attend. Cliquez sur le bouton ci-dessus pour démarrer votre séance.</p>
          </div>
        `;
        break;
    }

    await resend.emails.send({
      from: "M.O.N.A <noreply@monafrica.net>",
      to: recipientEmail,
      subject,
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
                background-color: #F5F1EB;
              }
              .container {
                background: white;
                border-radius: 16px;
                padding: 40px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
              }
              .header {
                text-align: center;
                margin-bottom: 32px;
                padding-bottom: 24px;
                border-bottom: 2px solid rgba(0, 0, 0, 0.1);
              }
              .logo {
                font-size: 32px;
                font-weight: 600;
                color: #C67B5C;
                margin-bottom: 8px;
              }
              .tagline {
                font-size: 14px;
                color: #C67B5C;
                font-style: italic;
              }
              h1 {
                color: black;
                font-size: 24px;
                margin: 24px 0 16px 0;
              }
              p {
                margin: 16px 0;
                color: #333333;
              }
              .consultation-card {
                background: #F5F1EB;
                padding: 24px;
                border-radius: 12px;
                margin: 24px 0;
              }
              .label {
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                color: rgba(0, 0, 0, 0.5);
                letter-spacing: 0.5px;
              }
              .value {
                font-size: 16px;
                font-weight: 600;
                color: black;
                margin-top: 4px;
              }
              .highlight {
                background: #FFF9F3;
                padding: 20px;
                border-left: 4px solid #C67B5C;
                margin: 24px 0;
                border-radius: 4px;
              }
              .cta-button {
                display: inline-block;
                background: black;
                color: white !important;
                text-decoration: none;
                padding: 14px 32px;
                border-radius: 9999px;
                margin: 24px 0;
                font-weight: 600;
              }
              .footer {
                margin-top: 40px;
                padding-top: 24px;
                border-top: 1px solid rgba(0, 0, 0, 0.1);
                text-align: center;
                font-size: 12px;
                color: #999;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">M.O.N.A</div>
                <div class="tagline">Mieux-être, Optimisation & Neuro-Apaisement</div>
              </div>
              
              ${content}
              
              <p style="margin-top: 32px; font-style: italic; color: rgba(0, 0, 0, 0.6);">
                L'équipe M.O.N.A
              </p>
              
              <div class="footer">
                <p>M.O.N.A - Plateforme de santé mentale premium<br>
                Kinshasa • Dakar • Abidjan</p>
                <p style="margin-top: 8px;">Cet email a été envoyé automatiquement depuis @monafrica.net</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log(`✅ Email de notification (${notificationType}) envoyé à ${recipientEmail}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Erreur envoi email de notification:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Envoie une notification par email pour les messages
 */
export async function sendMessageNotificationEmail(
  recipientEmail: string,
  recipientName: string,
  senderName: string,
  messagePreview: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await resend.emails.send({
      from: "M.O.N.A <noreply@monafrica.net>",
      to: recipientEmail,
      subject: `Nouveau message de ${senderName}`,
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
                background-color: #F5F1EB;
              }
              .container {
                background: white;
                border-radius: 16px;
                padding: 40px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
              }
              .header {
                text-align: center;
                margin-bottom: 32px;
                padding-bottom: 24px;
                border-bottom: 2px solid rgba(0, 0, 0, 0.1);
              }
              .logo {
                font-size: 32px;
                font-weight: 600;
                color: #C67B5C;
                margin-bottom: 8px;
              }
              .tagline {
                font-size: 14px;
                color: #C67B5C;
                font-style: italic;
              }
              .message-preview {
                background: #F5F1EB;
                padding: 24px;
                border-radius: 12px;
                margin: 24px 0;
                font-style: italic;
              }
              .cta-button {
                display: inline-block;
                background: black;
                color: white !important;
                text-decoration: none;
                padding: 14px 32px;
                border-radius: 9999px;
                margin: 24px 0;
                font-weight: 600;
              }
              .footer {
                margin-top: 40px;
                padding-top: 24px;
                border-top: 1px solid rgba(0, 0, 0, 0.1);
                text-align: center;
                font-size: 12px;
                color: #999;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">M.O.N.A</div>
                <div class="tagline">Mieux-être, Optimisation & Neuro-Apaisement</div>
              </div>
              
              <p>Bonjour <strong>${recipientName}</strong>,</p>
              
              <p>Vous avez reçu un nouveau message de <strong>${senderName}</strong> :</p>
              
              <div class="message-preview">
                ${messagePreview.length > 150 ? messagePreview.substring(0, 150) + '...' : messagePreview}
              </div>
              
              <div style="text-align: center;">
                <a href="https://www.monafrica.net/membre/messages" class="cta-button">
                  Lire le message complet
                </a>
              </div>
              
              <p style="margin-top: 32px; font-style: italic; color: rgba(0, 0, 0, 0.6);">
                L'équipe M.O.N.A
              </p>
              
              <div class="footer">
                <p>M.O.N.A - Plateforme de santé mentale premium<br>
                Kinshasa • Dakar • Abidjan</p>
                <p style="margin-top: 8px;">Cet email a été envoyé automatiquement depuis @monafrica.net</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log(`✅ Email de notification de message envoyé à ${recipientEmail}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Erreur envoi email de notification de message:`, error);
    return { success: false, error: error.message };
  }
}
