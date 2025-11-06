import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const HeroSection = () => {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const splineRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 });

    // Animate headline
    tl.fromTo(
      headlineRef.current,
      { opacity: 0, y: 50, filter: 'blur(10px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power2.out' }
    );

    // Animate subtitle
    tl.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.5'
    );

    // Animate CTA
    tl.fromTo(
      ctaRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' },
      '-=0.4'
    );

    // Animate Spline container
    tl.fromTo(
      splineRef.current,
      { opacity: 0, x: 100 },
      { opacity: 1, x: 0, duration: 1.2, ease: 'power2.out' },
      '-=0.8'
    );

    // Floating animation for glowing orbs
    const orbs = document.querySelectorAll('.glow-orb');
    orbs.forEach((orb, index) => {
      gsap.to(orb, {
        y: -20,
        duration: 3 + index * 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        delay: index * 0.2,
      });
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Background Spline */}
      <div 
        ref={splineRef}
        className="absolute inset-0 z-0 opacity-40"
      >
        <iframe 
          src='https://my.spline.design/galaxy-qvdNXLVAhQoZ21dUHI6icN6U/' 
          frameBorder='0' 
          width='100%' 
          height='100%'
          title="3D Background"
          className="pointer-events-none"
        />
        {/* Overlay to hide Spline watermark */}
        <div className="absolute bottom-0 right-0 w-[200px] h-[60px] bg-background z-10" />
      </div>

      {/* Floating Glow Orbs */}
      <div className="glow-orb absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 glow-cyan blur-3xl" />
      <div className="glow-orb absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-accent/10 glow-purple blur-3xl" />
      <div className="glow-orb absolute top-1/2 right-1/3 w-48 h-48 rounded-full bg-secondary/10 glow-blue blur-3xl" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto">
        <h1 
          ref={headlineRef}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
        >
          Hi, I'm <span className="text-primary">Instant<span className="text-purple-600">AI</span></span>
          <br />
          <span className="text-white [text-shadow:_2px_2px_8px_rgb(0_0_0_/_60%)]">
            AI Content Writer
          </span>
        </h1>

        <p 
          ref={subtitleRef}
          className="text-xl md:text-2xl text-white mb-12 max-w-2xl mx-auto [text-shadow:_2px_2px_8px_rgb(0_0_0_/_60%)]"
        >
          Create stunning video content with the power of artificial intelligence. Fast, efficient, and professional.
        </p>

        <div ref={ctaRef}>
          <Button 
            variant="hero" 
            size="lg"
            onClick={() => navigate('/login')}
            className="text-lg px-12 py-6 h-auto animate-pulse-glow"
          >
            Try For Free
          </Button>
        </div>
      </div>
    </section>
  );
};