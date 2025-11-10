import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { toast } from "sonner";

const Login = () => {
  const [, navigate] = useLocation();
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !companyId) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    try {
      const response = await login(email, password, companyId);
      toast.success("Login realizado com sucesso!");
      
      // Verificar o role do usuário para redirecionar
      if (response.roles.includes("Empresa")) {
        navigate("/empresa");
      } else {
        navigate("/cliente");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao fazer login";
      toast.error(errorMessage);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md bg-card rounded-3xl shadow-lg p-12">
        <h1 className="text-4xl font-bold text-center mb-12">Log-in</h1>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Mail className="w-5 h-5 text-foreground" />
            </div>
            <Input
              type="email"
              placeholder="E-mail:"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-12 h-14 bg-input border-none rounded-xl text-base"
            />
          </div>

          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Mail className="w-5 h-5 text-foreground" />
            </div>
            <Input
              type="text"
              placeholder="ID da Empresa:"
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              required
              className="pl-12 h-14 bg-input border-none rounded-xl text-base"
            />
          </div>

          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Lock className="w-5 h-5 text-foreground" />
            </div>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Senha:"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-12 pr-12 h-14 bg-input border-none rounded-xl text-base"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-foreground" />
              ) : (
                <Eye className="w-5 h-5 text-foreground" />
              )}
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="text-center space-y-2 pt-4">
            <p className="text-sm text-foreground">
              Ainda não fez seu cadastro?{" "}
              <a href="/signup" className="font-medium hover:underline">
                Cadastre-se aqui!
              </a>
            </p>
            <a
              href="/forgot-password"
              className="block text-sm text-destructive font-medium hover:underline"
            >
              Esqueceu sua senha?
            </a>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-accent hover:bg-accent/90 text-accent-foreground text-xl font-bold rounded-xl uppercase mt-8"
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
