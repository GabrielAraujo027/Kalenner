import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

export type AppointmentStatus = "scheduled" | "completed" | "cancelled";

export interface Appointment {
  id: string;
  service: string;
  clientName: string;
  time: string;
  date: string;
  status: AppointmentStatus;
}

interface AppointmentCardProps {
  appointment: Appointment;
}

const statusConfig = {
  scheduled: {
    label: "Agendado",
    className: "bg-warning text-warning-foreground hover:bg-warning/90",
  },
  completed: {
    label: "Concluído",
    className: "bg-success text-success-foreground hover:bg-success/90",
  },
  cancelled: {
    label: "Cancelado",
    className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  },
};

const AppointmentCard = ({ appointment }: AppointmentCardProps) => {
  const status = statusConfig[appointment.status];

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">{appointment.service}</h3>
          <p className="text-muted-foreground text-sm">{appointment.clientName}</p>
        </div>
        <div className="flex items-center gap-1 text-foreground font-medium">
          <Clock className="w-4 h-4" />
          <span>{appointment.time}</span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Badge className={status.className}>{status.label}</Badge>
        <span className="text-sm text-muted-foreground">{appointment.date}</span>
      </div>
    </Card>
  );
};

export default AppointmentCard;
