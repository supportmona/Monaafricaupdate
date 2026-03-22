import { Hono } from "npm:hono";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Set availability schedule
app.post("/schedule", async (c) => {
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

    const body = await c.req.json();
    const { schedule } = body; // schedule = { monday: [{start: "09:00", end: "17:00"}], ... }

    const key = `expert_availability:${expertId}`;
    await supabase.from("kv_store_6378cc81").upsert({
      key,
      value: {
        expertId,
        schedule,
        updatedAt: new Date().toISOString(),
      },
    });

    return c.json({ success: true, data: { schedule } });
  } catch (error) {
    console.error("Erreur définition disponibilité:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get availability schedule
app.get("/schedule", async (c) => {
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

    const key = `expert_availability:${expertId}`;
    const { data } = await supabase
      .from("kv_store_6378cc81")
      .select("value")
      .eq("key", key)
      .single();

    if (!data?.value) {
      // Return default schedule
      return c.json({
        success: true,
        data: {
          schedule: {
            monday: [{ start: "09:00", end: "17:00" }],
            tuesday: [{ start: "09:00", end: "17:00" }],
            wednesday: [{ start: "09:00", end: "17:00" }],
            thursday: [{ start: "09:00", end: "17:00" }],
            friday: [{ start: "09:00", end: "17:00" }],
            saturday: [],
            sunday: [],
          },
        },
      });
    }

    return c.json({ success: true, data: data.value });
  } catch (error) {
    console.error("Erreur récupération disponibilité:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Block time slot
app.post("/block", async (c) => {
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

    const body = await c.req.json();
    const { date, startTime, endTime, reason } = body;

    const blockId = crypto.randomUUID();
    const key = `availability_block:${blockId}`;

    await supabase.from("kv_store_6378cc81").insert({
      key,
      value: {
        id: blockId,
        expertId,
        date,
        startTime,
        endTime,
        reason: reason || "",
        createdAt: new Date().toISOString(),
      },
    });

    // Index by expert
    const expertBlocksKey = `expert_blocks:${expertId}`;
    const { data: existingBlocks } = await supabase
      .from("kv_store_6378cc81")
      .select("value")
      .eq("key", expertBlocksKey)
      .single();

    const blocksList = existingBlocks?.value || [];
    blocksList.push(blockId);

    await supabase.from("kv_store_6378cc81").upsert({
      key: expertBlocksKey,
      value: blocksList,
    });

    return c.json({ success: true, data: { blockId } });
  } catch (error) {
    console.error("Erreur blocage créneau:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get blocked slots
app.get("/blocks", async (c) => {
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

    const expertBlocksKey = `expert_blocks:${expertId}`;
    const { data: blocksList } = await supabase
      .from("kv_store_6378cc81")
      .select("value")
      .eq("key", expertBlocksKey)
      .single();

    const blockIds = blocksList?.value || [];

    if (blockIds.length === 0) {
      return c.json({ success: true, data: [] });
    }

    const keys = blockIds.map((id: string) => `availability_block:${id}`);
    const { data: blocks } = await supabase
      .from("kv_store_6378cc81")
      .select("value")
      .in("key", keys);

    const blockedSlots = blocks?.map((b) => b.value) || [];

    return c.json({ success: true, data: blockedSlots });
  } catch (error) {
    console.error("Erreur récupération blocages:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Unblock time slot
app.delete("/block/:blockId", async (c) => {
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

    const blockId = c.req.param("blockId");
    const key = `availability_block:${blockId}`;

    const { data: blockData } = await supabase
      .from("kv_store_6378cc81")
      .select("value")
      .eq("key", key)
      .single();

    if (!blockData?.value) {
      return c.json({ success: false, error: "Blocage non trouvé" }, 404);
    }

    if (blockData.value.expertId !== expertId) {
      return c.json({ success: false, error: "Accès non autorisé" }, 403);
    }

    // Delete block
    await supabase.from("kv_store_6378cc81").delete().eq("key", key);

    // Remove from expert's list
    const expertBlocksKey = `expert_blocks:${expertId}`;
    const { data: existingBlocks } = await supabase
      .from("kv_store_6378cc81")
      .select("value")
      .eq("key", expertBlocksKey)
      .single();

    if (existingBlocks?.value) {
      const updatedList = existingBlocks.value.filter((id: string) => id !== blockId);
      await supabase.from("kv_store_6378cc81").upsert({
        key: expertBlocksKey,
        value: updatedList,
      });
    }

    return c.json({ success: true });
  } catch (error) {
    console.error("Erreur déblocage créneau:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

export default app;
