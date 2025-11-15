import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Chatbot from "./pages/Chatbot";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./integrations/client";

// Small handler that runs on app load to process OAuth redirect fragments
// (e.g. #access_token=...) and then clean the URL and navigate to /chatbot.
function AuthHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hash = window.location.hash || '';
    // Only run when the URL contains OAuth tokens
    if (!hash.includes('access_token') && !hash.includes('refresh_token')) return;

    (async () => {
      try {
        // If supabase-js exposes a helper to parse the URL, call it.
        // This is best-effort; different versions may expose getSessionFromUrl.
        // If it fails, we fallback to checking the session directly.
        // @ts-ignore
        if (typeof supabase.auth.getSessionFromUrl === 'function') {
          // @ts-ignore
          await supabase.auth.getSessionFromUrl({ storeSession: true });
        }
      } catch (e) {
        // ignore parsing errors and continue
        // console.warn('getSessionFromUrl failed', e);
      }

      try {
        // Confirm session exists and then navigate/clean the URL
        const { data } = await supabase.auth.getSession();
        const session = data?.session;

        // Build a clean URL (preserve search params, but drop the hash)
        const cleanPath = `${window.location.origin}${window.location.pathname}${window.location.search}`;

        if (session?.user) {
          // If user is signed in, navigate to chatbot and replace history so tokens are not visible
          window.history.replaceState({}, document.title, cleanPath.replace(/\/$/, '') + '/chatbot');
          navigate('/chatbot', { replace: true });
        } else {
          // No session but remove token fragments anyway
          window.history.replaceState({}, document.title, cleanPath);
        }
      } catch (e) {
        // Best-effort only
        const cleanPath = `${window.location.origin}${window.location.pathname}${window.location.search}`;
        window.history.replaceState({}, document.title, cleanPath);
      }
    })();
  }, [navigate]);

  return null;
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthHandler />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chatbot" element={<Chatbot />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
