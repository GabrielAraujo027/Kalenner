import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import DashboardMain from "./pages/Dashboard-Main";
import CompromissoIndex from "./pages/Compromisso-Index";
import CompanyDashboard from "./pages/CompanyDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import Colaboradores from "./pages/Colaboradores";
import Configuracoes from "./pages/Configuracoes";
import Personalizacao from "./pages/Personalizacao";
import Cadastro from "./pages/Cadastro";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Login} />
      <Route path={"/login"} component={Login} />
      <Route path={"/signup"} component={Signup} />
      <Route path={"/forgot-password"} component={ForgotPassword} />
      <Route path={"/dashboard"}>
        {() => (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )}
      </Route>
      <Route path={"/dashboard-main"}>
        {() => (
          <ProtectedRoute>
            <DashboardMain />
          </ProtectedRoute>
        )}
      </Route>
      <Route path={"/compromisso"}>
        {() => (
          <ProtectedRoute>
            <CompromissoIndex />
          </ProtectedRoute>
        )}
      </Route>
      <Route path={"/empresa"}>
        {() => (
          <ProtectedRoute requiredRole="Empresa">
            <CompanyDashboard />
          </ProtectedRoute>
        )}
      </Route>
      <Route path={"/cliente"}>
        {() => (
          <ProtectedRoute requiredRole="Cliente">
            <ClientDashboard />
          </ProtectedRoute>
        )}
      </Route>
      <Route path={"/colaboradores"}>
        {() => (
          <ProtectedRoute>
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
      <Route path={"/personalizacao"}>
        {() => (
          <ProtectedRoute>
            <Personalizacao />
          </ProtectedRoute>
        )}
      </Route>
      <Route path={"/cadastro"}>
        {() => (
          <ProtectedRoute>
            <Cadastro />
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
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
