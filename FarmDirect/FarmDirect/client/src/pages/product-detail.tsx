import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Star, ShoppingCart, Minus, Plus, User, MapPin } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import type { ProductWithFarmer, Review } from "@shared/schema";

export default function ProductDetail() {
  const [match, params] = useRoute("/products/:id");
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading } = useQuery<ProductWithFarmer>({
    queryKey: ["/api/products", params?.id],
    enabled: !!params?.id,
  });

  const { data: reviews, isLoading: reviewsLoading } = useQuery<Review[]>({
    queryKey: ["/api/products", params?.id, "reviews"],
    enabled: !!params?.id,
  });

  const addToCart = () => {
    // TODO: Implement cart functionality
    console.log("Adding to cart:", product?.id, "quantity:", quantity);
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  if (!match) {
    return <div>Product not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="w-full h-96 rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ) : product ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="aspect-square overflow-hidden rounded-lg" data-testid={`img-product-detail-${product.id}`}>
                <img
                  src={product.imageUrl || "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Information */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2" data-testid={`text-product-title-${product.id}`}>
                    {product.name}
                  </h1>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-5 w-5 ${i < Math.floor(Number(product.rating) || 4.8) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground" data-testid={`text-product-rating-${product.id}`}>
                      {product.rating || "4.8"} ({product.reviewCount || 24} reviews)
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-primary mb-4" data-testid={`text-product-price-${product.id}`}>
                    ${product.price}/{product.unit}
                  </div>
                  {product.inStock ? (
                    <Badge variant="secondary" data-testid={`badge-in-stock-${product.id}`}>
                      In Stock
                    </Badge>
                  ) : (
                    <Badge variant="destructive" data-testid={`badge-out-stock-${product.id}`}>
                      Out of Stock
                    </Badge>
                  )}
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground leading-relaxed" data-testid={`text-product-description-${product.id}`}>
                    {product.description || "Fresh, high-quality produce grown with care using sustainable farming practices. Perfect for your family's table."}
                  </p>
                </div>

                <Separator />

                {/* Quantity Selector */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Quantity</label>
                    <div className="flex items-center space-x-3">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={decrementQuantity}
                        disabled={quantity <= 1}
                        data-testid="button-decrease-quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-lg font-medium w-12 text-center" data-testid="text-quantity">
                        {quantity}
                      </span>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={incrementQuantity}
                        data-testid="button-increase-quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Button 
                    size="lg" 
                    className="w-full" 
                    onClick={addToCart}
                    disabled={!product.inStock}
                    data-testid="button-add-to-cart"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart - ${(Number(product.price) * quantity).toFixed(2)}
                  </Button>
                </div>
              </div>
            </div>

            {/* Farmer Information */}
            <Card data-testid={`card-farmer-info-${product.farmer.id}`}>
              <CardHeader>
                <CardTitle>About the Farmer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
                    alt={`${product.farmer.farmName} farmer`}
                    className="w-16 h-16 rounded-full object-cover"
                    data-testid={`img-farmer-${product.farmer.id}`}
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1" data-testid={`text-farm-name-${product.farmer.id}`}>
                      {product.farmer.farmName}
                    </h4>
                    {product.farmer.location && (
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground mb-2">
                        <MapPin className="h-4 w-4" />
                        <span data-testid={`text-farm-location-${product.farmer.id}`}>
                          {product.farmer.location}
                        </span>
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground mb-3" data-testid={`text-farm-bio-${product.farmer.id}`}>
                      {product.farmer.bio || "Dedicated to providing fresh, quality produce using sustainable farming practices."}
                    </p>
                    <Link href={`/farmers/${product.farmer.id}`}>
                      <Button variant="outline" size="sm" data-testid={`button-view-farmer-${product.farmer.id}`}>
                        View Farmer Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card data-testid={`card-reviews-${product.id}`}>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                {reviewsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="border-b border-border pb-4 last:border-b-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <Skeleton className="h-4 w-4 rounded-full" />
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                        <Skeleton className="h-16 w-full" />
                      </div>
                    ))}
                  </div>
                ) : reviews && reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-border pb-4 last:border-b-0" data-testid={`review-${review.id}`}>
                        <div className="flex items-center space-x-2 mb-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-sm">Customer</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground" data-testid={`text-review-comment-${review.id}`}>
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground" data-testid="text-no-reviews">
                    No reviews yet. Be the first to review this product!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-12" data-testid="text-product-not-found">
            <p className="text-muted-foreground text-lg">
              Product not found.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
