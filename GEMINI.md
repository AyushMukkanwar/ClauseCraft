You are an expert full-stack architect specializing in Next.js 14 (App Router), TypeScript, Python FastAPI backends, and AI integrations.
You will help me design and build the Next.js frontend for my Legal-AI project called “ClauseCraft.”

Below is the detailed context and requirements — understand them fully before generating any code or design.

---

## 💡 Project Summary

ClauseCraft is an AI-powered legal assistant that helps companies review contracts and maintain consistency across deals.  
It has three main features:

1. Upload a gold-standard contract to **create a Playbook** of preferred clauses.
2. Upload a new contract to **compare it** with the Playbook and get **AI-generated suggestions**.
3. Ask a **chatbot (RAG)** questions about the firm’s own standards and clauses.

The Next.js app handles:
- Text extraction from PDF/DOCX files.
- Heuristic clause parsing and value storage.

The backend (FastAPI + Python) handles:
- Receiving extracted clauses from the Next.js app.
- LLM-based clause labeling and comparison.
- Embedding generation and storage in a Vector DB (Pinecone/Weaviate).
- Persistent DB (Mongo/Postgres) for full clause metadata.

The Next.js app is the **user-facing interface** where the firm’s users upload documents, see AI suggestions, and chat with their standards.

---

## 🧱 Tech Stack for Next.js

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui components
- **State:** React Query / SWR for data fetching
- **Auth (optional):** Clerk / NextAuth.js
- **PDF/Text parsing (client-side pre-view):** pdfjs-dist or pdf-parse (optional)
- **File upload handling:** Next.js API routes or directly to FastAPI endpoint
- **Deployment:** Vercel for frontend, FastAPI backend on Render/Railway

---

## ⚙️ Required Pages and Components

### 1️⃣ `/create-playbook` – Upload Gold Contract

- Page to upload a standard contract (PDF/DOCX).
- Send file → FastAPI `/upload-template`.
- Show upload progress.
- Display parsed clauses returned by backend.
- Allow user to edit clause titles or summaries before saving as playbook.
- Display confirmation when playbook is created.

### 2️⃣ `/review-contract` – Upload New Contract

- Page for reviewing a new contract against the firm’s playbook.
- Upload a contract → FastAPI `/upload-contract?playbook_id=...`.
- Backend returns structured JSON:
  ```json
  [
    {
      "clause_type": "Governing Law",
      "incoming_text": "This Agreement shall be governed by California law.",
      "suggestion": "Change to Delaware law.",
      "severity": "Minor",
      "rationale": "Playbook prefers Delaware jurisdiction."
    }
  ]
  ```
