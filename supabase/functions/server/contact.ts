import { Context } from "npm:hono";

interface ContactRequest {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  category?: string;
}

export async function handleContactSend(c: Context) {
  try {
    const body: ContactRequest = await c.req.json();
    const { name, email, phone, subject, message } = body;

    // Validation des champs requis
    if (!name || !email || !subject || !message) {
      return c.json({ 
        success: false, 
        error: "Tous les champs requis doivent être remplis" 
      }, 400);
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({ 
        success: false, 
        error: "Adresse email invalide" 
      }, 400);
    }

    // Récupération de la clé API Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY n'est pas configurée");
      return c.json({ 
        success: false, 
        error: "Service d'envoi non configuré" 
      }, 500);
    }

    // Construction du contenu HTML de l'email
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #2D2A26; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2D2A26; color: white; padding: 30px 20px; border-radius: 8px 8px 0 0; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 400; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #F5F1E8; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 20px; }
            .label { font-weight: 600; color: #2D2A26; margin-bottom: 5px; }
            .value { color: #666; }
            .message-box { background: #F5F1E8; padding: 20px; border-radius: 8px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 20px; padding: 20px; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔔 Nouveau message depuis M.O.N.A</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Sujet :</div>
                <div class="value">${subject}</div>
              </div>
              
              <div class="field">
                <div class="label">De :</div>
                <div class="value">${name}</div>
              </div>
              
              <div class="field">
                <div class="label">Email :</div>
                <div class="value"><a href="mailto:${email}">${email}</a></div>
              </div>
              
              ${phone ? `
              <div class="field">
                <div class="label">Téléphone :</div>
                <div class="value">${phone}</div>
              </div>
              ` : ''}
              
              <div class="message-box">
                <div class="label">Message :</div>
                <div class="value" style="white-space: pre-wrap;">${message}</div>
              </div>
            </div>
            <div class="footer">
              Envoyé depuis le formulaire de contact M.O.N.A<br>
              Temps de réponse recommandé : 48 heures
            </div>
          </div>
        </body>
      </html>
    `;

    // Envoi de l'email via Resend
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "M.O.N.A Contact <onboarding@resend.dev>", // Resend autorise seulement onboarding@resend.dev pour les tests
        to: ["contact@monafrica.net"],
        reply_to: email, // L'utilisateur pourra répondre directement à l'expéditeur
        subject: `[M.O.N.A Contact] ${subject} - ${name}`,
        html: htmlContent,
      }),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error("Erreur Resend:", resendData);
      return c.json({ 
        success: false, 
        error: "Erreur lors de l'envoi de l'email" 
      }, 500);
    }

    console.log("Email envoyé avec succès:", resendData);

    return c.json({ 
      success: true, 
      message: "Message envoyé avec succès",
      emailId: resendData.id 
    });

  } catch (error) {
    console.error("Erreur lors de l'envoi du message de contact:", error);
    return c.json({ 
      success: false, 
      error: "Erreur serveur lors de l'envoi du message" 
    }, 500);
  }
}
