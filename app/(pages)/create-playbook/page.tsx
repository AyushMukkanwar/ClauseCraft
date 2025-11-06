"use client"

import { useState, useEffect } from "react"
import { UploadZone } from "@/components/upload-zone"
import { ThinkingAnimation } from "@/components/thinking-animation"
import { PDFGallery } from "@/components/pdf-gallery"
import { uploadPDFs, getPDFs } from "@/lib/mock-api"
import { Zap } from "lucide-react"

interface PDF {
  name: string
  url: string
  id: string
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [pdfs, setPdfs] = useState<PDF[]>([])

  // Load PDFs on mount
  useEffect(() => {
    loadPDFs()
  }, [])

  const loadPDFs = async () => {
    const fetchedPdfs = await getPDFs()
    setPdfs(fetchedPdfs)
  }

  const handleFilesSelected = async (files: File[]) => {
    setIsLoading(true)
    try {
      const response = await uploadPDFs(files)
      if (response.success) {
        await loadPDFs()
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to upload PDFs")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="h-8 w-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="gradient-gemini-text">Create your playbook</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Upload your PDF documents with real-time AI processing. Watch as our agent processes your files in the
            background.
          </p>
        </div>

        {isLoading ? (
          <div className="rounded-xl bg-card/50 border border-border p-8">
            <ThinkingAnimation isVisible={true} />
          </div>
        ) : (
          <>
            {/* Main Content */}
            <div className="grid md:grid-cols-3 gap-12">
              {/* Upload Section */}
              <div className="md:col-span-2 space-y-8">
                <div className="rounded-xl bg-card/50 border border-border p-8">
                  <h2 className="text-xl font-semibold text-foreground mb-6">Upload Documents</h2>
                  <UploadZone onFilesSelected={handleFilesSelected} isLoading={isLoading} />
                </div>
              </div>

              {/* Sidebar Stats */}
              <div className="space-y-4">
                <div className="rounded-xl bg-gradient-to-br from-card/70 to-card/50 border border-border p-6 space-y-6">
                  <div>
                    <p className="text-muted-foreground text-sm">Total PDFs</p>
                    <p className="text-4xl font-bold text-primary mt-1">{pdfs.length}</p>
                  </div>
                  <div className="pt-4 border-t border-border space-y-3">
                    <div className="text-xs text-muted-foreground">
                      <p className="font-medium text-foreground mb-2">Status</p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span>Ready</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PDF Gallery - Only show if PDFs exist */}
            {pdfs.length > 0 && (
              <div className="rounded-xl bg-card/50 border border-border p-8">
                <PDFGallery pdfs={pdfs} />
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
