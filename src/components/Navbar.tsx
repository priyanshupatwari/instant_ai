import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleAboutClick = () => {
    setIsAboutOpen(true);
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold">
                <span className="text-primary">Instant</span>
                <span className="text-purple-600">AI</span>
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={handleAboutClick}
                className="text-foreground hover:text-primary transition-colors duration-300 font-medium"
              >
                About
              </button>
              <button
                onClick={scrollToContact}
                className="text-foreground hover:text-primary transition-colors duration-300 font-medium"
              >
                Contact Us
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-foreground hover:text-primary transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 space-y-4 animate-fade-in">
              <button
                onClick={handleAboutClick}
                className="block w-full text-left text-foreground hover:text-primary transition-colors duration-300 font-medium"
              >
                About
              </button>
              <button
                onClick={scrollToContact}
                className="block w-full text-left text-foreground hover:text-primary transition-colors duration-300 font-medium"
              >
                Contact Us
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* About Dialog */}
      <Dialog open={isAboutOpen} onOpenChange={setIsAboutOpen}>
        <DialogContent className="glass border-primary/20">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              <span className="text-primary">Instant</span>
              <span className="text-purple-600">AI</span>
            </DialogTitle>
            <DialogDescription className="text-foreground/90 text-base leading-relaxed pt-4">
              InstantAI is an AI-based content generator (script writer) currently only creating scripts for short videos. 
              InstantAI is powered by the API of a fine-tuned Phi mini model trained on the data of best performing videos 
              for YouTube and Instagram.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};
