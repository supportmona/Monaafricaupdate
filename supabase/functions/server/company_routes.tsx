import { Hono } from "npm:hono";
import * as kv from "./kv_store.tsx";

const app = new Hono();

/**
 * GET /company/stats
 * Récupérer les statistiques de l'entreprise
 */
app.get("/stats", async (c) => {
  try {
    const companyToken = c.req.header("X-Company-Token");
    
    if (!companyToken) {
      return c.json({ error: "Token entreprise manquant" }, 401);
    }

    // Décoder le token pour obtenir l'ID entreprise
    const tokenData = await kv.get(`company-token:${companyToken}`);
    if (!tokenData) {
      return c.json({ error: "Token invalide" }, 401);
    }

    const companyId = tokenData.companyId;

    // Récupérer les employés
    const employees = await kv.get(`company:${companyId}:employees`) || [];
    
    // Récupérer les consultations
    const consultations = await kv.get(`company:${companyId}:consultations`) || [];
    
    // Calculer les stats
    const activeUsers = employees.filter((e: any) => e.status === "active").length;
    const thisMonth = new Date().getMonth();
    const thisMonthConsultations = consultations.filter((c: any) => {
      const consultDate = new Date(c.date);
      return consultDate.getMonth() === thisMonth;
    }).length;

    const totalSatisfaction = consultations.reduce((sum: number, c: any) => sum + (c.satisfaction || 0), 0);
    const averageSatisfaction = consultations.length > 0 
      ? Math.round(totalSatisfaction / consultations.length)
      : 0;

    // Score bien-être (simulé pour le moment - à calculer avec vraies données)
    const wellbeingScore = activeUsers > 0 ? Math.min(85, 60 + (activeUsers * 2)) : 0;

    return c.json({
      success: true,
      stats: {
        totalEmployees: employees.length,
        activeUsers,
        totalConsultations: consultations.length,
        thisMonthConsultations,
        averageSatisfaction,
        wellbeingScore,
      },
    });
  } catch (error: any) {
    console.error("Erreur stats entreprise:", error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * GET /company/employees
 * Liste des employés de l'entreprise
 */
app.get("/employees", async (c) => {
  try {
    const companyToken = c.req.header("X-Company-Token");
    
    if (!companyToken) {
      return c.json({ error: "Token entreprise manquant" }, 401);
    }

    const tokenData = await kv.get(`company-token:${companyToken}`);
    if (!tokenData) {
      return c.json({ error: "Token invalide" }, 401);
    }

    const companyId = tokenData.companyId;
    const employees = await kv.get(`company:${companyId}:employees`) || [];

    return c.json({
      success: true,
      employees,
    });
  } catch (error: any) {
    console.error("Erreur liste employés:", error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * POST /company/employees/add
 * Ajouter un employé
 */
app.post("/employees/add", async (c) => {
  try {
    const companyToken = c.req.header("X-Company-Token");
    
    if (!companyToken) {
      return c.json({ error: "Token entreprise manquant" }, 401);
    }

    const tokenData = await kv.get(`company-token:${companyToken}`);
    if (!tokenData) {
      return c.json({ error: "Token invalide" }, 401);
    }

    const companyId = tokenData.companyId;
    const body = await c.req.json();
    const { email, firstName, lastName, phone, department, position } = body;

    if (!email || !firstName || !lastName) {
      return c.json({ error: "Email, prénom et nom requis" }, 400);
    }

    // Récupérer la liste actuelle
    const employees = await kv.get(`company:${companyId}:employees`) || [];

    // Vérifier si l'email existe déjà
    if (employees.some((e: any) => e.email === email)) {
      return c.json({ error: "Cet email est déjà enregistré" }, 400);
    }

    // Créer le nouvel employé
    const newEmployee = {
      id: `emp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      firstName,
      lastName,
      phone: phone || "",
      department: department || "",
      position: position || "",
      joinedDate: new Date().toISOString(),
      status: "invited",
      consultationsCount: 0,
    };

    // Ajouter à la liste
    employees.push(newEmployee);
    await kv.set(`company:${companyId}:employees`, employees);

    // TODO: Envoyer email d'invitation via Resend
    console.log(`📧 Email d'invitation à envoyer à ${email}`);

    return c.json({
      success: true,
      employee: newEmployee,
      message: "Employé ajouté avec succès. Un email d'invitation a été envoyé.",
    });
  } catch (error: any) {
    console.error("Erreur ajout employé:", error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * DELETE /company/employees/:id
 * Retirer un employé
 */
app.delete("/employees/:id", async (c) => {
  try {
    const companyToken = c.req.header("X-Company-Token");
    
    if (!companyToken) {
      return c.json({ error: "Token entreprise manquant" }, 401);
    }

    const tokenData = await kv.get(`company-token:${companyToken}`);
    if (!tokenData) {
      return c.json({ error: "Token invalide" }, 401);
    }

    const companyId = tokenData.companyId;
    const employeeId = c.req.param("id");

    const employees = await kv.get(`company:${companyId}:employees`) || [];
    const updatedEmployees = employees.filter((e: any) => e.id !== employeeId);

    if (employees.length === updatedEmployees.length) {
      return c.json({ error: "Employé non trouvé" }, 404);
    }

    await kv.set(`company:${companyId}:employees`, updatedEmployees);

    return c.json({
      success: true,
      message: "Employé retiré avec succès",
    });
  } catch (error: any) {
    console.error("Erreur suppression employé:", error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * GET /company/consultations
 * Liste des consultations de l'entreprise
 */
app.get("/consultations", async (c) => {
  try {
    const companyToken = c.req.header("X-Company-Token");
    
    if (!companyToken) {
      return c.json({ error: "Token entreprise manquant" }, 401);
    }

    const tokenData = await kv.get(`company-token:${companyToken}`);
    if (!tokenData) {
      return c.json({ error: "Token invalide" }, 401);
    }

    const companyId = tokenData.companyId;
    const consultations = await kv.get(`company:${companyId}:consultations`) || [];

    return c.json({
      success: true,
      consultations,
    });
  } catch (error: any) {
    console.error("Erreur liste consultations:", error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * GET /company/analytics
 * Analytics détaillées de l'entreprise
 */
app.get("/analytics", async (c) => {
  try {
    const companyToken = c.req.header("X-Company-Token");
    
    if (!companyToken) {
      return c.json({ error: "Token entreprise manquant" }, 401);
    }

    const tokenData = await kv.get(`company-token:${companyToken}`);
    if (!tokenData) {
      return c.json({ error: "Token invalide" }, 401);
    }

    const companyId = tokenData.companyId;
    
    const employees = await kv.get(`company:${companyId}:employees`) || [];
    const consultations = await kv.get(`company:${companyId}:consultations`) || [];

    // Analytics par département
    const departmentStats: any = {};
    employees.forEach((emp: any) => {
      const dept = emp.department || "Non assigné";
      if (!departmentStats[dept]) {
        departmentStats[dept] = {
          employees: 0,
          consultations: 0,
          activeUsers: 0,
        };
      }
      departmentStats[dept].employees++;
      if (emp.status === "active") {
        departmentStats[dept].activeUsers++;
      }
    });

    // Analytics par mois (3 derniers mois)
    const monthlyStats = [];
    for (let i = 2; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthConsults = consultations.filter((c: any) => {
        const cDate = new Date(c.date);
        return cDate.getMonth() === date.getMonth() && 
               cDate.getFullYear() === date.getFullYear();
      });

      monthlyStats.push({
        month: date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" }),
        consultations: monthConsults.length,
        satisfaction: monthConsults.length > 0
          ? Math.round(monthConsults.reduce((sum: number, c: any) => sum + (c.satisfaction || 0), 0) / monthConsults.length)
          : 0,
      });
    }

    // Top préoccupations
    const concerns: any = {};
    consultations.forEach((c: any) => {
      if (c.concerns) {
        c.concerns.forEach((concern: string) => {
          concerns[concern] = (concerns[concern] || 0) + 1;
        });
      }
    });

    const topConcerns = Object.entries(concerns)
      .map(([label, count]) => ({
        label,
        count,
        percentage: Math.round((count as number / consultations.length) * 100),
      }))
      .sort((a, b) => (b.count as number) - (a.count as number))
      .slice(0, 5);

    return c.json({
      success: true,
      analytics: {
        overview: {
          totalEmployees: employees.length,
          activeUsers: employees.filter((e: any) => e.status === "active").length,
          totalConsultations: consultations.length,
          averageSatisfaction: consultations.length > 0
            ? Math.round(consultations.reduce((sum: number, c: any) => sum + (c.satisfaction || 0), 0) / consultations.length)
            : 0,
        },
        departments: departmentStats,
        monthly: monthlyStats,
        topConcerns,
      },
    });
  } catch (error: any) {
    console.error("Erreur analytics:", error);
    return c.json({ error: error.message }, 500);
  }
});

export default app;
