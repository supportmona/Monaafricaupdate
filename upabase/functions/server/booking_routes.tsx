import { Hono } from 'npm:hono';
import { createClient } from "jsr:@supabase/supabase-js@2";

const bookingRoutes = new Hono();

const getSupabase = () => createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// ─── Helper : vérifier le token expert ────────────────────────────────────────
async function verifyExpertToken(authHeader: string | undefined) {
  if (!authHeader) return { error: "Token manquant" };
  const token = authHeader.split(" ")[1];
  if (!token) return { error: "Token invalide" };

  const supabase = getSupabase();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return { error: "Token expiré ou invalide" };
  return { user: data.user, token };
}

// ─── Helper : vérifier le token membre ───────────────────────────────────────
async function verifyMemberToken(authHeader: string | undefined) {
  if (!authHeader) return { error: "Token manquant" };
  const token = authHeader.split(" ")[1];
  if (!token) return { error: "Token invalide" };

  const supabase = getSupabase();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return { error: "Token expiré ou invalide" };
  return { user: data.user, token };
}

// ─── Helper : créer une room Daily.co ────────────────────────────────────────
async function createDailyRoom(bookingId: string, scheduledAt: string) {
  const dailyApiKey = Deno.env.get("DAILY_API_KEY");
  if (!dailyApiKey) {
    console.warn("⚠️ DAILY_API_KEY non configurée — room non créée");
    return { url: null, name: null };
  }

  const roomName = `mona-${bookingId.substring(0, 8)}`;
  const exp = Math.floor(new Date(scheduledAt).getTime() / 1000) + 7200; // expire 2h après le RDV

  try {
    const response = await fetch("https://api.daily.co/v1/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${dailyApiKey}`,
      },
      body: JSON.stringify({
        name: roomName,
        privacy: "private",
        properties: {
          exp,
          enable_chat: true,
          enable_screenshare: false,
          start_video_off: false,
          start_audio_off: false,
          max_participants: 2,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("❌ Daily.co erreur:", err);
      return { url: null, name: null };
    }

    const room = await response.json();
    console.log("✅ Daily.co room créée:", room.url);
    return { url: room.url, name: room.name };
  } catch (err) {
    console.error("❌ Daily.co exception:", err);
    return { url: null, name: null };
  }
}

// ════════════════════════════════════════════════════════
// EXPERT — Gérer ses disponibilités
// ════════════════════════════════════════════════════════

/**
 * GET /booking/expert/slots
 * L'expert récupère ses créneaux de disponibilité
 */
bookingRoutes.get("/expert/slots", async (c) => {
  const auth = await verifyExpertToken(c.req.header("Authorization"));
  if (auth.error) return c.json({ error: auth.error }, 401);

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("availability")
    .select("*")
    .eq("expert_id", auth.user.id)
    .order("day_of_week");

  if (error) return c.json({ error: error.message }, 500);
  return c.json({ success: true, data: data || [] });
});

/**
 * PUT /booking/expert/slots
 * L'expert met à jour ses créneaux (remplace tout)
 */
bookingRoutes.put("/expert/slots", async (c) => {
  const auth = await verifyExpertToken(c.req.header("Authorization"));
  if (auth.error) return c.json({ error: auth.error }, 401);

  const body = await c.req.json();
  const { slots } = body; // [{ day_of_week, start_time, end_time, is_available }]

  if (!slots || !Array.isArray(slots)) {
    return c.json({ error: "slots requis (tableau)" }, 400);
  }

  const supabase = getSupabase();

  // Supprimer les anciens créneaux
  await supabase.from("availability").delete().eq("expert_id", auth.user.id);

  // Insérer les nouveaux
  const toInsert = slots.map(s => ({
    expert_id: auth.user.id,
    day_of_week: s.day_of_week,
    start_time: s.start_time,
    end_time: s.end_time,
    is_available: s.is_available !== false,
  }));

  const { data, error } = await supabase
    .from("availability")
    .insert(toInsert)
    .select();

  if (error) return c.json({ error: error.message }, 500);

  console.log(`✅ Disponibilités mises à jour pour ${auth.user.id}`);
  return c.json({ success: true, data });
});

/**
 * GET /booking/expert/bookings
 * L'expert voit ses réservations
 */
bookingRoutes.get("/expert/bookings", async (c) => {
  const auth = await verifyExpertToken(c.req.header("Authorization"));
  if (auth.error) return c.json({ error: auth.error }, 401);

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      member:users!member_id(id, name, email, phone)
    `)
    .eq("expert_id", auth.user.id)
    .order("scheduled_at", { ascending: true });

  if (error) return c.json({ error: error.message }, 500);
  return c.json({ success: true, data: data || [] });
});

/**
 * PUT /booking/expert/bookings/:id/status
 * L'expert confirme ou annule un RDV
 */
bookingRoutes.put("/expert/bookings/:id/status", async (c) => {
  const auth = await verifyExpertToken(c.req.header("Authorization"));
  if (auth.error) return c.json({ error: auth.error }, 401);

  const bookingId = c.req.param("id");
  const { status } = await c.req.json(); // confirmed | cancelled

  if (!["confirmed", "cancelled", "completed"].includes(status)) {
    return c.json({ error: "Statut invalide" }, 400);
  }

  const supabase = getSupabase();

  // Vérifier que le booking appartient à cet expert
  const { data: booking, error: fetchError } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", bookingId)
    .eq("expert_id", auth.user.id)
    .single();

  if (fetchError || !booking) return c.json({ error: "Réservation introuvable" }, 404);

  // Si confirmation → créer la room Daily.co
  let dailyUrl = booking.daily_room_url;
  let dailyName = booking.daily_room_name;

  if (status === "confirmed" && !dailyUrl && booking.type === "video") {
    const room = await createDailyRoom(bookingId, booking.scheduled_at);
    dailyUrl = room.url;
    dailyName = room.name;
  }

  const { data, error } = await supabase
    .from("bookings")
    .update({
      status,
      daily_room_url: dailyUrl,
      daily_room_name: dailyName,
      updated_at: new Date().toISOString(),
    })
    .eq("id", bookingId)
    .select()
    .single();

  if (error) return c.json({ error: error.message }, 500);

  console.log(`✅ Booking ${bookingId} → ${status}`);
  return c.json({ success: true, data });
});

// ════════════════════════════════════════════════════════
// MEMBRE — Voir les créneaux et réserver
// ════════════════════════════════════════════════════════

/**
 * GET /booking/experts/:expertId/available-slots?date=2026-04-01
 * Le membre voit les créneaux libres d'un expert pour une date donnée
 */
bookingRoutes.get("/experts/:expertId/available-slots", async (c) => {
  const expertId = c.req.param("expertId");
  const dateStr = c.req.query("date"); // YYYY-MM-DD

  if (!dateStr) return c.json({ error: "date requis (YYYY-MM-DD)" }, 400);

  const date = new Date(dateStr);
  const dayOfWeek = date.getDay(); // 0=dim, 1=lun...

  const supabase = getSupabase();

  // Récupérer les disponibilités de ce jour
  const { data: availability, error: availError } = await supabase
    .from("availability")
    .select("*")
    .eq("expert_id", expertId)
    .eq("day_of_week", dayOfWeek)
    .eq("is_available", true);

  if (availError) return c.json({ error: availError.message }, 500);
  if (!availability || availability.length === 0) {
    return c.json({ success: true, data: [], message: "Aucun créneau ce jour" });
  }

  // Récupérer les réservations déjà prises ce jour
  const startOfDay = `${dateStr}T00:00:00Z`;
  const endOfDay = `${dateStr}T23:59:59Z`;

  const { data: existingBookings } = await supabase
    .from("bookings")
    .select("scheduled_at, duration_minutes")
    .eq("expert_id", expertId)
    .gte("scheduled_at", startOfDay)
    .lte("scheduled_at", endOfDay)
    .in("status", ["pending", "confirmed"]);

  // Générer les créneaux de 60 minutes dans les plages de disponibilité
  const slots: { time: string; available: boolean }[] = [];

  for (const avail of availability) {
    const [startH, startM] = avail.start_time.split(":").map(Number);
    const [endH, endM] = avail.end_time.split(":").map(Number);

    let currentH = startH;
    let currentM = startM;

    while (currentH * 60 + currentM + 60 <= endH * 60 + endM) {
      const timeStr = `${String(currentH).padStart(2, "0")}:${String(currentM).padStart(2, "0")}`;
      const slotStart = new Date(`${dateStr}T${timeStr}:00Z`);
      const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000);

      // Vérifier si ce créneau est déjà pris
      const isTaken = (existingBookings || []).some(booking => {
        const bStart = new Date(booking.scheduled_at);
        const bEnd = new Date(bStart.getTime() + (booking.duration_minutes || 60) * 60 * 1000);
        return slotStart < bEnd && slotEnd > bStart;
      });

      // Vérifier que le créneau est dans le futur
      const isInFuture = slotStart > new Date();

      slots.push({ time: timeStr, available: !isTaken && isInFuture });

      // Avancer d'une heure
      currentM += 60;
      if (currentM >= 60) {
        currentH += Math.floor(currentM / 60);
        currentM = currentM % 60;
      }
    }
  }

  return c.json({ success: true, data: slots });
});

/**
 * POST /booking/create
 * Le membre crée une réservation
 */
bookingRoutes.post("/create", async (c) => {
  const auth = await verifyMemberToken(c.req.header("Authorization"));
  if (auth.error) return c.json({ error: auth.error }, 401);

  const body = await c.req.json();
  const {
    expert_id,
    scheduled_at, // ISO string ex: "2026-04-01T09:00:00Z"
    duration_minutes = 60,
    type = "video",
    reason,
    price_xof,
    price_usd,
    currency = "XOF",
  } = body;

  if (!expert_id || !scheduled_at) {
    return c.json({ error: "expert_id et scheduled_at requis" }, 400);
  }

  const supabase = getSupabase();

  // Vérifier que l'expert existe
  const { data: expert } = await supabase
    .from("experts")
    .select("id, name, status")
    .eq("id", expert_id)
    .single();

  if (!expert || expert.status !== "approved") {
    return c.json({ error: "Expert non disponible" }, 400);
  }

  // Vérifier que le créneau est libre
  const slotStart = new Date(scheduled_at);
  const slotEnd = new Date(slotStart.getTime() + duration_minutes * 60 * 1000);

  const { data: conflict } = await supabase
    .from("bookings")
    .select("id")
    .eq("expert_id", expert_id)
    .in("status", ["pending", "confirmed"])
    .lt("scheduled_at", slotEnd.toISOString())
    .gt("scheduled_at", new Date(slotStart.getTime() - duration_minutes * 60 * 1000).toISOString());

  if (conflict && conflict.length > 0) {
    return c.json({ error: "Ce créneau est déjà pris" }, 409);
  }

  // Créer la réservation
  const { data: booking, error: insertError } = await supabase
    .from("bookings")
    .insert({
      member_id: auth.user.id,
      expert_id,
      scheduled_at,
      duration_minutes,
      status: "pending",
      type,
      reason,
      price_xof: price_xof || expert.hourly_rate_xof || null,
      price_usd: price_usd || expert.hourly_rate_usd || null,
      currency,
      payment_status: "unpaid",
    })
    .select()
    .single();

  if (insertError) return c.json({ error: insertError.message }, 500);

  console.log(`✅ Booking créé: ${booking.id} — ${auth.user.id} → ${expert_id}`);
  return c.json({ success: true, data: booking }, 201);
});

/**
 * GET /booking/member/bookings
 * Le membre voit ses réservations
 */
bookingRoutes.get("/member/bookings", async (c) => {
  const auth = await verifyMemberToken(c.req.header("Authorization"));
  if (auth.error) return c.json({ error: auth.error }, 401);

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      expert:experts!expert_id(id, name, email, specialty)
    `)
    .eq("member_id", auth.user.id)
    .order("scheduled_at", { ascending: true });

  if (error) return c.json({ error: error.message }, 500);
  return c.json({ success: true, data: data || [] });
});

/**
 * DELETE /booking/:id
 * Le membre annule un RDV (au moins 2h avant)
 */
bookingRoutes.delete("/:id", async (c) => {
  const auth = await verifyMemberToken(c.req.header("Authorization"));
  if (auth.error) return c.json({ error: auth.error }, 401);

  const bookingId = c.req.param("id");
  const supabase = getSupabase();

  const { data: booking } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", bookingId)
    .eq("member_id", auth.user.id)
    .single();

  if (!booking) return c.json({ error: "Réservation introuvable" }, 404);

  // Vérifier délai d'annulation (2h minimum)
  const scheduledAt = new Date(booking.scheduled_at);
  const now = new Date();
  const hoursUntil = (scheduledAt.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursUntil < 2) {
    return c.json({ error: "Impossible d'annuler moins de 2h avant le RDV" }, 400);
  }

  await supabase
    .from("bookings")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", bookingId);

  return c.json({ success: true, message: "Réservation annulée" });
});

/**
 * GET /booking/:id/room
 * Récupérer le lien Daily.co pour rejoindre la consultation
 */
bookingRoutes.get("/:id/room", async (c) => {
  const authHeader = c.req.header("Authorization");
  const supabase = getSupabase();

  // Accepte membre ou expert
  const { data: authData } = await supabase.auth.getUser(authHeader?.split(" ")[1] || "");
  if (!authData.user) return c.json({ error: "Non autorisé" }, 401);

  const bookingId = c.req.param("id");

  const { data: booking } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", bookingId)
    .single();

  if (!booking) return c.json({ error: "Réservation introuvable" }, 404);

  // Vérifier que l'utilisateur est membre ou expert du booking
  if (booking.member_id !== authData.user.id && booking.expert_id !== authData.user.id) {
    return c.json({ error: "Non autorisé" }, 403);
  }

  if (booking.status !== "confirmed") {
    return c.json({ error: "La réservation n'est pas encore confirmée" }, 400);
  }

  // Créer la room si elle n'existe pas encore
  let roomUrl = booking.daily_room_url;
  if (!roomUrl && booking.type === "video") {
    const room = await createDailyRoom(bookingId, booking.scheduled_at);
    roomUrl = room.url;

    await supabase
      .from("bookings")
      .update({
        daily_room_url: room.url,
        daily_room_name: room.name,
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookingId);
  }

  return c.json({
    success: true,
    data: {
      bookingId,
      roomUrl,
      scheduledAt: booking.scheduled_at,
      duration: booking.duration_minutes,
      role: booking.member_id === authData.user.id ? "member" : "expert",
    },
  });
});

export default bookingRoutes;
