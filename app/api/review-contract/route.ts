
import { NextResponse } from "next/server";

const NEXT_APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

interface Clause {
  id?: number;
  clause_type: string;
  clause_text: string;
}

interface Suggestion {
  clause_type: string;
  incoming_text: string;
  suggestion: string;
  severity: "Minor" | "Moderate" | "Major";
  rationale: string;
}

export async function POST(request: Request) {
  try {
    const { clauses: incomingClauses } = await request.json();

    if (!incomingClauses || !Array.isArray(incomingClauses)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    // 1. Find similar clause IDs from the playbook (MOCKED)
    // const similarClausesResponse = await fetch(`${NEXT_APP_URL}/api/find-similar-clauses`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ clauses: incomingClauses }),
    // });

    // if (!similarClausesResponse.ok) {
    //   throw new Error("Failed to find similar clauses");
    // }

    // const { similarClauseIds } = await similarClausesResponse.json();
    const similarClauseIds = ["1", "2", "3"]; // Mock data

    // 2. Retrieve the full text of the similar clauses (MOCKED)
    // const playbookClausesResponse = await fetch(`${NEXT_APP_URL}/api/clauses-by-ids`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ clauseIds: similarClauseIds }),
    // });

    // if (!playbookClausesResponse.ok) {
    //   throw new Error("Failed to retrieve playbook clauses");
    // }

    // const playbookClauses: Clause[] = await playbookClausesResponse.json();
    const playbookClauses: Clause[] = [
      { id: 1, clause_type: "Governing Law", clause_text: "This agreement shall be governed by the laws of the State of Delaware." },
      { id: 2, clause_type: "Confidentiality", clause_text: "The parties shall maintain the confidentiality of all information disclosed." },
      { id: 3, clause_type: "Limitation of Liability", clause_text: "In no event shall either party be liable for any consequential damages." },
    ]; // Mock data

    // 3. For each incoming clause, call the LLM to get suggestions
    const suggestions: Suggestion[] = [];
    for (const incomingClause of incomingClauses) {
      // In a real implementation, you would find the relevant playbook clauses for this specific incoming clause
      // and send them to the LLM. For now, we'll just send the incoming clause and a placeholder for the playbook clauses.

      // MOCK CALL to the GenAI FastAPI backend
      const suggestion = await getSuggestionFromLLM(incomingClause, playbookClauses);
      suggestions.push(suggestion);
    }

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error("Failed to review contract:", error);
    return NextResponse.json({ error: "Failed to review contract" }, { status: 500 });
  }
}

// Mock function to simulate calling the GenAI FastAPI backend
async function getSuggestionFromLLM(incomingClause: Clause, playbookClauses: Clause[]): Promise<Suggestion> {
  // In a real implementation, this would be a fetch call to your GenAI FastAPI backend
  // For now, we'll just return a mock suggestion
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        clause_type: incomingClause.clause_type,
        incoming_text: incomingClause.clause_text,
        suggestion: "This is a mock suggestion from the LLM. Consider revising this clause to better align with company standards.",
        severity: "Moderate",
        rationale: "This is a mock rationale. The playbook prefers different wording for this type of clause.",
      });
    }, 500);
  });
}
