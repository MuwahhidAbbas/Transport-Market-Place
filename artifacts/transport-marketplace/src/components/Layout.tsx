import { Link, useLocation } from "wouter";
import { Truck, LayoutDashboard, Search, FileText, Anchor, ArrowRightLeft, Menu, X } from "lucide-react";
import { useCurrentUser, useToggleRole } from "@/hooks/use-marketplace";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { data: user } = useCurrentUser();
  const toggleRole = useToggleRole();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!user) return null;

  const isCustomer = user.role === "customer";

  const navLinks = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/marketplace", label: "Marketplace", icon: Search },
    isCustomer 
      ? { href: "/my-requests", label: "My Requests", icon: FileText }
      : { href: "/my-bids", label: "My Bids", icon: Anchor },
  ];

  const handleToggleRole = () => {
    toggleRole.mutate();
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-xl text-primary">
                <Truck className="h-6 w-6" />
              </div>
              <span className="font-display font-bold text-xl text-foreground tracking-tight hidden sm:block">
                Freight<span className="text-primary">Flow</span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location === link.href;
                return (
                  <Link key={link.href} href={link.href} className="flex items-center gap-2 relative">
                    <span className={`text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                      <Icon className="h-4 w-4 inline mr-1" />
                      {link.label}
                    </span>
                    {isActive && (
                      <motion.div 
                        layoutId="navbar-indicator"
                        className="absolute -bottom-[22px] left-0 right-0 h-0.5 bg-primary"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 pr-4 border-r border-border">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-semibold leading-none">{user.name}</span>
                  <span className="text-xs text-muted-foreground capitalize">{user.role} View</span>
                </div>
                <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                  {user.avatar}
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleToggleRole}
                disabled={toggleRole.isPending}
                className="hidden sm:flex"
              >
                <ArrowRightLeft className="h-4 w-4 mr-2" />
                Switch to {isCustomer ? "Provider" : "Customer"}
              </Button>

              {/* Mobile menu button */}
              <button 
                className="md:hidden p-2 text-muted-foreground"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-border overflow-hidden"
          >
            <div className="px-4 pt-2 pb-4 space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location === link.href;
                return (
                  <Link key={link.href} href={link.href}>
                    <div 
                      className={`block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="h-5 w-5 inline mr-3" />
                      {link.label}
                    </div>
                  </Link>
                );
              })}
              <div className="mt-4 pt-4 border-t border-border">
                <Button 
                  variant="outline" 
                  className="w-full justify-center" 
                  onClick={handleToggleRole}
                  disabled={toggleRole.isPending}
                >
                  <ArrowRightLeft className="h-4 w-4 mr-2" />
                  Switch to {isCustomer ? "Provider" : "Customer"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
