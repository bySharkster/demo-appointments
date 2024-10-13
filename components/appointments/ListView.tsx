import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { AppointmentListItem } from "./AppointmentListItem";
import { Appointment } from "@/app/types";
import { CreateAppointment } from "./CreateAppointment";

interface ListViewProps {
  appointments: Appointment[];
  selectedDate: Date | undefined;
  clearSelectedDate: () => void;
  userRole: string;
  onUpdate: () => void;
}

export function ListView({
  appointments,
  selectedDate,
  clearSelectedDate,
  userRole,
  onUpdate,
}: ListViewProps) {
  return (
    <div className="space-y-4">
      {selectedDate && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Appointments for {format(selectedDate, "MMMM d, yyyy")}
          </h2>
          <Button onClick={clearSelectedDate} variant="outline">
            Clear Filter
          </Button>
        </div>
      )}
      {appointments.length === 0 ? (
        <>
          <p>No appointments found for this date.</p>
          {(userRole === "Admin" || userRole === "Creator") && (
            <CreateAppointment />
          )}
        </>
      ) : (
        appointments.map((appointment) => (
          <AppointmentListItem
            key={appointment.id}
            appointment={appointment}
            userRole={userRole}
            onUpdate={onUpdate}
          />
        ))
      )}
    </div>
  );
}
