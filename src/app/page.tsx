"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Code } from "lucide-react"

const GraphQLGenerator: React.FC = () => {
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
  const [output, setOutput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerate = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:3000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint, document }),
      })
      const data = await response.json()
      if (data.error) throw new Error(data.error)
      setOutput(data.code)
    } catch (error) {
      if (error instanceof Error)
      setOutput(`Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Code className="w-6 h-6" />
            GraphQL to TypeScript Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
        <CardFooter>
          <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
            {isLoading ? "Generating..." : "Generate TypeScript"}
          </Button>
        </CardFooter>
      </Card>

      {output && (
        <Card className="mt-6 bg-gray-900 text-white">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Generated Output</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="p-4 rounded bg-gray-800 overflow-x-auto">
              <code>{output}</code>
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default GraphQLGenerator

