import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Users, Lock, Mail } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast({
          title: "Erro ao entrar",
          description: data?.error || data?.message || "Erro ao autenticar",
          variant: "destructive",
        });
        return;
      }

      // Token may come as `token` or `Token` based on backend casing
      const token: string | undefined = data?.token ?? data?.Token;
      if (token) {
        localStorage.setItem("kalenner_token", token);
      }
      // Optional: persist extra fields if provided by backend
      if (data?.expiresAt ?? data?.ExpiresAt) {
        localStorage.setItem("kalenner_token_expires", (data?.expiresAt ?? data?.ExpiresAt) as string);
      }
      if (data?.email ?? data?.Email) {
        localStorage.setItem("kalenner_email", (data?.email ?? data?.Email) as string);
      }
      if (data?.roles ?? data?.Roles) {
        try {
          localStorage.setItem("kalenner_roles", JSON.stringify(data?.roles ?? data?.Roles));
        } catch {
          // ignore serialization/storage errors
        }
      }

      toast({
        title: "Login realizado!",
        description: "Bem-vindo de volta!",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro de rede ao fazer login",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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

          <div className="text-center space-y-2 pt-4">
            <p className="text-sm text-foreground">
              Ainda não fez seu cadastro?{" "}
              <Link to="/signup" className="font-medium hover:underline">
                Cadastre-se aqui!
              </Link>
            </p>
            <Link
              to="/forgot-password"
              className="block text-sm text-destructive font-medium hover:underline"
            >
              {/* Esqueceu sua senha? Recuperar! */}
            </Link>
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
