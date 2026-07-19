import { TreeApp } from "@/components/tree/TreeApp";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <TreeApp userId={user?.id ?? null} userEmail={user?.email ?? null} />;
}
