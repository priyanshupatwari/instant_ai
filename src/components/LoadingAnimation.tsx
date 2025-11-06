import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface LoadingAnimationProps {
  onComplete: () => void;
}

export const LoadingAnimation = ({ onComplete }: LoadingAnimationProps) => {
  const [progress, setProgress] = useState(0);
  const preloaderRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate logo entrance
    gsap.fromTo(
      logoRef.current,
      { opacity: 0, scale: 0.8, filter: 'blur(10px)' },
      { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power2.out' }
    );

    // Animate progress bar
    const progressTween = gsap.to(progressBarRef.current, {
      width: '100%',
      duration: 2,
      ease: 'power2.out',
      onUpdate: function() {
        const prog = Math.round(this.progress() * 100);
        setProgress(prog);
      },
      onComplete: () => {
        // Fade out preloader
        gsap.to(preloaderRef.current, {
          opacity: 0,
          scale: 0.9,
          filter: 'blur(10px)',
          duration: 1,
          delay: 0.3,
          ease: 'power2.inOut',
          onComplete: () => {
            onComplete();
          }
        });
      }
    });

    return () => {
      progressTween.kill();
    };
  }, [onComplete]);

  return (
    <div 
      ref={preloaderRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
    >
      <div ref={logoRef} className="mb-12 text-center">
        <h1 className="text-6xl md:text-8xl font-bold text-glow-cyan text-primary mb-4">
          InstantAI
        </h1>
        <p className="text-xl text-muted-foreground">Initializing AI...</p>
      </div>

      <div className="w-64 md:w-96">
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <div 
            ref={progressBarRef}
            className="h-full bg-gradient-to-r from-primary via-secondary to-accent glow-cyan"
            style={{ width: '0%' }}
          />
        </div>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          {progress}%
        </div>
      </div>
    </div>
  );
};