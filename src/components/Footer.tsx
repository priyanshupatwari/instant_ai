import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    gsap.fromTo(
      footer,
      { opacity: 0, y: 60, filter: 'blur(10px)' },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1,
        scrollTrigger: {
          trigger: footer,
          start: 'top 90%',
        },
      }
    );

    // Floating particles
    const particles = footer.querySelectorAll('.particle');
    particles.forEach((particle, index) => {
      gsap.to(particle, {
        y: -15,
        opacity: 0.7,
        duration: 2 + index * 0.3,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        delay: index * 0.2,
      });
    });
  }, []);

  return (
    <footer 
      ref={footerRef}
      className="relative py-12 px-4 border-t border-border/50"
    >
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="particle absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-primary/40 glow-cyan blur-sm" />
        <div className="particle absolute top-1/2 right-1/3 w-3 h-3 rounded-full bg-secondary/40 glow-blue blur-sm" />
        <div className="particle absolute bottom-1/3 left-1/2 w-2 h-2 rounded-full bg-accent/40 glow-purple blur-sm" />
        <div className="particle absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-primary/30 glow-cyan blur-sm" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-2xl font-bold text-primary text-glow-cyan">InstantAI</h3>
            <p className="text-sm text-muted-foreground mt-2">
              AI-Powered Content Creation
            </p>
          </div>

          <nav className="flex gap-8">
            <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">
              About
            </a>
            <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">
              Contact
            </a>
          </nav>
        </div>

        <div className="mt-8 pt-8 border-t border-border/30 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} InstantAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};