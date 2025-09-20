import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import InstallHarvestingSetup from "./components/InstallHarvestingSetup";
import InstallationUpdates from "./components/InstallationUpdates";
import Capture from "./pages/Capture";
import Contractors from "./pages/Contractors";
import Index from "./pages/Index";
import Installation from "./pages/Installation";
import Marketplace from "./pages/Marketplace";
import NotFound from "./pages/NotFound";
import Payment from "./pages/Payment";
import Schedule from "./pages/Schedule";
import Home from "./pages/Home";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/install-setup" element={<InstallHarvestingSetup />} />
          <Route path="/installation-updates" element={<InstallationUpdates />} />
          <Route path="/capture" element={<Capture />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/contractors" element={<Contractors />} />
          <Route path="/schedule/:contractorId" element={<Schedule />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/installation" element={<Installation />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
