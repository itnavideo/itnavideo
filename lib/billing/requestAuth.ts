import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthenticatedRequestUser = {
  id: string;
  email: string | null;
};

export async function getAuthenticatedRequestUser(request: Request): Promise<AuthenticatedRequestUser | null> {
  const authorization = request.headers.get("authorization") || "";
  const accessToken = authorization.replace(/^Bearer\s+/i, "").trim();
  if (!accessToken) return null;

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user) return null;

  return {
    id: data.user.id,
    email: data.user.email || null,
  };
}
