import { Hono } from "npm:hono@3";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// GET /entreprises/:id - Récupérer les détails d'une entreprise
app.get("/:id", async (c) => {
  try {
    const entrepriseId = c.req.param("id");
    console.log(`🏢 Récupération de l'entreprise ${entrepriseId}`);

    const entreprise = await kv.get(`entreprise:${entrepriseId}`);

    if (!entreprise) {
      return c.json(
        {
          success: false,
          error: "Entreprise non trouvée",
        },
        404
      );
    }

    return c.json({
      success: true,
      entreprise,
    });
  } catch (error: any) {
    console.error("❌ Erreur récupération entreprise:", error);
    return c.json(
      {
        success: false,
        error: error.message || "Erreur lors de la récupération de l'entreprise",
      },
      500
    );
  }
});

// GET /entreprises/:id/employees - Récupérer les collaborateurs
app.get("/:id/employees", async (c) => {
  try {
    const entrepriseId = c.req.param("id");
    console.log(`👥 Récupération des collaborateurs de l'entreprise ${entrepriseId}`);

    const employees = await kv.getByPrefix(`employee:${entrepriseId}:`);

    return c.json({
      success: true,
      employees: employees || [],
      total: employees?.length || 0,
    });
  } catch (error: any) {
    console.error("❌ Erreur récupération collaborateurs:", error);
    return c.json(
      {
        success: false,
        error: error.message || "Erreur lors de la récupération des collaborateurs",
      },
      500
    );
  }
});

// POST /entreprises/:id/employees/invite - Inviter un collaborateur
app.post("/:id/employees/invite", async (c) => {
  try {
    const entrepriseId = c.req.param("id");
    const body = await c.req.json();
    const { name, email, department, position } = body;

    console.log(`📧 Invitation collaborateur pour entreprise ${entrepriseId}:`, email);

    // Validation
    if (!name || !email || !department || !position) {
      return c.json(
        {
          success: false,
          error: "Champs requis manquants: name, email, department, position",
        },
        400
      );
    }

    // Créer l'ID de l'employé
    const employeeId = `emp_${Date.now()}`;

    const newEmployee = {
      id: employeeId,
      entrepriseId,
      name,
      email,
      department,
      position,
      status: "invited",
      invitedDate: new Date().toISOString().split("T")[0],
      consultations: 0,
      createdAt: new Date().toISOString(),
    };

    // Sauvegarder dans le KV store
    await kv.set(`employee:${entrepriseId}:${employeeId}`, newEmployee);

    // TODO: Envoyer email d'invitation au collaborateur

    console.log(`✅ Invitation envoyée à ${email}`);

    return c.json({
      success: true,
      employee: newEmployee,
    });
  } catch (error: any) {
    console.error("❌ Erreur invitation collaborateur:", error);
    return c.json(
      {
        success: false,
        error: error.message || "Erreur lors de l'invitation du collaborateur",
      },
      500
    );
  }
});

// GET /entreprises/:id/stats - Statistiques de l'entreprise
app.get("/:id/stats", async (c) => {
  try {
    const entrepriseId = c.req.param("id");
    console.log(`📊 Récupération des statistiques de l'entreprise ${entrepriseId}`);

    const employees = await kv.getByPrefix(`employee:${entrepriseId}:`);
    const consultations = await kv.getByPrefix(`consultation:entreprise:${entrepriseId}:`);

    const activeEmployees = employees?.filter((e: any) => e.status === "active") || [];
    const invitedEmployees = employees?.filter((e: any) => e.status === "invited") || [];

    // Calculer le score bien-être moyen
    const employeesWithScore = activeEmployees.filter((e: any) => e.wellbeingScore);
    const avgWellbeingScore = employeesWithScore.length
      ? employeesWithScore.reduce((sum: number, e: any) => sum + (e.wellbeingScore || 0), 0) / employeesWithScore.length
      : 0;

    // Compter les consultations ce mois
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const consultationsThisMonth = consultations?.filter((c: any) => {
      const consultDate = new Date(c.date);
      return consultDate >= firstDayOfMonth;
    }) || [];

    const stats = {
      totalEmployees: employees?.length || 0,
      activeUsers: activeEmployees.length,
      invitedUsers: invitedEmployees.length,
      consultationsThisMonth: consultationsThisMonth.length,
      avgWellbeingScore: parseFloat(avgWellbeingScore.toFixed(1)),
      creditsRemaining: 156, // TODO: Calculer depuis la vraie source
      alerts: 0, // TODO: Calculer les alertes bien-être
    };

    return c.json({
      success: true,
      stats,
    });
  } catch (error: any) {
    console.error("❌ Erreur récupération stats entreprise:", error);
    return c.json(
      {
        success: false,
        error: error.message || "Erreur lors de la récupération des statistiques",
      },
      500
    );
  }
});

