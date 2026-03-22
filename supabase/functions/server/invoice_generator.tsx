import { Hono } from "npm:hono";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Generate invoice PDF (returns HTML that can be converted to PDF)
app.get("/:transactionId", async (c) => {
  try {
    const token = c.req.header("X-User-Token");
    if (!token) {
      return c.json({ success: false, error: "Token manquant" }, 401);
    }

    const { data: userData } = await supabase.auth.getUser(token);
    if (!userData?.user?.id) {
      return c.json({ success: false, error: "Non authentifié" }, 401);
    }
    const userId = userData.user.id;

    const transactionId = c.req.param("transactionId");

    // Get transaction
    const { data: txData } = await supabase
      .from("kv_store_6378cc81")
      .select("value")
      .eq("key", `transaction:${transactionId}`)
      .single();

    if (!txData?.value) {
      return c.json({ success: false, error: "Transaction non trouvée" }, 404);
    }

    const transaction = txData.value;

    // Verify ownership
    if (transaction.userId !== userId) {
      return c.json({ success: false, error: "Accès non autorisé" }, 403);
    }

    // Get user profile
    const { data: profileData } = await supabase
      .from("kv_store_6378cc81")
      .select("value")
      .eq("key", `member_profile:${userId}`)
      .single();

    const profile = profileData?.value || {};

    // Generate invoice number
    const invoiceNumber = `INV-MONA-${new Date(transaction.createdAt).getFullYear()}-${transactionId.substring(0, 8).toUpperCase()}`;

    // Generate HTML invoice
    const html = generateInvoiceHTML({
      invoiceNumber,
      transaction,
      profile,
    });

    // In production, you would use a library like puppeteer or wkhtmltopdf
    // For now, return HTML that can be printed as PDF
    return c.html(html);
  } catch (error) {
    console.error("Erreur génération facture:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get invoice as JSON
app.get("/:transactionId/data", async (c) => {
  try {
    const token = c.req.header("X-User-Token");
    if (!token) {
      return c.json({ success: false, error: "Token manquant" }, 401);
    }

    const { data: userData } = await supabase.auth.getUser(token);
    if (!userData?.user?.id) {
      return c.json({ success: false, error: "Non authentifié" }, 401);
    }
    const userId = userData.user.id;

    const transactionId = c.req.param("transactionId");

    // Get transaction
    const { data: txData } = await supabase
      .from("kv_store_6378cc81")
      .select("value")
      .eq("key", `transaction:${transactionId}`)
      .single();

    if (!txData?.value) {
      return c.json({ success: false, error: "Transaction non trouvée" }, 404);
    }

    const transaction = txData.value;

    if (transaction.userId !== userId) {
      return c.json({ success: false, error: "Accès non autorisé" }, 403);
    }

    const { data: profileData } = await supabase
      .from("kv_store_6378cc81")
      .select("value")
      .eq("key", `member_profile:${userId}`)
      .single();

    const profile = profileData?.value || {};

    const invoiceNumber = `INV-MONA-${new Date(transaction.createdAt).getFullYear()}-${transactionId.substring(0, 8).toUpperCase()}`;

    return c.json({
      success: true,
      data: {
        invoiceNumber,
        transaction,
        profile,
        company: {
          name: "M.O.N.A",
          fullName: "Mieux-être, Optimisation & Neuro-Apaisement",
          address: "Kinshasa, RDC | Dakar, Sénégal | Abidjan, Côte d'Ivoire",
          email: "contact@monafrica.net",
          phone: "+243 XXX XXX XXX",
        },
      },
    });
  } catch (error) {
    console.error("Erreur données facture:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Helper function to generate invoice HTML
function generateInvoiceHTML(data: any) {
  const { invoiceNumber, transaction, profile } = data;
  const date = new Date(transaction.createdAt).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Facture ${invoiceNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      color: #1A1A1A;
      background: #F5F1ED;
      padding: 40px 20px;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 60px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 60px;
      padding-bottom: 30px;
      border-bottom: 3px solid #A68B6F;
    }
    .logo { font-size: 36px; font-weight: 700; color: #1A1A1A; }
    .logo-subtitle { font-size: 12px; color: #1A1A1A80; margin-top: 4px; }
    .invoice-info { text-align: right; }
    .invoice-number {
      font-size: 14px;
      font-weight: 700;
      color: #A68B6F;
      margin-bottom: 4px;
    }
    .invoice-date { font-size: 12px; color: #1A1A1A80; }
    .section {
      margin-bottom: 40px;
    }
    .section-title {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #1A1A1A80;
      margin-bottom: 12px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
    }
    .info-block p {
      font-size: 14px;
      margin-bottom: 4px;
    }
    .info-block strong {
      font-weight: 600;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th {
      background: #F5F1ED;
      padding: 12px;
      text-align: left;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #1A1A1A;
    }
    td {
      padding: 16px 12px;
      border-bottom: 1px solid #D4C5B9;
      font-size: 14px;
    }
    .total-section {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #D4C5B9;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      font-size: 14px;
    }
    .total-row.grand-total {
      font-size: 20px;
      font-weight: 700;
      color: #A68B6F;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 2px solid #D4C5B9;
    }
    .footer {
      margin-top: 60px;
      padding-top: 30px;
      border-top: 1px solid #D4C5B9;
      text-align: center;
      font-size: 12px;
      color: #1A1A1A80;
    }
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .status-completed {
      background: #10B98120;
      color: #10B981;
    }
    .status-pending {
      background: #F59E0B20;
      color: #F59E0B;
    }
    @media print {
      body { padding: 0; background: white; }
      .container { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <div class="logo">M.O.N.A</div>
        <div class="logo-subtitle">Mieux-être, Optimisation & Neuro-Apaisement</div>
      </div>
      <div class="invoice-info">
        <div class="invoice-number">FACTURE ${invoiceNumber}</div>
        <div class="invoice-date">${date}</div>
      </div>
    </div>

    <div class="section">
      <div class="info-grid">
        <div class="info-block">
          <div class="section-title">De</div>
          <p><strong>M.O.N.A</strong></p>
          <p>Kinshasa, RDC</p>
          <p>Dakar, Sénégal</p>
          <p>Abidjan, Côte d'Ivoire</p>
          <p>contact@monafrica.net</p>
        </div>
        <div class="info-block">
          <div class="section-title">À</div>
          <p><strong>${profile.name || "Client"}</strong></p>
          ${profile.email ? `<p>${profile.email}</p>` : ""}
          ${profile.phone ? `<p>${profile.phone}</p>` : ""}
          ${profile.location ? `<p>${profile.location}</p>` : ""}
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Détails</div>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Méthode</th>
            <th>Statut</th>
            <th style="text-align: right">Montant</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${transaction.description || "Abonnement M.O.N.A"}</td>
            <td>${getPaymentMethodLabel(transaction.method)}</td>
            <td>
              <span class="status-badge status-${transaction.status === "completed" ? "completed" : "pending"}">
                ${transaction.status === "completed" ? "Payé" : "En attente"}
              </span>
            </td>
            <td style="text-align: right">${formatAmount(transaction.amount, transaction.currency)}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="total-section">
      <div class="total-row">
        <span>Sous-total</span>
        <span>${formatAmount(transaction.amount, transaction.currency)}</span>
      </div>
      <div class="total-row grand-total">
        <span>Total</span>
        <span>${formatAmount(transaction.amount, transaction.currency)}</span>
      </div>
    </div>

    <div class="footer">
      <p>Merci pour votre confiance.</p>
      <p style="margin-top: 8px;">M.O.N.A - Excellence en santé mentale pour l'Afrique</p>
      <p style="margin-top: 8px;">contact@monafrica.net</p>
    </div>
  </div>
</body>
</html>
  `;
}

function getPaymentMethodLabel(method: string): string {
  const labels: any = {
    stripe_card: "Carte bancaire",
    wave_mobile_money: "Wave Mobile Money",
    orange_money: "Orange Money",
    wallet: "Portefeuille M.O.N.A",
  };
  return labels[method] || method;
}

function formatAmount(amount: number, currency: string): string {
  if (currency === "XOF") {
    return `${amount.toLocaleString("fr-FR")} XOF`;
  } else if (currency === "USD") {
    return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  }
  return `${amount} ${currency}`;
}

export default app;
