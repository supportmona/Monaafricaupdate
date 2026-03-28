import { Resend } from "npm:resend@6.9.1";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const CONTACT_EMAIL = "contact@monafrica.net";
const SUPPORT_EMAIL = "support@monafrica.net";
const NOREPLY_EMAIL = "noreply@monafrica.net";

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Génère un email pro @monafrica.net depuis prénom + nom
 * Ex: "Dr. Sarah" "Koné" → "sarah.kone@monafrica.net"
 */
export function generateExpertEmail(firstName: string, lastName: string): string {
  const clean = (s: string) =>
    s
      .toLowerCase()
      .replace(/^dr\.?\s*/i, "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "")
      .trim();
  return `${clean(firstName)}.${clean(lastName)}@monafrica.net`;
}

/**
 * Génère un mot de passe temporaire sécurisé
 * Ex: "Mona2026!K9xR"
 */
export function generateTempPassword(lastName: string): string {
  const clean = lastName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z]/g, "")
    .substring(0, 4);
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  const random = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `Mona2026!${clean}${random}`;
}

/**
 * Crée le compte Supabase Auth pour un expert approuvé
 * Retourne { email, password } ou null si échec
 */
export async function createExpertAccount(
  firstName: string,
  lastName: string,
  specialty: string,
  existingEmail?: string
): Promise<{ email: string; password: string } | null> {
  try {
    const { createClient } = await import("jsr:@supabase/supabase-js@2");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const expertEmail = existingEmail && existingEmail.endsWith("@monafrica.net")
      ? existingEmail
      : generateExpertEmail(firstName, lastName);

    const tempPassword = generateTempPassword(lastName);

    // Vérifier si le compte existe déjà
    const { data: existing } = await supabase.auth.admin.listUsers();
    const alreadyExists = existing?.users?.find(u => u.email === expertEmail);

    if (!alreadyExists) {
      const { error } = await supabase.auth.admin.createUser({
        email: expertEmail,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          firstName,
          lastName,
          specialty,
          role: "expert",
          mustChangePassword: true,
        },
      });
      if (error) {
        console.error("Erreur création compte expert:", error);
        return null;
      }
    }

    return { email: expertEmail, password: alreadyExists ? "[compte existant]" : tempPassword };
  } catch (e) {
    console.error("Erreur createExpertAccount:", e);
    return null;
  }
}

// ── Emails ────────────────────────────────────────────────────────────────────

const baseStyle = `
  body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #F9F7F4; }
  .container { background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 12px rgba(166,139,111,0.1); }
  .header { text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #D4C5B9; }
  .logo { font-size: 28px; font-weight: 700; color: #A68B6F; letter-spacing: 0.1em; }
  .tagline { font-size: 13px; color: #B8A079; font-style: italic; margin-top: 4px; }
  h1 { color: #1A1A1A; font-size: 24px; margin: 24px 0 16px; }
  p { margin: 14px 0; color: #333; }
  .highlight { background: #F5F1ED; padding: 20px; border-left: 4px solid #A68B6F; margin: 24px 0; border-radius: 4px; }
  .credentials { background: #1A1A1A; color: white; padding: 24px; border-radius: 12px; margin: 24px 0; font-family: monospace; }
  .credentials .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #A68B6F; margin-bottom: 4px; }
  .credentials .value { font-size: 18px; color: white; font-weight: 600; margin-bottom: 16px; }
  .credentials .value.password { color: #D4C5B9; }
  .cta { display: inline-block; background: #1A1A1A; color: white !important; text-decoration: none; padding: 14px 32px; border-radius: 100px; margin: 24px 0; font-weight: 600; font-size: 15px; }
  .warning { background: #FFF8E7; border: 1px solid #F0D080; padding: 16px; border-radius: 8px; font-size: 13px; color: #7A5F00; }
  .footer { margin-top: 40px; padding-top: 24px; border-top: 1px solid #D4C5B9; text-align: center; font-size: 12px; color: #999; }
  ul { padding-left: 20px; }
  li { margin: 8px 0; color: #555; }
`;

/**
 * Email d'approbation avec identifiants générés automatiquement
 */
