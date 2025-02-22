import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy } from "lucide-react"
import { toast } from "sonner"

interface ExtractedCodeSectionProps {
  output: string
}

const ExtractedCodeSection: React.FC<ExtractedCodeSectionProps> = ({ output }) => {
  const extractCodeBlocks = () => {
    if (!output) return []
    const blocks = output.match(/(?:export (?:type|enum) \w+[\s\S]*?(?:;|\}))(?:\n|$)/g)
    return blocks || []
  }

  const copyCodeBlock = (block: string) => {
    navigator.clipboard
      .writeText(block)
      .then(() => {
        console.log("Copied to clipboard")
        toast.success("Copied to clipboard")
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
        toast.error("Failed to copy to clipboard")
      })
  }

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Extracted Code Blocks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {extractCodeBlocks().map((block, index) => (
            <div key={index} className="relative">
              <pre className="p-4 rounded bg-gray-100 overflow-x-auto">
                <code>{block}</code>
              </pre>
              <Button
                onClick={() => copyCodeBlock(block)}
                className="absolute top-2 right-2"
                size="sm"
                variant="secondary"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default ExtractedCodeSection

