import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SessionProvider } from "@/components/session-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminControl from "./pages/AdminControl";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PostalPayment from "./pages/PostalPayment";
import Pricing from "./pages/Pricing";
import QueueDisplay from "./pages/QueueDisplay";
import ShopQueue from "./pages/ShopQueue";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SessionProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/postal-payment" element={<PostalPayment />} />
            <Route path="/shop/:id" element={<ShopQueue />} />
            <Route path="/queue/:id" element={<ShopQueue />} />
            <Route path="/display/:id" element={<QueueDisplay />} />
            <Route path="/admin-dorak-control-067" element={<AdminControl />} />
            <Route path="/dorak-admin-067" element={<AdminControl />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SessionProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;