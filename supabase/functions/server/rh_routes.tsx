import { Hono } from "npm:hono@3";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// GET /rh/team - Récupérer tous les membres de l'équipe M.O.N.A
app.get("/team", async (c) => {
  try {
    console.log("📋 Récupération de l'équipe M.O.N.A");

    // Récupérer tous les membres de l'équipe depuis le KV store
    const teamMembers = await kv.getByPrefix("team_member:");

    if (!teamMembers || teamMembers.length === 0) {
      return c.json({
        success: true,
        team: [],
        total: 0,
      });
    }

    return c.json({
      success: true,
      team: teamMembers,
      total: teamMembers.length,
    });
  } catch (error: any) {
    console.error("❌ Erreur récupération équipe:", error);
    return c.json(
      {
        success: false,
        error: error.message || "Erreur lors de la récupération de l'équipe",
      },
      500
    );
  }
});

// GET /rh/team/:id - Détails d'un membre
app.get("/team/:id", async (c) => {
  try {
    const memberId = c.req.param("id");
    console.log(`📋 Récupération du membre ${memberId}`);

    const member = await kv.get(`team_member:${memberId}`);

    if (!member) {
      return c.json(
        {
          success: false,
          error: "Membre non trouvé",
        },
        404
      );
    }

    return c.json({
      success: true,
      member,
    });
  } catch (error: any) {
    console.error("❌ Erreur récupération membre:", error);
    return c.json(
      {
        success: false,
        error: error.message || "Erreur lors de la récupération du membre",
      },
      500
    );
  }
});

// POST /rh/team - Ajouter un nouveau membre à l'équipe
app.post("/team", async (c) => {
  try {
    const body = await c.req.json();
    const { name, email, role, department, location, phone, salary } = body;

    console.log("➕ Ajout d'un nouveau membre:", name);

    // Validation
    if (!name || !email || !role || !department) {
      return c.json(
        {
          success: false,
          error: "Champs requis manquants: name, email, role, department",
        },
        400
      );
    }

    // Créer l'ID du membre
    const memberId = `member_${Date.now()}`;

    const newMember = {
      id: memberId,
      name,
      email,
      role,
      department,
      location: location || "Kinshasa",
      phone: phone || "",
      salary: salary || 0,
      status: "active",
      joinDate: new Date().toISOString().split("T")[0],
      performance: 0,
      createdAt: new Date().toISOString(),
    };

    // Sauvegarder dans le KV store
    await kv.set(`team_member:${memberId}`, newMember);

    console.log(`✅ Membre ${name} ajouté avec succès`);

    return c.json({
      success: true,
      member: newMember,
    });
  } catch (error: any) {
    console.error("❌ Erreur ajout membre:", error);
    return c.json(
      {
        success: false,
        error: error.message || "Erreur lors de l'ajout du membre",
      },
      500
    );
  }
});

// PUT /rh/team/:id - Mettre à jour un membre
app.put("/team/:id", async (c) => {
  try {
    const memberId = c.req.param("id");
    const updates = await c.req.json();

    console.log(`✏️ Mise à jour du membre ${memberId}`);

    const existingMember = await kv.get(`team_member:${memberId}`);

    if (!existingMember) {
      return c.json(
        {
          success: false,
          error: "Membre non trouvé",
        },
        404
      );
    }

    const updatedMember = {
      ...existingMember,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`team_member:${memberId}`, updatedMember);

    console.log(`✅ Membre ${memberId} mis à jour`);

    return c.json({
      success: true,
      member: updatedMember,
    });
  } catch (error: any) {
    console.error("❌ Erreur mise à jour membre:", error);
    return c.json(
      {
        success: false,
        error: error.message || "Erreur lors de la mise à jour du membre",
      },
      500
    );
  }
});

// GET /rh/experts - Récupérer tous les experts pour validation
app.get("/experts", async (c) => {
  try {
    console.log("👨‍⚕️ Récupération des experts pour validation RH");

    const experts = await kv.getByPrefix("expert:");

    if (!experts || experts.length === 0) {
      return c.json({
        success: true,
        experts: [],
        total: 0,
      });
    }

    return c.json({
      success: true,
      experts,
      total: experts.length,
    });
  } catch (error: any) {
    console.error("❌ Erreur récupération experts:", error);
    return c.json(
      {
        success: false,
        error: error.message || "Erreur lors de la récupération des experts",
      },
      500
    );
  }
});

