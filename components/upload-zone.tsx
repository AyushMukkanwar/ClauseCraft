"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Cloud, File, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void
  isLoading?: boolean
}

export function UploadZone({ onFilesSelected, isLoading = false }: UploadZoneProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragCounter = useRef(0)
  const [isDragging, setIsDragging] = useState(false)

  const handleFiles = (files: FileList | null) => {
    if (!files) return

    const pdfFiles = Array.from(files).filter((file) => file.type === "application/pdf")

    if (pdfFiles.length === 0) {
      alert("Please select PDF files only")
      return
    }

    setSelectedFiles((prev) => [...prev, ...pdfFiles])
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current++
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current--
    if (dragCounter.current === 0) {
      setIsDragging(false)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current = 0
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = () => {
    if (selectedFiles.length === 0) return
    onFilesSelected(selectedFiles)
    setSelectedFiles([])
  }

  return (
    <div className="w-full space-y-6">
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative rounded-lg border-2 border-dashed transition-all p-12 text-center ${
          isDragging ? "border-primary bg-primary/10" : "border-border bg-card/50 hover:border-primary/50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf"
          onChange={handleInputChange}
          className="hidden"
          disabled={isLoading}
        />

        <div className="flex flex-col items-center gap-3">
          <Cloud className="h-12 w-12 text-muted-foreground" />
          <div>
            <p className="text-lg font-semibold text-foreground">Drag your PDFs here</p>
            <p className="text-sm text-muted-foreground mt-1">
              or{" "}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-primary hover:text-accent transition-colors underline"
                disabled={isLoading}
              >
                click to browse
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Selected Files ({selectedFiles.length})</p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-card/70 rounded-md border border-border"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <File className="h-4 w-4 text-accent flex-shrink-0" />
                  <span className="text-sm text-foreground truncate">{file.name}</span>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Button */}
      {selectedFiles.length > 0 && (
        <Button
          onClick={handleUpload}
          disabled={isLoading}
          className="w-full h-11 bg-gradient-to-r from-primary via-accent to-purple-500 hover:opacity-90 text-primary-foreground font-semibold"
        >
          {isLoading ? "Uploading..." : "Upload PDFs"}
        </Button>
      )}
    </div>
  )
}
