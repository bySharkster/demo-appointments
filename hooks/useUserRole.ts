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
          .select("role_id")
          .eq("id", user.id)
          .single();

        if (!data) throw new Error("User profile not found");

        const { data: userRole } = await supabase
          .from("roles")
          .select("role_name")
          .eq("role_id", data.role_id)
          .single();

        if (!userRole) throw new Error("User role not found");

        if (!error && data && data.role_id && userRole.role_name) {
          setRole(userRole.role_name);
        } else {
          console.error("Role information is missing");
        }
      }
    };

    fetchRole();
  }, []);

  return role;
};
