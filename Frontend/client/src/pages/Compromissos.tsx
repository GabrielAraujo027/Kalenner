import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Plus, Search, Clock, User, Briefcase, Filter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function Compromissos() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Dados de exemplo
  const compromissos = [
    {
      id: 1,
      cliente: "João Silva",
      servico: "Corte de Cabelo",
      colaborador: "Carlos Barbeiro",
      data: "2024-11-16",
      horario: "14:00",
      duracao: "45min",
      status: "confirmado",
      valor: "R$ 50,00"
    },
    {
      id: 2,
      cliente: "Maria Santos",
      servico: "Manicure",
      colaborador: "Ana Manicure",
      data: "2024-11-16",
      horario: "15:30",
      duracao: "60min",
      status: "confirmado",
      valor: "R$ 40,00"
    },
    {
      id: 3,
      cliente: "Pedro Costa",
      servico: "Massagem",
      colaborador: "Paula Massagista",
      data: "2024-11-17",
      horario: "10:00",
      duracao: "90min",
      status: "pendente",
      valor: "R$ 120,00"
    },
    {
      id: 4,
      cliente: "Ana Paula",
      servico: "Depilação",
      colaborador: "Carla Esteticista",
      data: "2024-11-17",
      horario: "14:00",
      duracao: "30min",
      status: "cancelado",
      valor: "R$ 60,00"
    },
  ];

  const handleNovoAgendamento = () => {
    toast.success("Novo agendamento criado!");
    setDialogOpen(false);
  };

  const filteredCompromissos = compromissos.filter((c) => {
    const matchesSearch = c.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.servico.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "todos" || c.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout userRole={user?.roles[0] as "Empresa" | "Cliente"} onLogout={handleLogout}>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Compromissos</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie todos os agendamentos
            </p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Agendamento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Novo Agendamento</DialogTitle>
                <DialogDescription>
                  Preencha os dados para criar um novo agendamento
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="cliente">Cliente</Label>
                  <Input id="cliente" placeholder="Nome do cliente" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="servico">Serviço</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="corte">Corte de Cabelo</SelectItem>
                      <SelectItem value="manicure">Manicure</SelectItem>
                      <SelectItem value="massagem">Massagem</SelectItem>
                      <SelectItem value="depilacao">Depilação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="colaborador">Colaborador</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o colaborador" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="carlos">Carlos Barbeiro</SelectItem>
                      <SelectItem value="ana">Ana Manicure</SelectItem>
                      <SelectItem value="paula">Paula Massagista</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="data">Data</Label>
                    <Input id="data" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="horario">Horário</Label>
                    <Input id="horario" type="time" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleNovoAgendamento}>
                  Criar Agendamento
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filtros e Busca */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por cliente ou serviço..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="w-full md:w-48">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="confirmado">Confirmado</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Compromissos */}
        <Card>
          <CardHeader>
            <CardTitle>Agendamentos</CardTitle>
            <CardDescription>
              {filteredCompromissos.length} agendamento(s) encontrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCompromissos.map((compromisso) => (
                <div
                  key={compromisso.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">{compromisso.cliente}</p>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          {compromisso.servico}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {compromisso.colaborador}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {compromisso.duracao}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:items-end gap-2 md:ml-4">
                    <div className="text-right">
                      <p className="font-medium text-foreground">
                        {new Date(compromisso.data).toLocaleDateString("pt-BR")} às {compromisso.horario}
                      </p>
                      <p className="text-sm text-muted-foreground">{compromisso.valor}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        compromisso.status === "confirmado"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : compromisso.status === "pendente"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {compromisso.status.charAt(0).toUpperCase() + compromisso.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
