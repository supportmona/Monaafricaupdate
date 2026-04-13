// supabase/functions/approve-expert/index.ts
// Les candidatures sont dans kv_store_6378cc81 avec des clés "application:{id}"
// Après approbation, on crée l'expert dans la table experts + compte Auth

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-expert-token',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const SUPABASE_URL       = Deno.env.get('SUPABASE_URL') ?? ''
const SERVICE_ROLE_KEY   = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const RESEND_API_KEY     = Deno.env.get('RESEND_API_KEY') ?? ''
const KV_TABLE           = 'kv_store_6378cc81'

// ─── Utilitaires ──────────────────────────────────────────────────────────────

function generateExpertEmail(fullName: string, suffix?: number): string {
  const parts = fullName
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().trim().replace(/[^a-z\s]/g, '').split(/\s+/)
  const [first, ...rest] = parts
  const last = rest.join('') || first
  return suffix ? `${first}.${last}${suffix}@monafrica.net` : `${first}.${last}@monafrica.net`
}

function generateTempPassword(): string {
  const UP = 'ABCDEFGHJKLMNPQRSTUVWXYZ', LO = 'abcdefghjkmnpqrstuvwxyz'
  const DI = '23456789', SP = '!@#$%&*'
  const pick = (s: string, n: number) =>
    Array.from({ length: n }, () => s[Math.floor(Math.random() * s.length)]).join('')
  const raw = pick(UP, 2) + pick(DI, 2) + pick(SP, 1) + pick(LO, 7)
  const arr = raw.split('')
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr.join('')
}

// ─── Email via Resend ─────────────────────────────────────────────────────────

async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  if (!RESEND_API_KEY) return false
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: 'MONA Africa <noreply@monafrica.net>', to, subject, html }),
    })
    return res.ok
  } catch { return false }
}

