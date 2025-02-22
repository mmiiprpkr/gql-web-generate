"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search } from "lucide-react"

interface OutputSectionProps {
  output: string
}

const OutputSection: React.FC<OutputSectionProps> = ({ output }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const outputRef = useRef<HTMLPreElement>(null)

  const searchAndHighlight = useCallback(() => {
    if (!outputRef.current) return

    const content = outputRef.current.textContent || ""
    const regex = new RegExp(searchTerm, "gi")
    const highlightedContent = content.replace(regex, (match) => `<mark>${match}</mark>`)
    outputRef.current.innerHTML = highlightedContent
  }, [searchTerm])

  return (
    <Card className="bg-gray-900 text-white">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex justify-between items-center">
          <span>Generated Output</span>
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-black"
            />
            <Button onClick={searchAndHighlight} variant="secondary">
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <pre ref={outputRef} className="p-4 rounded bg-gray-800 overflow-x-auto">
          <code>{output}</code>
        </pre>
      </CardContent>
    </Card>
  )
}

export default OutputSection

