import { createAuthClient } from "better-auth/react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error("NEXT_PUBLIC_API_URL is not configured.");
}

export const authClient = createAuthClient({
  baseURL: apiUrl.replace(/\/$/, ""),
});

export const { signIn, signUp, signOut, useSession } = authClient;
