// Mock API functions for demonstration
// In production, these would be actual API calls to /api/upload and /api/get-pdfs

interface UploadResponse {
  success: boolean
  files: Array<{
    name: string
    url: string
  }>
}

interface PDFFile {
  name: string
  url: string
  id: string
}

// Simulated database
let uploadedFiles: PDFFile[] = []

export async function uploadPDFs(files: File[]): Promise<UploadResponse> {
  // ACTUAL IMPLEMENTATION (commented out):
  // const formData = new FormData();
  // files.forEach((file) => {
  //   formData.append("files", file);
  // });
  //
  // const response = await fetch("/api/upload", {
  //   method: "POST",
  //   body: formData,
  // });
  //
  // if (!response.ok) throw new Error("Upload failed");
  // return response.json();

  // DEMO IMPLEMENTATION:
  return new Promise((resolve) => {
    setTimeout(() => {
      const uploadedFilesList = files.map((file, index) => {
        const pdfFile: PDFFile = {
          name: file.name,
          url: `blob:demo-pdf-${Date.now()}-${index}`,
          id: `pdf-${Date.now()}-${index}`,
        }
        uploadedFiles.push(pdfFile)
        return {
          name: file.name,
          url: pdfFile.url,
        }
      })

      resolve({
        success: true,
        files: uploadedFilesList,
      })
    }, 5000) // 5 second delay to show animation
  })
}

export async function getPDFs(): Promise<PDFFile[]> {
  // ACTUAL IMPLEMENTATION (commented out):
  // const response = await fetch("/api/get-pdfs", {
  //   method: "GET",
  // });
  //
  // if (!response.ok) throw new Error("Failed to fetch PDFs");
  // return response.json();

  // DEMO IMPLEMENTATION:
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(uploadedFiles)
    }, 500)
  })
}

export function resetUploadedFiles(): void {
  uploadedFiles = []
}
