"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useToast } from "@/hooks/use-toast";
import { createAppointment } from "@/app/actions/appointments/actions";

const formSchema = z.object({
  client_name: z.string().min(2, {
    message: "El nombre del cliente debe tener al menos 2 caracteres.",
  }),
  client_place: z.string().min(2, {
    message: "El lugar del cliente debe tener al menos 2 caracteres.",
  }),
  start_time: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Por favor, seleccione una fecha y hora válida.",
  }),
  phone_number: z.string().min(10, {
    message: "El número de teléfono debe tener al menos 10 caracteres.",
  }),
  additional_notes: z.string().optional(),
});

export function CreateAppointment() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client_name: "",
      client_place: "",
      start_time: "",
      phone_number: "",
      additional_notes: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });

      await createAppointment(formData);

      toast({
        title: "Cita Creada",
        description: "La cita a sido creada exitosamente.",
      });
      setOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Fallo al crear la cita. Intente de nuevo.",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Appointment</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Appointment</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new appointment.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="client_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="client_place"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Place</FormLabel>
                  <FormControl>
                    <Input placeholder="Office A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="start_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="additional_notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Any additional information"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Create Appointment</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
