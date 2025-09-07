import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart } from "lucide-react";
import { Link } from "wouter";
import type { ProductWithFarmer } from "@shared/schema";

interface ProductCardProps {
  product: ProductWithFarmer;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = () => {
    // TODO: Implement cart functionality
    console.log("Adding to cart:", product.id);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border border-border" data-testid={`card-product-${product.id}`}>
      <Link href={`/products/${product.id}`}>
        <div className="aspect-square overflow-hidden">
          <img
            src={product.imageUrl || "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
            data-testid={`img-product-${product.id}`}
          />
        </div>
      </Link>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground" data-testid={`text-farmer-${product.id}`}>
            by {product.farmer.farmName}
          </span>
          <div className="flex items-center" data-testid={`rating-${product.id}`}>
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-muted-foreground ml-1">
              {product.rating || "4.8"}
            </span>
          </div>
        </div>
        
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold mb-2 hover:text-primary transition-colors" data-testid={`title-product-${product.id}`}>
            {product.name}
          </h3>
        </Link>
        
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2" data-testid={`description-product-${product.id}`}>
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary" data-testid={`price-product-${product.id}`}>
            ${product.price}/{product.unit}
          </span>
          {product.inStock ? (
            <Button 
              size="sm" 
              onClick={addToCart}
              data-testid={`button-add-cart-${product.id}`}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add to Cart
            </Button>
          ) : (
            <Badge variant="secondary" data-testid={`badge-out-stock-${product.id}`}>
              Out of Stock
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
