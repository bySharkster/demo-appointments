// hooks/useUserRole.ts
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export const useUserRole = () => {
  const [role, setRole] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("roles(role_name)")
          .eq("id", user.id)
          .single();

        if (!error && data && data.roles && data.roles.role_name) {
          setRole(data.roles.role_name);
        } else {
          console.error("Role information is missing");
        }
      }
    };

    fetchRole();
  }, []);

  return role;
};