// PUT /rh/experts/:id/validate - Valider un expert
app.put("/experts/:id/validate", async (c) => {
  try {
    const expertId = c.req.param("id");
    console.log(`✅ Validation de l'expert ${expertId}`);

    const expert = await kv.get(`expert:${expertId}`);

    if (!expert) {
      return c.json(
        {
          success: false,
          error: "Expert non trouvé",
        },
        404
      );
    }

    const updatedExpert = {
      ...expert,
      status: "approved",
      validatedDate: new Date().toISOString().split("T")[0],
      validatedBy: "rh",
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`expert:${expertId}`, updatedExpert);

    console.log(`✅ Expert ${expertId} validé`);

    // TODO: Envoyer email de confirmation à l'expert

    return c.json({
      success: true,
      expert: updatedExpert,
    });
  } catch (error: any) {
    console.error("❌ Erreur validation expert:", error);
    return c.json(
      {
        success: false,
        error: error.message || "Erreur lors de la validation de l'expert",
      },
      500
    );
  }
});

// PUT /rh/experts/:id/reject - Rejeter un expert
app.put("/experts/:id/reject", async (c) => {
  try {
    const expertId = c.req.param("id");
    const { reason } = await c.req.json();

    console.log(`❌ Rejet de l'expert ${expertId}`);

    const expert = await kv.get(`expert:${expertId}`);

    if (!expert) {
      return c.json(
        {
          success: false,
          error: "Expert non trouvé",
        },
        404
      );
    }

    const updatedExpert = {
      ...expert,
      status: "rejected",
      rejectionReason: reason || "Non spécifié",
      rejectedBy: "rh",
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`expert:${expertId}`, updatedExpert);

    console.log(`❌ Expert ${expertId} rejeté`);

    // TODO: Envoyer email de notification à l'expert

    return c.json({
      success: true,
      expert: updatedExpert,
    });
  } catch (error: any) {
    console.error("❌ Erreur rejet expert:", error);
    return c.json(
      {
        success: false,
        error: error.message || "Erreur lors du rejet de l'expert",
      },
      500
    );
  }
});

// GET /rh/stats - Statistiques RH
app.get("/stats", async (c) => {
  try {
    console.log("📊 Récupération des statistiques RH");

    const teamMembers = await kv.getByPrefix("team_member:");
    const experts = await kv.getByPrefix("expert:");

    const stats = {
      team: {
        total: teamMembers?.length || 0,
        active: teamMembers?.filter((m: any) => m.status === "active").length || 0,
        onLeave: teamMembers?.filter((m: any) => m.status === "on_leave").length || 0,
        avgPerformance: teamMembers?.length
          ? teamMembers.reduce((sum: number, m: any) => sum + (m.performance || 0), 0) / teamMembers.length
          : 0,
      },
      experts: {
        total: experts?.length || 0,
        pending: experts?.filter((e: any) => e.status === "pending_validation" || e.status === "pending_documents").length || 0,
        approved: experts?.filter((e: any) => e.status === "approved").length || 0,
        rejected: experts?.filter((e: any) => e.status === "rejected").length || 0,
      },
    };

    return c.json({
      success: true,
      stats,
    });
  } catch (error: any) {
    console.error("❌ Erreur récupération stats RH:", error);
    return c.json(
      {
        success: false,
        error: error.message || "Erreur lors de la récupération des statistiques",
      },
      500
    );
  }
});

// GET /rh/tasks - Tâches RH prioritaires
app.get("/tasks", async (c) => {
  try {
    console.log("📝 Récupération des tâches RH");

    const tasks = await kv.getByPrefix("rh_task:");

    return c.json({
      success: true,
      tasks: tasks || [],
    });
  } catch (error: any) {
    console.error("❌ Erreur récupération tâches:", error);
    return c.json(
      {
        success: false,
        error: error.message || "Erreur lors de la récupération des tâches",
      },
      500
    );
  }
});

// POST /rh/tasks - Créer une nouvelle tâche RH
app.post("/tasks", async (c) => {
  try {
    const body = await c.req.json();
    const { title, priority, dueDate, assignedTo } = body;

    console.log("➕ Création d'une nouvelle tâche RH:", title);

    const taskId = `task_${Date.now()}`;

    const newTask = {
      id: taskId,
      title,
      priority: priority || "medium",
      dueDate,
      assignedTo,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    await kv.set(`rh_task:${taskId}`, newTask);

    console.log(`✅ Tâche ${title} créée`);

    return c.json({
      success: true,
      task: newTask,
    });
  } catch (error: any) {
    console.error("❌ Erreur création tâche:", error);
    return c.json(
      {
        success: false,
        error: error.message || "Erreur lors de la création de la tâche",
      },
      500
    );
  }
});

export default app;
