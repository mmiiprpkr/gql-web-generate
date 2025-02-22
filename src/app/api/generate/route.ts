/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { loadSchema } from "@graphql-tools/load";
import { UrlLoader } from "@graphql-tools/url-loader";
import { codegen } from "@graphql-codegen/core";
import { parse, print } from "graphql";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { endpoint, document } = body;

    if (!endpoint || !document) {
      return NextResponse.json(
        { error: "Missing endpoint or document" },
        { status: 400 }
      );
    }

    const schema = await loadSchema(endpoint, {
      loaders: [new UrlLoader()],
    }).catch((error: unknown) => {
      if (error instanceof Error)
        throw new Error(`Failed to load schema: ${error.message}`);
    });

    const documentAst = parse(document);

    const config = {
      schema,
      documents: [{ document: documentAst, rawSDL: print(documentAst) }],
      filename: "output.ts",
      plugins: [{ typescript: {} }, { "typescript-operations": {} }],
      pluginMap: {
        typescript: require("@graphql-codegen/typescript"),
        "typescript-operations": require("@graphql-codegen/typescript-operations"),
      },
      config: {
        onlyOperationTypes: true,
      },
    };

    // @ts-expect-error
    const generatedCode = await codegen(config);
    return NextResponse.json({ code: generatedCode }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
