import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import Dashboard from "./pages/Dashboard";
import EsimManagement from "./pages/EsimManagement";
import Usage from "./pages/Usage";
import TeamSettings from "./pages/TeamSettings";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Permissions from "./pages/team-settings/Permissions";
import Limits from "./pages/team-settings/Limits";
import UsageTeam from "./pages/team-settings/Usage";
import EsimGroupEdit from "./pages/EsimGroupEdit";
import EsimGroupView from "./pages/EsimGroupView";
import EsimGroupCreate from "./pages/EsimGroupCreate";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ViewGroup from "./pages/ViewGroup";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            {/* Protected routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/esim-codes" element={<EsimManagement />} />
            <Route path="/esim-codes/:groupId/edit" element={<EsimGroupEdit />} />
            <Route path="/esim-codes/:groupId/view" element={<ViewGroup />} />
            <Route path="/esim-codes/create" element={<EsimGroupCreate />} />
            <Route path="/usage" element={<Usage />} />
            <Route path="/team" element={<TeamSettings />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App; 