import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { AppointmentActions } from "./AppointmentActions";
import { Appointment } from "@/app/types";
import { useEffect, useState } from "react";
import { fetchUserProfile } from "@/app/actions/users/actions";

interface AppointmentCardProps {
  appointment: Appointment;
  userRole: string;
  onUpdate: () => void;
}

export function AppointmentCard({
  appointment,
  userRole,
  onUpdate,
}: AppointmentCardProps) {
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
        <Card>
          <CardHeader>
            <CardTitle>{appointment.client_name}</CardTitle>
            <CardDescription>{appointment.client_place}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Start:</strong>{" "}
              {format(new Date(appointment.start_time), "PPp")}
            </p>
            <p>
              <strong>End:</strong>{" "}
              {format(new Date(appointment.end_time), "PPp")}
            </p>
            <p>
              <strong>Status:</strong> {appointment.status}
            </p>
            <p>
              <strong>Phone:</strong> {appointment.phone_number}
            </p>
            {appointment.status === "ASSIGNED" && ( // Show vendor name if appointment is assigned
              <p>
                <strong>Assigned to: </strong>
                {assignedVendor?.first_name.concat(
                  " ",
                  assignedVendor.last_name
                )}
              </p>
            )}
            {appointment.additional_notes && (
              <p>
                <strong>Notes:</strong> {appointment.additional_notes}
              </p>
            )}
          </CardContent>
          <CardFooter>
            <AppointmentActions
              appointment={appointment}
              userRole={userRole}
              onUpdate={onUpdate}
            />
          </CardFooter>
        </Card>
      )}
    </>
  );
}
