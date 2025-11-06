"use client"

import { useState } from "react";
import { UploadZone } from "@/components/upload-zone";
import { ThinkingAnimation } from "@/components/thinking-animation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";

export default function CreatePlaybookPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [clauses, setClauses] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setClauses([]);

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

      // 2. Extract clauses from each PDF concurrently
      const extractionPromises = publicUrls.map((url: string) =>
        fetch("/api/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pdfUrl: url }),
        }).then((res) => {
          if (!res.ok) {
            throw new Error(`Extraction failed for ${url}`);
          }
          return res.json();
        })
      );

      const extractionResults = await Promise.all(extractionPromises);

      // 3. Aggregate clauses
      const allClauses = extractionResults.flatMap((result) => result.clauses);
      setClauses(allClauses);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const savePlaybook = async (clauses: string[]) => {
    // Placeholder function to save clauses
    console.log("Saving playbook with clauses:", clauses);
    try {
      const response = await fetch("/api/playbooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clauses }),
      });

      if (!response.ok) {
        throw new Error("Failed to save playbook");
      }

      const result = await response.json();
      console.log("Playbook saved:", result);
      alert("Playbook saved successfully!");
    } catch (error) {
      console.error("Failed to save playbook:", error);
      alert("Failed to save playbook.");
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="h-8 w-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="gradient-gemini-text">Create your playbook</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Upload your gold-standard contracts to create a playbook of your preferred clauses.
          </p>
        </div>

        <div className="rounded-xl bg-card/50 border border-border p-8">
          <h2 className="text-xl font-semibold text-foreground mb-6">Upload Documents</h2>
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

        {clauses.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Extracted Clauses</CardTitle>
              <Button onClick={() => savePlaybook(clauses)}>Save Playbook</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {clauses.map((clause, index) => (
                <div key={index} className="p-4 border rounded-lg bg-background">
                  <p className="text-sm text-muted-foreground">Clause {index + 1}</p>
                  <p className="mt-1">{clause}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
