/**
 * A simple heuristic to split text into clauses.
 * This can be improved with more sophisticated rules.
 * @param text The raw text content from a document.
 * @returns An array of strings, where each string is a potential clause.
 */
export function extractClausesFromText(text: string): string[] {
  // 1. Split by lines that seem to be numbered or lettered headings (e.g., '1.', '1.1', 'a)').
  // This regex looks for a newline, optional whitespace, a number/letter pattern, and then more whitespace.
  const potentialClauses = text.split(/\n\s*(?:\d+\.|\d+\.\d+|[a-z]\))\s+/);

  return potentialClauses
    .map(clause => clause.trim()) // Remove leading/trailing whitespace from each clause
    .filter(clause => clause.length > 20); // Filter out short, likely irrelevant lines or artifacts
}
