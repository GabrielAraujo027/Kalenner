import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

const ForgotPassword = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({
          title: "Erro",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "E-mail enviado!",
        description: "Verifique sua caixa de entrada para redefinir sua senha",
      });
      setEmail("");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar o e-mail",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md bg-card rounded-3xl shadow-lg p-12">
        <h1 className="text-4xl font-bold text-center mb-8">Recuperar Senha</h1>
        <p className="text-center text-muted-foreground mb-8">
          Digite seu e-mail para receber as instruções de recuperação
        </p>
        
        <form onSubmit={handleResetPassword} className="space-y-6">
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

          <div className="text-center pt-4">
            <Link
              to="/login"
              className="text-sm text-foreground hover:underline"
            >
              Voltar para login
            </Link>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-accent hover:bg-accent/90 text-accent-foreground text-xl font-bold rounded-xl uppercase mt-8"
          >
            {loading ? "Enviando..." : "Recuperar"}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
