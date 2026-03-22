import * as kv from "./kv_store.tsx";
import { ALL_DEFAULT_TEMPLATES } from "./templates-data.ts";

// Préfixes pour les clés KV
const TEMPLATE_PREFIX = "template:";
const EXPERT_TEMPLATES_PREFIX = "expert_templates:";
const TEMPLATES_INITIALIZED_PREFIX = "templates_initialized:";

/**
 * Initialiser les templates par défaut pour un expert
 */
export async function initializeExpertTemplates(expertId: string): Promise<void> {
  try {
    // Vérifier si les templates ont déjà été initialisés pour cet expert
    const initKey = `${TEMPLATES_INITIALIZED_PREFIX}${expertId}`;
    const alreadyInitialized = await kv.get(initKey);

    if (alreadyInitialized) {
      console.log(`Templates already initialized for expert ${expertId}`);
      return;
    }

    console.log(`Initializing templates for expert ${expertId}...`);

    // Créer une copie des templates par défaut pour cet expert
    const expertTemplates = ALL_DEFAULT_TEMPLATES.map((template) => ({
      ...template,
      expertId,
      isFavorite: false,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDefault: true,
      isPublic: true,
    }));

    // Sauvegarder chaque template individuellement
    const savePromises = expertTemplates.map((template) => {
      const templateKey = `${TEMPLATE_PREFIX}${expertId}:${template.id}`;
      return kv.set(templateKey, template);
    });

    // Sauvegarder la liste des IDs de templates de l'expert
    const templateIds = expertTemplates.map((t) => t.id);
    const expertTemplatesKey = `${EXPERT_TEMPLATES_PREFIX}${expertId}`;
    savePromises.push(kv.set(expertTemplatesKey, templateIds));

    // Marquer comme initialisé
    savePromises.push(kv.set(initKey, { initialized: true, date: new Date().toISOString() }));

    await Promise.all(savePromises);

    console.log(`Successfully initialized ${expertTemplates.length} templates for expert ${expertId}`);
  } catch (error) {
    console.error(`Error initializing templates for expert ${expertId}:`, error);
    throw error;
  }
}

/**
 * Récupérer tous les templates d'un expert
 */
export async function getExpertTemplates(expertId: string): Promise<any[]> {
  try {
    // Récupérer la liste des IDs de templates
    const expertTemplatesKey = `${EXPERT_TEMPLATES_PREFIX}${expertId}`;
    const templateIds = await kv.get(expertTemplatesKey);

    if (!templateIds || !Array.isArray(templateIds)) {
      console.log(`No templates found for expert ${expertId}, initializing...`);
      await initializeExpertTemplates(expertId);
      return getExpertTemplates(expertId); // Récursion pour récupérer après initialisation
    }

    // Récupérer tous les templates
    const templatePromises = templateIds.map((id: string) => {
      const templateKey = `${TEMPLATE_PREFIX}${expertId}:${id}`;
      return kv.get(templateKey);
    });

    const templates = await Promise.all(templatePromises);

    // Filtrer les nulls (au cas où)
    return templates.filter((t) => t !== null);
  } catch (error) {
    console.error(`Error getting templates for expert ${expertId}:`, error);
    throw error;
  }
}

/**
 * Récupérer un template spécifique
 */
export async function getTemplate(expertId: string, templateId: string): Promise<any | null> {
  try {
    const templateKey = `${TEMPLATE_PREFIX}${expertId}:${templateId}`;
    return await kv.get(templateKey);
  } catch (error) {
    console.error(`Error getting template ${templateId} for expert ${expertId}:`, error);
    throw error;
  }
}

/**
 * Créer un nouveau template personnalisé
 */
