export interface Appointment {
  id: string;
  client_name: string;
  client_place: string;
  start_time: string;
  end_time: string;
  status: string;
  phone_number: string;
  additional_notes?: string;
  assigned_to?: string;
}
