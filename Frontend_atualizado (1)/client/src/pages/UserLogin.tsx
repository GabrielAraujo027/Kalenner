import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useCompany } from "@/hooks/useCompany";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { toast } from "sonner";
import { Link } from "wouter";

export default function UserLogin() {
  const [, navigate] = useLocation();
  const { login } = useAuth();
  const { company, fetchCompany, loading: companyLoading } = useCompany();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get company slug from URL path
  useEffect(() => {
    const pathSegments = window.location.pathname.split("/").filter(Boolean);
    const companySlug = pathSegments[0];

    if (companySlug && companySlug !== "user-login") {
      fetchCompany(companySlug);
    }
  }, [fetchCompany]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      // Simulating API call
      // In production: const response = await fetch(`/api/auth/user-login`, { ... });
      await login(email, password, company?.id || "default");
      toast.success("Login successful!");
      navigate("/my-appointments");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login error";
      toast.error(errorMessage);
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

  return (
    <AuthLayout company={company}>
      <div className="w-full bg-card rounded-2xl shadow-xl p-8 md:p-10">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-foreground">
            Book Your Appointment
          </h1>
          <p className="text-center text-muted-foreground mt-2 text-sm">
            Sign in to view and manage your appointments
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
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
              onChange={(e) => setPassword(e.target.value)}
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

          <div className="text-center space-y-3 pt-2">
            <Link href={`/${company?.id || ""}/company-login`}>
              <span className="block text-sm text-muted-foreground hover:text-foreground cursor-pointer">
                Are you a company? Sign in here
              </span>
            </Link>
            <Link href={`/${company?.id || ""}/forgot-password`}>
              <span className="block text-sm text-destructive font-medium hover:underline cursor-pointer">
                Forgot your password?
              </span>
            </Link>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold rounded-xl uppercase mt-6"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href={`/${company?.id || ""}/signup`}>
              <span className="font-medium text-primary hover:underline cursor-pointer">
                Create one now
              </span>
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
