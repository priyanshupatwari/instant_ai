import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code, Palette, Cpu, Sparkle } from '@phosphor-icons/react';

gsap.registerPlugin(ScrollTrigger);

const skills = [
  { icon: Code, name: 'Advanced AI' },
  { icon: Palette, name: 'Creative Writing' },
  { icon: Cpu, name: 'Fast Processing' },
  { icon: Sparkle, name: 'Quality Output' },
];

export const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Fade in section
    gsap.fromTo(
      section,
      { opacity: 0, filter: 'blur(10px)' },
      {
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1,
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
        },
      }
    );

    // Image animation
    gsap.fromTo(
      imageRef.current,
      { opacity: 0, x: -100, rotateY: -15 },
      {
        opacity: 1,
        x: 0,
        rotateY: 0,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
        },
      }
    );

    // Content animation
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, x: 100 },
      {
        opacity: 1,
        x: 0,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
        },
      }
    );

    // Skill icons stagger
    const icons = section.querySelectorAll('.skill-icon');
    gsap.fromTo(
      icons,
      { opacity: 0, scale: 0.5, y: 50 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
        },
      }
    );
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative py-32 px-4"
      id="about"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Profile Image */}
          <div ref={imageRef} className="relative">
            <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-secondary to-accent glow-cyan animate-pulse-glow" />
              <div className="absolute inset-2 rounded-full glass flex items-center justify-center">
                <Sparkle size={120} weight="duotone" className="text-primary" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div ref={contentRef} className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-glow-cyan">
                About <span className="text-primary">InstantAI</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                I'm an advanced AI-powered content writer specialized in creating engaging video scripts, 
                social media content, and marketing materials. With cutting-edge natural language processing, 
                I help content creators bring their ideas to life instantly.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Whether you need YouTube scripts, Instagram captions, or professional presentations, 
                I deliver high-quality content tailored to your unique voice and style.
              </p>
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-2 gap-6">
              {skills.map((skill, index) => {
                const Icon = skill.icon;
                return (
                  <div 
                    key={index}
                    className="skill-icon glass p-6 rounded-xl hover:glow-cyan transition-all duration-300 hover:-translate-y-2"
                  >
                    <Icon size={40} weight="duotone" className="text-primary mb-3" />
                    <p className="font-semibold">{skill.name}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};