export async function createTemplate(expertId: string, templateData: any): Promise<any> {
  try {
    const templateId = `custom_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const template = {
      ...templateData,
      id: templateId,
      expertId,
      isDefault: false,
      isPublic: false,
      isFavorite: false,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Sauvegarder le template
    const templateKey = `${TEMPLATE_PREFIX}${expertId}:${templateId}`;
    await kv.set(templateKey, template);

    // Ajouter l'ID à la liste des templates de l'expert
    const expertTemplatesKey = `${EXPERT_TEMPLATES_PREFIX}${expertId}`;
    const templateIds = (await kv.get(expertTemplatesKey)) || [];
    templateIds.push(templateId);
    await kv.set(expertTemplatesKey, templateIds);

    console.log(`Created new template ${templateId} for expert ${expertId}`);
    return template;
  } catch (error) {
    console.error(`Error creating template for expert ${expertId}:`, error);
    throw error;
  }
}

/**
 * Mettre à jour un template
 */
export async function updateTemplate(
  expertId: string,
  templateId: string,
  updates: any
): Promise<any | null> {
  try {
    const templateKey = `${TEMPLATE_PREFIX}${expertId}:${templateId}`;
    const existingTemplate = await kv.get(templateKey);

    if (!existingTemplate) {
      console.log(`Template ${templateId} not found for expert ${expertId}`);
      return null;
    }

    // Ne pas permettre la modification des templates par défaut (sauf favoris et usageCount)
    if (existingTemplate.isDefault) {
      const allowedUpdates = {
        isFavorite: updates.isFavorite,
        usageCount: updates.usageCount,
        updatedAt: new Date().toISOString(),
      };
      const updatedTemplate = { ...existingTemplate, ...allowedUpdates };
      await kv.set(templateKey, updatedTemplate);
      return updatedTemplate;
    }

    // Pour les templates personnalisés, autoriser toutes les modifications
    const updatedTemplate = {
      ...existingTemplate,
      ...updates,
      id: templateId, // Préserver l'ID
      expertId, // Préserver l'expertId
      updatedAt: new Date().toISOString(),
    };

    await kv.set(templateKey, updatedTemplate);
    console.log(`Updated template ${templateId} for expert ${expertId}`);
    return updatedTemplate;
  } catch (error) {
    console.error(`Error updating template ${templateId} for expert ${expertId}:`, error);
    throw error;
  }
}

/**
 * Supprimer un template (seulement les templates personnalisés)
 */
export async function deleteTemplate(expertId: string, templateId: string): Promise<boolean> {
  try {
    const templateKey = `${TEMPLATE_PREFIX}${expertId}:${templateId}`;
    const template = await kv.get(templateKey);

    if (!template) {
      console.log(`Template ${templateId} not found for expert ${expertId}`);
      return false;
    }

    // Ne pas permettre la suppression des templates par défaut
    if (template.isDefault) {
      console.log(`Cannot delete default template ${templateId}`);
      return false;
    }

    // Supprimer le template
    await kv.del(templateKey);

    // Retirer l'ID de la liste des templates de l'expert
    const expertTemplatesKey = `${EXPERT_TEMPLATES_PREFIX}${expertId}`;
    const templateIds = (await kv.get(expertTemplatesKey)) || [];
    const updatedIds = templateIds.filter((id: string) => id !== templateId);
    await kv.set(expertTemplatesKey, updatedIds);

    console.log(`Deleted template ${templateId} for expert ${expertId}`);
    return true;
  } catch (error) {
    console.error(`Error deleting template ${templateId} for expert ${expertId}:`, error);
    throw error;
  }
}

/**
 * Incrémenter le compteur d'utilisation d'un template
 */
export async function incrementTemplateUsage(expertId: string, templateId: string): Promise<void> {
  try {
    const template = await getTemplate(expertId, templateId);
    if (template) {
      const usageCount = (template.usageCount || 0) + 1;
      await updateTemplate(expertId, templateId, { usageCount });
    }
  } catch (error) {
    console.error(`Error incrementing usage for template ${templateId}:`, error);
    // Ne pas faire échouer l'opération si le compteur ne peut pas être incrémenté
  }
}

/**
 * Basculer le statut favori d'un template
 */
export async function toggleTemplateFavorite(expertId: string, templateId: string): Promise<any | null> {
  try {
    const template = await getTemplate(expertId, templateId);
    if (template) {
      const isFavorite = !template.isFavorite;
      return await updateTemplate(expertId, templateId, { isFavorite });
    }
    return null;
  } catch (error) {
    console.error(`Error toggling favorite for template ${templateId}:`, error);
    throw error;
  }
}

/**
 * Obtenir les templates par type
 */
export async function getTemplatesByType(expertId: string, type: string): Promise<any[]> {
  try {
    const allTemplates = await getExpertTemplates(expertId);
    return allTemplates.filter((t) => t.type === type);
  } catch (error) {
    console.error(`Error getting templates by type ${type} for expert ${expertId}:`, error);
    throw error;
  }
}

/**
 * Obtenir les templates favoris
 */
export async function getFavoriteTemplates(expertId: string): Promise<any[]> {
  try {
    const allTemplates = await getExpertTemplates(expertId);
    return allTemplates.filter((t) => t.isFavorite === true);
  } catch (error) {
    console.error(`Error getting favorite templates for expert ${expertId}:`, error);
    throw error;
  }
}
