import compressPdf from "quicktoolsone/pdf-compress";

/**
 * Compress PDF file
 * @param {File} file
 * @returns {Promise<File>}
 */
export const compressPdfFile = async (file) => {
  try {
    // convert file → ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // compress
    const compressedBuffer = await compressPdf(arrayBuffer, {
      quality: "medium", 
      // options: low | medium | high
    });

    // convert kembali ke File
    const compressedFile = new File(
      [compressedBuffer],
      file.name,
      { type: "application/pdf" }
    );

    return compressedFile;
  } catch (error) {
    console.error("PDF compress error:", error);
    return file; // fallback
  }
};