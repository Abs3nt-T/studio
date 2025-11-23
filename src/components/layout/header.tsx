"use client";

import Link from "next/link";
import { Menu, Beef } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import React from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/prodotti", label: "I Nostri Prodotti" },
  { href: "/salute", label: "Salute" },
  { href: "/contatti", label: "Contatti" },
];

export function Header() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerTextColor = isScrolled ? 'text-primary' : 'text-primary-foreground';
  const navLinkColor = isScrolled ? 'text-foreground/80 hover:text-foreground' : 'text-primary-foreground/80 hover:text-primary-foreground';
  const mobileMenuButtonColor = isScrolled ? 'text-foreground' : 'text-primary-foreground hover:bg-white/10';

  return (
    <header className={
      `sticky top-0 z-50 w-full transition-colors duration-300
      ${isScrolled ? 'border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60' : 'bg-transparent'}`
    }>
      <div className="container flex h-16 max-w-screen-xl items-center justify-between">
        <Link href="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
          <Beef className={`h-8 w-8 transition-colors ${headerTextColor}`} />
          <span className={`font-headline text-2xl font-bold transition-colors ${headerTextColor}`}>
            Fanuli Carni Equine
          </span>
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-8 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors ${navLinkColor}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center gap-2 md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className={mobileMenuButtonColor}>
                <Menu className="h-6 w-6" />
                <span className="sr-only">Apri menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="p-4">
                <Link href="/" className="mb-8 flex items-center gap-3" onClick={() => setIsOpen(false)}>
                   <Beef className="h-8 w-8 text-primary" />
                   <span className="font-headline text-xl font-bold text-primary">
                      Fanuli Carni Equine
                  </span>
                </Link>
                <div className="flex flex-col gap-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-lg font-medium text-foreground/80 hover:text-foreground"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
