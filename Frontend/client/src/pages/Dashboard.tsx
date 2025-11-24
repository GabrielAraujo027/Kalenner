import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useCompanySlug } from "@/hooks/useCompanySlug";
import { appointmentsApi, servicesApi, professionalsApi } from "@/services";
import type { AppointmentResponse, ServiceResponse, ProfessionalResponse } from "@/services";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Calendar, Clock, User, Filter, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Appointment {
  id: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  service: string;
  professional: string;
  date: string;
  time: string;
  duration: number;
  status: "confirmed" | "pending" | "completed" | "cancelled" | "denied";
  notes: string;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const slug = useCompanySlug();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<number | null>(null);

  // Helper para converter status string para número (enum do backend)
  const statusToNumber = (status: string): number => {
    switch (status) {
      case "scheduled":
      case "confirmed":
      case "pending":
        return 1; // Scheduled
      case "cancelled":
        return 2; // Cancelled
      case "completed":
        return 3; // Completed
      case "denied":
        return 4; // Denied
      default:
        return 1;
    }
  };

  // Verificar se usuário é cliente
  const isClient = user?.roles?.[0] === "Cliente";

  // Form states
  const [formService, setFormService] = useState<number | null>(null);
  const [formProfessional, setFormProfessional] = useState<number | null>(null);
  const [formDate, setFormDate] = useState("");
  const [formTime, setFormTime] = useState("");
  const [formNotes, setFormNotes] = useState("");

  const handleLogout = () => {
    logout();
    navigate(slug ? `/${slug}/login` : "/login");
  };

  // Estado de dados
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<ServiceResponse[]>([]);
  const [professionals, setProfessionals] = useState<ProfessionalResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar dados da API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [appointmentsData, servicesData, professionalsData] = await Promise.all([
          appointmentsApi.getAppointments(),
          servicesApi.getServices(),
          professionalsApi.getProfessionals(),
        ]);
        
        const mappedAppointments: Appointment[] = appointmentsData.map(apt => {
          const service = servicesData.find(s => s.id === apt.serviceId);
          return {
            id: apt.id,
            clientName: apt.clientId, 
            clientEmail: "",
            clientPhone: "",
            service: apt.serviceName,
            professional: apt.professionalName,
            date: new Date(apt.start).toISOString().split('T')[0],
            time: new Date(apt.start).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            duration: service?.duration || 0,
            status: apt.status === "scheduled" ? "confirmed" : apt.status === "completed" ? "completed" : apt.status === "cancelled" ? "cancelled" : "pending",
            notes: apt.notes || ""
          };
        });
        
        setAppointments(mappedAppointments);
        setServices(servicesData);
        setProfessionals(professionalsData);
      } catch (error) {
        console.error("Failed to load data:", error);
        toast.error("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleCreateAppointment = async () => {
    if (!formService || !formDate || !formTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const selectedService = services.find(s => s.id === formService);
      
      if (!selectedService) {
        toast.error("Invalid service selected");
        return;
      }

      const startDateTime = new Date(`${formDate}T${formTime}`);

      const createdAppointment = await appointmentsApi.createAppointment({
        serviceId: formService,
        professionalId: formProfessional || undefined,
        start: startDateTime.toISOString(),
        notes: formNotes || undefined
      });

      const newAppointment: Appointment = {
        id: createdAppointment.id,
        clientName: createdAppointment.clientId,
        clientEmail: "",
        clientPhone: "",
        service: createdAppointment.serviceName,
        professional: createdAppointment.professionalName,
        date: formDate,
        time: formTime,
        duration: selectedService.duration,
        status: "pending",
        notes: formNotes
      };

      setAppointments([...appointments, newAppointment]);
      toast.success("Appointment created successfully!");
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to create appointment:", error);
      toast.error("Failed to create appointment");
    }
  };

  const handleDeleteAppointment = (id: number) => {
    setAppointments(appointments.filter(a => a.id !== id));
    toast.success("Appointment deleted");
  };

  const handleStatusChange = async (id: number, newStatus: Appointment["status"]) => {
    // Se for cancelamento, abrir diálogo de confirmação
    if (newStatus === "cancelled") {
      setAppointmentToCancel(id);
      setCancelDialogOpen(true);
      return;
    }

    try {
      const statusNumber = statusToNumber(newStatus);
      await appointmentsApi.updateAppointmentStatus(id, statusNumber);
      
      setAppointments(appointments.map(a =>
        a.id === id ? { ...a, status: newStatus } : a
      ));
      toast.success("Appointment status updated");
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update appointment status");
    }
  };

  const confirmCancellation = async () => {
    if (!appointmentToCancel) return;

    try {
      await appointmentsApi.updateAppointmentStatus(appointmentToCancel, 2); // 2 = Cancelled
      
      setAppointments(appointments.map(a =>
        a.id === appointmentToCancel ? { ...a, status: "cancelled" } : a
      ));
      toast.success("Appointment cancelled");
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
      toast.error("Failed to cancel appointment");
    } finally {
      setCancelDialogOpen(false);
      setAppointmentToCancel(null);
    }
  };

  const resetForm = () => {
    setFormService(null);
    setFormProfessional(null);
    setFormDate("");
    setFormTime("");
    setFormNotes("");
  };

  const filteredAppointments = appointments.filter(a => {
    const matchesSearch = a.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         a.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Appointment["status"]) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "completed": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "cancelled": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    }
  };

  const todayAppointments = appointments.filter(a => a.date === new Date().toISOString().split('T')[0]);
  const confirmedAppointments = appointments.filter(a => a.status === "confirmed");

  return (
    <DashboardLayout userRole={user?.roles[0] as "Empresa" | "Cliente"} onLogout={handleLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's your appointment overview
            </p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Appointment</DialogTitle>
                <DialogDescription>
                  Schedule a new appointment
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="service">Service *</Label>
                    <Select value={formService?.toString()} onValueChange={(value) => setFormService(Number(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((s) => (
                          <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="professional">Professional</Label>
                    <Select value={formProfessional?.toString()} onValueChange={(value) => setFormProfessional(Number(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {professionals.map((p) => (
                          <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formTime}
                      onChange={(e) => setFormTime(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    placeholder="Additional notes..."
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => {
                  setDialogOpen(false);
                  resetForm();
                }}>
                  Cancel
                </Button>
                <Button onClick={handleCreateAppointment}>
                  Create Appointment
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Today's Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{todayAppointments.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Scheduled for today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Confirmed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{confirmedAppointments.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Total confirmed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{appointments.length}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <div className="space-y-3">
          {filteredAppointments.length === 0 ? (
            <Card>
              <CardContent className="pt-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No appointments found</p>
              </CardContent>
            </Card>
          ) : (
            filteredAppointments.map((appointment) => (
              <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      {/* Linha principal: Serviço e Status */}
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-foreground">{appointment.service}</h3>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </Badge>
                      </div>
                      
                      {/* Linha de informações: Data, Hora e Duração */}
                      <div className="flex items-center gap-6 text-base">
                        <div className="flex items-center gap-2 text-foreground font-semibold">
                          <Calendar className="h-5 w-5 text-primary" />
                          <span>{new Date(appointment.date).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-foreground font-semibold">
                          <Clock className="h-5 w-5 text-primary" />
                          <span>{appointment.time}</span>
                        </div>
                        {appointment.duration > 0 && (
                          <div className="text-sm text-muted-foreground">
                            ({appointment.duration} min)
                          </div>
                        )}
                      </div>

                      {/* Profissional */}
                      {appointment.professional && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>{appointment.professional}</span>
                        </div>
                      )}
                      
                      {/* Notas */}
                      {appointment.notes && (
                        <p className="text-sm text-muted-foreground italic">Note: {appointment.notes}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {/* Se cancelado, apenas mostrar o status */}
                      {appointment.status === "cancelled" ? (
                        <Badge className={getStatusColor(appointment.status)} variant="outline">
                          Cancelled
                        </Badge>
                      ) : (
                        /* Se cliente, só pode cancelar */
                        isClient ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(appointment.id, "cancelled")}
                            className="text-destructive hover:text-destructive"
                          >
                            Cancel
                          </Button>
                        ) : (
                          /* Se empresa, pode alterar todos os status */
                          <>
                            <Select
                              value={appointment.status}
                              onValueChange={(value) => handleStatusChange(appointment.id, value as Appointment["status"])}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="confirmed">Confirm</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="completed">Complete</SelectItem>
                                <SelectItem value="cancelled">Cancel</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteAppointment(appointment.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Diálogo de confirmação de cancelamento */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar agendamento?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Não</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancellation} className="bg-destructive hover:bg-destructive/90">
              Sim, cancelar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
