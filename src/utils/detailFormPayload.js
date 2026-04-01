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
 * Flatten detail payload agar konsisten dengan struktur tabel detail terpisah
 * (contoh: contactdet/companydet/dealsdet).
 */
export function buildEntityDetailPayload({ entityType, entityId, payload }) {
  if (!entityId) {
    return { error: `ID ${entityType} tidak ditemukan untuk simpan detail.` };
  }

  if (!entityType) {
    return { error: "Entity Type diperlukan (contact|company|deal)." };
  }

  const normalizedEntity = String(entityType).toLowerCase();
  const now = new Date().toISOString().slice(0, 19).replace("T", " ");

  const idFieldMap = {
    contact: "contactid",
    company: "companyid",
    deal: "dealid",
  };

  const fkField = idFieldMap[normalizedEntity] || `${normalizedEntity}id`;

  const requestPayload = {
    choice: "u",
    id: entityId,
    [fkField]: entityId,
    notes: payload?.note || "",
    task_name: payload?.task?.name || "",
    desktask: payload?.task?.content || "",
    statustask: payload?.task?.status || "",
    assignee: payload?.task?.assignee || "",
    due_date: payload?.task?.dueDate || "",
    task_time: payload?.task?.time || "",
    prioritytask: payload?.task?.priority || "",
    associated_contact: payload?.task?.associatedContact || "",
    docs: payload?.docs?.description || "",
    updated_at: now,
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
 * Map entityType ke action penyimpanan tabel detail terpisah.
 */
export function getDetailSaveAction(entityType) {
  const actionMap = {
    contact: "contacts/saveContactDetail",
    company: "company/saveCompanyDetail",
    deal: "deals/saveDealDetail",
  };

  return actionMap[entityType] || null;
}

/**
 * Endpoint candidate untuk penyimpanan detail per entity.
 */
export function getDetailEndpointCandidates(entityType) {
  const endpointMap = {
    contact: ["contact/input"],
    company: ["company/input"],
    deal: ["deals/input"],
  };

  return (
    endpointMap[entityType] || [`${entityType}det/input`, `${entityType}/input`]
  );
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
