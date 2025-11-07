
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { clauseIds } = await request.json();

    if (!clauseIds || !Array.isArray(clauseIds) || clauseIds.length === 0) {
      return NextResponse.json({ error: "Invalid request body: clauseIds array is required" }, { status: 400 });
    }

    // Ensure all IDs are numbers for Prisma query
    const numericClauseIds = clauseIds.map(id => parseInt(id)).filter(id => !isNaN(id));

    if (numericClauseIds.length === 0) {
      return NextResponse.json({ error: "No valid numeric clause IDs provided" }, { status: 400 });
    }

    const clauses = await prisma.clause.findMany({
      where: {
        id: {
          in: numericClauseIds,
        },
      },
    });

    return NextResponse.json(clauses);
  } catch (error) {
    console.error("Failed to retrieve clauses by IDs:", error);
    return NextResponse.json({ error: "Failed to retrieve clauses" }, { status: 500 });
  }
}
