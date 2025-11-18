import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CompanyProvider } from "./contexts/CompanyContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Colaboradores from "./pages/Colaboradores";
import Servicos from "./pages/Servicos";
import Login from "./pages/Login";
import Home from "./pages/Home"; // Adicionando Home para ser o Painel Principal / Home
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import CompanyLogin from "./pages/CompanyLogin";
import UserLogin from "./pages/UserLogin";
import UserAppointments from "./pages/UserAppointments";
import Configuracoes from "./pages/Configuracoes";
import Personalizacao from "./pages/Personalizacao";
import Compromissos from "./pages/Compromissos";
import CompromissoIndex from "./pages/Compromisso-Index";
import ClientDashboard from "./pages/ClientDashboard";
import DashboardMain from "./pages/Dashboard-Main";
import Collaborators from "./pages/collaborators";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";

function Router() {
  return (
    <Switch>
      {/* Rotas de Autenticação */}
      <Route path={"/"} component={Login} />
      <Route path={"/login"} component={Login} />
      <Route path={"/signup"} component={Signup} />
      <Route path={"/forgot-password"} component={ForgotPassword} />
      <Route path={"/:company/login"} component={Login} />
      <Route path={"/:company/signup"} component={Signup} />
      <Route path={"/:company/forgot-password"} component={ForgotPassword} />
      <Route path={"/:company/company-login"} component={CompanyLogin} />
      <Route path={"/:company/user-login"} component={UserLogin} />

      {/* Rotas Principais (Protegidas) */}
      <Route path={"/painel-principal"}>
        {() => (
          <ProtectedRoute>
            <Dashboard />
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
      <Route path={"/colaboradores"}>
        {() => (
          <ProtectedRoute requiredRole="Empresa">
            <Colaboradores />
          </ProtectedRoute>
        )}
      </Route>

      {/* Redirecionar /dashboard para /painel-principal */}
      <Route path={"/dashboard"}>
        {() => (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )}
      </Route>

      {/* Rotas de Cliente (Manter por segurança, mas não serão acessíveis pelo menu) */}
      <Route path={"/my-appointments"}>
        {() => (
          <ProtectedRoute>
            <UserAppointments />
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

      {/* Rotas Antigas (Manter para evitar quebras, mas serão removidas do menu) */}
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
      <Route path={"/compromissos"}>
        {() => (
          <ProtectedRoute>
            <Compromissos />
          </ProtectedRoute>
        )}
      </Route>
      <Route path={"/compromisso-index"}>
        {() => (
          <ProtectedRoute>
            <CompromissoIndex />
          </ProtectedRoute>
        )}
      </Route>
      <Route path={"/client-dashboard"}>
        {() => (
          <ProtectedRoute>
            <ClientDashboard />
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
      <Route path={"/collaborators"}>
        {() => (
          <ProtectedRoute>
            <Collaborators />
          </ProtectedRoute>
        )}
      </Route>
      <Route path={"/home"}>
        {() => (
          <ProtectedRoute>
            <Home />
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
