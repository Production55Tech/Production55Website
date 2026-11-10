import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";
import type { Request, Response } from "express";

export function createClient(req: Request, res: Response) {
  return createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll() {
        return parseCookieHeader(req.headers.cookie ?? "").map((c) => ({
          name: c.name,
          value: c.value ?? "",
        }));
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          res.appendHeader("Set-Cookie", serializeCookieHeader(name, value, options)),
        );
      },
    },
  });
}
