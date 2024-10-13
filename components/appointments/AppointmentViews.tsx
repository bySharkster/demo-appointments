"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/utils/supabase/client";
import { CalendarView } from "./CalendarView";
import { ListView } from "./ListView";
import { CardView } from "./CardView";
import { Appointment } from "@/app/types";
import { listAppointments } from "@/app/actions/appointments/actions";
import { isSameDay } from "date-fns";
import { useUserRole } from "@/hooks/useUserRole";

export function AppointmentViews() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState("calendar");
  const userRole = useUserRole() || "User";

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const data = await listAppointments();
        setAppointments(data);
        setFilteredAppointments(data);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAppointments();
  }, [setAppointments]);

  useEffect(() => {
    if (selectedDate) {
      const filtered = appointments.filter((appointment) =>
        isSameDay(new Date(appointment.start_time), selectedDate)
      );
      setFilteredAppointments(filtered);
      setActiveView("list"); // Switch to list view when a date is selected
    } else {
      setFilteredAppointments(appointments);
    }
  }, [selectedDate, appointments]);

  const handleUpdate = () => {
    // Refetch appointments after an update
    listAppointments().then((data) => {
      setAppointments(data);
      setFilteredAppointments(data);
    });
  };

  if (isLoading) {
    return <div>Loading appointments...</div>;
  }

  return (
    <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="calendar">Calendar</TabsTrigger>
        <TabsTrigger value="list">List</TabsTrigger>
        <TabsTrigger value="card">Card</TabsTrigger>
      </TabsList>
      <TabsContent value="calendar">
        <CalendarView
          appointments={appointments}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </TabsContent>
      <TabsContent value="list">
        <ListView
          appointments={filteredAppointments}
          selectedDate={selectedDate}
          clearSelectedDate={() => setSelectedDate(undefined)}
          userRole={userRole}
          onUpdate={handleUpdate}
        />
      </TabsContent>
      <TabsContent value="card">
        <CardView
          appointments={filteredAppointments}
          selectedDate={selectedDate}
          clearSelectedDate={() => setSelectedDate(undefined)}
          userRole={userRole}
          onUpdate={handleUpdate}
        />
      </TabsContent>
    </Tabs>
  );
}
