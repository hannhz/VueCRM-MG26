/**
 * Generic payload builder untuk DetailFormDuplicate
 * Supports: contact, company, deal, dan entity types lainnya
 */

export function buildDetailFormPayload({ entityType, entityId, payload }) {
  if (!entityId) {
    return { error: `ID ${entityType} tidak ditemukan untuk diupdate.` };
  }

  if (!entityType) {
    return { error: "Entity Type diperlukan (contact|company|deal)." };
  }

  // payload dari DetailFormDuplicate berisi: { note, task, docs, entityType }
  const requestPayload = {
    id: entityId,
    choice: "u", // 'u' untuk Update
    entityType: entityType,
    note: payload?.note || "",
    task: payload?.task || {},
    docs: payload?.docs || {},
    archived: 0, // Default not archived
    updated_at: new Date().toISOString(),
  };

  return { data: requestPayload, error: null };
}

/**
 * Map entityType ke Vuex action yang sesuai
 */
export function getUpdateAction(entityType) {
  const actionMap = {
    contact: "contacts/updateContact",
    company: "company/updatecompany",
    deal: "deals/updateDeal",
    task: "tasks/updateTask",
    document: "documents/updateDocument",
  };

  return actionMap[entityType] || null;
}

/**
 * Map entityType ke API endpoint
 */
export function getApiEndpoint(entityType) {
  const endpointMap = {
    contact: "contact/input",
    company: "company/input",
    deal: "deal/input",
    task: "task/input",
    document: "document/input",
  };

  return endpointMap[entityType] || `${entityType}/input`;
}
