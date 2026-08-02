import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, TrendingUp, User, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "IPO Bidding", path: "/ipo-bidding" },
  { name: "Allotment Status", path: "/allotment-status" },
  { name: "GMP", path: "/gmp" },
  { name: "Subscription", path: "/subscription-ratio" },
  { name: "Mutual Funds", path: "/mutual-funds" },
  { name: "Commodities", path: "/commodities" },
  { name: "Help / Support", path: "/help-support" },
];


export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/80 backdrop-blur-xl supports-[backdrop-filter]:bg-card/60 transition-all duration-300">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-hero transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-glow">
            <TrendingUp className="h-5 w-5 text-primary-foreground transition-transform duration-300 group-hover:scale-110" />
          </div>
          <span className="font-display text-xl font-bold text-foreground group-hover:text-accent transition-colors duration-300">
            DM Finance Services
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link, index) => (
            <Link
              key={link.path}
              to={link.path}
            
              className={cn(
                "relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 hover-underline",
                location.pathname === link.path
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {link.name}
              {location.pathname === link.path && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="group hover:bg-muted/50 transition-all duration-300" 
            asChild
          >
            <Link to="/login">
              <LogIn className="h-4 w-4 mr-1.5 transition-transform duration-300 group-hover:rotate-12" />
              Login
            </Link>
          </Button>
          <Button 
            size="sm" 
            className="btn-shine group transition-all duration-300 hover:shadow-lg" 
            asChild
          >
            <Link to="/signup">
              <User className="h-4 w-4 mr-1.5 transition-transform duration-300 group-hover:scale-110" />
              Sign Up
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden relative overflow-hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className={cn(
            "absolute transition-all duration-300",
            mobileMenuOpen ? "rotate-90 opacity-0 scale-50" : "rotate-0 opacity-100 scale-100"
          )}>
            <Menu className="h-5 w-5" />
          </span>
          <span className={cn(
            "absolute transition-all duration-300",
            mobileMenuOpen ? "rotate-0 opacity-100 scale-100" : "-rotate-90 opacity-0 scale-50"
          )}>
            <X className="h-5 w-5" />
          </span>
        </Button>
      </div>
      
      {/* Mobile Navigation */}
      <div className={cn(
        "lg:hidden border-t border-border/50 bg-card/95 backdrop-blur-xl overflow-hidden transition-all duration-500 ease-out",
        mobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <nav className="container py-4 flex flex-col gap-1">
          {navLinks.map((link, index) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 transform",
                location.pathname === link.path
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:translate-x-1"
              )}
              style={{ 
                animationDelay: `${index * 0.05}s`,
                opacity: mobileMenuOpen ? 1 : 0,
                transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-10px)',
                transition: `all 0.3s ease ${index * 0.05}s`
              }}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
            <Button variant="outline" size="sm" className="flex-1 hover:border-accent transition-colors duration-300" asChild>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                Login
              </Link>
            </Button>
            <Button size="sm" className="flex-1 btn-shine" asChild>
              <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                Sign Up
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}