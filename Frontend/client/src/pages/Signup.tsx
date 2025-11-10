import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Users, Lock, Mail } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

const Signup = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter no mínimo 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast({
          title: "Erro ao cadastrar",
          description: data?.error || data?.message || "Erro ao cadastrar usuário",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Cadastro realizado!",
        description: "Você já pode fazer login",
      });
      navigate("/login", { replace: true });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro de rede ao fazer cadastro",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md bg-card rounded-3xl shadow-lg p-12">
        <h1 className="text-4xl font-bold text-center mb-12">Cadastro</h1>
        
        <form onSubmit={handleSignup} className="space-y-6">
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

          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Lock className="w-5 h-5 text-foreground" />
            </div>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Confirmar senha:"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="pl-12 h-14 bg-input border-none rounded-xl text-base"
            />
          </div>

          <div className="text-center pt-4">
            <p className="text-sm text-foreground">
              Já possui uma conta?{" "}
              <a href="/login" className="font-medium hover:underline">
                Faça login!
              </a>
            </p>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-accent hover:bg-accent/90 text-accent-foreground text-xl font-bold rounded-xl uppercase mt-8"
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Signup;
