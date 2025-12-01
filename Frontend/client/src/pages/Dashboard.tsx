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
import { Plus, Search, Calendar, Clock, User, Filter } from "lucide-react";
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

enum AppointmentStatus {
  Scheduled = 1,
  Cancelled = 2,
  Completed = 3,
  Denied = 4
}

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
  status: AppointmentStatus;
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


  const getStatusLabel = (status: AppointmentStatus): string => {
    switch (status) {
      case AppointmentStatus.Scheduled: return "Scheduled";
      case AppointmentStatus.Cancelled: return "Cancelled";
      case AppointmentStatus.Completed: return "Completed";
      case AppointmentStatus.Denied: return "Denied";
      default: return "Unknown";
    }
  };

  const getStatusColor = (status: AppointmentStatus): string => {
    switch (status) {
      case AppointmentStatus.Scheduled: return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case AppointmentStatus.Cancelled: return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case AppointmentStatus.Completed: return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case AppointmentStatus.Denied: return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
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
          const startDate = apt.start.split('T')[0];
          const startTime = apt.start.split('T')[1].substring(0, 5);
          const status = apt.status as AppointmentStatus;
          
          return {
            id: apt.id,
            clientName: apt.clientId, 
            clientEmail: "",
            clientPhone: "",
            service: apt.serviceName,
            professional: apt.professionalName,
            date: startDate,
            time: startTime,
            duration: service?.duration || 0,
            status,
            notes: apt.notes || ""
          };
        });
        
        setAppointments(mappedAppointments);
        setServices(servicesData);
        setProfessionals(professionalsData);
      } catch (error: any) {
        console.error("Failed to load data:", error);
        const errorMessage = error?.response?.data?.error || error?.message || "Failed to load appointments";
        toast.error(errorMessage);
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

      // Validação para bloquear agendamentos no passado
      const selectedDateTime = new Date(`${formDate}T${formTime}`);
      const now = new Date();

      if (selectedDateTime.getTime() < now.getTime()) {
        toast.error("Cannot schedule an appointment in the past.");
        return;
      }

      
const startDateTimeString = `${formDate}T${formTime}:00Z`;

      const createdAppointment = await appointmentsApi.createAppointment({
        serviceId: formService,
        professionalId: formProfessional || undefined,
        start: startDateTimeString,
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
        status: AppointmentStatus.Scheduled,
        notes: formNotes
      };

      setAppointments([...appointments, newAppointment]);
      toast.success("Appointment created successfully!");
      setDialogOpen(false);
      resetForm();
    } catch (error: any) {
      console.error("Failed to create appointment:", error);
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to create appointment";
      toast.error(errorMessage);
    }
  };

  const handleDeleteAppointment = async (id: number) => {
    try {
      await appointmentsApi.deleteAppointment(id);
      setAppointments(appointments.filter(a => a.id !== id));
      toast.success("Appointment deleted successfully!");
    } catch (error: any) {
      console.error("Failed to delete appointment:", error);
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to delete appointment";
      toast.error(errorMessage);
    }
  };

  const handleStatusChange = async (id: number, newStatus: AppointmentStatus) => {
    // Se for cancelamento, abrir diálogo de confirmação
    if (newStatus === AppointmentStatus.Cancelled) {
      setAppointmentToCancel(id);
      setCancelDialogOpen(true);
      return;
    }

    try {
      await appointmentsApi.updateAppointmentStatus(id, newStatus);
      
      setAppointments(appointments.map(a =>
        a.id === id ? { ...a, status: newStatus } : a
      ));
      toast.success("Status atualizado com sucesso");
    } catch (error: any) {
      console.error("Failed to update status:", error);
      const errorMessage = error?.response?.data?.error || error?.message || "Falha ao atualizar status";
      toast.error(errorMessage);
    }
  };

  const confirmCancellation = async () => {
    if (!appointmentToCancel) return;

    try {
      await appointmentsApi.updateAppointmentStatus(appointmentToCancel, AppointmentStatus.Cancelled);
      
      setAppointments(appointments.map(a =>
        a.id === appointmentToCancel ? { ...a, status: AppointmentStatus.Cancelled } : a
      ));
      toast.success("Agendamento cancelado com sucesso");
    } catch (error: any) {
      console.error("Failed to cancel appointment:", error);
      const errorMessage = error?.response?.data?.error || error?.message || "Falha ao cancelar agendamento";
      toast.error(errorMessage);
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
    const matchesStatus = statusFilter === "all" || a.status.toString() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const todayAppointments = appointments.filter(a => a.date === new Date().toISOString().split('T')[0]);
  const scheduledAppointments = appointments.filter(a => a.status === AppointmentStatus.Scheduled);

  return (
    <DashboardLayout userRole={user?.roles[0] as "Empresa" | "Cliente"} onLogout={handleLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's your appointment overview
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
            {user?.roles?.[0] === "Empresa" && (
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" onClick={() => navigate(slug ? `/${slug}/servicos` : "/servicos")}>
                  Serviços
                </Button>
                <Button variant="outline" onClick={() => navigate(slug ? `/${slug}/colaboradores` : "/colaboradores")}>
                  Colaboradores
                </Button>
              </div>
            )}
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Agendados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{scheduledAppointments.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Total agendados</p>
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
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="1">Scheduled</SelectItem>
                  <SelectItem value="2">Cancelled</SelectItem>
                  <SelectItem value="3">Completed</SelectItem>
                  <SelectItem value="4">Denied</SelectItem>
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
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      {/* Linha principal: Serviço e Status */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-lg font-bold text-foreground">{appointment.service}</h3>
                        <Badge className={getStatusColor(appointment.status)}>
                          {getStatusLabel(appointment.status)}
                        </Badge>
                      </div>
                      
                      {/* Linha de informações: Data, Hora e Duração */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-5 w-5 text-primary" />
                          <span>{appointment.date.split('-').reverse().join('/')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-5 w-5 text-primary" />
                          <span>{appointment.time}</span>
                        </div>
                        {appointment.duration > 0 && (
                          <div className="text-xs text-muted-foreground">
                            ({appointment.duration} min)
                          </div>
                        )}
                      </div>

                      {/* Profissional */}
                      {appointment.professional && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>{appointment.professional}</span>
                        </div>
                      )}
                      
                      {/* Notas */}
                      {appointment.notes && (
                        <p className="text-xs text-muted-foreground italic">Note: {appointment.notes}</p>
                      )}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {/* Se cliente, só pode cancelar se status for Scheduled */}
                      {isClient ? (
                        appointment.status === AppointmentStatus.Scheduled ? (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleStatusChange(appointment.id, AppointmentStatus.Cancelled)}
                          >
                            Cancelar Agendamento
                          </Button>
                        ) : (
                          <Badge className={getStatusColor(appointment.status)} variant="outline">
                            {getStatusLabel(appointment.status)}
                          </Badge>
                        )
                      ) : (
                        /* Se empresa, pode alterar todos os status */
                        <Select
                          value={appointment.status.toString()}
                          onValueChange={(value) => handleStatusChange(appointment.id, parseInt(value) as AppointmentStatus)}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Scheduled</SelectItem>
                            <SelectItem value="2">Cancelled</SelectItem>
                            <SelectItem value="3">Completed</SelectItem>
                            <SelectItem value="4">Denied</SelectItem>
                          </SelectContent>
                        </Select>
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
