
import { NextResponse } from "next/server";

const FASTAPI_URL = process.env.NEXT_PUBLIC_GENAI_FASTAPI_URL || "http://localhost:8001";

interface Clause {
  clause_type: string;
  clause_text: string;
}

export async function POST(request: Request) {
  try {
    const { clauses } = await request.json();

    if (!clauses || !Array.isArray(clauses)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const similarClauseIds = new Set<string>();

    for (const clause of clauses) {
      try {
        const response = await fetch(`${FASTAPI_URL}/find-similar-clauses`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(clause),
        });

        if (response.ok) {
          const { clause_ids } = await response.json();
          if (clause_ids && Array.isArray(clause_ids)) {
            clause_ids.forEach((id) => similarClauseIds.add(id));
          }
        }
      } catch (error) {
        console.error(`Failed to find similar clauses for clause: ${clause.clause_type}`, error);
        // Continue to the next clause even if one fails
      }
    }

    return NextResponse.json({ similarClauseIds: Array.from(similarClauseIds) });
  } catch (error) {
    console.error("Failed to find similar clauses:", error);
    return NextResponse.json({ error: "Failed to find similar clauses" }, { status: 500 });
  }
}