function approvalHtml(name: string, specialty: string, email: string, password: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
body{font-family:-apple-system,sans-serif;background:#F5F1ED;padding:40px 16px}
.card{background:#fff;border-radius:20px;padding:40px;max-width:560px;margin:0 auto}
.top{background:#1A1A1A;border-radius:12px;padding:32px;text-align:center;margin-bottom:28px}
.logo{color:#D4C5B9;font-size:12px;letter-spacing:.2em;text-transform:uppercase;margin-bottom:6px}
.title{color:#fff;font-size:24px;font-weight:300}
.box{background:#F5F1ED;border-radius:12px;padding:20px;margin:20px 0}
.row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #E8DFD6}
.row:last-child{border-bottom:none}
.label{font-size:13px;color:#888}
.val{font-size:14px;font-family:monospace;font-weight:700;color:#1A1A1A}
.btn{display:block;background:#1A1A1A;color:#fff;text-decoration:none;text-align:center;padding:16px;border-radius:999px;font-size:15px;font-weight:600;margin:24px 0}
.warn{background:#fffbeb;border:1px solid #fcd34d;border-radius:10px;padding:14px;font-size:13px;color:#92400e}
</style></head><body><div class="card">
<div class="top"><div class="logo">MONA Africa</div><div class="title">Bienvenue dans l'équipe</div></div>
<p style="font-size:15px;color:#4b5563">Bonjour <strong>Dr. ${name}</strong>,<br><br>
Votre candidature en tant qu'expert <strong>${specialty}</strong> a été <strong style="color:#059669">approuvée</strong>.</p>
<div class="box">
  <p style="font-size:11px;font-weight:700;color:#A68B6F;text-transform:uppercase;letter-spacing:.1em;margin:0 0 12px">Vos identifiants</p>
  <div class="row"><span class="label">Email</span><span class="val">${email}</span></div>
  <div class="row"><span class="label">Mot de passe temporaire</span><span class="val">${password}</span></div>
</div>
<a href="https://monafrica.net/expert/login" class="btn">Accéder à mon portail →</a>
<div class="warn"><strong>Important :</strong> Modifiez ce mot de passe dès votre première connexion.</div>
<p style="text-align:center;font-size:12px;color:#9ca3af;margin-top:24px">© ${new Date().getFullYear()} MONA Africa · <a href="https://monafrica.net" style="color:#A68B6F">monafrica.net</a></p>
</div></body></html>`
}

function rejectionHtml(name: string, reason?: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
body{font-family:-apple-system,sans-serif;background:#F5F1ED;padding:40px 16px}
.card{background:#fff;border-radius:20px;padding:40px;max-width:560px;margin:0 auto}
</style></head><body><div class="card">
<p style="font-size:22px;font-weight:300;margin-bottom:20px">Réponse à votre candidature</p>
<p style="font-size:15px;color:#4b5563">Bonjour Dr. ${name},</p>
<p style="font-size:15px;color:#4b5563">Après examen de votre dossier, notre équipe ne peut pas approuver votre candidature pour le moment.</p>
${reason ? `<blockquote style="border-left:3px solid #D4C5B9;padding:12px 16px;margin:16px 0;font-style:italic;color:#374151">"${reason}"</blockquote>` : ''}
<p style="font-size:15px;color:#4b5563">Vous pouvez soumettre une nouvelle candidature dans <strong>90 jours</strong>.</p>
<p style="font-size:12px;color:#9ca3af;margin-top:24px">Questions : <a href="mailto:support@monafrica.net" style="color:#A68B6F">support@monafrica.net</a></p>
</div></body></html>`
}

// ─── Handler ──────────────────────────────────────────────────────────────────

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS })

  const respond = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), { status, headers: { ...CORS, 'Content-Type': 'application/json' } })

  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
    const { expert_id, action, reason } = await req.json()

    if (!expert_id || !['approve', 'reject'].includes(action)) {
      return respond({ error: 'Paramètres invalides' }, 400)
    }

    // ── Lire la candidature depuis le KV store ────────────────────────────────
    const { data: kvRow, error: kvErr } = await supabase
      .from(KV_TABLE)
      .select('value')
      .eq('key', `application:${expert_id}`)
      .single()

    if (kvErr || !kvRow) {
      return respond({ error: 'Candidature introuvable', detail: kvErr?.message }, 404)
    }

    const app = typeof kvRow.value === 'string' ? JSON.parse(kvRow.value) : kvRow.value
    const expertName = `${app.firstName ?? ''} ${app.lastName ?? ''}`.trim() || 'Expert'
    const candidatureEmail = app.email ?? ''

    // ── APPROBATION ───────────────────────────────────────────────────────────
    if (action === 'approve') {
      const tempPassword = generateTempPassword()
      let generatedEmail = generateExpertEmail(expertName)

      // Vérifier unicité email dans experts
      const { data: existing } = await supabase
        .from('experts')
        .select('id')
        .eq('email', generatedEmail)
        .maybeSingle()

      if (existing) {
        generatedEmail = generateExpertEmail(expertName, Date.now() % 9000 + 1000)
      }

      // Créer le compte Supabase Auth
      const { data: authUser, error: authErr } = await supabase.auth.admin.createUser({
        email: generatedEmail,
        password: tempPassword,
        email_confirm: true,
        user_metadata: { full_name: expertName, role: 'expert' },
      })

      if (authErr && !authErr.message.includes('already registered')) {
        return respond({ error: `Auth error: ${authErr.message}` }, 500)
      }

      // Créer ou mettre à jour dans la table experts
      const { error: expertErr } = await supabase
        .from('experts')
        .upsert({
          id: authUser?.user?.id,
          email: generatedEmail,
          name: expertName,
          phone: app.phone ?? '',
          specialty: app.specialty ?? app.profession ?? '',
          status: 'approved',
        })

      // Mettre à jour le statut dans le KV store
      await supabase
        .from(KV_TABLE)
        .update({ value: JSON.stringify({ ...app, status: 'approved', generatedEmail, approvedAt: new Date().toISOString() }) })
        .eq('key', `application:${expert_id}`)

      // Mettre à jour la liste applications:approved
      const { data: approvedList } = await supabase
        .from(KV_TABLE).select('value').eq('key', 'applications:approved').maybeSingle()
      const currentApproved: string[] = approvedList
        ? (typeof approvedList.value === 'string' ? JSON.parse(approvedList.value) : approvedList.value)
        : []
      if (!currentApproved.includes(expert_id)) {
        await supabase.from(KV_TABLE).upsert({
          key: 'applications:approved',
          value: JSON.stringify([...currentApproved, expert_id])
        })
      }

      // Retirer de applications:pending
      const { data: pendingList } = await supabase
        .from(KV_TABLE).select('value').eq('key', 'applications:pending').maybeSingle()
      if (pendingList) {
        const pending: string[] = typeof pendingList.value === 'string'
          ? JSON.parse(pendingList.value) : pendingList.value
        await supabase.from(KV_TABLE).update({
          value: JSON.stringify(pending.filter((id: string) => id !== expert_id))
        }).eq('key', 'applications:pending')
      }

      // Envoyer emails
      const html = approvalHtml(expertName, app.specialty ?? app.profession ?? 'santé mentale', generatedEmail, tempPassword)
      const emailSent1 = await sendEmail(generatedEmail, '✓ Votre compte MONA Africa expert est activé', html)
      let emailSent2 = false
      if (candidatureEmail && candidatureEmail !== generatedEmail) {
        emailSent2 = await sendEmail(candidatureEmail, '✓ Votre candidature MONA Africa approuvée', html)
      }

      return respond({
        success: true,
        expert_id,
        generated_email: generatedEmail,
        temp_password: tempPassword,
        email_sent: emailSent1 || emailSent2,
        message: (emailSent1 || emailSent2)
          ? 'Expert approuvé et email envoyé'
          : 'Expert approuvé — email non envoyé, identifiants disponibles ci-dessus',
      })
    }

    // ── REJET ─────────────────────────────────────────────────────────────────
    if (action === 'reject') {
      await supabase
        .from(KV_TABLE)
        .update({ value: JSON.stringify({ ...app, status: 'rejected', rejectedAt: new Date().toISOString(), rejectionReason: reason }) })
        .eq('key', `application:${expert_id}`)

      // Retirer de applications:pending
      const { data: pendingList } = await supabase
        .from(KV_TABLE).select('value').eq('key', 'applications:pending').maybeSingle()
      if (pendingList) {
        const pending: string[] = typeof pendingList.value === 'string'
          ? JSON.parse(pendingList.value) : pendingList.value
        await supabase.from(KV_TABLE).update({
          value: JSON.stringify(pending.filter((id: string) => id !== expert_id))
        }).eq('key', 'applications:pending')
      }

      const emailSent = candidatureEmail
        ? await sendEmail(candidatureEmail, 'Suite à votre candidature MONA Africa',
            rejectionHtml(expertName, reason))
        : false

      return respond({ success: true, expert_id, email_sent: emailSent, message: 'Expert rejeté' })
    }

  } catch (err) {
    console.error('approve-expert error:', err)
    return respond({ error: String(err) }, 500)
  }
})
