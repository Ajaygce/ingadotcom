import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Star, Heart, ShoppingCart, Shield, Truck, RotateCcw } from "lucide-react";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const productId = params?.id;
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  const { data: product, isLoading } = useQuery({
    queryKey: [`/api/products/${productId}`],
    enabled: !!productId,
  });

  const { data: reviews } = useQuery({
    queryKey: [`/api/products/${productId}/reviews`],
    enabled: !!productId,
  });

  const { data: relatedProducts } = useQuery({
    queryKey: [`/api/products?category=${product?.category?.slug}&limit=4`],
    enabled: !!product?.category?.slug,
  });

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/cart", {
        productId,
        quantity,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to cart",
        description: `${quantity} item(s) added to your cart.`,
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

  const submitReviewMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/products/${productId}/reviews`, newReview);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/products/${productId}/reviews`] });
      queryClient.invalidateQueries({ queryKey: [`/api/products/${productId}`] });
      setNewReview({ rating: 5, comment: "" });
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Please sign in",
          description: "You need to be logged in to submit a review.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 1500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to submit review.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xl text-muted-foreground">Product not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  const price = parseFloat(product.price);
  const rating = parseFloat(product.averageRating || "0");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-muted-foreground mb-8">
            <a href="/" className="hover:text-foreground">Home</a>
            <span className="mx-2">/</span>
            <a href="/products" className="hover:text-foreground">Products</a>
            {product.category && (
              <>
                <span className="mx-2">/</span>
                <a href={`/products?category=${product.category.slug}`} className="hover:text-foreground">
                  {product.category.name}
                </a>
              </>
            )}
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          {/* Product Main Section */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Image Gallery */}
            <div>
              <div className="aspect-square rounded-2xl overflow-hidden bg-muted mb-4">
                <img
                  src={product.imageUrls?.[selectedImage] || "/placeholder-product.png"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  data-testid="img-product-main"
                />
              </div>
              {product.imageUrls && product.imageUrls.length > 1 && (
                <div className="flex gap-4 overflow-x-auto">
                  {product.imageUrls.map((url: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index ? 'border-primary' : 'border-transparent'
                      }`}
                      data-testid={`button-thumbnail-${index}`}
                    >
                      <img src={url} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-4xl font-bold mb-4" data-testid="text-product-name">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Math.round(rating)
                          ? "fill-primary text-primary"
                          : "fill-muted text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground" data-testid="text-review-count">
                  {product.reviewCount || 0} reviews
                </span>
              </div>

              {/* Price */}
              <p className="text-4xl font-bold text-primary mb-6" data-testid="text-product-price">
                ${price.toFixed(2)}
              </p>

              {/* Safety Certifications */}
              {product.safetyCertifications && product.safetyCertifications.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {product.safetyCertifications.map((cert: string) => (
                    <Badge key={cert} className="bg-accent text-accent-foreground" data-testid={`badge-cert-${cert}`}>
                      <Shield className="h-3 w-3 mr-1" />
                      {cert}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">Quantity</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      data-testid="button-decrease-quantity"
                    >
                      -
                    </Button>
                    <span className="px-6 font-medium" data-testid="text-quantity">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={quantity >= product.stockQuantity}
                      data-testid="button-increase-quantity"
                    >
                      +
                    </Button>
                  </div>
                  <span className="text-sm text-muted-foreground" data-testid="text-stock">
                    {product.stockQuantity} in stock
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-8">
                <Button
                  className="flex-1 h-14 text-lg"
                  onClick={() => addToCartMutation.mutate()}
                  disabled={product.stockQuantity === 0 || !isAuthenticated}
                  data-testid="button-add-to-cart"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="icon" className="h-14 w-14" data-testid="button-add-wishlist">
                  <Heart className="h-6 w-6" />
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 p-6 bg-card rounded-lg">
                <div className="text-center">
                  <Truck className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Free Shipping</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">30-Day Returns</p>
                </div>
                <div className="text-center">
                  <Shield className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Safety Certified</p>
                </div>
              </div>

              {/* Product Details Accordion */}
              <Accordion type="single" collapsible className="mt-8">
                <AccordionItem value="description">
                  <AccordionTrigger>Description</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-lg leading-loose" data-testid="text-description">
                      {product.description}
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="specifications">
                  <AccordionTrigger>Specifications</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {product.ageRange && (
                        <li><strong>Age Range:</strong> {product.ageRange}</li>
                      )}
                      <li><strong>Stock:</strong> {product.stockQuantity} available</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="shipping">
                  <AccordionTrigger>Shipping & Returns</AccordionTrigger>
                  <AccordionContent>
                    <p>Free shipping on orders over $50. 30-day hassle-free returns.</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Customer Reviews</h2>

            {/* Review Form */}
            {isAuthenticated && (
              <Card className="p-6 mb-8">
                <h3 className="font-semibold text-lg mb-4">Write a Review</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          data-testid={`button-rating-${star}`}
                        >
                          <Star
                            className={`h-8 w-8 cursor-pointer transition-colors ${
                              star <= newReview.rating
                                ? "fill-primary text-primary"
                                : "fill-muted text-muted"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Comment</label>
                    <Textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      placeholder="Share your experience with this product..."
                      rows={4}
                      data-testid="textarea-review-comment"
                    />
                  </div>
                  <Button
                    onClick={() => submitReviewMutation.mutate()}
                    disabled={submitReviewMutation.isPending}
                    data-testid="button-submit-review"
                  >
                    Submit Review
                  </Button>
                </div>
              </Card>
            )}

            {/* Reviews List */}
            <div className="grid md:grid-cols-2 gap-6">
              {reviews?.map((review: any) => (
                <Card key={review.id} className="p-6" data-testid={`review-${review.id}`}>
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating
                            ? "fill-primary text-primary"
                            : "fill-muted text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mb-3">{review.comment}</p>
                  <div className="flex items-center gap-2">
                    {review.user?.profileImageUrl && (
                      <img
                        src={review.user.profileImageUrl}
                        alt={review.user.firstName || 'User'}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium text-sm">
                        {review.user?.firstName} {review.user?.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts && relatedProducts.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold mb-8">You Might Also Love</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.filter((p: any) => p.id !== productId).slice(0, 4).map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
