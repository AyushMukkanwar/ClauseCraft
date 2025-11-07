
# GenAI FastAPI Backend API Specification for ClauseCraft

This document outlines the API endpoints and data structures that the ClauseCraft Next.js frontend expects from the GenAI FastAPI backend.

## 1. Find Similar Clauses

This endpoint is responsible for finding relevant clauses from the playbook that are similar to the clauses from a new, incoming contract.

*   **Endpoint:** `/find-similar-clauses`
*   **Method:** `POST`
*   **Request Body:**
    *   A JSON object with a single key, `clauses`, which is an array of `Clause` objects.

    ```json
    {
      "clauses": [
        {
          "clause_type": "Governing Law",
          "clause_text": "This Agreement shall be governed by and construed in accordance with the laws of the State of California."
        },
        {
          "clause_type": "Confidentiality",
          "clause_text": "Each party agrees to keep confidential all information disclosed by the other party."
        }
      ]
    }
    ```

*   **`Clause` Object Schema:**
    *   `clause_type` (string): The heading or type of the clause.
    *   `clause_text` (string): The full text of the clause.

*   **Expected Output:**
    *   A JSON object with a single key, `clause_ids`, which is an array of strings. Each string is the ID of a similar clause from the playbook stored in the database.
    *   The backend should use a vector similarity search (e.g., using Pinecone or Weaviate) to find the most relevant clause IDs.

    ```json
    {
      "clause_ids": ["1", "5", "12", "23"]
    }
    ```

## 2. Generate Suggestions

This endpoint is the core of the review feature. It takes a single clause from the incoming contract and a list of similar clauses from the playbook, and it should return an AI-generated suggestion.

*   **Endpoint:** `/generate-suggestions`
*   **Method:** `POST`
*   **Request Body:**
    *   A JSON object with two keys: `incoming_clause` and `playbook_clauses`.

    ```json
    {
      "incoming_clause": {
        "clause_type": "Governing Law",
        "clause_text": "This Agreement shall be governed by and construed in accordance with the laws of the State of California."
      },
      "playbook_clauses": [
        {
          "id": 1,
          "clause_type": "Governing Law",
          "clause_text": "This agreement shall be governed by the laws of the State of Delaware."
        },
        {
          "id": 5,
          "clause_type": "Jurisdiction",
          "clause_text": "The parties agree to the exclusive jurisdiction of the courts of the State of Delaware."
        }
      ]
    }
    ```

*   **`incoming_clause` Object Schema:**
    *   `clause_type` (string): The type of the incoming clause.
    *   `clause_text` (string): The text of the incoming clause.

*   **`playbook_clauses` Array Schema:**
    *   An array of `Clause` objects from the playbook, including their `id`.

*   **Expected Output:**
    *   A single JSON object representing a `Suggestion`.

    ```json
    {
      "clause_type": "Governing Law",
      "incoming_text": "This Agreement shall be governed by and construed in accordance with the laws of the State of California.",
      "suggestion": "Change the governing law from California to Delaware to align with company policy.",
      "severity": "Major",
      "rationale": "The company's standard playbook requires all contracts to be governed by the laws of the State of Delaware for consistency and legal predictability."
    }
    ```

*   **`Suggestion` Object Schema:**
    *   `clause_type` (string): The type of the clause being reviewed.
    *   `incoming_text` (string): The original text of the clause from the new contract.
    *   `suggestion` (string): The LLM-generated suggestion for how to improve the clause.
    *   `severity` (string): The severity of the issue, which should be one of "Minor", "Moderate", or "Major".
    *   `rationale` (string): The LLM-generated explanation for why the suggestion is being made.

This detailed specification should provide the GenAI backend developer with all the necessary information to build the required endpoints.
