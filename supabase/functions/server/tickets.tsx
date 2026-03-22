import * as kv from './kv_store.tsx';

/**
 * Types pour le système de tickets
 */
export interface Ticket {
  id: string;
  createdBy: string;
  createdByName: string;
  createdByRole: 'member' | 'expert' | 'b2b';
  category: 'technique' | 'facturation' | 'compte' | 'autre';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'ouvert' | 'en_cours' | 'resolu' | 'ferme';
  subject: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  messages: TicketMessage[];
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  authorId: string;
  authorName: string;
  authorRole: 'member' | 'expert' | 'admin' | 'b2b';
  content: string;
  timestamp: string;
  isStaffReply: boolean;
}

/**
 * Crée un nouveau ticket
 */
export async function createTicket(
  createdBy: string,
  createdByName: string,
  createdByRole: 'member' | 'expert' | 'b2b',
  category: 'technique' | 'facturation' | 'compte' | 'autre',
  subject: string,
  description: string,
  priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium'
): Promise<{ success: boolean; ticket?: Ticket; error?: string }> {
  try {
    const ticketId = `ticket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();
    
    const ticket: Ticket = {
      id: ticketId,
      createdBy,
      createdByName,
      createdByRole,
      category,
      priority,
      status: 'ouvert',
      subject,
      description,
      createdAt: timestamp,
      updatedAt: timestamp,
      messages: [],
    };
    
    // Sauvegarder le ticket
    await kv.set(`ticket:${ticketId}`, ticket);
    
    // Ajouter à la liste globale des tickets
    const allTicketsKey = 'tickets:all';
    const allTickets = await kv.get(allTicketsKey) || [];
    allTickets.unshift(ticketId); // Ajouter au début
    await kv.set(allTicketsKey, allTickets);
    
    // Ajouter à la liste des tickets de l'utilisateur
    const userTicketsKey = `user:${createdBy}:tickets`;
    const userTickets = await kv.get(userTicketsKey) || [];
    userTickets.unshift(ticketId);
    await kv.set(userTicketsKey, userTickets);
    
    return { success: true, ticket };
  } catch (error) {
    console.error('Erreur createTicket:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Ajoute un message à un ticket
 */
export async function addTicketMessage(
  ticketId: string,
  authorId: string,
  authorName: string,
  authorRole: 'member' | 'expert' | 'admin' | 'b2b',
  content: string,
  isStaffReply: boolean = false
): Promise<{ success: boolean; message?: TicketMessage; error?: string }> {
  try {
    const ticket = await kv.get(`ticket:${ticketId}`) as Ticket | null;
    
    if (!ticket) {
      return { success: false, error: 'Ticket non trouvé' };
    }
    
    const messageId = `ticketmsg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();
    
    const message: TicketMessage = {
      id: messageId,
      ticketId,
      authorId,
      authorName,
      authorRole,
      content,
      timestamp,
      isStaffReply,
    };
    
    // Ajouter le message au ticket
    ticket.messages.push(message);
    ticket.updatedAt = timestamp;
    
    // Si c'est une réponse du staff, passer en "en_cours"
    if (isStaffReply && ticket.status === 'ouvert') {
      ticket.status = 'en_cours';
    }
    
    await kv.set(`ticket:${ticketId}`, ticket);
    
    return { success: true, message };
  } catch (error) {
    console.error('Erreur addTicketMessage:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Met à jour le statut d'un ticket
 */
export async function updateTicketStatus(
  ticketId: string,
  status: 'ouvert' | 'en_cours' | 'resolu' | 'ferme',
  assignedTo?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const ticket = await kv.get(`ticket:${ticketId}`) as Ticket | null;
    
    if (!ticket) {
      return { success: false, error: 'Ticket non trouvé' };
    }
    
    ticket.status = status;
    ticket.updatedAt = new Date().toISOString();
    
    if (assignedTo !== undefined) {
      ticket.assignedTo = assignedTo;
    }
    
    await kv.set(`ticket:${ticketId}`, ticket);
    
    return { success: true };
  } catch (error) {
    console.error('Erreur updateTicketStatus:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Récupère tous les tickets
 */
export async function getAllTickets(): Promise<Ticket[]> {
  try {
    const allTicketsKey = 'tickets:all';
    const ticketIds = await kv.get(allTicketsKey) || [];
    
    const tickets: Ticket[] = [];
    for (const ticketId of ticketIds) {
      const ticket = await kv.get(`ticket:${ticketId}`) as Ticket | null;
      if (ticket) {
        tickets.push(ticket);
      }
    }
    
    return tickets;
  } catch (error) {
    console.error('Erreur getAllTickets:', error);
    return [];
  }
}

/**
 * Récupère les tickets d'un utilisateur
 */
export async function getUserTickets(userId: string): Promise<Ticket[]> {
  try {
    const userTicketsKey = `user:${userId}:tickets`;
    const ticketIds = await kv.get(userTicketsKey) || [];
    
    const tickets: Ticket[] = [];
    for (const ticketId of ticketIds) {
      const ticket = await kv.get(`ticket:${ticketId}`) as Ticket | null;
      if (ticket) {
        tickets.push(ticket);
      }
    }
    
    return tickets;
  } catch (error) {
    console.error('Erreur getUserTickets:', error);
    return [];
  }
}

/**
 * Récupère un ticket par son ID
 */
export async function getTicket(ticketId: string): Promise<Ticket | null> {
  try {
    return await kv.get(`ticket:${ticketId}`) as Ticket | null;
  } catch (error) {
    console.error('Erreur getTicket:', error);
    return null;
  }
}

/**
 * Compte les tickets par statut
 */
export async function getTicketStats(): Promise<{
  total: number;
  ouvert: number;
  en_cours: number;
  resolu: number;
  ferme: number;
}> {
  try {
    const tickets = await getAllTickets();
    
    return {
      total: tickets.length,
      ouvert: tickets.filter(t => t.status === 'ouvert').length,
      en_cours: tickets.filter(t => t.status === 'en_cours').length,
      resolu: tickets.filter(t => t.status === 'resolu').length,
      ferme: tickets.filter(t => t.status === 'ferme').length,
    };
  } catch (error) {
    console.error('Erreur getTicketStats:', error);
    return { total: 0, ouvert: 0, en_cours: 0, resolu: 0, ferme: 0 };
  }
}
