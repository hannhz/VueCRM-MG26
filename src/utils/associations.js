export function getAssociationCandidates(v1, v2, v3, v4, v5, v6) {
  let candidates = [v1, v2, v3, v4, v5, v6];
  return candidates.find((val) => {
    if (Array.isArray(val) && val.length > 0) return true;
    if (typeof val === "string" && val.trim() !== "") return true;
    if (typeof val === "number") return true;
    return false;
  });
}

export function resolveAssociationLabels(candidates, options) {
  if (!candidates) return [];

  // Jika string JSON
  if (typeof candidates === "string") {
    try {
      if (
        candidates.trim().startsWith("[") ||
        candidates.trim().startsWith("{")
      ) {
        candidates = JSON.parse(candidates);
      } else {
        candidates = candidates.split(",").map((s) => s.trim());
      }
    } catch {
      candidates = [candidates];
    }
  }

  // Pastikan bentuknya array
  const arr = Array.isArray(candidates) ? candidates : [candidates];

  return arr
    .map((item) => {
      // Jika bentuknya object {id, name}
      if (item && typeof item === "object") {
        return item.name || item.company_name || item.deal_name || "Unknown";
      }

      // Jika bentuknya ID, cari di option
      const strId = String(item).trim();
      const found = options.find((opt) => String(opt.value) === strId);
      return found ? found.label : strId;
    })
    .filter(Boolean);
}
