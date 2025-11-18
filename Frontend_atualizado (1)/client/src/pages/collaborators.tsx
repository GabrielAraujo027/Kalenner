import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CollaboratorCard } from "@/components/CollaboratorCard";
import { useToast } from "@/hooks/use-toast";

// Mock data - Substituir por API real
const mockServices = [
  { id: "1", name: "Corte", description: "Corte de cabelo" },
  { id: "2", name: "Barba", description: "Aparação de barba" },
  { id: "3", name: "Corte e Barba", description: "Corte completo" },
];

const mockCollaborators = [
  { id: "1", name: "João Silva", role: "Barbeiro" },
  { id: "2", name: "Maria Santos", role: "Recepcionista" },
];

interface Service {
  id: string;
  name: string;
  description: string;
}

interface Collaborator {
  id: string;
  name: string;
  role: string;
}

export default function Colaboradores() {
  const { toast } = useToast();
  const [professionalName, setProfessionalName] = useState("");
  const [professionalDescription, setProfessionalDescription] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  
  const [editingCollaborator, setEditingCollaborator] = useState<Collaborator | null>(null);
  const [editCollaboratorOpen, setEditCollaboratorOpen] = useState(false);
  
  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editServiceOpen, setEditServiceOpen] = useState(false);

  useEffect(() => {
    fetchServices();
    fetchCollaborators();
  }, []);

  const fetchServices = async () => {
    // TODO: Integrar com API real
    setServices(mockServices);
  };

  const fetchCollaborators = async () => {
    // TODO: Integrar com API real
    setCollaborators(mockCollaborators);
  };

  const handleAddProfessional = async () => {
    if (!professionalName.trim() || !professionalDescription.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome e descrição do profissional",
        variant: "destructive",
      });
      return;
    }

    // TODO: Integrar com API real
    const newCollaborator = {
      id: Date.now().toString(),
      name: professionalName,
      role: professionalDescription,
    };

    if (true) {
      toast({
        title: "Profissional adicionado",
        description: `${professionalName} foi adicionado com sucesso`,
      });
      setProfessionalName("");
      setProfessionalDescription("");
      setCollaborators([...collaborators, newCollaborator]);
      setSelectedServices([]);
    }
  };

  const handleEditCollaborator = (collaborator: Collaborator) => {
    setEditingCollaborator(collaborator);
    setEditCollaboratorOpen(true);
  };

  const handleUpdateCollaborator = async () => {
    if (!editingCollaborator || !editingCollaborator.name.trim() || !editingCollaborator.role.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome e descrição do profissional",
        variant: "destructive",
      });
      return;
    }

    // TODO: Integrar com API real
    if (true) {
      toast({
        title: "Colaborador atualizado",
        description: "Dados atualizados com sucesso",
      });
      setEditCollaboratorOpen(false);
      setEditingCollaborator(null);
      fetchCollaborators();
    }
  };

  const handleDeleteCollaborator = async (id: string) => {
    // TODO: Integrar com API real
    if (true) {
      toast({
        title: "Colaborador excluído",
        description: "Colaborador removido com sucesso",
      });
      fetchCollaborators();
    }
  };

  const handleAddServiceField = () => {
    setSelectedServices([...selectedServices, ""]);
  };

  const handleServiceChange = (index: number, value: string) => {
    const newServices = [...selectedServices];
    newServices[index] = value;
    setSelectedServices(newServices);
  };

  const handleAddService = async () => {
    if (!serviceName.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Preencha o nome do serviço",
        variant: "destructive",
      });
      return;
    }

    // TODO: Integrar com API real
    if (true) {
      toast({
        title: "Serviço adicionado",
        description: `${serviceName} foi adicionado com sucesso`,
      });
      setServiceName("");
      setServiceDescription("");
      fetchServices();
    }
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setEditServiceOpen(true);
  };

  const handleUpdateService = async () => {
    if (!editingService || !editingService.name.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Preencha o nome do serviço",
        variant: "destructive",
      });
      return;
    }

    // TODO: Integrar com API real
    if (true) {
      toast({
        title: "Serviço atualizado",
        description: "Dados atualizados com sucesso",
      });
      setEditServiceOpen(false);
      setEditingService(null);
      fetchServices();
    }
  };

  const handleDeleteService = async (id: string) => {
    // TODO: Integrar com API real
    if (true) {
      toast({
        title: "Serviço excluído",
        description: "Serviço removido com sucesso",
      });
      fetchServices();
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-8">
      <h1 className="border-b-2 border-foreground pb-2 text-2xl font-bold uppercase text-foreground">
        CONFIGURAÇÕES DE COLABORADORES
      </h1>

      <div className="space-y-6">
        <div>
          <h2 className="mb-4 text-lg font-semibold">Adicionar Profissional:</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              placeholder="Nome..."
              value={professionalName}
              onChange={(e) => setProfessionalName(e.target.value)}
              className="rounded-xl border-2"
            />
            <Input
              placeholder="Descrição..."
              value={professionalDescription}
              onChange={(e) => setProfessionalDescription(e.target.value)}
              className="rounded-xl border-2"
            />
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Serviços:</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAddServiceField}
              className="h-10 w-10 rounded-full bg-muted hover:bg-muted/80"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-3">
            {selectedServices.map((serviceId, index) => (
              <Select key={index} value={serviceId} onValueChange={(value) => handleServiceChange(index, value)}>
                <SelectTrigger className="rounded-xl border-2">
                  <SelectValue placeholder="Selecione um serviço" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
          </div>

          {selectedServices.length === 0 && (
            <Select>
              <SelectTrigger className="rounded-xl border-2">
                <SelectValue placeholder="Corte e Barba" />
              </SelectTrigger>
            </Select>
          )}
        </div>

        <Button onClick={handleAddProfessional} className="w-full rounded-xl md:w-auto">
          Adicionar Profissional
        </Button>
      </div>

      <div>
        <h2 className="mb-6 border-b border-border pb-2 text-xl font-semibold">Colaboradores</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {collaborators.map((collaborator) => (
            <CollaboratorCard
              key={collaborator.id}
              name={collaborator.name}
              role={collaborator.role}
              onEdit={() => handleEditCollaborator(collaborator)}
              onDelete={() => handleDeleteCollaborator(collaborator.id)}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="mb-6 flex items-center justify-between border-b border-border pb-2">
          <h2 className="text-xl font-semibold">Gerenciar Serviços</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded-xl">
                <Plus className="mr-2 h-4 w-4" />
                Novo Serviço
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Serviço</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input
                  placeholder="Nome do serviço..."
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="rounded-xl border-2"
                />
                <Input
                  placeholder="Descrição..."
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                  className="rounded-xl border-2"
                />
                <Button onClick={handleAddService} className="w-full rounded-xl">
                  Adicionar Serviço
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div key={service.id} className="rounded-xl border-2 border-border bg-card p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{service.name}</h3>
                  {service.description && (
                    <p className="mt-1 text-sm text-muted-foreground">{service.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditService(service)}
                    className="h-8 w-8 text-accent hover:bg-accent/10 hover:text-accent"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteService(service.id)}
                    className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={editCollaboratorOpen} onOpenChange={setEditCollaboratorOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Colaborador</DialogTitle>
          </DialogHeader>
          {editingCollaborator && (
            <div className="space-y-4 pt-4">
              <Input
                placeholder="Nome..."
                value={editingCollaborator.name}
                onChange={(e) => setEditingCollaborator({ ...editingCollaborator, name: e.target.value })}
                className="rounded-xl border-2"
              />
              <Input
                placeholder="Descrição..."
                value={editingCollaborator.role}
                onChange={(e) => setEditingCollaborator({ ...editingCollaborator, role: e.target.value })}
                className="rounded-xl border-2"
              />
              <Button onClick={handleUpdateCollaborator} className="w-full rounded-xl">
                Salvar Alterações
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={editServiceOpen} onOpenChange={setEditServiceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Serviço</DialogTitle>
          </DialogHeader>
          {editingService && (
            <div className="space-y-4 pt-4">
              <Input
                placeholder="Nome do serviço..."
                value={editingService.name}
                onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                className="rounded-xl border-2"
              />
              <Input
                placeholder="Descrição..."
                value={editingService.description || ""}
                onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                className="rounded-xl border-2"
              />
              <Button onClick={handleUpdateService} className="w-full rounded-xl">
                Salvar Alterações
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
