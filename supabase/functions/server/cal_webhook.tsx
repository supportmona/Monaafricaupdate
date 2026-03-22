import { Hono } from "npm:hono@4";
import * as appointments from "./appointments.tsx";

const app = new Hono();

/**
 * Webhook Cal.com pour capturer les réservations
 * POST /make-server-6378cc81/webhooks/cal
 * 
 * Cal.com envoie des webhooks pour les événements suivants:
 * - BOOKING_CREATED
 * - BOOKING_RESCHEDULED
 * - BOOKING_CANCELLED
 */
app.post("/cal", async (c) => {
  try {
    const body = await c.req.json();
    console.log("📅 Webhook Cal.com reçu:", body);

    const { triggerEvent, payload } = body;

    if (triggerEvent === "BOOKING_CREATED") {
      const {
        uid,
        title,
        startTime,
        endTime,
        attendees,
        organizer,
        responses,
        metadata
      } = payload;

      // Extraire les informations du premier participant
      const attendee = attendees?.[0];
      if (!attendee) {
        console.error("❌ Aucun participant trouvé");
        return c.json({ received: true });
      }

      // Extraire userId depuis les métadonnées ou les réponses
      const userId = metadata?.userId || responses?.userId || `guest_${Date.now()}`;
      const expertId = organizer?.id || "expert_default";

      // Convertir la date ISO en format date/heure
      const bookingDate = new Date(startTime);
      const dateString = bookingDate.toISOString().split('T')[0];
      const timeString = bookingDate.toTimeString().split(' ')[0].slice(0, 5);

      // Calculer la durée en minutes
      const duration = Math.round((new Date(endTime).getTime() - new Date(startTime).getTime()) / (1000 * 60));

      // Créer le rendez-vous dans notre système
      const appointment = await appointments.createAppointment({
        memberId: userId,
        expertId: expertId,
        memberName: attendee.name || "Invité",
        memberEmail: attendee.email || "",
        memberPhone: attendee.phoneNumber || "",
        date: dateString,
        time: timeString,
        duration: duration,
        type: "online",
        status: "upcoming",
        reason: title || "Consultation",
        notes: `Réservé via Cal.com (ID: ${uid})`
      });

      if (appointment.error) {
        console.error("❌ Erreur création rendez-vous:", appointment.error);
        return c.json({ error: appointment.error }, 500);
      }

      console.log("✅ Rendez-vous créé depuis Cal.com:", appointment.data?.id);
      return c.json({ 
        received: true, 
        appointmentId: appointment.data?.id 
      });
    }

    if (triggerEvent === "BOOKING_CANCELLED") {
      // TODO: Mettre à jour le statut du rendez-vous
      console.log("❌ Réservation annulée:", payload.uid);
      return c.json({ received: true });
    }

    if (triggerEvent === "BOOKING_RESCHEDULED") {
      // TODO: Mettre à jour la date/heure du rendez-vous
      console.log("🔄 Réservation reprogrammée:", payload.uid);
      return c.json({ received: true });
    }

    // Événement non géré
    console.log("⚠️ Événement Cal.com non géré:", triggerEvent);
    return c.json({ received: true });

  } catch (error) {
    console.error("❌ Erreur webhook Cal.com:", error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Route de test pour simuler une réservation Cal.com
 * POST /make-server-6378cc81/webhooks/cal/test
 */
app.post("/cal/test", async (c) => {
  try {
    const body = await c.req.json();
    const { userId, expertId, date, time, duration, name, email, phone } = body;

    console.log("🧪 Test création rendez-vous Cal.com");

    const appointment = await appointments.createAppointment({
      memberId: userId,
      expertId: expertId || "expert_default",
      memberName: name || "Test User",
      memberEmail: email || "test@example.com",
      memberPhone: phone || "",
      date: date || new Date().toISOString().split('T')[0],
      time: time || "14:00",
      duration: duration || 60,
      type: "online",
      status: "upcoming",
      reason: "Test consultation",
      notes: "Créé manuellement pour test"
    });

    if (appointment.error) {
      return c.json({ error: appointment.error }, 500);
    }

    console.log("✅ Rendez-vous test créé:", appointment.data?.id);
    return c.json({ 
      success: true, 
      appointment: appointment.data 
    });

  } catch (error) {
    console.error("❌ Erreur test Cal.com:", error);
    return c.json({ error: error.message }, 500);
  }
});

export default app;
