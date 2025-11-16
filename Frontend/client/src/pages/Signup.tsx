import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useCompany } from "@/hooks/useCompany";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { validatePassword, getPasswordStrength } from "@/lib/passwordValidator";

export default function Signup() {
  const [, navigate] = useLocation();
  const { signup } = useAuth();
  const { company, fetchCompany, loading: companyLoading } = useCompany();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("Client");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState(validatePassword(""));
  const [passwordStrength, setPasswordStrength] = useState<"weak" | "fair" | "good" | "strong">("weak");

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
    setPasswordStrength(getPasswordStrength(value));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword || !name) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!passwordValidation.isValid) {
      toast.error("Password does not meet requirements");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      // Simulating API call
      // In production: const response = await fetch(`/api/auth/signup`, { ... });
      await signup(email, password, company?.id || "default", role);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Signup error";
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

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case "weak": return "bg-red-500";
      case "fair": return "bg-yellow-500";
      case "good": return "bg-blue-500";
      case "strong": return "bg-green-500";
    }
  };

  return (
    <AuthLayout company={company}>
      <div className="w-full bg-card rounded-2xl shadow-xl p-8 md:p-10 max-h-[90vh] overflow-y-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-foreground">
          Create Account
        </h1>

        <form onSubmit={handleSignup} className="space-y-5">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              <User className="w-5 h-5" />
            </div>
            <Input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="pl-12 h-12 bg-input border-border rounded-xl text-base"
            />
          </div>

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

          {/* Password Strength Indicator */}
          {password && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Password strength</Label>
                <span className="text-xs font-medium text-foreground capitalize">{passwordStrength}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${getStrengthColor()} transition-all duration-300`}
                  style={{
                    width: passwordStrength === "weak" ? "25%" : passwordStrength === "fair" ? "50%" : passwordStrength === "good" ? "75%" : "100%"
                  }}
                />
              </div>
              {/* Password Requirements */}
              {passwordValidation.errors.length > 0 && (
                <div className="space-y-1 mt-2">
                  {passwordValidation.errors.map((error, index) => (
                    <p key={index} className="text-xs text-destructive">{error}</p>
                  ))}
                </div>
              )}
            </div>
          )}

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

          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">Account type</Label>
            <RadioGroup value={role} onValueChange={setRole} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Client" id="client" />
                <Label htmlFor="client" className="cursor-pointer">Client</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Company" id="company" />
                <Label htmlFor="company" className="cursor-pointer">Company</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="text-center pt-2">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href={`/${company?.id || ""}/login`}>
                <span className="font-medium text-primary hover:underline cursor-pointer">
                  Sign in here!
                </span>
              </Link>
            </p>
          </div>

          <Button
            type="submit"
            disabled={loading || !passwordValidation.isValid}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold rounded-xl uppercase mt-6"
          >
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}
