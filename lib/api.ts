// Functions for interacting with the FastAPI backend

const FASTAPI_URL = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://127.0.0.1:8000';

interface Clause {
  clause_type: string;
  clause_text: string;
  // Add other fields that your backend will return
}

/**
 * Sends a PDF URL to the FastAPI backend to extract clauses.
 * @param pdfUrl The public URL of the PDF stored in Supabase.
 * @returns A promise that resolves to an array of extracted clauses.
 */
export async function extractClausesFromUrl(pdfUrl: string): Promise<Clause[]> {
  const response = await fetch(`${FASTAPI_URL}/extract-clauses`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pdf_url: pdfUrl }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to extract clauses from backend');
  }

  return response.json();
}