"use client";
import { useUserRole } from "@/hooks/useUserRole";
import { CreateAppointment } from "./CreateAppointment";
import { AppointmentViews } from "./AppointmentViews";

export const AppointmentList = () => {
  const userRole = useUserRole();

  return (
    <div>
      <h1>Appointments</h1>
      {/* Render appointment list */}
      {`${userRole}`}
      <AppointmentViews />
      <div className="w-full h-px bg-gray-300 my-2"></div>
      {/* Render create appointment form for Admin and Creator */}
      {(userRole === "Admin" || userRole === "Creator") && (
        <CreateAppointment />
      )}
    </div>
  );
};
