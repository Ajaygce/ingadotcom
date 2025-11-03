import { Button } from "@/components/ui/button";
import { Heart, Shield, Truck, RotateCcw } from "lucide-react";
import { Link } from "wouter";

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-secondary/5 to-accent/10" />
        <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-5" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Safe, Certified Baby Products
            </span>
            <br />
            <span className="text-foreground">for Happy Little Ones</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover our curated collection of premium baby essentials. Every product is safety-tested, parent-approved, and made with love.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="text-lg px-8 h-14" asChild data-testid="button-signin">
              <a href="/api/login">Sign In to Shop</a>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 h-14" asChild data-testid="button-learn-more">
              <a href="#features">Learn More</a>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              Free Shipping Over $50
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-primary" />
              30-Day Returns
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Safety Certified
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Parents Choose Ingaa</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're committed to providing the safest, highest-quality products for your precious little ones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Safety Tested</h3>
              <p className="text-muted-foreground">
                Every product meets or exceeds international safety standards.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="h-16 w-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Non-Toxic Materials</h3>
              <p className="text-muted-foreground">
                BPA-free, phthalate-free, and eco-friendly materials only.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="h-16 w-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Fast Shipping</h3>
              <p className="text-muted-foreground">
                Free shipping on orders over $50. Quick delivery to your door.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="h-16 w-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Easy Returns</h3>
              <p className="text-muted-foreground">
                30-day hassle-free returns. Your satisfaction is guaranteed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Shop by Category</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need for your baby, all in one place.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Feeding", slug: "feeding", emoji: "🍼" },
              { name: "Clothing", slug: "clothing", emoji: "👶" },
              { name: "Toys", slug: "toys", emoji: "🧸" },
              { name: "Nursery", slug: "nursery", emoji: "🛏️" },
            ].map((category) => (
              <a
                key={category.slug}
                href="/api/login"
                className="group aspect-square rounded-2xl bg-card border-2 hover:border-primary transition-all p-8 flex flex-col items-center justify-center text-center hover-elevate"
                data-testid={`link-category-${category.slug}`}
              >
                <div className="text-6xl mb-4">{category.emoji}</div>
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Join Our Community
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Sign in to access exclusive deals, save your favorites, and enjoy a personalized shopping experience.
          </p>
          <Button size="lg" className="text-lg px-8 h-14" asChild data-testid="button-join-now">
            <a href="/api/login">Sign In Now</a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-1 mb-4">
            <p>Made with</p>
            <Heart className="h-4 w-4 fill-primary text-primary" />
            <p>for parents everywhere</p>
          </div>
          <p>© 2024 Ingaa. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
