import { createClient } from "@/utils/supabase/server";
import { getUserRole } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const withRoleCheck =
  (
    allowedRoles: string[],
    handler: (req: NextRequest, res: NextResponse) => Promise<NextResponse>
  ) =>
  async (req: NextRequest, res: NextResponse) => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = await getUserRole(supabase, user.id);

    if (!allowedRoles.includes(userRole)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return handler(req, res);
  };
