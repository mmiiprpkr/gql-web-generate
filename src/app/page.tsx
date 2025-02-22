"use client";

import type React from "react";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, Copy, Zap } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const GraphQLGenerator: React.FC = () => {
  const [endpoint, setEndpoint] = useState(
    "https://premium-service-v2.gtt-dev.sawasdeebyaot.com/graphql"
  );
  const [document, setDocument] =
    useState(`mutation WebPremiumServiceAdminApplyVoucher($code: String!) {
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
  }`);
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint, document }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setOutput(data.code);
    } catch (error) {
      if (error instanceof Error) setOutput(`Error: ${error.message}`);

      console.error("Error:", error);
      toast.error("Failed to generate TypeScript");
    } finally {
      setIsLoading(false);
    }
  };

  const copyCodeBlock = (block: string) => {
    navigator.clipboard
      .writeText(block)
      .then(() => {
        toast.success("Copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast.error("Failed to copy to clipboard");
      });
  };

  const extractCodeBlocks = useCallback(() => {
    if (!output) return [];
    const blocks = output.match(
      /(?:export (?:type|enum) \w+[\s\S]*?(?:;|\}))(?:\n|$)/g
    );
    return blocks || [];
  }, [output]);

  const filteredCodeBlocks = useCallback(() => {
    const blocks = extractCodeBlocks();
    console.log("Search Term:", searchTerm); // ตรวจสอบค่าที่ใช้ค้นหา
    console.log("Blocks Before Filtering:", blocks);

    if (!searchTerm) return blocks;

    const filtered = blocks.filter((block) =>
      block.toLowerCase().includes(searchTerm.toLowerCase())
    );

    console.log("Filtered Blocks:", filtered);
    return filtered;
  }, [extractCodeBlocks, searchTerm]);

  return (
    <div className="p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-white shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-3xl font-bold flex items-center gap-2 text-primary">
              <Zap className="w-8 h-8" />
              GraphQL to TypeScript Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label
                htmlFor="endpoint"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
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
              <label
                htmlFor="document"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
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
            <Button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {isLoading ? "Generating..." : "Generate TypeScript"}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      {output && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold flex justify-between items-center">
                <span>Generated Output</span>
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                  <Button variant="outline">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="code" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="code">Full Code</TabsTrigger>
                  <TabsTrigger value="copy">Extracted Blocks</TabsTrigger>
                </TabsList>
                <TabsContent value="code">
                  <pre className="p-4 rounded bg-gray-100 overflow-x-auto max-h-96">
                    <code>{output}</code>
                  </pre>
                </TabsContent>
                <TabsContent value="copy">
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {filteredCodeBlocks().map((block, index) => (
                      <div key={index} className="relative group">
                        <pre className="p-4 rounded bg-gray-100 overflow-x-auto">
                          <code>{block}</code>
                        </pre>
                        <Button
                          onClick={() => copyCodeBlock(block)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          size="sm"
                          variant="secondary"
                        >
                          <Copy className="w-4 h-4 mr-2" /> Copy
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default GraphQLGenerator;
