import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/client';
import { GoogleLogo } from '@phosphor-icons/react';
import { toast } from 'sonner';

export default function Login() {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        navigate('/chatbot');
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        navigate('/chatbot');
      }
    });

    // Animate card entrance
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 50, scale: 0.9, filter: 'blur(10px)' },
      { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1, ease: 'power2.out', delay: 0.3 }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Allow overriding the redirect target from env for easy local/dev testing
          // e.g. VITE_AUTH_REDIRECT=http://localhost:5173/chatbot
          redirectTo: import.meta.env.VITE_AUTH_REDIRECT || `${window.location.origin}/chatbot`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to sign in with Google');
      setIsLoading(false);
    }
  };

  // Redirect if already logged in
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 glow-cyan blur-3xl animate-float" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-accent/10 glow-purple blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>

      <div 
        ref={cardRef}
        className="relative z-10 glass p-12 rounded-3xl max-w-md w-full border border-primary/20 glow-cyan"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary text-glow-cyan mb-3">
            InstantAI
          </h1>
          <p className="text-muted-foreground text-lg">
            Sign in to start creating
          </p>
        </div>

        <Button
          variant="glass"
          size="lg"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full text-lg py-6 h-auto"
        >
          {isLoading ? (
            <span className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Connecting...
            </span>
          ) : (
            <span className="flex items-center gap-3">
              <GoogleLogo size={24} weight="bold" />
              Continue with Google
            </span>
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-8">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}