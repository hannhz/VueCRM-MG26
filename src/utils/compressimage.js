import imageCompression from "browser-image-compression";

/**
 * Compress 1 image
 * @param {File} file
 * @param {Object} customOptions
 * @returns {Promise<File>}
 */
export const compressImage = async (file, customOptions = {}) => {
  try {
    // validasi image
    if (!file.type.startsWith("image/")) {
      return file;
    }

    const defaultOptions = {
      maxSizeMB: 1,             // max size
      maxWidthOrHeight: 1280,  // resize
      useWebWorker: true,
      initialQuality: 0.8,
    };

    const options = { ...defaultOptions, ...customOptions };

    const compressedFile = await imageCompression(file, options);

    return compressedFile;
  } catch (error) {
    console.error("Compress image error:", error);
    return file; // fallback
  }
};

/**
 * Compress multiple images
 * @param {File[]} files
 * @param {Object} options
 * @returns {Promise<File[]>}
 */
export const compressImages = async (files, options = {}) => {
  const results = [];

  for (const file of files) {
    const compressed = await compressImage(file, options);
    results.push(compressed);
  }

  return results;
};