// GET /entreprises/:id/analytics - Analytics détaillées par département
app.get("/:id/analytics", async (c) => {
  try {
    const entrepriseId = c.req.param("id");
    console.log(`📈 Récupération des analytics de l'entreprise ${entrepriseId}`);

    const employees = await kv.getByPrefix(`employee:${entrepriseId}:`);

    if (!employees || employees.length === 0) {
      return c.json({
        success: true,
        analytics: {
          byDepartment: [],
          trends: {},
        },
      });
    }

    // Grouper par département
    const departmentMap = new Map<string, any[]>();
    employees.forEach((emp: any) => {
      if (!departmentMap.has(emp.department)) {
        departmentMap.set(emp.department, []);
      }
      departmentMap.get(emp.department)!.push(emp);
    });

    // Calculer les stats par département
    const byDepartment = Array.from(departmentMap.entries()).map(([name, emps]) => {
      const activeUsers = emps.filter((e) => e.status === "active");
      const employeesWithScore = activeUsers.filter((e) => e.wellbeingScore);
      const avgScore = employeesWithScore.length
        ? employeesWithScore.reduce((sum, e) => sum + (e.wellbeingScore || 0), 0) / employeesWithScore.length
        : 0;

      return {
        name,
        employees: emps.length,
        activeUsers: activeUsers.length,
        score: parseFloat(avgScore.toFixed(1)),
        trend: "neutral", // TODO: Calculer la tendance réelle
      };
    });

    return c.json({
      success: true,
      analytics: {
        byDepartment,
        trends: {
          wellbeing: "up",
          consultations: "up",
          engagement: "neutral",
        },
      },
    });
  } catch (error: any) {
    console.error("❌ Erreur récupération analytics:", error);
    return c.json(
      {
        success: false,
        error: error.message || "Erreur lors de la récupération des analytics",
      },
      500
    );
  }
});

// GET /entreprises/:id/consultations - Historique des consultations
app.get("/:id/consultations", async (c) => {
  try {
    const entrepriseId = c.req.param("id");
    console.log(`📅 Récupération des consultations de l'entreprise ${entrepriseId}`);

    const consultations = await kv.getByPrefix(`consultation:entreprise:${entrepriseId}:`);

    // Anonymiser les données (masquer les identités)
    const anonymizedConsultations = consultations?.map((c: any) => ({
      id: c.id,
      date: c.date,
      duration: c.duration,
      department: c.department,
      expertSpecialty: c.expertSpecialty,
      status: c.status,
      // Ne pas inclure: employeeId, employeeName, notes, etc.
    })) || [];

    return c.json({
      success: true,
      consultations: anonymizedConsultations,
      total: anonymizedConsultations.length,
    });
  } catch (error: any) {
    console.error("❌ Erreur récupération consultations:", error);
    return c.json(
      {
        success: false,
        error: error.message || "Erreur lors de la récupération des consultations",
      },
      500
    );
  }
});

// GET /entreprises/:id/credits - Gestion des crédits consultations
app.get("/:id/credits", async (c) => {
  try {
    const entrepriseId = c.req.param("id");
    console.log(`💳 Récupération des crédits de l'entreprise ${entrepriseId}`);

    const entreprise = await kv.get(`entreprise:${entrepriseId}`);

    if (!entreprise) {
      return c.json(
        {
          success: false,
          error: "Entreprise non trouvée",
        },
        404
      );
    }

    const credits = {
      total: entreprise.creditsTotal || 200,
      used: entreprise.creditsUsed || 44,
      remaining: (entreprise.creditsTotal || 200) - (entreprise.creditsUsed || 44),
      expirationDate: entreprise.creditsExpiration || "2025-12-31",
    };

    return c.json({
      success: true,
      credits,
    });
  } catch (error: any) {
    console.error("❌ Erreur récupération crédits:", error);
    return c.json(
      {
        success: false,
        error: error.message || "Erreur lors de la récupération des crédits",
      },
      500
    );
  }
});

