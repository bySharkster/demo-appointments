import { format } from "date-fns";
import { AppointmentActions } from "./AppointmentActions";
import { Appointment } from "@/app/types";
import { useEffect, useState } from "react";
import { fetchUserProfile } from "@/app/actions/users/actions";

interface AppointmentListItemProps {
  appointment: Appointment;
  userRole: string;
  onUpdate: () => void;
}

export function AppointmentListItem({
  appointment,
  userRole,
  onUpdate,
}: AppointmentListItemProps) {
  const [assignedVendor, setAssignedVendor] = useState<{
    first_name: string;
    last_name: string;
  } | null>(null);

  useEffect(() => {
    if (appointment.status === "ASSIGNED" && appointment.assigned_to) {
      fetchUserProfile(appointment.assigned_to)
        .then(setAssignedVendor)
        .catch((error) =>
          console.error("Failed to fetch assigned vendor:", error)
        );
    }
  }, [appointment.status, appointment.assigned_to]);

  return (
    <>
      {appointment.status !== "CANCELLED" && (
        <div className="flex justify-between items-center p-4 border rounded-lg gap-2 flex-row">
          <div className="flex flex-col text-nowrap">
            <h3 className="font-bold">{appointment.client_name}</h3>
            <p>{appointment.client_place}</p>
            <p>{format(new Date(appointment.start_time), "PPp")}</p>
            <p>Status: {appointment.status}</p>
            {appointment.status === "ASSIGNED" && ( // Show vendor name if appointment is assigned
              <p>
                {" "}
                Assigned to:{" "}
                {assignedVendor?.first_name.concat(
                  " ",
                  assignedVendor.last_name
                )}
              </p>
            )}
          </div>
          <AppointmentActions
            appointment={appointment}
            userRole={userRole}
            onUpdate={onUpdate}
          />
        </div>
      )}
    </>
  );
}
