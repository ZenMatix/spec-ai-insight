
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import HumanResponse from './pages/HumanResponse'; 
import Aichat from "./pages/Aichat";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import Layout from './components/Layout';
import LayoutWithoutFooter from './components/LayoutWithoutFooter';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingScreen from './components/LoadingScreen';
import { useAppLoading } from './hooks/useAppLoading';

const queryClient = new QueryClient();

const App = () => {
  const { isLoading } = useAppLoading();

  // Show loading screen with absolute priority - prevent any layout rendering
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="/" element={<LayoutWithoutFooter />}>
              <Route path="sign-in" element={<SignIn />} />
              <Route path="sign-up" element={<SignUp />} />
              <Route path="get-started" element={
                <ProtectedRoute>
                  <HumanResponse />
                </ProtectedRoute>
              } />
              <Route path="Ai-chat" element={
                <ProtectedRoute>
                  <Aichat />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
