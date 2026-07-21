import type { BlueprintUser } from "@/lib/notionService";

export type OtpRecord = {
  email: string;
  role: BlueprintUser["role"];
  code: string;
  expiresAt: number;
  attempts: number;
  user: BlueprintUser;
};

const globalStore = globalThis as typeof globalThis & {
  __sbfOtpStore?: Map<string, OtpRecord>;
};

const store = globalStore.__sbfOtpStore ?? new Map<string, OtpRecord>();
globalStore.__sbfOtpStore = store;

const keyFor = (email: string, role: string) => `${email.trim().toLowerCase()}::${role}`;

export const createOtp = (user: BlueprintUser) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const record: OtpRecord = {
    email: user.email,
    role: user.role,
    code,
    expiresAt: Date.now() + 10 * 60 * 1000,
    attempts: 0,
    user,
  };

  store.set(keyFor(user.email, user.role), record);
  return record;
};

export const verifyOtp = (email: string, role: string, code: string) => {
  const record = store.get(keyFor(email, role));
  if (!record) return { ok: false as const, error: "No active code found. Request a new code." };
  if (Date.now() > record.expiresAt) {
    store.delete(keyFor(email, role));
    return { ok: false as const, error: "This code has expired. Request a new code." };
  }

  record.attempts += 1;
  if (record.attempts > 5) {
    store.delete(keyFor(email, role));
    return { ok: false as const, error: "Too many attempts. Request a new code." };
  }

  if (record.code !== code.trim()) {
    return { ok: false as const, error: "Incorrect code." };
  }

  store.delete(keyFor(email, role));
  return { ok: true as const, user: record.user };
};

export const roleRedirect = (role: BlueprintUser["role"]) => (role === "admin" ? "/admin" : "/dashboard");
