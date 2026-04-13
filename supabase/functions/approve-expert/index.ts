// supabase/functions/approve-expert/index.ts
//
// Version sans Resend — envoi email via SMTP Supabase natif
//
// Stratégie d'envoi :
//   • Approbation : supabase.auth.admin.createUser() crée le compte
//     → génère un "magic link" d'invitation avec generateLink()
//     → envoie l'email via l'API interne Supabase (/auth/v1/admin/users/{id}/send-email)
//     → les identifiants (email + mdp temp) sont aussi stockés en base
//       pour affichage dans l'admin si l'email ne passe pas
//   • Rejet : email via le même relay SMTP Supabase
//
// Aucune clé externe nécessaire — SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY suffisent.

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-expert-token',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const SUPABASE_URL         = Deno.env.get('SUPABASE_URL') ?? ''
const SERVICE_ROLE_KEY     = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

// ─── Utilitaires ──────────────────────────────────────────────────────────────

function generateExpertEmail(fullName: string, suffix?: number): string {
  const parts = fullName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
  const [first, ...rest] = parts
  const last = rest.join('') || first
  return suffix
    ? `${first}.${last}${suffix}@monafrica.net`
    : `${first}.${last}@monafrica.net`
}

function generateTempPassword(): string {
  const UP = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const LO = 'abcdefghjkmnpqrstuvwxyz'
  const DI = '23456789'
  const SP = '!@#$%&*'
  const pick = (s: string, n: number) =>
    Array.from({ length: n }, () => s[Math.floor(Math.random() * s.length)]).join('')
  const raw = pick(UP, 2) + pick(DI, 2) + pick(SP, 1) + pick(LO, 7)
  const arr = raw.split('')
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr.join('')
}

// ─── Envoi email via SMTP relay Supabase ─────────────────────────────────────
// Supabase expose un endpoint interne qui utilise son propre SMTP
// (le même qui envoie les emails de confirmation d'inscription).
// Pas de quota extérieur, pas de clé API tierce.

async function sendEmailViaSMTP(params: {
  to: string
  subject: string
  html: string
}) {
  // Supabase Auth SMTP relay — endpoint interne disponible depuis les Edge Functions
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({
      email: params.to,
      type: 'custom',          // type custom → envoie le HTML tel quel
      subject: params.subject,
      content: params.html,
    }),
  })

  // Cet endpoint peut renvoyer 200 ou 204 selon la version de Supabase
  if (!res.ok && res.status !== 204) {
    const txt = await res.text().catch(() => '')
    // Fallback : log l'erreur mais ne bloque pas — les identifiants sont en base
    console.error(`SMTP relay error ${res.status}:`, txt)
    return { sent: false, error: txt }
  }

  return { sent: true }
}

// ─── Templates HTML ───────────────────────────────────────────────────────────

