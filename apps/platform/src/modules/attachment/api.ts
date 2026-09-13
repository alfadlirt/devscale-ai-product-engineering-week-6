type UploadedDocument = {
  documentId: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export async function uploadDocument(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/documents`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Document upload failed.");
  }

  return (await response.json()) as UploadedDocument;
}
