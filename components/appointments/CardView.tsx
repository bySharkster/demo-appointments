import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { AppointmentCard } from "./AppointmentCard";
import { Appointment } from "@/app/types";
import { CreateAppointment } from "./CreateAppointment";

interface CardViewProps {
  appointments: Appointment[];
  selectedDate: Date | undefined;
  clearSelectedDate: () => void;
  userRole: string;
  onUpdate: () => void;
}

export function CardView({
  appointments,
  selectedDate,
  clearSelectedDate,
  userRole,
  onUpdate,
}: CardViewProps) {
  return (
    <div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              userRole={userRole}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
