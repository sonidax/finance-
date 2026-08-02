import { Link } from "react-router-dom";
import { TrendingUp, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-accent/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary-foreground/5 rounded-full blur-3xl animate-float" />
      </div>
      
      <div className="container py-14 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div className="opacity-0 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-5 group">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-foreground/10 transition-all duration-500 group-hover:bg-accent/20 group-hover:scale-110 group-hover:rotate-3">
                <TrendingUp className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              </div>
              <span className="font-display text-xl font-bold">DM Services</span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Your trusted partner for IPO investments, mutual funds, and financial services. 
              We help you make informed investment decisions.
            </p>
          </div>

          {/* Quick Links */}
          <div className="opacity-0 animate-fade-in-up stagger-1">
            <h3 className="font-display font-semibold mb-5 text-lg">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              {[
                { to: "/ipo-bidding", label: "IPO Bidding" },
                { to: "/allotment-status", label: "Allotment Status" },
                { to: "/gmp", label: "Grey Market Premium" },
                { to: "/help-support", label: "Help / Support" },
                { to: "/mutual-funds", label: "Mutual Funds" },
              ].map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-all duration-300 inline-flex items-center gap-1 group hover:translate-x-1"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="opacity-0 animate-fade-in-up stagger-2">
            <h3 className="font-display font-semibold mb-5 text-lg">Services</h3>
            <ul className="space-y-3 text-sm">
              {[
                { to: "/commodities", label: "Commodities" },
                { to: "/subscription-ratio", label: "Subscription Ratio" },
              ].map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-all duration-300 inline-flex items-center gap-1 group hover:translate-x-1"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="opacity-0 animate-fade-in-up stagger-3">
            <h3 className="font-display font-semibold mb-5 text-lg">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3 text-primary-foreground/70 group hover:text-primary-foreground transition-colors duration-300">
                <div className="h-9 w-9 rounded-lg bg-primary-foreground/10 flex items-center justify-center transition-all duration-300 group-hover:bg-accent/20 group-hover:scale-110">
                  <Mail className="h-4 w-4" />
                </div>
                support@dmservices.in
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/70 group hover:text-primary-foreground transition-colors duration-300">
                <div className="h-9 w-9 rounded-lg bg-primary-foreground/10 flex items-center justify-center transition-all duration-300 group-hover:bg-accent/20 group-hover:scale-110">
                  <Phone className="h-4 w-4" />
                </div>
                +91 98765 43210
              </li>
              <li className="flex items-start gap-3 text-primary-foreground/70 group hover:text-primary-foreground transition-colors duration-300">
                <div className="h-9 w-9 rounded-lg bg-primary-foreground/10 flex items-center justify-center transition-all duration-300 group-hover:bg-accent/20 group-hover:scale-110 flex-shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="pt-2">Himmatnagar, Gujarat, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-10 pt-8 text-center text-sm text-primary-foreground/60 opacity-0 animate-fade-in stagger-4">
          <p>&copy; {new Date().getFullYear()} DM Services. All rights reserved.</p>
          <p className="mt-2 flex items-center justify-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-soft" />
              SEBI Registered
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-soft" />
              AMFI Registered
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}