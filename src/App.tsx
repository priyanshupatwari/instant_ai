import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Chatbot from "./pages/Chatbot";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./integrations/client";
// Analytics is loaded dynamically on the client to avoid build-time bundling issues
// import ChatMessage from '@/components/ui/ChatMessage';

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

const App = () => {
  const [AnalyticsComponent, setAnalyticsComponent] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    import("@vercel/analytics/react")
      .then((mod) => {
        if (mounted) setAnalyticsComponent(() => mod.Analytics);
      })
      .catch(() => {
        // ignore; optional analytics not available in some environments
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
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
        {AnalyticsComponent && <AnalyticsComponent />}
        {/* <ChatMessage text={"Hello! I'm Instant AI, your dedicated assistant for crafting exceptional short-form video scripts. I'm genuinely excited to help you bring your video ideas to life! To get started, I need a little more information about your video. The more details you provide, the better I can tailor the script to your vision! Tell me about: * **Core Topic/Subject**: What is your video about? * **Target Platform**: Where will this video be posted? (TikTok, Instagram Reels, YouTube Shorts, etc.) * **Target Audience**: Who are you trying to reach? (age, interests, demographics) * **Desired Length**: Approximately how long should the video be? (15s, 30s, 60s, 90s, or up to 2.5 minutes MAX) * **Tone & Style**: What's the vibe? (Educational, entertaining, humorous, dramatic, inspirational, casual, professional?) * **Key Message/Goal**: What do you want viewers to take away or do after watching? * **Unique Angle**: What makes your video different from others on this topic? * **Visual Style Preferences**: \n\n Any specific ideas for how it should look? (Fast-paced cuts, talking head, B-roll heavy, text overlays?) * **Specific Requirements**: Are there any must-include points, calls-to-action, or things to avoid? Let's create something amazing together!"} /> */}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
