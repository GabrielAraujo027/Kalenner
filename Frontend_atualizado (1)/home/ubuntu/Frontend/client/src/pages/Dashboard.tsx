import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCompany } from "@/hooks/useCompany";
import { api, ServiceResponse, ProfessionalResponse, CreateAppointmentRequest, AppointmentResponse } from "@/services/api";
import { format } from "date-fns";
import { useLocation } from "wouter";
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
  status: "confirmed" | "pending" | "completed" | "cancelled";
  notes: string;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { company } = useCompany();
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  const [services, setServices] = useState<ServiceResponse[]>([]);
  const [professionals, setProfessionals] = useState<ProfessionalResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (company?.id) {
      const fetchResources = async () => {
        try {
          const [fetchedServices, fetchedProfessionals] = await Promise.all([
            api.getServices(company.id),
            api.getProfessionals(company.id),
          ]);
          setServices(fetchedServices);
          setProfessionals(fetchedProfessionals);
        } catch (error) {
          console.error("Failed to fetch services or professionals:", error);
          toast.error("Failed to load services and professionals.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchResources();
    }
  }, [company?.id]);

  // Form states
  const [formClientName, setFormClientName] = useState("");
  const [formClientEmail, setFormClientEmail] = useState("");
  const [formClientPhone, setFormClientPhone] = useState("");
  const [formServiceId, setFormServiceId] = useState("");
  const [formProfessionalId, setFormProfessionalId] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formTime, setFormTime] = useState("");
  const [formNotes, setFormNotes] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const handleCreateAppointment = async () => {
    if (!formClientName || !formClientEmail || !formServiceId || !formProfessionalId || !formDate || !formTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    const service = services.find(s => s.id === parseInt(formServiceId));
    const professional = professionals.find(p => p.id === parseInt(formProfessionalId));

    if (!service || !professional) {
      toast.error("Invalid service or professional selected.");
      return;
    }

    const startDateTime = `${formDate}T${formTime}:00`;
    const serviceDuration = service.duration;
    const endTime = new Date(new Date(startDateTime).getTime() + serviceDuration * 60000);
    const endDateTime = format(endTime, "yyyy-MM-dd'T'HH:mm:ss");

    const newAppointmentData: CreateAppointmentRequest = {
      serviceId: parseInt(formServiceId),
      professionalId: parseInt(formProfessionalId),
      start: startDateTime,
      end: endDateTime,
      notes: formNotes,
    };

    try {
      const createdAppointment = await api.createAppointment(newAppointmentData);

      const mappedAppointment: Appointment = {
        id: createdAppointment.id,
        clientName: formClientName,
        clientEmail: formClientEmail,
        clientPhone: formClientPhone,
        service: service.name,
        professional: professional.name,
        date: formDate,
        time: formTime,
        status: createdAppointment.status as Appointment["status"],
        notes: createdAppointment.notes || "",
      };

      setAppointments([...appointments, mappedAppointment]);
      toast.success("Appointment created successfully!");
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error(`Failed to create appointment: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const handleDeleteAppointment = (id: number) => {
    setAppointments(appointments.filter(a => a.id !== id));
    toast.success("Appointment deleted");
  };

  const handleStatusChange = (id: number, newStatus: Appointment["status"]) => {
    setAppointments(appointments.map(a =>
      a.id === id ? { ...a, status: newStatus } : a
    ));
    toast.success("Appointment status updated");
  };

  const resetForm = () => {
    setFormClientName("");
    setFormClientEmail("");
    setFormClientPhone("");
    setFormServiceId("");
    setFormProfessionalId("");
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
                  Schedule a new appointment for your client
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="client-name">Client Name *</Label>
                  <Input
                    id="client-name"
                    placeholder="Full name"
                    value={formClientName}
                    onChange={(e) => setFormClientName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-email">Email *</Label>
                  <Input
                    id="client-email"
                    type="email"
                    placeholder="email@example.com"
                    value={formClientEmail}
                    onChange={(e) => setFormClientEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-phone">Phone</Label>
                  <Input
                    id="client-phone"
                    placeholder="(11) 98765-4321"
                    value={formClientPhone}
                    onChange={(e) => setFormClientPhone(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="service">Service *</Label>
                    <Select value={formServiceId} onValueChange={setFormServiceId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((s) => (
                          <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="professional">Professional *</Label>
                    <Select value={formProfessionalId} onValueChange={setFormProfessionalId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {professionals.map((p) => (
                          <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
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
              <p className="text-2xl font-bold">{todayAppointments.length}</p>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Confirmed Appointments</CardTitle>
              <p className="text-2xl font-bold">{confirmedAppointments.length}</p>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Appointments</CardTitle>
              <p className="text-2xl font-bold">{appointments.length}</p>
            </CardHeader>
          </Card>
        </div>

        {/* Appointments Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <CardTitle>Appointments</CardTitle>
                <CardDescription>Manage your client appointments</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative w-full max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by client or service..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="p-4 text-left font-medium text-muted-foreground">Client</th>
                    <th className="p-4 text-left font-medium text-muted-foreground">Service</th>
                    <th className="p-4 text-left font-medium text-muted-foreground">Date & Time</th>
                    <th className="p-4 text-left font-medium text-muted-foreground">Status</th>
                    <th className="p-4 text-right font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((apt) => (
                    <tr key={apt.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <div className="font-medium text-foreground">{apt.clientName}</div>
                        <div className="text-muted-foreground">{apt.clientEmail}</div>
                      </td>
                      <td className="p-4">
                        <div>{apt.service}</div>
                        <div className="text-xs text-muted-foreground">with {apt.professional}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{apt.date}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{apt.time}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Select value={apt.status} onValueChange={(newStatus) => handleStatusChange(apt.id, newStatus as Appointment["status"]) }>
                          <SelectTrigger className={`h-8 border-0 font-semibold text-xs rounded-full px-3 ${getStatusColor(apt.status)}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteAppointment(apt.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredAppointments.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>No appointments found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
