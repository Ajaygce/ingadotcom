import { Link } from "wouter";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product & { category?: { name: string } };
}

export function ProductCard({ product }: ProductCardProps) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/cart", {
        productId: product.id,
        quantity: 1,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Please sign in",
          description: "You need to be logged in to add items to cart.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 1500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to add item to cart.",
        variant: "destructive",
      });
    },
  });

  const toggleWishlistMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/wishlist/toggle", {
        productId: product.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Please sign in",
          description: "You need to be logged in to save items to your wishlist.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 1500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update wishlist.",
        variant: "destructive",
      });
    },
  });

  const imageUrl = product.imageUrls?.[0] || "/placeholder-product.png";
  const price = parseFloat(product.price);
  const rating = parseFloat(product.averageRating || "0");

  return (
    <Card className="group overflow-hidden hover-elevate transition-all duration-200" data-testid={`card-product-${product.id}`}>
      <Link href={`/product/${product.id}`}>
        <a className="block relative">
          <div className="aspect-square overflow-hidden bg-muted">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          {product.featured && (
            <Badge className="absolute top-2 left-2 bg-accent" data-testid={`badge-featured-${product.id}`}>
              Featured
            </Badge>
          )}
          {product.bestseller && (
            <Badge className="absolute top-2 left-2 bg-primary" data-testid={`badge-bestseller-${product.id}`}>
              Bestseller
            </Badge>
          )}
          {product.stockQuantity === 0 && (
            <Badge className="absolute top-2 right-2 bg-destructive" data-testid={`badge-outofstock-${product.id}`}>
              Out of Stock
            </Badge>
          )}
        </a>
      </Link>

      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 bg-background/80 backdrop-blur hover:bg-background"
        onClick={() => toggleWishlistMutation.mutate()}
        disabled={!isAuthenticated}
        data-testid={`button-wishlist-${product.id}`}
      >
        <Heart className="h-5 w-5" />
      </Button>

      <CardContent className="p-4">
        <Link href={`/product/${product.id}`}>
          <a className="block">
            {product.category && (
              <p className="text-xs text-muted-foreground mb-1" data-testid={`text-category-${product.id}`}>
                {product.category.name}
              </p>
            )}
            <h3 className="font-medium text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors" data-testid={`text-name-${product.id}`}>
              {product.name}
            </h3>
          </a>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= Math.round(rating)
                    ? "fill-primary text-primary"
                    : "fill-muted text-muted"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground" data-testid={`text-reviews-${product.id}`}>
            ({product.reviewCount || 0})
          </span>
        </div>

        {/* Safety certifications */}
        {product.safetyCertifications && product.safetyCertifications.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {product.safetyCertifications.slice(0, 2).map((cert: string) => (
              <Badge key={cert} variant="outline" className="text-xs" data-testid={`badge-cert-${product.id}-${cert}`}>
                {cert}
              </Badge>
            ))}
          </div>
        )}

        {/* Price */}
        <p className="text-2xl font-bold text-primary" data-testid={`text-price-${product.id}`}>
          ${price.toFixed(2)}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={() => addToCartMutation.mutate()}
          disabled={product.stockQuantity === 0 || addToCartMutation.isPending || !isAuthenticated}
          data-testid={`button-addtocart-${product.id}`}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.stockQuantity === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}
