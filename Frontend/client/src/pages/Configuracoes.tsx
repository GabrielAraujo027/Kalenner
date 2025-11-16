import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Building2, Bell, Lock, Globe } from "lucide-react";

export default function Configuracoes() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Estados para as configurações
  const [nomeEmpresa, setNomeEmpresa] = useState("Minha Empresa");
  const [emailEmpresa, setEmailEmpresa] = useState("contato@empresa.com");
  const [telefoneEmpresa, setTelefoneEmpresa] = useState("(11) 98765-4321");
  const [enderecoEmpresa, setEnderecoEmpresa] = useState("Rua Exemplo, 123");
  
  const [notificacaoEmail, setNotificacaoEmail] = useState(true);
  const [notificacaoSMS, setNotificacaoSMS] = useState(false);
  const [notificacaoLembrete, setNotificacaoLembrete] = useState(true);

  const handleSalvarDadosEmpresa = () => {
    toast.success("Dados da empresa atualizados com sucesso!");
  };

  const handleSalvarNotificacoes = () => {
    toast.success("Preferências de notificação salvas!");
  };

  const handleAlterarSenha = () => {
    toast.success("Senha alterada com sucesso!");
  };

  return (
    <DashboardLayout userRole={user?.roles[0] as "Empresa" | "Cliente"} onLogout={handleLogout}>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as configurações do sistema
          </p>
        </div>

        {/* Dados da Empresa */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <CardTitle>Dados da Empresa</CardTitle>
            </div>
            <CardDescription>
              Informações básicas da sua empresa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome-empresa">Nome da Empresa</Label>
                <Input
                  id="nome-empresa"
                  value={nomeEmpresa}
                  onChange={(e) => setNomeEmpresa(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-empresa">E-mail</Label>
                <Input
                  id="email-empresa"
                  type="email"
                  value={emailEmpresa}
                  onChange={(e) => setEmailEmpresa(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone-empresa">Telefone</Label>
                <Input
                  id="telefone-empresa"
                  value={telefoneEmpresa}
                  onChange={(e) => setTelefoneEmpresa(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endereco-empresa">Endereço</Label>
                <Input
                  id="endereco-empresa"
                  value={enderecoEmpresa}
                  onChange={(e) => setEnderecoEmpresa(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={handleSalvarDadosEmpresa}>
                Salvar Alterações
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle>Notificações</CardTitle>
            </div>
            <CardDescription>
              Configure como deseja receber notificações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notif-email" className="text-base">
                  Notificações por E-mail
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receba atualizações sobre agendamentos por e-mail
                </p>
              </div>
              <Switch
                id="notif-email"
                checked={notificacaoEmail}
                onCheckedChange={setNotificacaoEmail}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notif-sms" className="text-base">
                  Notificações por SMS
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receba lembretes de agendamentos por SMS
                </p>
              </div>
              <Switch
                id="notif-sms"
                checked={notificacaoSMS}
                onCheckedChange={setNotificacaoSMS}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notif-lembrete" className="text-base">
                  Lembretes Automáticos
                </Label>
                <p className="text-sm text-muted-foreground">
                  Enviar lembretes automáticos 24h antes do agendamento
                </p>
              </div>
              <Switch
                id="notif-lembrete"
                checked={notificacaoLembrete}
                onCheckedChange={setNotificacaoLembrete}
              />
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={handleSalvarNotificacoes}>
                Salvar Preferências
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Segurança */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              <CardTitle>Segurança</CardTitle>
            </div>
            <CardDescription>
              Altere sua senha e gerencie a segurança da conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="senha-atual">Senha Atual</Label>
                <Input id="senha-atual" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nova-senha">Nova Senha</Label>
                <Input id="nova-senha" type="password" />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={handleAlterarSenha}>
                Alterar Senha
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preferências do Sistema */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <CardTitle>Preferências do Sistema</CardTitle>
            </div>
            <CardDescription>
              Configurações gerais do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="idioma">Idioma</Label>
                <Input id="idioma" value="Português (Brasil)" disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fuso">Fuso Horário</Label>
                <Input id="fuso" value="America/Sao_Paulo (GMT-3)" disabled />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
