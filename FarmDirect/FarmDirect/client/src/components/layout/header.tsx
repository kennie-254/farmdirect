import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sprout, Search, ShoppingCart, Menu, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { logOut } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

export default function Header() {
  const [location, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isActive = (path: string) => location === path;

  return (
    <header className="bg-card shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" data-testid="link-home">
            <Sprout className="text-primary text-2xl" />
            <span className="text-2xl font-bold text-primary">Farm Direct</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/" 
              className={`transition-colors ${isActive('/') ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
              data-testid="link-home-nav"
            >
              Home
            </Link>
            <Link 
              href="/marketplace" 
              className={`transition-colors ${isActive('/marketplace') ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
              data-testid="link-marketplace"
            >
              Marketplace
            </Link>
            <Link 
              href="/farmers" 
              className={`transition-colors ${isActive('/farmers') ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
              data-testid="link-farmers"
            >
              Farmers
            </Link>
            {user && (
              <Link 
                href="/my-orders" 
                className={`transition-colors ${isActive('/my-orders') ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                data-testid="link-orders"
              >
                My Orders
              </Link>
            )}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input
                type="search"
                placeholder="Search fresh produce..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4"
                data-testid="input-search"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            </form>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative" data-testid="button-cart">
              <ShoppingCart className="h-5 w-5" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                0
              </Badge>
            </Button>
            
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm" data-testid="text-username">{user.email}</span>
                </div>
                <Button 
                  onClick={handleSignOut} 
                  variant="outline"
                  data-testid="button-signout"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <Link href="/auth/sign-in">
                  <Button variant="default" data-testid="button-signin">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button variant="secondary" data-testid="button-signup">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/marketplace" className="text-muted-foreground hover:text-primary transition-colors">
                Marketplace
              </Link>
              <Link href="/farmers" className="text-muted-foreground hover:text-primary transition-colors">
                Farmers
              </Link>
              {user && (
                <Link href="/my-orders" className="text-muted-foreground hover:text-primary transition-colors">
                  My Orders
                </Link>
              )}
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="search"
                  placeholder="Search fresh produce..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4"
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              </form>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
