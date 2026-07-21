import { NextResponse } from "next/server";
import { NotionConfigError } from "@/lib/notionService";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      relationshipType?: string;
    };

    if (!body.name || !body.email || !body.relationshipType) {
      return NextResponse.json(
        { success: false, error: "Name, email, and relationship type are required." },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        status: "pending",
        message:
          "Signup request captured. Add a Notion database ID for write-back when you are ready to create pending users directly in Notion.",
      },
    });
  } catch (error) {
    const status = error instanceof NotionConfigError ? 400 : 502;
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof NotionConfigError
            ? error.message
            : "Unable to submit signup request.",
      },
      { status },
    );
  }
}
