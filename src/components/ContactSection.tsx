import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { YoutubeLogo, InstagramLogo, LinkedinLogo } from '@phosphor-icons/react';
import { toast } from 'sonner';

gsap.registerPlugin(ScrollTrigger);

export const ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Fade in inputs from left
    const inputs = section.querySelectorAll('input, textarea');
    gsap.fromTo(
      inputs,
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
        },
      }
    );

    // Social icons animation
    const icons = section.querySelectorAll('.social-icon');
    gsap.fromTo(
      icons,
      { opacity: 0, scale: 0 },
      {
        opacity: 1,
        scale: 1,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Pulse animation on submit
    gsap.to(formRef.current, {
      scale: 1.02,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut',
    });

    toast.success('Message sent successfully!');
    setFormData({ name: '', email: '', message: '' });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section 
      ref={sectionRef}
      className="relative py-32 px-4"
      id="contact-section"
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-glow-cyan">
          Get In <span className="text-primary">Touch</span>
        </h2>
        <p className="text-center text-muted-foreground mb-12 text-lg">
          Have a project in mind? Let's create something amazing together.
        </p>

        <form 
          ref={formRef}
          onSubmit={handleSubmit}
          className="glass p-8 md:p-12 rounded-2xl space-y-6"
        >
          <div>
            <Input
              name="name"
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="glass border-primary/30 focus:border-primary focus:glow-cyan transition-all h-12"
            />
          </div>

          <div>
            <Input
              name="email"
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="glass border-primary/30 focus:border-primary focus:glow-cyan transition-all h-12"
            />
          </div>

          <div>
            <Textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              className="glass border-primary/30 focus:border-primary focus:glow-cyan transition-all resize-none"
            />
          </div>

          <Button 
            type="submit"
            variant="hero"
            size="lg"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </form>

        {/* Social Links */}
        <div className="flex justify-center gap-6 mt-12">
          {[
            { icon: YoutubeLogo, href: 'http://www.youtube.com/@dheeraj_raajput' },
            { icon: InstagramLogo, href: 'https://instagram.com/dheerajrajput6757?igsh=aGt2YndmYzEyaDFh' },
            { icon: LinkedinLogo, href: 'https://www.linkedin.com/in/dheeraj-rajput-849642318?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app' },
          ].map((social, index) => {
            const Icon = social.icon;
            return (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon glass p-4 rounded-full hover:glow-cyan transition-all duration-300 hover:-translate-y-1"
              >
                <Icon size={28} weight="fill" className="text-primary" />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};