import { NextResponse } from "next/server";
import { roleRedirect, verifyOtp } from "@/lib/otpStore";
import type { Role } from "@/lib/types";

const ROLES: Role[] = ["admin", "member", "investor", "partner", "lender"];

const isRole = (value: unknown): value is Role =>
  typeof value === "string" && ROLES.includes(value as Role);

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    role?: Role;
    code?: string;
  };

  const email = body.email?.trim().toLowerCase() ?? "";
  const role = isRole(body.role) ? body.role : "member";
  const code = body.code?.trim() ?? "";

  if (!email || !code) {
    return NextResponse.json(
      { success: false, error: "Email and code are required." },
      { status: 400 },
    );
  }

  const result = verifyOtp(email, role, code);

  if (!result.ok) {
    return NextResponse.json(
      { success: false, error: result.error },
      { status: 401 },
    );
  }

  const user = result.user;

  return NextResponse.json({
    success: true,
    data: {
      role: user.role,
      email: user.email,
      name: user.name,
      relationshipType: user.relationshipType,
      contactId: user.contactId,
      membershipTier: user.membershipTier,
      accessLevel: user.accessLevel,
      interests: user.interests,
      ndaStatus: user.ndaStatus,
      verificationStatus: user.verificationStatus,
      source: user.source,
      redirectPath: roleRedirect(user.role),
    },
  });
}
