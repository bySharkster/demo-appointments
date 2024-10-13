import { Calendar } from "@/components/ui/calendar";
import { Appointment } from "@/app/types";

interface CalendarViewProps {
  appointments: Appointment[];
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
}

export function CalendarView({
  appointments,
  selectedDate,
  setSelectedDate,
}: CalendarViewProps) {
  const appointmentDates = appointments.map((app) => new Date(app.start_time));

  return (
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={setSelectedDate}
      className="rounded-md border"
      modifiers={{ hasAppointment: appointmentDates }}
      modifiersStyles={{
        hasAppointment: { backgroundColor: "lightblue" },
      }}
    />
  );
}