// POST /entreprises/:id/credits/purchase - Acheter des crédits
app.post("/:id/credits/purchase", async (c) => {
  try {
    const entrepriseId = c.req.param("id");
    const { amount, paymentMethod } = await c.req.json();

    console.log(`💰 Achat de crédits pour entreprise ${entrepriseId}:`, amount);

    if (!amount || amount <= 0) {
      return c.json(
        {
          success: false,
          error: "Montant invalide",
        },
        400
      );
    }

    const entreprise = await kv.get(`entreprise:${entrepriseId}`);

    if (!entreprise) {
      return c.json(
        {
          success: false,
          error: "Entreprise non trouvée",
        },
        404
      );
    }

    // Mettre à jour les crédits
    const updatedEntreprise = {
      ...entreprise,
      creditsTotal: (entreprise.creditsTotal || 0) + amount,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`entreprise:${entrepriseId}`, updatedEntreprise);

    // Créer une transaction
    const transactionId = `txn_${Date.now()}`;
    const transaction = {
      id: transactionId,
      entrepriseId,
      type: "credit_purchase",
      amount,
      paymentMethod: paymentMethod || "card",
      status: "completed",
      createdAt: new Date().toISOString(),
    };

    await kv.set(`transaction:${transactionId}`, transaction);

    console.log(`✅ ${amount} crédits ajoutés à l'entreprise ${entrepriseId}`);

    return c.json({
      success: true,
      credits: {
        total: updatedEntreprise.creditsTotal,
        remaining: updatedEntreprise.creditsTotal - (entreprise.creditsUsed || 0),
      },
      transaction,
    });
  } catch (error: any) {
    console.error("❌ Erreur achat crédits:", error);
    return c.json(
      {
        success: false,
        error: error.message || "Erreur lors de l'achat de crédits",
      },
      500
    );
  }
});

// GET /entreprises/:id/alerts - Signaux d'alerte bien-être
app.get("/:id/alerts", async (c) => {
  try {
    const entrepriseId = c.req.param("id");
    console.log(`🚨 Récupération des alertes de l'entreprise ${entrepriseId}`);

    const employees = await kv.getByPrefix(`employee:${entrepriseId}:`);

    // Détecter les collaborateurs avec un score bien-être bas
    const lowScoreThreshold = 6.0;
    const alerts = employees
      ?.filter((e: any) => e.wellbeingScore && e.wellbeingScore < lowScoreThreshold)
      .map((e: any) => ({
        department: e.department,
        severity: e.wellbeingScore < 5 ? "high" : "medium",
        message: `Département ${e.department} : score bien-être en baisse`,
        date: new Date().toISOString().split("T")[0],
      })) || [];

    return c.json({
      success: true,
      alerts,
      total: alerts.length,
    });
  } catch (error: any) {
    console.error("❌ Erreur récupération alertes:", error);
    return c.json(
      {
        success: false,
        error: error.message || "Erreur lors de la récupération des alertes",
      },
      500
    );
  }
});

// PUT /entreprises/:id - Mettre à jour le profil entreprise
app.put("/:id", async (c) => {
  try {
    const entrepriseId = c.req.param("id");
    const updates = await c.req.json();

    console.log(`✏️ Mise à jour de l'entreprise ${entrepriseId}`);

    const entreprise = await kv.get(`entreprise:${entrepriseId}`);

    if (!entreprise) {
      return c.json(
        {
          success: false,
          error: "Entreprise non trouvée",
        },
        404
      );
    }

    const updatedEntreprise = {
      ...entreprise,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`entreprise:${entrepriseId}`, updatedEntreprise);

    console.log(`✅ Entreprise ${entrepriseId} mise à jour`);

    return c.json({
      success: true,
      entreprise: updatedEntreprise,
    });
  } catch (error: any) {
    console.error("❌ Erreur mise à jour entreprise:", error);
    return c.json(
      {
        success: false,
        error: error.message || "Erreur lors de la mise à jour de l'entreprise",
      },
      500
    );
  }
});

export default app;
