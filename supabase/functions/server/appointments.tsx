import * as kv from "./kv_store.tsx";

export interface Appointment {
  id: string;
  expertId: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  memberPhone?: string;
  date: string;
  duration: number;
  type: "online" | "in-person";
  status: "upcoming" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  reason?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Créer un nouveau rendez-vous
 */
export async function createAppointment(appointmentData: Omit<Appointment, "id" | "createdAt" | "updatedAt">): Promise<{ data?: Appointment; error?: string }> {
  try {
    const appointment: Appointment = {
      ...appointmentData,
      id: `apt_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const key = `appointment_${appointment.id}`;
    await kv.set(key, appointment);

    // Ajouter à la liste des rendez-vous de l'expert
    const expertAppointmentsKey = `expert_appointments_${appointmentData.expertId}`;
    const expertAppointments = (await kv.get(expertAppointmentsKey)) || [];
    expertAppointments.push(appointment.id);
    await kv.set(expertAppointmentsKey, expertAppointments);

    // Ajouter à la liste des rendez-vous de l'utilisateur
    const userAppointmentsKey = `user_appointments_${appointmentData.memberId}`;
    const userAppointments = (await kv.get(userAppointmentsKey)) || [];
    userAppointments.push(appointment.id);
    await kv.set(userAppointmentsKey, userAppointments);

    return { data: appointment };
  } catch (error) {
    console.error("Erreur création rendez-vous:", error);
    return { error: error.message };
  }
}

/**
 * Récupérer les rendez-vous d'un expert
 */
export async function getExpertAppointments(expertId: string): Promise<{ data?: Appointment[]; error?: string }> {
  try {
    const expertAppointmentsKey = `expert_appointments_${expertId}`;
    const appointmentIds = (await kv.get(expertAppointmentsKey)) || [];

    const appointments: Appointment[] = [];
    for (const id of appointmentIds) {
      const appointment = await kv.get(`appointment_${id}`);
      if (appointment) {
        appointments.push(appointment);
      }
    }

    // Trier par date
    appointments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return { data: appointments };
  } catch (error) {
    console.error("Erreur récupération rendez-vous:", error);
    return { error: error.message };
  }
}

/**
 * Récupérer les rendez-vous d'un utilisateur/membre
 */
export async function getUserAppointments(userId: string): Promise<{ data?: Appointment[]; error?: string }> {
  try {
    const userAppointmentsKey = `user_appointments_${userId}`;
    const appointmentIds = (await kv.get(userAppointmentsKey)) || [];

    const appointments: Appointment[] = [];
    for (const id of appointmentIds) {
      const appointment = await kv.get(`appointment_${id}`);
      if (appointment) {
        appointments.push(appointment);
      }
    }

    // Trier par date
    appointments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return { data: appointments };
  } catch (error) {
    console.error("Erreur récupération rendez-vous utilisateur:", error);
    return { error: error.message };
  }
}

/**
 * Mettre à jour le statut d'un rendez-vous
 */
export async function updateAppointmentStatus(
  appointmentId: string,
  status: Appointment["status"],
  notes?: string
): Promise<{ data?: Appointment; error?: string }> {
  try {
    const key = `appointment_${appointmentId}`;
    const appointment = await kv.get(key);

    if (!appointment) {
      return { error: "Rendez-vous introuvable" };
    }

    const updatedAppointment: Appointment = {
      ...appointment,
      status,
      notes: notes || appointment.notes,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(key, updatedAppointment);

    return { data: updatedAppointment };
  } catch (error) {
    console.error("Erreur mise à jour rendez-vous:", error);
    return { error: error.message };
  }
}

/**
 * Ajouter une disponibilité
 */
export async function addAvailability(expertId: string, availability: any): Promise<{ error?: string }> {
  try {
    const availabilityKey = `availability_${expertId}_${Date.now()}`;
    await kv.set(availabilityKey, {
      ...availability,
      expertId,
      createdAt: new Date().toISOString(),
    });

    return {};
  } catch (error) {
    console.error("Erreur ajout disponibilité:", error);
    return { error: error.message };
  }
}

/**
 * Récupérer les disponibilités d'un expert
 */
export async function getExpertAvailabilities(expertId: string): Promise<{ data?: any[]; error?: string }> {
  try {
    const prefix = `availability_${expertId}_`;
    const availabilities = await kv.getByPrefix(prefix);

    return { data: availabilities || [] };
  } catch (error) {
    console.error("Erreur récupération disponibilités:", error);
    return { error: error.message };
  }
}