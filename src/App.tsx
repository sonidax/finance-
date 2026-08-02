import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import IPOBidding from "./pages/IPOBidding";
import AllotmentStatus from "./pages/AllotmentStatus";
import GMP from "./pages/GMP";
import SubscriptionRatio from "./pages/SubscriptionRatio";
import MutualFunds from "./pages/MutualFunds";
import Commodities from "./pages/Commodities";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import HelpSupport from "./pages/HelpSupport";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/ipo-bidding" element={<IPOBidding />} />
          <Route path="/allotment-status" element={<AllotmentStatus />} />
          <Route path="/gmp" element={<GMP />} />
          <Route path="/subscription-ratio" element={<SubscriptionRatio />} />
          <Route path="/mutual-funds" element={<MutualFunds />} />
          <Route path="/commodities" element={<Commodities />} />
          <Route path="/help-support" element={<HelpSupport />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
