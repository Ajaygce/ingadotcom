import { Link, useLocation } from "wouter";
import { ShoppingCart, Heart, User, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CartSlideOver } from "./CartSlideOver";
import logoImage from "@assets/Artboard 1_1761839581907.png";

export function Header() {
  const { isAuthenticated, user } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const { data: cartItems } = useQuery({
    queryKey: ["/api/cart"],
    enabled: isAuthenticated,
  });

  const { data: wishlistItems } = useQuery({
    queryKey: ["/api/wishlist"],
    enabled: isAuthenticated,
  });

  const cartCount = cartItems?.length || 0;
  const wishlistCount = wishlistItems?.length || 0;

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
        {/* Top bar with free shipping notice */}
        <div className="bg-primary text-primary-foreground py-2 px-4 text-center text-sm">
          <p>Free Shipping on Orders Over $50 | 30-Day Returns | Safety Certified</p>
        </div>

        {/* Main header */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              <Menu className="h-6 w-6" />
            </Button>

            {/* Logo */}
            <Link href="/">
              <a className="flex items-center gap-2 hover-elevate rounded-lg px-2 py-1 -ml-2 md:ml-0" data-testid="link-home">
                <img 
                  src={logoImage} 
                  alt="Ingaa Baby Products" 
                  className="h-10 md:h-12 w-auto"
                />
              </a>
            </Link>

            {/* Desktop search bar */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for baby products..."
                  className="pl-10 h-12"
                  data-testid="input-search"
                />
              </div>
            </div>

            {/* Right side icons */}
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  <Link href="/wishlist">
                    <Button variant="ghost" size="icon" className="relative" data-testid="button-wishlist">
                      <Heart className="h-6 w-6" />
                      {wishlistCount > 0 && (
                        <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs" data-testid="badge-wishlist-count">
                          {wishlistCount}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    onClick={() => setIsCartOpen(true)}
                    data-testid="button-cart"
                  >
                    <ShoppingCart className="h-6 w-6" />
                    {cartCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs" data-testid="badge-cart-count">
                        {cartCount}
                      </Badge>
                    )}
                  </Button>
                  <Link href="/account">
                    <Button variant="ghost" size="icon" data-testid="button-account">
                      {user?.profileImageUrl ? (
                        <img
                          src={user.profileImageUrl}
                          alt={user.firstName || 'User'}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6" />
                      )}
                    </Button>
                  </Link>
                </>
              ) : (
                <Button asChild data-testid="button-login">
                  <a href="/api/login">Sign In</a>
                </Button>
              )}
            </div>
          </div>

          {/* Mobile search bar */}
          <div className="md:hidden mt-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for baby products..."
                className="pl-10"
                data-testid="input-search-mobile"
              />
            </div>
          </div>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:block bg-card border-t">
          <div className="max-w-7xl mx-auto px-4">
            <ul className="flex items-center justify-center gap-8 py-3">
              <li>
                <Link href="/products?category=all">
                  <a className={`hover-elevate px-4 py-2 rounded-lg transition-colors ${location === '/products' ? 'bg-primary/10 text-primary' : ''}`} data-testid="link-all-products">
                    All Products
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/products?category=feeding">
                  <a className="hover-elevate px-4 py-2 rounded-lg transition-colors" data-testid="link-feeding">
                    Feeding
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/products?category=clothing">
                  <a className="hover-elevate px-4 py-2 rounded-lg transition-colors" data-testid="link-clothing">
                    Clothing
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/products?category=toys">
                  <a className="hover-elevate px-4 py-2 rounded-lg transition-colors" data-testid="link-toys">
                    Toys
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/products?category=nursery">
                  <a className="hover-elevate px-4 py-2 rounded-lg transition-colors" data-testid="link-nursery">
                    Nursery
                  </a>
                </Link>
              </li>
              {user?.isAdmin && (
                <li>
                  <Link href="/admin">
                    <a className={`hover-elevate px-4 py-2 rounded-lg transition-colors bg-accent/20 font-medium ${location.startsWith('/admin') ? 'bg-accent/40' : ''}`} data-testid="link-admin">
                      Admin
                    </a>
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </nav>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-card border-t">
            <nav className="px-4 py-4">
              <ul className="space-y-2">
                <li>
                  <Link href="/products?category=all">
                    <a className="block hover-elevate px-4 py-3 rounded-lg" data-testid="link-all-products-mobile">
                      All Products
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=feeding">
                    <a className="block hover-elevate px-4 py-3 rounded-lg" data-testid="link-feeding-mobile">
                      Feeding
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=clothing">
                    <a className="block hover-elevate px-4 py-3 rounded-lg" data-testid="link-clothing-mobile">
                      Clothing
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=toys">
                    <a className="block hover-elevate px-4 py-3 rounded-lg" data-testid="link-toys-mobile">
                      Toys
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=nursery">
                    <a className="block hover-elevate px-4 py-3 rounded-lg" data-testid="link-nursery-mobile">
                      Nursery
                    </a>
                  </Link>
                </li>
                {user?.isAdmin && (
                  <li>
                    <Link href="/admin">
                      <a className="block hover-elevate px-4 py-3 rounded-lg bg-accent/20 font-medium" data-testid="link-admin-mobile">
                        Admin Panel
                      </a>
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        )}
      </header>

      <CartSlideOver isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
