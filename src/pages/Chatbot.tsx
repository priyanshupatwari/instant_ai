import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/client';
import { PaperPlaneRight, SignOut } from '@phosphor-icons/react';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chatbot() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! I\'m InstantAI. How can I help you create amazing content today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        navigate('/login');
      } else {
        setUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session?.user) {
        navigate('/login');
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('webhook-relay', {
        body: { 
          message: userMessage,
          userId: user.id 
        }
      });

      if (error) throw error;

      const assistantResponse = data?.response || 'No response received';
      setMessages(prev => [...prev, { role: 'assistant', content: assistantResponse }]);
      setIsLoading(false);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="h-[100dvh] flex flex-col">
      {/* Header */}
      <header className="glass border-b border-border/50 p-4 flex justify-between items-center flex-shrink-0">
        <h1 className="text-2xl font-bold text-primary text-glow-cyan">InstantAI</h1>
        <Button 
          variant="glass" 
          size="sm"
          onClick={handleSignOut}
        >
          <SignOut size={20} weight="bold" />
          Sign Out
        </Button>
      </header>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 min-h-0">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] md:max-w-[70%] p-4 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground glow-cyan'
                    : 'glass border border-primary/20'
                }`}
              >
                <p className="leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="glass border border-primary/20 p-4 rounded-2xl">
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form */}
      <div className="glass border-t border-border/50 p-4 flex-shrink-0 sticky bottom-0">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-4">
          <Input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter the topic for the script"
            disabled={isLoading}
            className="flex-1 glass border-primary/30 focus:border-primary focus:glow-cyan h-12"
          />
          <Button 
            type="submit" 
            variant="hero"
            disabled={isLoading || !input.trim()}
            className="px-6"
          >
            <PaperPlaneRight size={20} weight="fill" />
          </Button>
        </form>
        {user && (
          <div className="mt-2 text-xs text-muted-foreground">
            {user.user_metadata?.full_name || user.email?.split('@')[0]} • {user.email}
          </div>
        )}
        </div>
      </div>

      {/* Background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/5 glow-cyan blur-3xl animate-float" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-accent/5 glow-purple blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
}