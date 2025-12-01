import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { Github, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo />
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} AquaOrder. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <a href="#" aria-label="Twitter">
                <Twitter />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="#" aria-label="GitHub">
                <Github />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="#" aria-label="LinkedIn">
                <Linkedin />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}