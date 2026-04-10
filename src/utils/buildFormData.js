export function buildFormData(formData, isEditMode = false, id = null) {
  const fd = new FormData();

  // =========================
  // FIELD BIASA (LEVEL ROOT)
  // =========================
  Object.keys(formData).forEach((key) => {
    if (["noteData", "task", "docs"].includes(key)) return;

    const value = formData[key];

    // handle array (assoc)
    if (Array.isArray(value)) {
      value.forEach((v) => {
        fd.append(`${key}[]`, v);
      });
    } else {
      fd.append(key, value ?? "");
    }
  });

  // =========================
  // NOTE DATA
  // =========================
  if (formData.noteData) {
    const note = formData.noteData;

    fd.append("noteData[body]", note.body || "");
    fd.append("noteData[gps_address]", note.gps_address || "");
    fd.append("noteData[latitude]", note.latitude || "");
    fd.append("noteData[longitude]", note.longitude || "");

    // 🔥 MULTIPLE PHOTOS
    // if (Array.isArray(note.photos)) {
    //   note.photos.forEach((photo) => {
    //     if (photo?.file) {
    //       fd.append("noteData[photos][]", photo.file);
    //     }
    //   });
    // }

    if (Array.isArray(note.photos)) {
      note.photos.forEach((photo) => {
        if (photo instanceof File || photo instanceof Blob) {
          fd.append("noteData[photos][]", photo);
        } else if (photo?.file) {
          // fallback kalau suatu saat bentuknya {file: ...}
          fd.append("noteData[photos][]", photo.file);
        }
      });
    }

    // AUDIO
    if (note.audioBlob) {
      fd.append("noteData[audio]", note.audioBlob, "record.webm");
    }
  }

  // =========================
  // TASK
  // =========================
  if (formData.task) {
    Object.keys(formData.task).forEach((key) => {
      fd.append(`task[${key}]`, formData.task[key] || "");
    });
  }

  // =========================
  // DOCS
  // =========================
  if (formData.docs) {
    fd.append("docs[description]", formData.docs.description || "");
    fd.append("docs[fileSource]", formData.docs.fileSource || "");

    // 🎉 Laravel expects docs[] for multiple file upload via $request->file('docs')
    if (Array.isArray(formData.docs.files)) {
      formData.docs.files.forEach((file) => {
        if (file instanceof File || file instanceof Blob) {
          fd.append("docs[]", file, file.name || "document");
        } else if (file) {
          fd.append("docs[]", file);
        }
      });
    }
  }

  // =========================
  // INSERT / UPDATE
  // =========================
  fd.append("choice", isEditMode ? "u" : "i");

  if (isEditMode && id) {
    fd.append("id", id);
  }

  return fd;
}
