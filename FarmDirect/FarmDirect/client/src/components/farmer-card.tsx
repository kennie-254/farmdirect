import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Link } from "wouter";
import type { FarmerWithProducts } from "@shared/schema";

interface FarmerCardProps {
  farmer: FarmerWithProducts;
}

export default function FarmerCard({ farmer }: FarmerCardProps) {
  return (
    <Card className="text-center border border-border" data-testid={`card-farmer-${farmer.id}`}>
      <CardContent className="p-6">
        <img
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
          alt={`${farmer.user.name} portrait`}
          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
          data-testid={`img-farmer-${farmer.id}`}
        />
        
        <h3 className="font-semibold text-lg mb-2" data-testid={`name-farmer-${farmer.id}`}>
          {farmer.user.name}
        </h3>
        
        <p className="text-muted-foreground mb-3" data-testid={`farm-name-${farmer.id}`}>
          {farmer.farmName}
        </p>
        
        <div className="flex items-center justify-center mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${i < Math.floor(Number(farmer.rating) || 4.8) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground ml-2" data-testid={`rating-farmer-${farmer.id}`}>
            {farmer.rating || "4.8"} ({farmer.reviewCount || 127} reviews)
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4" data-testid={`bio-farmer-${farmer.id}`}>
          {farmer.bio || "Specializing in fresh, organic produce"}
        </p>
        
        <Link href={`/farmers/${farmer.id}`}>
          <Button variant="secondary" size="sm" data-testid={`button-view-products-${farmer.id}`}>
            View Products
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
