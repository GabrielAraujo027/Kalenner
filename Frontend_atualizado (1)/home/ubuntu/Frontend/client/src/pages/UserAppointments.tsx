import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useCompany } from "@/hooks/useCompany";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, MapPin, Phone, Mail, LogOut, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserAppointment {
  id: number;
  service: string;
  professional: string;
  date: string;
  time: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  duration: number;
  price: number;
}

export default function UserAppointments() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const { company } = useCompany();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formService, setFormService] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formTime, setFormTime] = useState("");

  const handleLogout = () => {
    logout();
    navigate(`/${company?.id || ""}/user-login`);
  };

  // Mock user appointments
  const [appointments, setAppointments] = useState<UserAppointment[]>([
    {
      id: 1,
      service: "Haircut",
      professional: "Carlos Barbeiro",
      date: "2024-11-20",
      time: "10:00",
      status: "confirmed",
      duration: 45,
      price: 50.00
    },
    {
      id: 2,
      service: "Manicure",
      professional: "Ana Manicure",
      date: "2024-11-22",
      time: "14:00",
      status: "confirmed",
      duration: 60,
      price: 40.00
    },
    {
      id: 3,
      service: "Massage",
      professional: "Paula Massagista",
      date: "2024-11-25",
      time: "15:30",
      status: "pending",
      duration: 90,
      price: 120.00
    },
  ]);

  const services = ["Haircut", "Beard", "Manicure", "Pedicure", "Massage", "Facial"];
  const professionals = ["Carlos Barbeiro", "Ana Manicure", "Paula Massagista", "Carla Esteticista"];

  const handleBookAppointment = () => {
    if (!formService || !formDate || !formTime) {
      toast.error("Please fill in all fields");
      return;
    }

    const newAppointment: UserAppointment = {
      id: appointments.length + 1,
      service: formService,
      professional: professionals[0],
      date: formDate,
      time: formTime,
      status: "pending",
      duration: 60,
      price: 50.00
    };

    setAppointments([...appointments, newAppointment]);
    toast.success("Appointment booked successfully!");
    setDialogOpen(false);
    resetForm();
  };

  const handleCancelAppointment = (id: number) => {
    setAppointments(appointments.map(a =>
      a.id === id ? { ...a, status: "cancelled" } : a
    ));
    toast.success("Appointment cancelled");
  };

  const resetForm = () => {
    setFormService("");
    setFormDate("");
    setFormTime("");
  };

  const getStatusColor = (status: UserAppointment["status"]) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "completed": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "cancelled": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    }
  };

  const upcomingAppointments = appointments.filter(a =>
    new Date(a.date) >= new Date() && a.status !== "cancelled"
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastAppointments = appointments.filter(a =>
    new Date(a.date) < new Date() || a.status === "cancelled"
  );

  return (
    <div className="min-h-screen" style={{
      background: `linear-gradient(135deg, ${company?.primaryColor || 'oklch(0.45 0.15 250)'}, ${company?.accentColor || 'oklch(0.55 0.18 250)'})`
    }}>
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {company?.logo && (
              <img src={company.logo} alt={company.name} className="h-12 w-12 object-contain" />
            )}
            <div>
              <h1 className="text-2xl font-bold text-white">{company?.name || "Kalenner"}</h1>
              <p className="text-white/80 text-sm">Your Appointments</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="gap-2 bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Card */}
        <Card className="mb-8 border-0 shadow-xl">
          <CardContent className="pt-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  Welcome back, {user?.email?.split('@')[0]}!
                </h2>
                <p className="text-muted-foreground">
                  Manage your appointments and book new services
                </p>
              </div>
              <Dialog open={dialogOpen} onOpenChange={(open) => {
                setDialogOpen(open);
                if (!open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button size="lg" className="gap-2">
                    <Plus className="h-5 w-5" />
                    Book Appointment
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Book New Appointment</DialogTitle>
                    <DialogDescription>
                      Select a service and available time slot
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="service">Service *</Label>
                      <Select value={formService} onValueChange={setFormService}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
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
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => {
                      setDialogOpen(false);
                      resetForm();
                    }}>
                      Cancel
                    </Button>
                    <Button onClick={handleBookAppointment}>
                      Book Appointment
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">Upcoming Appointments</h3>
          {upcomingAppointments.length === 0 ? (
            <Card className="border-0 shadow-xl">
              <CardContent className="pt-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground mb-4">No upcoming appointments</p>
                <Dialog open={dialogOpen} onOpenChange={(open) => {
                  setDialogOpen(open);
                  if (!open) resetForm();
                }}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Book Your First Appointment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Book New Appointment</DialogTitle>
                      <DialogDescription>
                        Select a service and available time slot
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="service">Service *</Label>
                        <Select value={formService} onValueChange={setFormService}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                          <SelectContent>
                            {services.map((s) => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
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
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => {
                        setDialogOpen(false);
                        resetForm();
                      }}>
                        Cancel
                      </Button>
                      <Button onClick={handleBookAppointment}>
                        Book Appointment
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingAppointments.map((appointment) => (
                <Card key={appointment.id} className="border-0 shadow-xl hover:shadow-2xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{appointment.service}</CardTitle>
                        <CardDescription className="mt-1">{appointment.professional}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{appointment.date}</span>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{appointment.time} • {appointment.duration} min</span>
                      </div>
                      <div className="flex items-center gap-3 font-semibold text-primary">
                        <span>R$ {appointment.price.toFixed(2)}</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full text-destructive hover:text-destructive"
                      onClick={() => handleCancelAppointment(appointment.id)}
                    >
                      Cancel Appointment
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Past Appointments */}
        {pastAppointments.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Past Appointments</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pastAppointments.map((appointment) => (
                <Card key={appointment.id} className="border-0 shadow-xl opacity-75">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{appointment.service}</CardTitle>
                        <CardDescription className="mt-1">{appointment.professional}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{appointment.date}</span>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{appointment.time} • {appointment.duration} min</span>
                      </div>
                      <div className="flex items-center gap-3 font-semibold text-primary">
                        <span>R$ {appointment.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
