import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowLeft } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { useCompany } from "@/hooks/useCompany";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { company, fetchCompany, loading: companyLoading } = useCompany();

  // Get company slug from URL path
  useEffect(() => {
    const pathSegments = window.location.pathname.split("/").filter(Boolean);
    const companySlug = pathSegments[0];

    if (companySlug && companySlug !== "forgot-password") {
      fetchCompany(companySlug);
    }
  }, [fetchCompany]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      // Simulating API call
      // In production: const response = await fetch(`/api/auth/forgot-password`, { ... });
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSent(true);
      toast.success("Recovery email sent!");
    } catch (err) {
      toast.error("Error sending recovery email");
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
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
          Reset Password
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Enter your email to receive password reset instructions
        </p>

        {!sent ? (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Mail className="w-5 h-5" />
              </div>
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-12 h-12 bg-input border-border rounded-xl text-base"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold rounded-xl uppercase"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>

            <Link href={`/${company?.id || ""}/login`}>
              <Button
                type="button"
                variant="ghost"
                className="w-full h-12 text-base"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to login
              </Button>
            </Link>
          </form>
        ) : (
          <div className="text-center space-y-6">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
              <p className="text-green-800 dark:text-green-200 font-medium">
                Email sent successfully!
              </p>
              <p className="text-green-700 dark:text-green-300 text-sm mt-2">
                Check your inbox and follow the instructions to reset your password.
              </p>
            </div>

            <Link href={`/${company?.id || ""}/login`}>
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 text-base"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to login
              </Button>
            </Link>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
