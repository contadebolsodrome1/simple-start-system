import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import IdeasPage from "./pages/Ideas";
import ClientsPage from "./pages/ClientsPage";
import ClientDetailPage from "./pages/ClientDetailPage";
import ProcessesPage from "./pages/ProcessesPage";
import ProcessDetailPage from "./pages/ProcessDetailPage";
import SystemArchitectPage from "./pages/SystemArchitectPage";
import ArchitectPage from "./pages/ArchitectPage";
import AutomationsPage from "./pages/AutomationsPage";
import AutomationDetailPage from "./pages/AutomationDetailPage";
import UsersPage from "./pages/UsersPage";
import KeysPage from "./pages/KeysPage";
import { AuthProvider, useAuth } from "./context/AuthContext";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <Index />
        </ProtectedRoute>
      }
    />
    <Route
      path="/ideas"
      element={
        <ProtectedRoute>
          <IdeasPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/clients"
      element={
        <ProtectedRoute>
          <ClientsPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/clients/:id"
      element={
        <ProtectedRoute>
          <ClientDetailPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/processes"
      element={
        <ProtectedRoute>
          <ProcessesPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/processes/:id"
      element={
        <ProtectedRoute>
          <ProcessDetailPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/system-architect"
      element={
        <ProtectedRoute>
          <SystemArchitectPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/architect"
      element={
        <ProtectedRoute>
          <ArchitectPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/automations"
      element={
        <ProtectedRoute>
          <AutomationsPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/automations/:id"
      element={
        <ProtectedRoute>
          <AutomationDetailPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/keys"
      element={
        <ProtectedRoute>
          <KeysPage />
        </ProtectedRoute>
      }
    />
    <Route path="/auth" element={<Auth />} />
    <Route path="/login" element={<Navigate to="/auth" replace />} />
    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
