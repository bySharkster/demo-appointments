import { createClient } from "@/utils/supabase/client";

export async function fetchUsersByRole(
  role: number,
  appointmentStartTime: string
) {
  const supabase = createClient();

  // Fetch users with the specified role
  const { data: users, error } = await supabase
    .from("profiles")
    .select("id, first_name, last_name")
    .eq("role_id", role);

  if (error) throw error;

  // Fetch appointments that overlap with the given start time
  const appointmentEndTime = new Date(
    new Date(appointmentStartTime).getTime() + 60 * 60 * 1000
  ).toISOString();
  const { data: busyVendors, error: appointmentError } = await supabase
    .from("appointments")
    .select("assigned_to")
    .or(
      `and(start_time.gte.${appointmentStartTime},start_time.lt.${appointmentEndTime}),and(end_time.gt.${appointmentStartTime},end_time.lte.${appointmentEndTime})`
    )
    .not("status", "eq", "CANCELLED");

  if (appointmentError) throw appointmentError;

  // Filter out busy vendors
  const busyVendorIds = busyVendors.map(
    (appointment) => appointment.assigned_to
  );
  const availableVendors = users.filter(
    (user) => !busyVendorIds.includes(user.id)
  );

  return availableVendors;
}
export async function fetchUserProfile(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("first_name, last_name")
    .eq("id", userId)
    .single();

  if (error) throw error;

  return data;
}
