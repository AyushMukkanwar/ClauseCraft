"use client";

import { useState } from "react";
import { UploadZone } from "@/components/upload-zone";
import { ThinkingAnimation } from "@/components/thinking-animation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";
import { extractClausesFromUrl } from "@/lib/api";
import type { Clause } from "@/lib/api";

interface Suggestion {
  clause_type: string;
  incoming_text: string;
  suggestion: string;
  severity: "Minor" | "Moderate" | "Major";
  rationale: string;
}

export default function ReviewContractPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuggestions([]);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      // 1. Upload files to get public URLs
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("File upload failed");
      }

      const { publicUrls } = await uploadResponse.json();

      // 2. Extract clauses from the first PDF
      const incomingClauses = await extractClausesFromUrl(publicUrls[0]);

      // 3. Get suggestions for the extracted clauses
      const reviewResponse = await fetch("/api/review-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clauses: incomingClauses }),
      });

      if (!reviewResponse.ok) {
        throw new Error("Failed to get suggestions");
      }

      const suggestions = await reviewResponse.json();
      setSuggestions(suggestions);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="h-8 w-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="gradient-gemini-text">Review a Contract</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Upload a new contract to compare it with your playbook and get AI-generated suggestions.
          </p>
        </div>

        <div className="rounded-xl bg-card/50 border border-border p-8">
          <h2 className="text-xl font-semibold text-foreground mb-6">Upload Document</h2>
          <UploadZone onFilesSelected={handleFilesSelected} isLoading={isLoading} />
        </div>

        {isLoading && (
          <div className="rounded-xl bg-card/50 border border-border p-8">
            <ThinkingAnimation isVisible={true} />
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-destructive/10 border border-destructive text-destructive p-4">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {suggestions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Suggestions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="p-4 border rounded-lg bg-background">
                  <p className="text-sm font-bold text-primary">{suggestion.clause_type}</p>
                  <p className="mt-2 text-muted-foreground">{suggestion.incoming_text}</p>
                  <p className="mt-4 font-semibold">Suggestion:</p>
                  <p className="mt-1">{suggestion.suggestion}</p>
                  <p className="mt-2 text-sm">
                    <span className="font-semibold">Severity:</span> {suggestion.severity}
                  </p>
                  <p className="mt-1 text-sm">
                    <span className="font-semibold">Rationale:</span> {suggestion.rationale}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}