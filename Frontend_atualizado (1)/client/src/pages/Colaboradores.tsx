import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Mail, Phone, Briefcase, Edit, Trash2 } from "lucide-react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Colaborador {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  especialidade: string;
  servicos: string[];
  status: "ativo" | "inativo";
  agendamentos: number;
}

export default function Colaboradores() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedColaborador, setSelectedColaborador] = useState<Colaborador | null>(null);

  // Form states
  const [formNome, setFormNome] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formTelefone, setFormTelefone] = useState("");
  const [formEspecialidade, setFormEspecialidade] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Dados de exemplo
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([
    {
      id: 1,
      nome: "Carlos Barbeiro",
      email: "carlos@kalenner.com",
      telefone: "(11) 98765-4321",
      especialidade: "Barbeiro",
      servicos: ["Corte de Cabelo", "Barba", "Sobrancelha"],
      status: "ativo",
      agendamentos: 156
    },
    {
      id: 2,
      nome: "Ana Manicure",
      email: "ana@kalenner.com",
      telefone: "(11) 98765-4322",
      especialidade: "Manicure",
      servicos: ["Manicure", "Pedicure", "Unhas Decoradas"],
      status: "ativo",
      agendamentos: 203
    },
    {
      id: 3,
      nome: "Paula Massagista",
      email: "paula@kalenner.com",
      telefone: "(11) 98765-4323",
      especialidade: "Massoterapia",
      servicos: ["Massagem Relaxante", "Massagem Terapêutica", "Drenagem"],
      status: "ativo",
      agendamentos: 98
    },
    {
      id: 4,
      nome: "Carla Esteticista",
      email: "carla@kalenner.com",
      telefone: "(11) 98765-4324",
      especialidade: "Estética",
      servicos: ["Depilação", "Limpeza de Pele", "Hidratação"],
      status: "inativo",
      agendamentos: 67
    },
  ]);

  const handleNovoColaborador = () => {
    if (!formNome || !formEmail || !formTelefone || !formEspecialidade) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    const novoColaborador: Colaborador = {
      id: colaboradores.length + 1,
      nome: formNome,
      email: formEmail,
      telefone: formTelefone,
      especialidade: formEspecialidade,
      servicos: [],
      status: "ativo",
      agendamentos: 0
    };

    setColaboradores([...colaboradores, novoColaborador]);
    toast.success("Colaborador cadastrado com sucesso!");
    setDialogOpen(false);
    resetForm();
  };

  const handleEditarColaborador = () => {
    if (!selectedColaborador || !formNome || !formEmail || !formTelefone || !formEspecialidade) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    const colaboradoresAtualizados = colaboradores.map(c =>
      c.id === selectedColaborador.id
        ? { ...c, nome: formNome, email: formEmail, telefone: formTelefone, especialidade: formEspecialidade }
        : c
    );

    setColaboradores(colaboradoresAtualizados);
    toast.success("Colaborador atualizado com sucesso!");
    setEditDialogOpen(false);
    setSelectedColaborador(null);
    resetForm();
  };

  const handleExcluirColaborador = (id: number) => {
    setColaboradores(colaboradores.filter(c => c.id !== id));
    toast.success("Colaborador excluído com sucesso!");
  };

  const openEditDialog = (colaborador: Colaborador) => {
    setSelectedColaborador(colaborador);
    setFormNome(colaborador.nome);
    setFormEmail(colaborador.email);
    setFormTelefone(colaborador.telefone);
    setFormEspecialidade(colaborador.especialidade);
    setEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormNome("");
    setFormEmail("");
    setFormTelefone("");
    setFormEspecialidade("");
  };

  const filteredColaboradores = colaboradores.filter((c) =>
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.especialidade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (nome: string) => {
    return nome
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DashboardLayout userRole={user?.roles[0] as "Empresa" | "Cliente"} onLogout={handleLogout}>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Colaboradores</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie sua equipe de profissionais
            </p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Colaborador
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Novo Colaborador</DialogTitle>
                <DialogDescription>
                  Cadastre um novo profissional na sua equipe
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome completo</Label>
                  <Input
                    id="nome"
                    placeholder="Nome do colaborador"
                    value={formNome}
                    onChange={(e) => setFormNome(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@exemplo.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    placeholder="(11) 98765-4321"
                    value={formTelefone}
                    onChange={(e) => setFormTelefone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="especialidade">Especialidade</Label>
                  <Input
                    id="especialidade"
                    placeholder="Ex: Barbeiro, Manicure"
                    value={formEspecialidade}
                    onChange={(e) => setFormEspecialidade(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => {
                  setDialogOpen(false);
                  resetForm();
                }}>
                  Cancelar
                </Button>
                <Button onClick={handleNovoColaborador}>
                  Cadastrar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Dialog de Edição */}
        <Dialog open={editDialogOpen} onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) {
            setSelectedColaborador(null);
            resetForm();
          }
        }}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Editar Colaborador</DialogTitle>
              <DialogDescription>
                Atualize as informações do colaborador
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-nome">Nome completo</Label>
                <Input
                  id="edit-nome"
                  placeholder="Nome do colaborador"
                  value={formNome}
                  onChange={(e) => setFormNome(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">E-mail</Label>
                <Input
                  id="edit-email"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-telefone">Telefone</Label>
                <Input
                  id="edit-telefone"
                  placeholder="(11) 98765-4321"
                  value={formTelefone}
                  onChange={(e) => setFormTelefone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-especialidade">Especialidade</Label>
                <Input
                  id="edit-especialidade"
                  placeholder="Ex: Barbeiro, Manicure"
                  value={formEspecialidade}
                  onChange={(e) => setFormEspecialidade(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => {
                setEditDialogOpen(false);
                setSelectedColaborador(null);
                resetForm();
              }}>
                Cancelar
              </Button>
              <Button onClick={handleEditarColaborador}>
                Salvar Alterações
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Busca */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar colaborador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Grid de Colaboradores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredColaboradores.map((colaborador) => (
            <Card key={colaborador.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(colaborador.nome)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{colaborador.nome}</CardTitle>
                      <CardDescription>{colaborador.especialidade}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={colaborador.status === "ativo" ? "default" : "secondary"}>
                    {colaborador.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{colaborador.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{colaborador.telefone}</span>
                  </div>
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <Briefcase className="h-4 w-4 mt-0.5" />
                    <div className="flex flex-wrap gap-1">
                      {colaborador.servicos.map((servico, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {servico}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-3">
                    <span className="font-semibold text-foreground">{colaborador.agendamentos}</span> agendamentos realizados
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => openEditDialog(colaborador)}
                    >
                      <Edit className="h-4 w-4" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleExcluirColaborador(colaborador.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
