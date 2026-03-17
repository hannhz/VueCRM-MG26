export function buildUpdateContactPayload({ selectedContactId, payload }) {
    if (!selectedContactId) {
        return { error: "ID Contact tidak ditemukan untuk diupdate." };
    }

    // `payload` coming from DetailDataContact contains { contact, note, task, docs }
    // We mainly need the contact details at the root level for the update endpoint.
    const contactData = payload?.contact || payload;

    const dealIds = Array.isArray(contactData.dealsassoc)
        ? contactData.dealsassoc.join(",")
        : contactData.dealsassoc;

    const companyIds = Array.isArray(contactData.companyassoc)
        ? contactData.companyassoc.join(",")
        : contactData.companyassoc;

    const requestPayload = {
        id: selectedContactId,
        choice: "u", // 'u' untuk Update (Laravel backend)
        ...contactData,
        ...payload, // Include note, task, docs if backend expects them (or maybe backend doesn't care)
        dealsassoc: dealIds || null,
        companyassoc: companyIds || null,
    };

    // Prevent recursive or deeply nested `contact` property if we spread it above
    delete requestPayload.contact;

    return { data: requestPayload, error: null };
}
