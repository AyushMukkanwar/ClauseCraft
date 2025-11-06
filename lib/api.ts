export const vectorizeClauses = async (clauses: string[]) => {
  try {
    const response = await fetch("/api/vectorize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clauses }),
    });

    if (!response.ok) {
      throw new Error("Failed to vectorize clauses");
    }

    const result = await response.json();
    console.log("Vectorization result:", result);
    return result;
  } catch (error) {
    console.error("Error vectorizing clauses:", error);
    throw error;
  }
};
