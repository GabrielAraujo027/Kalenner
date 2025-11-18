import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import DailySummary from "@/components/DailySummary";
import AppointmentCard, { Appointment, AppointmentStatus } from "@/components/AppointmentCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data
const mockAppointments: Appointment[] = [
  {
    id: "1",
    service: "Corte Completo",
    clientName: "Jean Menezes",
    time: "17:00",
    date: "21/11/2025",
    status: "completed",
  },
  {
    id: "2",
    service: "Corte e Barba",
    clientName: "Rafael Nonato",
    time: "12:00",
    date: "24/11/2025",
    status: "scheduled",
  },
  {
    id: "3",
    service: "Corte Completo",
    clientName: "João Garcia",
    time: "14:00",
    date: "28/11/2025",
    status: "cancelled",
  },
  {
    id: "4",
    service: "Somente Barba",
    clientName: "Almir Monteiro",
    time: "17:00",
    date: "01/12/2025",
    status: "scheduled",
  },
  {
    id: "5",
    service: "Corte Completo",
    clientName: "Renato Magalhães",
    time: "19:00",
    date: "02/12/2025",
    status: "scheduled",
  },
  {
    id: "6",
    service: "Corte Completo com Descoloração",
    clientName: "Igor Pratti",
    time: "11:00",
    date: "07/12/2025",
    status: "scheduled",
  },
];

const CompanyDashboard = () => {
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState<AppointmentStatus | "all">("all");

  const filteredAppointments = mockAppointments.filter((appointment) => {
    const matchesDate = !filterDate || appointment.date.includes(filterDate);
    const matchesStatus = filterStatus === "all" || appointment.status === filterStatus;
    return matchesDate && matchesStatus;
  });

  const todayAppointments = mockAppointments.filter(
    (apt) => apt.status === "scheduled" && apt.date === new Date().toLocaleDateString("pt-BR")
  );

  const nextAppointment = mockAppointments
    .filter((apt) => apt.status === "scheduled")
    .sort((a, b) => {
      const dateA = new Date(a.date.split("/").reverse().join("-"));
      const dateB = new Date(b.date.split("/").reverse().join("-"));
      return dateA.getTime() - dateB.getTime();
    })[0];

  const handleClearFilters = () => {
    setFilterDate("");
    setFilterStatus("all");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar userType="company" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">PAINEL PRINCIPAL</h1>
          <div className="w-full h-1 bg-foreground mb-8"></div>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Resumo Diário</h2>
            <div className="max-w-md">
              <DailySummary
                count={todayAppointments.length}
                nextAppointment={
                  nextAppointment
                    ? {
                        service: nextAppointment.service,
                        clientName: nextAppointment.clientName,
                      }
                    : undefined
                }
              />
            </div>
          </section>

          <section>
            <div className="bg-primary text-primary-foreground rounded-lg p-4 mb-6 flex items-center gap-4">
              <div className="flex items-center gap-2 flex-1">
                <label className="font-semibold">DATA</label>
                <Input
                  type="text"
                  placeholder="DD/MM/AAAA"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="max-w-xs bg-background text-foreground"
                />
              </div>

              <div className="flex items-center gap-2 flex-1">
                <label className="font-semibold">STATUS</label>
                <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as AppointmentStatus | "all")}>
                  <SelectTrigger className="max-w-xs bg-background text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="scheduled">Agendado</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleClearFilters} className="bg-accent text-accent-foreground hover:bg-accent/90">
                LIMPAR
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>

            {filteredAppointments.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>Nenhum agendamento encontrado com os filtros selecionados.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default CompanyDashboard;
