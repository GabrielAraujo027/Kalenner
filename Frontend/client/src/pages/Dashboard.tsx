import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useCompanySlug } from "@/hooks/useCompanySlug";
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
  const [, navigate] = useLocation();
  const slug = useCompanySlug();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form states
  const [formClientName, setFormClientName] = useState("");
  const [formClientEmail, setFormClientEmail] = useState("");
  const [formClientPhone, setFormClientPhone] = useState("");
  const [formService, setFormService] = useState("");
  const [formProfessional, setFormProfessional] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formTime, setFormTime] = useState("");
  const [formNotes, setFormNotes] = useState("");

  const handleLogout = () => {
    logout();
    navigate(slug ? `/${slug}/login` : "/login");
  };

  // Mock data
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      clientName: "John Smith",
      clientEmail: "john@example.com",
      clientPhone: "(11) 98765-4321",
      service: "Haircut",
      professional: "Carlos Barbeiro",
      date: "2024-11-20",
      time: "10:00",
      status: "confirmed",
      notes: "Regular haircut"
    },
    {
      id: 2,
      clientName: "Maria Silva",
      clientEmail: "maria@example.com",
      clientPhone: "(11) 98765-4322",
      service: "Manicure",
      professional: "Ana Manicure",
      date: "2024-11-20",
      time: "14:00",
      status: "pending",
      notes: "French manicure"
    },
  ]);

  const services = ["Haircut", "Beard", "Manicure", "Pedicure", "Massage", "Facial"];
  const professionals = ["Carlos Barbeiro", "Ana Manicure", "Paula Massagista", "Carla Esteticista"];

  const handleCreateAppointment = () => {
    if (!formClientName || !formClientEmail || !formService || !formProfessional || !formDate || !formTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newAppointment: Appointment = {
      id: appointments.length + 1,
      clientName: formClientName,
      clientEmail: formClientEmail,
      clientPhone: formClientPhone,
      service: formService,
      professional: formProfessional,
      date: formDate,
      time: formTime,
      status: "pending",
      notes: formNotes
    };

    setAppointments([...appointments, newAppointment]);
    toast.success("Appointment created successfully!");
    setDialogOpen(false);
    resetForm();
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
    setFormService("");
    setFormProfessional("");
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
                    <Select value={formService} onValueChange={setFormService}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="professional">Professional *</Label>
                    <Select value={formProfessional} onValueChange={setFormProfessional}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {professionals.map((p) => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
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
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg text-foreground">{appointment.clientName}</h3>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{appointment.professional}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{appointment.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{appointment.time}</span>
                        </div>
                        <div>
                          <span className="text-foreground font-medium">{appointment.service}</span>
                        </div>
                      </div>
                      {appointment.notes && (
                        <p className="text-sm text-muted-foreground italic">Note: {appointment.notes}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
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
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