export async function sendApprovalEmail(
  expertEmail: string,
  firstName: string,
  lastName: string,
  credentials?: { email: string; password: string }
): Promise<{ success: boolean; error?: string }> {
  const expertName = `${firstName} ${lastName}`;
  const loginEmail = credentials?.email || expertEmail;
  const tempPassword = credentials?.password || "—";
  const showCredentials = !!credentials;

  try {
    await resend.emails.send({
      from: "M.O.N.A <noreply@monafrica.net>",
      to: expertEmail,
      subject: "Votre candidature M.O.N.A a été acceptée",
      html: `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${baseStyle}</style></head><body>
        <div class="container">
          <div class="header">
            <div class="logo">M.O.N.A</div>
            <div class="tagline">Mieux-être · Optimisation · Neuro-Apaisement</div>
          </div>

          <h1>Félicitations, ${expertName}</h1>

          <p>Nous avons le plaisir de vous informer que votre candidature pour rejoindre le réseau M.O.N.A a été <strong>acceptée</strong>.</p>

          <div class="highlight">
            <p style="margin:0;">Votre profil correspond aux critères d'excellence que nous recherchons pour accompagner nos membres en Afrique francophone. Bienvenue dans notre communauté de praticiens.</p>
          </div>

          ${showCredentials ? `
          <p><strong>Vos identifiants de connexion :</strong></p>
          <div class="credentials">
            <div class="label">Adresse email professionnelle</div>
            <div class="value">${loginEmail}</div>
            <div class="label">Mot de passe temporaire</div>
            <div class="value password">${tempPassword}</div>
          </div>
          <div class="warning">
            Changez votre mot de passe lors de votre première connexion. Ne partagez jamais ces identifiants.
          </div>
          ` : ""}

          <p>En tant que praticien M.O.N.A, vous aurez accès à :</p>
          <ul>
            <li>Un portail expert avec tableau de bord dédié</li>
            <li>Un système de matching intelligent avec les membres</li>
            <li>Des outils de téléconsultation vidéo sécurisés (Daily.co)</li>
            <li>La gestion de vos disponibilités et rendez-vous</li>
            <li>Des templates de documents médicaux (ordonnances, rapports, plans de soins)</li>
          </ul>

          <p style="text-align:center;">
            <a href="https://monafrica.net/expert/login" class="cta">Accéder à mon espace expert</a>
          </p>

          <p>Notre équipe vous contactera prochainement pour finaliser votre onboarding. Pour toute question, écrivez-nous à <a href="mailto:support@monafrica.net" style="color:#A68B6F;">support@monafrica.net</a>.</p>

          <p style="color:#B8A079;font-style:italic;margin-top:32px;">
            Cordialement,<br>L'équipe M.O.N.A
          </p>

          <div class="footer">
            <p>M.O.N.A · Kinshasa · Dakar · Abidjan</p>
            <p>Cet email est confidentiel. Ne pas transférer.</p>
          </div>
        </div>
      </body></html>`,
    });

    console.log(`Email d'approbation envoyé à ${expertEmail}`);
    return { success: true };
  } catch (error) {
    console.error("Erreur email approbation:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Email de rejet bienveillant
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
      html: `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${baseStyle}</style></head><body>
        <div class="container">
          <div class="header">
            <div class="logo">M.O.N.A</div>
            <div class="tagline">Mieux-être · Optimisation · Neuro-Apaisement</div>
          </div>

          <h1>Cher(e) ${candidateName},</h1>

          <p>Nous vous remercions sincèrement pour l'intérêt que vous portez à M.O.N.A et pour le temps consacré à votre candidature.</p>

          <p>Après un examen attentif de votre profil, nous ne sommes pas en mesure de donner suite à votre candidature à ce stade.</p>

          <div class="highlight">
            <p style="margin:0;">Cette décision ne reflète pas vos compétences ou votre valeur professionnelle. Notre sélection répond à des critères spécifiques liés à notre positionnement actuel et à la composition de notre réseau d'experts.</p>
          </div>

          <p>Nous vous encourageons à :</p>
          <ul>
            <li>Soumettre une nouvelle candidature dans les prochains mois — nos besoins évoluent régulièrement</li>
            <li>Rester attentif à nos communications pour de futures opportunités</li>
            <li>Continuer à développer votre expertise dans votre domaine</li>
          </ul>

          <p>Nous conservons votre dossier et n'hésiterons pas à vous recontacter si une opportunité correspondant à votre profil se présente.</p>

          <p>Nous vous souhaitons beaucoup de succès dans vos projets professionnels et espérons avoir l'occasion de collaborer avec vous à l'avenir.</p>

          <p style="color:#B8A079;font-style:italic;margin-top:32px;">
            Avec toute notre considération,<br>L'équipe M.O.N.A
          </p>

          <div class="footer">
            <p>M.O.N.A · Kinshasa · Dakar · Abidjan</p>
            <p>Pour toute question : <a href="mailto:contact@monafrica.net" style="color:#A68B6F;">contact@monafrica.net</a></p>
          </div>
        </div>
      </body></html>`,
    });

    console.log(`Email de rejet envoyé à ${candidateEmail}`);
    return { success: true };
  } catch (error) {
    console.error("Erreur email rejet:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Email d'invitation (expert créé directement par l'admin)
 */
export async function sendExpertInvitationEmail(
  expertEmail: string,
  firstName: string,
  lastName: string,
  adminName?: string
): Promise<{ success: boolean; error?: string }> {
  const expertName = `${firstName} ${lastName}`;

  try {
    await resend.emails.send({
      from: "M.O.N.A <noreply@monafrica.net>",
      to: expertEmail,
      subject: "Bienvenue dans l'équipe M.O.N.A — Vos identifiants",
      html: `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${baseStyle}</style></head><body>
        <div class="container">
          <div class="header">
            <div class="logo">M.O.N.A</div>
            <div class="tagline">Mieux-être · Optimisation · Neuro-Apaisement</div>
          </div>

          <h1>Bienvenue, ${expertName}</h1>

          <p>Notre équipe administrative vous a créé un compte expert sur la plateforme M.O.N.A. Nous sommes ravis de vous accueillir dans notre réseau de praticiens.</p>

          <p><strong>Vos identifiants de connexion :</strong></p>
          <div class="credentials">
            <div class="label">Adresse email professionnelle</div>
            <div class="value">${expertEmail}</div>
            <div class="label">Instructions</div>
            <div class="value" style="font-size:14px;color:#D4C5B9;">Créez votre mot de passe lors de votre première connexion</div>
          </div>

          <p style="text-align:center;">
            <a href="https://monafrica.net/expert/login" class="cta">Accéder à mon espace expert</a>
          </p>

          <p>Pour toute assistance, contactez notre équipe à <a href="mailto:support@monafrica.net" style="color:#A68B6F;">support@monafrica.net</a>.</p>

          <p style="color:#B8A079;font-style:italic;margin-top:32px;">
            ${adminName ? `${adminName}<br>` : ""}L'équipe M.O.N.A
          </p>

          <div class="footer">
            <p>M.O.N.A · Kinshasa · Dakar · Abidjan</p>
          </div>
        </div>
      </body></html>`,
    });

    console.log(`Email d'invitation envoyé à ${expertEmail}`);
    return { success: true };
  } catch (error) {
    console.error("Erreur email invitation:", error);
    return { success: false, error: error.message };
  }
}

// ── Emails contact & support (inchangés fonctionnellement) ───────────────────

export async function sendContactEmail(
  senderName: string, senderEmail: string, senderPhone: string,
  subject: string, message: string, category: string = "général"
): Promise<{ success: boolean; error?: string }> {
  try {
    await resend.emails.send({
      from: `M.O.N.A Contact <${NOREPLY_EMAIL}>`,
      to: CONTACT_EMAIL, replyTo: senderEmail,
      subject: `Nouveau message : ${subject}`,
      html: `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${baseStyle}</style></head><body>
        <div class="container">
          <h1>Nouveau message de contact</h1>
          <div class="highlight">
            <p><strong>De :</strong> ${senderName} (${senderEmail})<br>
            <strong>Téléphone :</strong> ${senderPhone || "Non renseigné"}<br>
            <strong>Catégorie :</strong> ${category}<br>
            <strong>Sujet :</strong> ${subject}</p>
          </div>
          <p>${message.replace(/\n/g, "<br>")}</p>
          <div class="footer"><p>Reçu le ${new Date().toLocaleDateString("fr-FR", { dateStyle: "full" })}</p></div>
        </div>
      </body></html>`,
    });

    await resend.emails.send({
      from: `M.O.N.A <${CONTACT_EMAIL}>`, to: senderEmail,
      subject: "Votre message a bien été reçu",
      html: `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${baseStyle}</style></head><body>
        <div class="container">
          <div class="header"><div class="logo">M.O.N.A</div><div class="tagline">Mieux-être · Optimisation · Neuro-Apaisement</div></div>
          <h1>Bonjour ${senderName},</h1>
          <p>Nous avons bien reçu votre message concernant : <strong>${subject}</strong></p>
          <div class="highlight"><p style="margin:0;">Notre équipe vous répondra dans les <strong>48 heures ouvrées</strong>.</p></div>
          <p style="color:#B8A079;font-style:italic;">L'équipe M.O.N.A</p>
          <div class="footer"><p>M.O.N.A · Kinshasa · Dakar · Abidjan</p></div>
        </div>
      </body></html>`,
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function sendSupportEmail(
  senderName: string, senderEmail: string, senderPhone: string,
  subject: string, message: string,
  priority: "basse" | "normale" | "haute" | "urgente" = "normale",
  userType: string = "membre"
): Promise<{ success: boolean; error?: string }> {
  try {
    await resend.emails.send({
      from: `M.O.N.A Support <${NOREPLY_EMAIL}>`,
      to: SUPPORT_EMAIL, replyTo: senderEmail,
      subject: `[${priority.toUpperCase()}] ${subject}`,
      html: `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${baseStyle}</style></head><body>
        <div class="container">
          <h1>Demande de support</h1>
          <div class="highlight">
            <p><strong>De :</strong> ${senderName} — ${userType} (${senderEmail})<br>
            <strong>Priorité :</strong> ${priority.toUpperCase()}<br>
            <strong>Sujet :</strong> ${subject}</p>
          </div>
          <p>${message.replace(/\n/g, "<br>")}</p>
          <div class="footer"><p>Reçu le ${new Date().toLocaleDateString("fr-FR")}</p></div>
        </div>
      </body></html>`,
    });

    await resend.emails.send({
      from: `M.O.N.A Support <${SUPPORT_EMAIL}>`, to: senderEmail,
      subject: "Votre demande de support a été enregistrée",
      html: `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${baseStyle}</style></head><body>
        <div class="container">
          <div class="header"><div class="logo">M.O.N.A</div><div class="tagline">Mieux-être · Optimisation · Neuro-Apaisement</div></div>
          <h1>Bonjour ${senderName},</h1>
          <p>Votre demande concernant <strong>${subject}</strong> a bien été enregistrée (priorité : <strong>${priority}</strong>).</p>
          <div class="highlight"><p style="margin:0;">${
            priority === "urgente" ? "Notre équipe vous contactera dans les prochaines heures." :
            priority === "haute" ? "Nous traiterons votre demande dans les 24 heures." :
            "Nous vous répondrons sous 48 heures ouvrées."
          }</p></div>
          <p style="color:#B8A079;font-style:italic;">L'équipe Support M.O.N.A</p>
          <div class="footer"><p>M.O.N.A · ${SUPPORT_EMAIL}</p></div>
        </div>
      </body></html>`,
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function sendAdminToExpertEmail(
  fromAdmin: "contact@monafrica.net" | "support@monafrica.net",
  toExpertEmail: string, toExpertName: string,
  subject: string, message: string, cc?: string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const adminName = fromAdmin === CONTACT_EMAIL ? "Équipe Contact M.O.N.A" : "Équipe Support M.O.N.A";

    await resend.emails.send({
      from: `M.O.N.A <${fromAdmin}>`,
      to: toExpertEmail,
      cc: cc && cc.length > 0 ? cc : undefined,
      replyTo: fromAdmin, subject,
      html: `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${baseStyle}</style></head><body>
        <div class="container">
          <div class="header"><div class="logo">M.O.N.A</div><div class="tagline">Mieux-être · Optimisation · Neuro-Apaisement</div></div>
          <h1>Bonjour ${toExpertName},</h1>
          <div class="highlight"><p style="margin:0;">${message.replace(/\n/g, "<br>")}</p></div>
          <p>Vous pouvez répondre directement à cet email.</p>
          <p style="color:#B8A079;font-style:italic;">Cordialement,<br>${adminName}</p>
          <div class="footer"><p>M.O.N.A · ${fromAdmin}</p></div>
        </div>
      </body></html>`,
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
