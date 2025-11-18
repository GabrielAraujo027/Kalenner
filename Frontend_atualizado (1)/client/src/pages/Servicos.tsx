import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Clock, DollarSign, Edit, Trash2, Tag } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Servico {
  id: number;
  nome: string;
  descricao: string;
  duracao: number; // em minutos
  preco: number;
  categoria: string;
  ativo: boolean;
}

export default function Servicos() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedServico, setSelectedServico] = useState<Servico | null>(null);

  // Form states
  const [formNome, setFormNome] = useState("");
  const [formDescricao, setFormDescricao] = useState("");
  const [formDuracao, setFormDuracao] = useState("");
  const [formPreco, setFormPreco] = useState("");
  const [formCategoria, setFormCategoria] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Dados de exemplo
  const [servicos, setServicos] = useState<Servico[]>([
    {
      id: 1,
      nome: "Corte de Cabelo Masculino",
      descricao: "Corte tradicional ou moderno com acabamento profissional",
      duracao: 45,
      preco: 50.00,
      categoria: "Cabelo",
      ativo: true
    },
    {
      id: 2,
      nome: "Barba Completa",
      descricao: "Aparar, modelar e finalizar com produtos premium",
      duracao: 30,
      preco: 35.00,
      categoria: "Barba",
      ativo: true
    },
    {
      id: 3,
      nome: "Manicure",
      descricao: "Cuidados completos para as unhas das mãos",
      duracao: 60,
      preco: 40.00,
      categoria: "Unhas",
      ativo: true
    },
    {
      id: 4,
      nome: "Pedicure",
      descricao: "Cuidados completos para as unhas dos pés",
      duracao: 60,
      preco: 45.00,
      categoria: "Unhas",
      ativo: true
    },
    {
      id: 5,
      nome: "Massagem Relaxante",
      descricao: "Massagem corporal completa para relaxamento",
      duracao: 90,
      preco: 120.00,
      categoria: "Massagem",
      ativo: true
    },
    {
      id: 6,
      nome: "Depilação Facial",
      descricao: "Remoção de pelos faciais com cera",
      duracao: 20,
      preco: 30.00,
      categoria: "Estética",
      ativo: false
    },
  ]);

  const categorias = ["Cabelo", "Barba", "Unhas", "Massagem", "Estética", "Outros"];

  const handleNovoServico = () => {
    if (!formNome || !formDescricao || !formDuracao || !formPreco || !formCategoria) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    const novoServico: Servico = {
      id: servicos.length + 1,
      nome: formNome,
      descricao: formDescricao,
      duracao: parseInt(formDuracao),
      preco: parseFloat(formPreco),
      categoria: formCategoria,
      ativo: true
    };

    setServicos([...servicos, novoServico]);
    toast.success("Serviço criado com sucesso!");
    setDialogOpen(false);
    resetForm();
  };

  const handleEditarServico = () => {
    if (!selectedServico || !formNome || !formDescricao || !formDuracao || !formPreco || !formCategoria) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    const servicosAtualizados = servicos.map(s =>
      s.id === selectedServico.id
        ? {
            ...s,
            nome: formNome,
            descricao: formDescricao,
            duracao: parseInt(formDuracao),
            preco: parseFloat(formPreco),
            categoria: formCategoria
          }
        : s
    );

    setServicos(servicosAtualizados);
    toast.success("Serviço atualizado com sucesso!");
    setEditDialogOpen(false);
    setSelectedServico(null);
    resetForm();
  };

  const handleExcluirServico = (id: number) => {
    setServicos(servicos.filter(s => s.id !== id));
    toast.success("Serviço excluído com sucesso!");
  };

  const handleToggleStatus = (id: number) => {
    const servicosAtualizados = servicos.map(s =>
      s.id === id ? { ...s, ativo: !s.ativo } : s
    );
    setServicos(servicosAtualizados);
    toast.success("Status do serviço atualizado!");
  };

  const openEditDialog = (servico: Servico) => {
    setSelectedServico(servico);
    setFormNome(servico.nome);
    setFormDescricao(servico.descricao);
    setFormDuracao(servico.duracao.toString());
    setFormPreco(servico.preco.toString());
    setFormCategoria(servico.categoria);
    setEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormNome("");
    setFormDescricao("");
    setFormDuracao("");
    setFormPreco("");
    setFormCategoria("");
  };

  const filteredServicos = servicos.filter((s) =>
    s.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <DashboardLayout userRole={user?.roles[0] as "Empresa" | "Cliente"} onLogout={handleLogout}>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Serviços</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie os serviços oferecidos pela sua empresa
            </p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Serviço
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Novo Serviço</DialogTitle>
                <DialogDescription>
                  Cadastre um novo serviço oferecido pela empresa
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Serviço</Label>
                  <Input
                    id="nome"
                    placeholder="Ex: Corte de Cabelo"
                    value={formNome}
                    onChange={(e) => setFormNome(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    placeholder="Descreva o serviço..."
                    value={formDescricao}
                    onChange={(e) => setFormDescricao(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duracao">Duração (min)</Label>
                    <Input
                      id="duracao"
                      type="number"
                      placeholder="45"
                      value={formDuracao}
                      onChange={(e) => setFormDuracao(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preco">Preço (R$)</Label>
                    <Input
                      id="preco"
                      type="number"
                      step="0.01"
                      placeholder="50.00"
                      value={formPreco}
                      onChange={(e) => setFormPreco(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select value={formCategoria} onValueChange={setFormCategoria}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => {
                  setDialogOpen(false);
                  resetForm();
                }}>
                  Cancelar
                </Button>
                <Button onClick={handleNovoServico}>
                  Criar Serviço
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Dialog de Edição */}
        <Dialog open={editDialogOpen} onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) {
            setSelectedServico(null);
            resetForm();
          }
        }}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Editar Serviço</DialogTitle>
              <DialogDescription>
                Atualize as informações do serviço
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-nome">Nome do Serviço</Label>
                <Input
                  id="edit-nome"
                  placeholder="Ex: Corte de Cabelo"
                  value={formNome}
                  onChange={(e) => setFormNome(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-descricao">Descrição</Label>
                <Textarea
                  id="edit-descricao"
                  placeholder="Descreva o serviço..."
                  value={formDescricao}
                  onChange={(e) => setFormDescricao(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-duracao">Duração (min)</Label>
                  <Input
                    id="edit-duracao"
                    type="number"
                    placeholder="45"
                    value={formDuracao}
                    onChange={(e) => setFormDuracao(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-preco">Preço (R$)</Label>
                  <Input
                    id="edit-preco"
                    type="number"
                    step="0.01"
                    placeholder="50.00"
                    value={formPreco}
                    onChange={(e) => setFormPreco(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-categoria">Categoria</Label>
                <Select value={formCategoria} onValueChange={setFormCategoria}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => {
                setEditDialogOpen(false);
                setSelectedServico(null);
                resetForm();
              }}>
                Cancelar
              </Button>
              <Button onClick={handleEditarServico}>
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
                placeholder="Buscar serviço..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Grid de Serviços */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServicos.map((servico) => (
            <Card key={servico.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{servico.nome}</CardTitle>
                    <CardDescription className="mt-2">{servico.descricao}</CardDescription>
                  </div>
                  <Badge variant={servico.ativo ? "default" : "secondary"}>
                    {servico.ativo ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Tag className="h-4 w-4" />
                      Categoria
                    </span>
                    <Badge variant="outline">{servico.categoria}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Duração
                    </span>
                    <span className="font-medium text-foreground">{servico.duracao} min</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      Preço
                    </span>
                    <span className="font-bold text-lg text-primary">{formatCurrency(servico.preco)}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border space-y-2">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => openEditDialog(servico)}
                    >
                      <Edit className="h-4 w-4" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleExcluirServico(servico.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant={servico.ativo ? "secondary" : "default"}
                    size="sm"
                    className="w-full"
                    onClick={() => handleToggleStatus(servico.id)}
                  >
                    {servico.ativo ? "Desativar" : "Ativar"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
