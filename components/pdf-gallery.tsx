"use client"

import { useState } from "react"
import { FileText, X } from "lucide-react"

interface PDF {
  name: string
  url: string
  id: string
}

interface PDFGalleryProps {
  pdfs: PDF[]
}

export function PDFGallery({ pdfs }: PDFGalleryProps) {
  const [selectedPdf, setSelectedPdf] = useState<PDF | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  if (pdfs.length === 0) {
    return null
  }

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Uploaded PDFs</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pdfs.map((pdf) => (
            <button
              key={pdf.id}
              onClick={() => setSelectedPdf(pdf)}
              className="group relative overflow-hidden rounded-lg border border-border bg-card/50 p-6 hover:border-primary/50 hover:bg-card/70 transition-all hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="flex flex-col items-center justify-center gap-3 h-32">
                <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground text-center line-clamp-2 group-hover:text-accent transition-colors">
                  {pdf.name}
                </p>
                <p className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to view
                </p>
              </div>

              {/* Gradient border effect on hover */}
              <div className="absolute inset-0 bg-gradient-gemini opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none rounded-lg" />
            </button>
          ))}
        </div>
      </div>

      {selectedPdf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedPdf(null)} />

          <div className="relative z-10 w-[80vw] h-[80vh] bg-card border border-border rounded-lg shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-card/70">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-foreground truncate">{selectedPdf.name}</h2>
              </div>
              <button
                onClick={() => setSelectedPdf(null)}
                className="ml-4 p-2 hover:bg-secondary rounded-lg transition-colors flex-shrink-0"
              >
                <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              </button>
            </div>

            <div className="flex-1 overflow-auto bg-secondary/30">
              <iframe
                src={`${selectedPdf.url}#toolbar=0&navpanes=0`}
                className="w-full h-full border-none"
                title={selectedPdf.name}
              />
            </div>

            {/* Footer with download option */}
            <div className="p-4 border-t border-border bg-card/70 flex justify-end">
              <a
                href={selectedPdf.url}
                download={selectedPdf.name}
                className="px-4 py-2 bg-gradient-to-r from-primary via-accent to-purple-500 text-primary-foreground rounded-md hover:opacity-90 transition-opacity text-sm font-medium"
              >
                Download PDF
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
