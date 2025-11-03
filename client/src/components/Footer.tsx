import { Link } from "wouter";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t mt-24">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4">
              Ingaa
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Premium baby products, carefully curated for your little one's safety and comfort.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products?category=all">
                  <a className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-all">
                    All Products
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/products?category=feeding">
                  <a className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-feeding">
                    Feeding
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/products?category=clothing">
                  <a className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-clothing">
                    Clothing
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/products?category=toys">
                  <a className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-toys">
                    Toys
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/products?category=nursery">
                  <a className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-nursery">
                    Nursery
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Track Order
                </a>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-semibold mb-4">About</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Our Story
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Safety Standards
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sustainability
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2024 Ingaa. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="h-4 w-4 fill-primary text-primary" /> for parents everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
