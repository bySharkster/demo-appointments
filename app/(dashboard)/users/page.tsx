import { createClient } from "@/utils/supabase/server";
import { getUserRole } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
// import { UserList } from "@/components/lists/UserList";

export default async function ProtectedPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const userRole = await getUserRole(supabase, user.id);

  if (userRole !== "Admin") {
    return <div>Access Denied</div>;
  }

  return (
    <div>
      <h1>User list to manage users</h1>
      {/* <UserList /> */}
    </div>
  );
}