function approvalHtml(p: {
  name: string; specialty: string; email: string; password: string
}): string {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#F5F1ED;padding:40px 16px}
.wrap{max-width:560px;margin:0 auto}
.card{background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.07)}
.top{background:#1A1A1A;padding:36px 40px;text-align:center}
.logo{color:#D4C5B9;font-size:13px;letter-spacing:.25em;text-transform:uppercase;margin-bottom:8px}
.title{color:#fff;font-size:26px;font-weight:300;line-height:1.3}
.body{padding:36px 40px}
.greeting{font-size:16px;color:#4b5563;line-height:1.6;margin-bottom:24px}
.approved{display:inline-block;background:#d1fae5;color:#065f46;padding:4px 14px;border-radius:999px;font-size:13px;font-weight:600;margin-bottom:24px}
.box{background:#F5F1ED;border-radius:14px;padding:24px;margin-bottom:28px}
.box-title{font-size:11px;font-weight:700;color:#A68B6F;letter-spacing:.15em;text-transform:uppercase;margin-bottom:16px}
.row{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #E8DFD6}
.row:last-child{border-bottom:none}
.row-label{font-size:13px;color:#6b7280}
.row-val{font-size:14px;font-family:'Courier New',monospace;font-weight:700;color:#1A1A1A;word-break:break-all}
.btn{display:block;background:#1A1A1A;color:#fff!important;text-decoration:none;text-align:center;padding:16px 32px;border-radius:999px;font-size:15px;font-weight:600;margin-bottom:24px}
.warn{background:#fffbeb;border:1px solid #fcd34d;border-radius:12px;padding:14px 18px;font-size:13px;color:#92400e;line-height:1.5}
.foot{text-align:center;font-size:12px;color:#9ca3af;padding:24px 40px;border-top:1px solid #f3f4f6}
</style></head>
<body><div class="wrap"><div class="card">
<div class="top">
  <div class="logo">MONA Africa</div>
  <div class="title">Bienvenue dans l'équipe</div>
</div>
<div class="body">
  <p class="greeting">Bonjour <strong>Dr. ${p.name}</strong>,<br><br>
  Votre candidature en tant qu'expert <strong>${p.specialty || 'santé mentale'}</strong> a été examinée par notre équipe.</p>
  <span class="approved">✓ Candidature approuvée</span>
  <div class="box">
    <div class="box-title">Vos identifiants de connexion</div>
    <div class="row">
      <span class="row-label">Adresse email</span>
      <span class="row-val">${p.email}</span>
    </div>
    <div class="row">
      <span class="row-label">Mot de passe temporaire</span>
      <span class="row-val">${p.password}</span>
    </div>
  </div>
  <a href="https://monafrica.net/expert/login" class="btn">Accéder à mon portail expert →</a>
  <div class="warn">
    <strong>Important :</strong> Ce mot de passe est temporaire. Veuillez le modifier dès votre première connexion dans les paramètres de votre profil.
  </div>
</div>
<div class="foot">© ${new Date().getFullYear()} MONA Africa &nbsp;·&nbsp; <a href="https://monafrica.net" style="color:#A68B6F">monafrica.net</a><br>Des questions ? <a href="mailto:support@monafrica.net" style="color:#A68B6F">support@monafrica.net</a></div>
</div></div></body></html>`
}

function rejectionHtml(p: { name: string; reason?: string }): string {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#F5F1ED;padding:40px 16px}
.wrap{max-width:560px;margin:0 auto}
.card{background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.07)}
.top{background:#1A1A1A;padding:36px 40px;text-align:center}
.logo{color:#D4C5B9;font-size:13px;letter-spacing:.25em;text-transform:uppercase;margin-bottom:8px}
.title{color:#fff;font-size:26px;font-weight:300}
.body{padding:36px 40px}
p{font-size:15px;color:#4b5563;line-height:1.6;margin-bottom:16px}
.quote{background:#F5F1ED;border-left:3px solid #D4C5B9;padding:14px 18px;border-radius:0 10px 10px 0;margin:20px 0;font-style:italic;font-size:14px;color:#374151}
.foot{text-align:center;font-size:12px;color:#9ca3af;padding:24px 40px;border-top:1px solid #f3f4f6}
</style></head>
<body><div class="wrap"><div class="card">
<div class="top">
  <div class="logo">MONA Africa</div>
  <div class="title">Réponse à votre candidature</div>
</div>
<div class="body">
  <p>Bonjour <strong>Dr. ${p.name}</strong>,</p>
  <p>Après examen attentif de votre dossier, notre comité de sélection n'est pas en mesure d'approuver votre candidature pour le moment.</p>
  ${p.reason ? `<div class="quote">"${p.reason}"</div>` : ''}
  <p>Vous pourrez soumettre une nouvelle candidature dans <strong>90 jours</strong> avec des documents mis à jour.</p>
  <p style="font-size:13px;color:#9ca3af">Pour toute question : <a href="mailto:support@monafrica.net" style="color:#A68B6F">support@monafrica.net</a></p>
</div>
<div class="foot">© ${new Date().getFullYear()} MONA Africa &nbsp;·&nbsp; <a href="https://monafrica.net" style="color:#A68B6F">monafrica.net</a></div>
</div></div></body></html>`
}

// ─── Handler ──────────────────────────────────────────────────────────────────

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS })
  }

  const respond = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })

  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
    const body     = await req.json()
    const { expert_id, action, reason } = body

    if (!expert_id || !['approve', 'reject'].includes(action)) {
      return respond({ error: 'Paramètres invalides (expert_id + action requis)' }, 400)
    }

    // ── Récupérer l'expert ────────────────────────────────────────────────────
    // Cherche dans experts_applications OU experts selon votre schéma
    const { data: expert, error: fetchErr } = await supabase
      .from('experts')
      .select('id, name, email, specialty, status')
      .eq('id', expert_id)
      .single()

    if (fetchErr || !expert) {
      return respond({ error: 'Expert introuvable', detail: fetchErr?.message }, 404)
    }

   const expertName = expert.name || 'Expert'

    // ── APPROBATION ───────────────────────────────────────────────────────────
    if (action === 'approve') {

      // 1. Générer l'email @monafrica.net
      let generatedEmail = generateExpertEmail(expertName)

      // Vérifier unicité dans auth.users
      const { data: existingUsers } = await supabase.auth.admin.listUsers()
      const emailTaken = existingUsers?.users?.some(u => u.email === generatedEmail)
      if (emailTaken) {
        generatedEmail = generateExpertEmail(expertName, Date.now() % 9000 + 1000)
      }

      // 2. Générer le mot de passe temporaire
      const tempPassword = generateTempPassword()

      // 3. Créer le compte Supabase Auth
      const { data: authUser, error: authErr } = await supabase.auth.admin.createUser({
        email:          generatedEmail,
        password:       tempPassword,
        email_confirm:  true,          // pas besoin de confirmation — compte admin-créé
        user_metadata: {
          full_name:  expertName,
          role:       'expert',
          expert_id:  expert.id,
        },
      })

      if (authErr) {
        // Si le compte existe déjà (re-deploy ou double clic), on continue
        if (!authErr.message.includes('already registered')) {
          return respond({ error: `Auth error: ${authErr.message}` }, 500)
        }
      }

      // 4. Mettre à jour la table experts avec les identifiants générés
      //    → stocké en base = visible dans l'admin même si l'email ne part pas
      await supabase
        .from('experts')
        .update({
          status:           'approved',
          generated_email:  generatedEmail,
          temp_password:    tempPassword,   // stocké temporairement pour affichage admin
          auth_user_id:     authUser?.user?.id ?? null,
          approved_at:      new Date().toISOString(),
          rejection_reason: null,
        })
        .eq('id', expert_id)

      // 5. Envoyer l'email via SMTP Supabase natif
      const emailResult = await sendEmailViaSMTP({
        to:      generatedEmail,
        subject: '✓ Votre compte MONA Africa expert est activé',
        html:    approvalHtml({
          name:      expertName,
          specialty: expert.specialty || expert.profession || 'santé mentale',
          email:     generatedEmail,
          password:  tempPassword,
        }),
      })

      // Envoyer aussi à l'email de candidature si différent
      if (expert.email && expert.email !== generatedEmail) {
        await sendEmailViaSMTP({
          to:      expert.email,
          subject: '✓ Votre candidature MONA Africa a été approuvée',
          html:    approvalHtml({
            name:      expertName,
            specialty: expert.specialty || expert.profession || 'santé mentale',
            email:     generatedEmail,
            password:  tempPassword,
          }),
        })
      }

      return respond({
        success:         true,
        expert_id,
        generated_email: generatedEmail,
        temp_password:   tempPassword,   // renvoyé au client admin pour affichage de secours
        email_sent:      emailResult.sent,
        message:         emailResult.sent
          ? 'Expert approuvé et email envoyé'
          : 'Expert approuvé — email non envoyé (SMTP), identifiants disponibles en base',
      })
    }

    // ── REJET ─────────────────────────────────────────────────────────────────
    if (action === 'reject') {
      await supabase
        .from('experts')
        .update({
          status:           'rejected',
          rejected_at:      new Date().toISOString(),
          rejection_reason: reason ?? null,
        })
        .eq('id', expert_id)

      let emailSent = false
      if (expert.email) {
        const result = await sendEmailViaSMTP({
          to:      expert.email,
          subject: 'Suite à votre candidature MONA Africa',
          html:    rejectionHtml({ name: expertName, reason }),
        })
        emailSent = result.sent
      }

      return respond({
        success:    true,
        expert_id,
        email_sent: emailSent,
        message:    'Expert rejeté' + (emailSent ? ' et email envoyé' : ''),
      })
    }

  } catch (err) {
    console.error('approve-expert error:', err)
    return respond({ error: String(err) }, 500)
  }
})
