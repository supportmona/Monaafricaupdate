import { Hono } from "npm:hono";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Get expert's patients list
app.get("/list", async (c) => {
  try {
    const expertToken = c.req.header("X-Expert-Token");
    if (!expertToken) {
      return c.json({ success: false, error: "Token expert manquant" }, 401);
    }

    const { data: expertData } = await supabase.auth.getUser(expertToken);
    if (!expertData?.user?.id) {
      return c.json({ success: false, error: "Expert non authentifié" }, 401);
    }
    const expertId = expertData.user.id;

    // Get all consultations for this expert
    const { data: consultations } = await supabase
      .from("kv_store_6378cc81")
      .select("key, value")
      .like("key", "consultation:%");

    // Filter consultations for this expert and extract unique patient IDs
    const patientIds = new Set<string>();
    consultations?.forEach((c) => {
      const consultation = c.value;
      if (consultation.expertId === expertId && consultation.memberId) {
        patientIds.add(consultation.memberId);
      }
    });

    // Get patient profiles
    const patients = [];
    for (const patientId of patientIds) {
      const { data: profileData } = await supabase
        .from("kv_store_6378cc81")
        .select("value")
        .eq("key", `member_profile:${patientId}`)
        .single();

      if (profileData?.value) {
        const profile = profileData.value;
        
        // Count consultations with this patient
        const patientConsultations = consultations?.filter(
          (c) => c.value.expertId === expertId && c.value.memberId === patientId
        ) || [];

        patients.push({
          id: patientId,
          name: profile.name || "Patient",
          email: profile.email || "",
          phone: profile.phone || "",
          dateOfBirth: profile.dateOfBirth || "",
          location: profile.location || "",
          consultationsCount: patientConsultations.length,
          lastConsultation: patientConsultations
            .sort((a, b) => new Date(b.value.date).getTime() - new Date(a.value.date).getTime())[0]
            ?.value?.date || null,
        });
      }
    }

    // Sort by last consultation date
    patients.sort((a, b) => {
      if (!a.lastConsultation) return 1;
      if (!b.lastConsultation) return -1;
      return new Date(b.lastConsultation).getTime() - new Date(a.lastConsultation).getTime();
    });

    return c.json({ success: true, data: patients });
  } catch (error) {
    console.error("Erreur récupération patients:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get patient details
app.get("/:patientId", async (c) => {
  try {
    const expertToken = c.req.header("X-Expert-Token");
    if (!expertToken) {
      return c.json({ success: false, error: "Token expert manquant" }, 401);
    }

    const { data: expertData } = await supabase.auth.getUser(expertToken);
    if (!expertData?.user?.id) {
      return c.json({ success: false, error: "Expert non authentifié" }, 401);
    }
    const expertId = expertData.user.id;

    const patientId = c.req.param("patientId");

    // Get patient profile
    const { data: profileData } = await supabase
      .from("kv_store_6378cc81")
      .select("value")
      .eq("key", `member_profile:${patientId}`)
      .single();

    if (!profileData?.value) {
      return c.json({ success: false, error: "Patient non trouvé" }, 404);
    }

    // Get consultations history
    const { data: consultations } = await supabase
      .from("kv_store_6378cc81")
      .select("key, value")
      .like("key", "consultation:%");

    const patientConsultations = consultations
      ?.filter((c) => c.value.expertId === expertId && c.value.memberId === patientId)
      .map((c) => c.value)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) || [];

    // Get consultation notes
    const notesKeys = patientConsultations.map((c) => `consultation_notes:${c.id}`);
    const { data: notesData } = await supabase
      .from("kv_store_6378cc81")
      .select("value")
      .in("key", notesKeys);

    const notesMap = new Map();
    notesData?.forEach((n) => {
      notesMap.set(n.value.consultationId, n.value);
    });

    const consultationsWithNotes = patientConsultations.map((c) => ({
      ...c,
      notes: notesMap.get(c.id) || null,
    }));

    return c.json({
      success: true,
      data: {
        profile: profileData.value,
        consultations: consultationsWithNotes,
      },
    });
  } catch (error) {
    console.error("Erreur récupération détails patient:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Add consultation notes
app.post("/:patientId/consultations/:consultationId/notes", async (c) => {
  try {
    const expertToken = c.req.header("X-Expert-Token");
    if (!expertToken) {
      return c.json({ success: false, error: "Token expert manquant" }, 401);
    }

    const { data: expertData } = await supabase.auth.getUser(expertToken);
    if (!expertData?.user?.id) {
      return c.json({ success: false, error: "Expert non authentifié" }, 401);
    }
    const expertId = expertData.user.id;

    const consultationId = c.req.param("consultationId");
    const body = await c.req.json();
    const { notes, diagnosis, recommendations, nextSteps } = body;

    // Verify consultation belongs to this expert
    const { data: consultationData } = await supabase
      .from("kv_store_6378cc81")
      .select("value")
      .eq("key", `consultation:${consultationId}`)
      .single();

    if (!consultationData?.value) {
      return c.json({ success: false, error: "Consultation non trouvée" }, 404);
    }

    if (consultationData.value.expertId !== expertId) {
      return c.json({ success: false, error: "Accès non autorisé" }, 403);
    }

    const key = `consultation_notes:${consultationId}`;
    const notesData = {
      consultationId,
      expertId,
      patientId: consultationData.value.memberId,
      notes: notes || "",
      diagnosis: diagnosis || "",
      recommendations: recommendations || "",
      nextSteps: nextSteps || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await supabase.from("kv_store_6378cc81").upsert({
      key,
      value: notesData,
    });

    return c.json({ success: true, data: notesData });
  } catch (error) {
    console.error("Erreur ajout notes consultation:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get consultation notes
app.get("/consultations/:consultationId/notes", async (c) => {
  try {
    const expertToken = c.req.header("X-Expert-Token");
    if (!expertToken) {
      return c.json({ success: false, error: "Token expert manquant" }, 401);
    }

    const { data: expertData } = await supabase.auth.getUser(expertToken);
    if (!expertData?.user?.id) {
      return c.json({ success: false, error: "Expert non authentifié" }, 401);
    }
    const expertId = expertData.user.id;

    const consultationId = c.req.param("consultationId");

    // Verify consultation belongs to this expert
    const { data: consultationData } = await supabase
      .from("kv_store_6378cc81")
      .select("value")
      .eq("key", `consultation:${consultationId}`)
      .single();

    if (!consultationData?.value) {
      return c.json({ success: false, error: "Consultation non trouvée" }, 404);
    }

    if (consultationData.value.expertId !== expertId) {
      return c.json({ success: false, error: "Accès non autorisé" }, 403);
    }

    const key = `consultation_notes:${consultationId}`;
    const { data: notesData } = await supabase
      .from("kv_store_6378cc81")
      .select("value")
      .eq("key", key)
      .single();

    return c.json({
      success: true,
      data: notesData?.value || null,
    });
  } catch (error) {
    console.error("Erreur récupération notes:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

export default app;
