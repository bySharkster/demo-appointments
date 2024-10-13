"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Appointment } from "@/app/types";
import {
  assignAppointment,
  cancelAppointment,
  updateAppointmentStatus,
} from "@/app/actions/appointments/actions";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { fetchUsersByRole } from "@/app/actions/users/actions";

interface AppointmentActionsProps {
  appointment: Appointment;
  userRole: string;
  onUpdate: () => void;
}

export function AppointmentActions({
  appointment,
  userRole,
  onUpdate,
}: AppointmentActionsProps) {
  const { toast } = useToast();
  const [availableVendors, setAvailableVendors] = useState<
    { id: string; first_name: string; last_name: string }[]
  >([]);

  useEffect(() => {
    if (
      ["Coordinator", "Admin"].includes(userRole) &&
      appointment.status === "PENDING"
    ) {
      fetchUsersByRole(3, appointment.start_time)
        .then(setAvailableVendors)
        .catch((error) => console.error("Failed to fetch vendors:", error));
    }
  }, [userRole, appointment.status, appointment.start_time]);

  const handleStatusUpdate = async (status: string) => {
    try {
      await updateAppointmentStatus(appointment.id, status);
      toast({ title: "Status updated successfully" });
      onUpdate();
    } catch (error) {
      toast({ title: "Failed to update status", variant: "destructive" });
    }
  };

  const handleCancel = async () => {
    try {
      await cancelAppointment(appointment.id);
      toast({ title: "Appointment cancelled successfully" });
      onUpdate();
    } catch (error) {
      toast({ title: "Failed to cancel appointment", variant: "destructive" });
    }
  };

  const handleAssign = async (vendorId: string) => {
    try {
      await assignAppointment(appointment.id, vendorId);
      toast({ title: "Appointment assigned successfully" });
      onUpdate();
    } catch (error) {
      toast({
        title: `Failed to assign appointment `,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full ">
      {["Coordinator", "Admin"].includes(userRole) &&
        appointment.status === "PENDING" && (
          <Select onValueChange={handleAssign}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Assign to vendor" />
            </SelectTrigger>
            <SelectContent>
              {availableVendors.map((vendor) => (
                <SelectItem key={vendor.id} value={vendor.id}>
                  {`${vendor.first_name} ${vendor.last_name} `}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      {["Vendor", "Admin"].includes(userRole) &&
        appointment.status === "ASSIGNED" && (
          <Button onClick={() => handleStatusUpdate("CONFIRMED")}>
            Confirm
          </Button>
        )}
      {["Vendor", "Admin"].includes(userRole) &&
        appointment.status === "CONFIRMED" && (
          <Button onClick={() => handleStatusUpdate("CLOSED")}>Close</Button>
        )}

      <Button onClick={handleCancel} variant="destructive">
        Cancel
      </Button>
    </div>
  );
}
