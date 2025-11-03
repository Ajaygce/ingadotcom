import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { data: featuredProducts, isLoading: loadingFeatured } = useQuery({
    queryKey: ["/api/products?featured=true&limit=8"],
  });

  const { data: bestsellers, isLoading: loadingBestsellers } = useQuery({
    queryKey: ["/api/products?bestseller=true&limit=8"],
  });

  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-secondary/5 to-accent/10" />
        <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-5" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Welcome to Ingaa
            </span>
            <br />
            <span className="text-foreground">Where Safety Meets Style</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Shop our curated collection of premium baby products, all safety-certified and parent-approved.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/products">
              <Button size="lg" className="text-lg px-8 h-14" data-testid="button-shop-now">
                Shop Now
              </Button>
            </Link>
            <Link href="/products?featured=true">
              <Button size="lg" variant="outline" className="text-lg px-8 h-14" data-testid="button-new-arrivals">
                New Arrivals
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Category Navigation Grid */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
            <p className="text-lg text-muted-foreground">
              Find exactly what you need for your little one
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories?.map((category: any) => (
              <Link key={category.id} href={`/products?category=${category.slug}`}>
                <Card className="group aspect-square rounded-2xl overflow-hidden hover-elevate transition-all cursor-pointer" data-testid={`card-category-${category.slug}`}>
                  <div className="relative h-full">
                    {category.imageUrl && (
                      <img
                        src={category.imageUrl}
                        alt={category.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-white text-xl font-semibold" data-testid={`text-category-name-${category.slug}`}>
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Products</h2>
              <p className="text-muted-foreground">Handpicked favorites for your baby</p>
            </div>
            <Link href="/products?featured=true">
              <Button variant="outline" data-testid="button-view-all-featured">
                View All Featured
              </Button>
            </Link>
          </div>

          {loadingFeatured ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="h-96 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts?.slice(0, 8).map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Safety & Certifications</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every product is rigorously tested and certified to meet the highest safety standards
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {["Safety Tested", "Non-Toxic", "BPA-Free", "Organic"].map((cert) => (
              <div key={cert} className="text-center p-6 rounded-lg bg-background">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✓</span>
                </div>
                <h3 className="font-semibold text-lg">{cert}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Parent Favorites</h2>
            <p className="text-lg text-muted-foreground">
              Our most-loved products trusted by thousands of parents
            </p>
          </div>

          {loadingBestsellers ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="h-96 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestsellers?.slice(0, 8).map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Parents Say</h2>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-6 w-6 fill-primary text-primary" />
              ))}
            </div>
            <p className="text-lg text-muted-foreground">
              4.8 stars from 2,500+ happy parents
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: "Sarah M.",
                quote: "Amazing quality! My baby loves the organic cotton onesies. They're so soft and wash beautifully.",
                rating: 5,
              },
              {
                name: "Michael T.",
                quote: "Fast shipping and great customer service. The products are exactly as described and totally worth it!",
                rating: 5,
              },
              {
                name: "Emily R.",
                quote: "I love that everything is safety certified. As a new mom, that peace of mind is priceless.",
                rating: 5,
              },
              {
                name: "David L.",
                quote: "The toys are educational and safe. Our little one is learning and having fun at the same time!",
                rating: 5,
              },
            ].map((review, i) => (
              <Card key={i} className="p-6">
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-lg mb-4 leading-relaxed">"{review.quote}"</p>
                <p className="font-semibold">{review.name}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Community</h2>
              <p className="text-lg text-muted-foreground mb-4">
                Get exclusive deals, parenting tips, and be the first to know about new arrivals!
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>✓ Exclusive deals and discounts</li>
                <li>✓ Expert parenting tips</li>
                <li>✓ New arrival notifications</li>
              </ul>
            </div>
            <div>
              <div className="bg-background rounded-lg p-6 shadow-lg">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="mb-3 h-12"
                  data-testid="input-newsletter-email"
                />
                <Button className="w-full h-12" data-testid="button-subscribe">
                  Subscribe Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
