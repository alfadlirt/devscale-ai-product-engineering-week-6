type UploadedDocument = {
  documentId: string;
};

export async function uploadDocument(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("http://localhost:8000/api/documents", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Document upload failed.");
  }

  return (await response.json()) as UploadedDocument;
}
