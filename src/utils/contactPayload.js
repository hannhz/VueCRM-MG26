export function buildUpdateContactPayload({ selectedContactId, payload }) {
    if (!selectedContactId) {
        return { error: "ID Contact tidak ditemukan untuk diupdate." };
    }

    // Format array associations ke string CSV yang dipisahkan koma
    // karena backend Laravel ContactController tampaknya mengharapkan format tersebut 
    // atau JSON array string dalam requestnya
    const dealIds = Array.isArray(payload.dealsassoc)
        ? payload.dealsassoc.join(",")
        : payload.dealsassoc;

    const companyIds = Array.isArray(payload.companyassoc)
        ? payload.companyassoc.join(",")
        : payload.companyassoc;

    const requestPayload = {
        id: selectedContactId,
        choice: "u", // 'u' untuk Update (Laravel backend)
        ...payload,
        dealsassoc: dealIds || null,
        companyassoc: companyIds || null,
    };

    return { data: requestPayload, error: null };
}
