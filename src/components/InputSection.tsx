"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface InputSectionProps {
  onGenerate: (endpoint: string, document: string) => void
  isLoading: boolean
}

const InputSection: React.FC<InputSectionProps> = ({ onGenerate, isLoading }) => {
  const [endpoint, setEndpoint] = useState("https://premium-service-v2.gtt-dev.sawasdeebyaot.com/graphql")
  const [document, setDocument] = useState(`mutation WebPremiumServiceAdminApplyVoucher($code: String!) {
    webPremiumServiceAdminApplyVoucher(code: $code) {
      success
      message
      code
      payload {
        items {
          voucherId
          code
          title
          description
          endAt
          image
        }
      }
    }
  }`)

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="endpoint" className="block text-sm font-medium text-gray-700 mb-1">
          GraphQL Endpoint
        </label>
        <Input
          id="endpoint"
          type="text"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          placeholder="Enter GraphQL Endpoint"
          className="w-full"
        />
      </div>
      <div>
        <label htmlFor="document" className="block text-sm font-medium text-gray-700 mb-1">
          GraphQL Document
        </label>
        <Textarea
          id="document"
          value={document}
          onChange={(e) => setDocument(e.target.value)}
          placeholder="Enter GraphQL Document"
          className="w-full h-48"
        />
      </div>
      <Button onClick={() => onGenerate(endpoint, document)} disabled={isLoading} className="w-full">
        {isLoading ? "Generating..." : "Generate TypeScript"}
      </Button>
    </div>
  )
}

export default InputSection

