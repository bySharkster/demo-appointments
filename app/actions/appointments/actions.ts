"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createAppointment(formData: FormData) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const client_name = formData.get("client_name") as string;
  const client_place = formData.get("client_place") as string;
  const start_time = formData.get("start_time") as string;
  const phone_number = formData.get("phone_number") as string;
  const additional_notes = formData.get("additional_notes") as string;

  if (!client_name || !client_place || !start_time || !phone_number) {
    throw new Error("Missing required fields");
  }

  const end_time = new Date(
    new Date(start_time).getTime() + 60 * 60 * 1000
  ).toISOString();

  const { data, error } = await supabase
    .from("appointments")
    .insert({
      client_name,
      client_place,
      start_time,
      end_time,
      phone_number,
      additional_notes,
      created_by: user.id,
      status: "PENDING",
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  revalidatePath("/appointments");
  return data;
}
export async function listAppointments() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .order("start_time", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

export async function getAppointment(id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateAppointment(id: string, formData: FormData) {
  const supabase = createClient();

  const {
    client_name,
    client_place,
    start_time,
    end_time,
    phone_number,
    additional_notes,
  } = Object.fromEntries(formData.entries());

  const { data, error } = await supabase
    .from("appointments")
    .update({
      client_name,
      client_place,
      start_time,
      end_time,
      phone_number,
      additional_notes,
    })
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  revalidatePath("/appointments");
  return data;
}

export async function updateAppointmentStatus(
  appointmentId: string,
  status: string
) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Get user role
  const { data: profile } = await supabase
    .from("profiles")
    .select("roles(role_name)")
    .eq("id", user.id)
    .single();

  if (!profile) throw new Error("User profile not found");

  // Check permissions based on status and user role
  if (
    (status === "CONFIRMED" || status === "CLOSED") &&
    !["Vendor", "Admin"].includes(profile.roles.role_name)
  ) {
    throw new Error("Unauthorized to perform this action");
  }

  const { data, error } = await supabase
    .from("appointments")
    .update({ status })
    .eq("id", appointmentId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
export async function cancelAppointment(appointmentId: string) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("appointments")
    .update({ status: "CANCELLED" })
    .eq("id", appointmentId)
    .or(
      `created_by.eq.${user.id},assigned_by.eq.${user.id},assigned_to.eq.${user.id}`
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}
export async function assignAppointment(
  appointmentId: string,
  vendorId: string
) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Get user role
  const { data: profile } = await supabase
    .from("profiles")
    .select("roles(role_name)")
    .eq("id", user.id)
    .single();

  if (!profile || !["Coordinator", "Admin"].includes(profile.roles.role_name)) {
    throw new Error("Unauthorized to perform this action");
  }

  const { data, error } = await supabase
    .from("appointments")
    .update({ assigned_to: vendorId, assigned_by: user.id, status: "ASSIGNED" })
    .eq("id", appointmentId)
    .in("status", ["PENDING", "ASSIGNED"])
    .select()
    .single();

  if (error) throw error;
  return data;
}
