import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CompanyProvider } from "./contexts/CompanyContext";
import Login from "./pages/Login";
import CompanyLogin from "./pages/CompanyLogin";
import UserLogin from "./pages/UserLogin";
import UserAppointments from "./pages/UserAppointments";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";

import Colaboradores from "./pages/Colaboradores";
import Configuracoes from "./pages/Configuracoes";
import Servicos from "./pages/Servicos";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Login} />
      <Route path={"/login"} component={Login} />
      <Route path={"/signup"} component={Signup} />
      <Route path={"/forgot-password"} component={ForgotPassword} />
      <Route path={"/:company/login"} component={Login} />
      <Route path={"/:company/company-login"} component={CompanyLogin} />
      <Route path={"/:company/user-login"} component={UserLogin} />
      <Route path={"/:company/signup"} component={Signup} />
      <Route path={"/:company/forgot-password"} component={ForgotPassword} />
      <Route path={"/my-appointments"}>
        {() => (
          <ProtectedRoute>
            <UserAppointments />
          </ProtectedRoute>
        )}
      </Route>
      <Route path={"/dashboard"}>
        {() => (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )}
      </Route>

      <Route path={"/colaboradores"}>
        {() => (
          <ProtectedRoute requiredRole="Empresa">
            <Colaboradores />
          </ProtectedRoute>
        )}
      </Route>
      <Route path={"/configuracoes"}>
        {() => (
          <ProtectedRoute>
            <Configuracoes />
          </ProtectedRoute>
        )}
      </Route>
      <Route path={"/servicos"}>
        {() => (
          <ProtectedRoute requiredRole="Empresa">
            <Servicos />
          </ProtectedRoute>
        )}
      </Route>
      <Route path={"/:company/my-appointments"}>
        {() => (
          <ProtectedRoute>
            <UserAppointments />
          </ProtectedRoute>
        )}
      </Route>
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <CompanyProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </AuthProvider>
        </CompanyProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
