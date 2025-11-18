import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useCompany } from "@/hooks/useCompany";
import { Eye, EyeOff, Lock, Mail, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import AuthLayout from "@/components/AuthLayout";
import { validatePassword } from "@/lib/passwordValidator";

export default function Signup() {
  const [, navigate] = useLocation();
  const { register } = useAuth();
  const { company, fetchCompany, loading: companyLoading, error } = useCompany();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState(validatePassword(""));

  // Get company slug from URL path
  useEffect(() => {
    const pathSegments = window.location.pathname.split("/").filter(Boolean);
    const companySlug = pathSegments[0];
    if (companySlug && companySlug !== "signup") {
      fetchCompany(companySlug);
    }
  }, [fetchCompany]);

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordValidation(validatePassword(value));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (!passwordValidation.isValid) {
      toast.error("Senha não atende aos requisitos");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Senhas diferentes");
      return;
    }

    setLoading(true);
    try {
      if (!company) {
        toast.error("Empresa não carregada");
        return;
      }
      await register(email, password, company.id);
  toast.success("Cadastro realizado! Faça login.");
      navigate(`/${company.slug}/login`, { replace: true });
    } catch (error) {
      const description = error instanceof Error ? error.message : "Erro ao cadastrar usuário";
      toast.error("Erro ao cadastrar", {
        description,
      });
    } finally {
      setLoading(false);
    }
  };

  if (companyLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading company data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <p className="text-destructive font-medium">{error}</p>
          <p className="text-sm text-muted-foreground">Ops... A tela buscada não se encontra disponível, verifique o link e tente novamente.</p>
        </div>
      </div>
    );
  }

  const criteria = passwordValidation.criteria;

  return (
    <AuthLayout company={company}>
      <div className="w-full bg-card rounded-2xl shadow-xl p-8 md:p-10 max-h-[90vh] overflow-y-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-foreground">
          Create Account
        </h1>

        <form onSubmit={handleSignup} className="space-y-5">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Mail className="w-5 h-5" />
            </div>
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-12 h-12 bg-input border-border rounded-xl text-base"
            />
          </div>

          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Lock className="w-5 h-5" />
            </div>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              required
              className="pl-12 pr-12 h-12 bg-input border-border rounded-xl text-base"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Requisitos da senha:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <li className="flex items-center gap-1">
                {criteria.uppercase ? <CheckCircle className="w-3 h-3 text-green-500" /> : <XCircle className="w-3 h-3 text-red-500" />}
                Maiúscula
              </li>
              <li className="flex items-center gap-1">
                {criteria.lowercase ? <CheckCircle className="w-3 h-3 text-green-500" /> : <XCircle className="w-3 h-3 text-red-500" />}
                Minúscula
              </li>
              <li className="flex items-center gap-1">
                {criteria.number ? <CheckCircle className="w-3 h-3 text-green-500" /> : <XCircle className="w-3 h-3 text-red-500" />}
                Número
              </li>
              <li className="flex items-center gap-1">
                {criteria.special ? <CheckCircle className="w-3 h-3 text-green-500" /> : <XCircle className="w-3 h-3 text-red-500" />}
                Especial
              </li>
              <li className="flex items-center gap-1">
                {criteria.length ? <CheckCircle className="w-3 h-3 text-green-500" /> : <XCircle className="w-3 h-3 text-red-500" />}
                8+ caracteres
              </li>
            </ul>
            {password.length > 0 && passwordValidation.errors.length > 0 && (
              <div className="space-y-1 mt-1">
                {passwordValidation.errors.map((error, index) => (
                  <p key={index} className="text-[10px] text-destructive">{error}</p>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Lock className="w-5 h-5" />
            </div>
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="pl-12 pr-12 h-12 bg-input border-border rounded-xl text-base"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>


          <div className="text-center pt-2">
            <p className="text-sm text-muted-foreground">
              Já possui conta? {""}
              <Link href={`/${company?.slug || ""}/login`}>
                <span className="font-medium text-primary hover:underline cursor-pointer">
                  Entrar
                </span>
              </Link>
            </p>
          </div>

          <Button
            type="submit"
            disabled={loading || !passwordValidation.isValid || password !== confirmPassword}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold rounded-xl uppercase mt-6"
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}
