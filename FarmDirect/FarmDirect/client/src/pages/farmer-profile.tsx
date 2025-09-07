import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, MapPin, Calendar } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ProductCard from "@/components/product-card";
import type { FarmerWithProducts } from "@shared/schema";

export default function FarmerProfile() {
  const [match, params] = useRoute("/farmers/:id");

  const { data: farmer, isLoading } = useQuery<FarmerWithProducts>({
    queryKey: ["/api/farmers", params?.id],
    enabled: !!params?.id,
  });

  if (!match) {
    return <div>Farmer not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="space-y-8">
            {/* Farmer Info Skeleton */}
            <Card>
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  <Skeleton className="w-32 h-32 rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-6 w-64 mb-4" />
                    <div className="flex items-center space-x-4 mb-4">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-5 w-32" />
                    </div>
                    <Skeleton className="h-20 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Products Skeleton */}
            <div>
              <Skeleton className="h-8 w-48 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="w-full h-48" />
                    <CardContent className="p-4">
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-full mb-3" />
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-8 w-24" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ) : farmer ? (
          <div className="space-y-8">
            {/* Farmer Information */}
            <Card data-testid={`card-farmer-profile-${farmer.id}`}>
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"
                    alt={`${farmer.user.name} portrait`}
                    className="w-32 h-32 rounded-full object-cover flex-shrink-0"
                    data-testid={`img-farmer-profile-${farmer.id}`}
                  />
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-2" data-testid={`text-farmer-name-${farmer.id}`}>
                      {farmer.user.name}
                    </h1>
                    <h2 className="text-xl text-muted-foreground mb-4" data-testid={`text-farm-name-${farmer.id}`}>
                      {farmer.farmName}
                    </h2>
                    
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <div className="flex items-center space-x-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-5 w-5 ${i < Math.floor(Number(farmer.rating) || 4.8) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="font-medium" data-testid={`text-farmer-rating-${farmer.id}`}>
                          {farmer.rating || "4.8"}
                        </span>
                        <span className="text-muted-foreground">
                          ({farmer.reviewCount || 127} reviews)
                        </span>
                      </div>
                      
                      {farmer.location && (
                        <div className="flex items-center space-x-1 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span data-testid={`text-farmer-location-${farmer.id}`}>
                            {farmer.location}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Farming since {new Date(farmer.createdAt!).getFullYear()}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground leading-relaxed" data-testid={`text-farmer-bio-${farmer.id}`}>
                      {farmer.bio || "Dedicated to providing the freshest, highest quality produce using sustainable farming practices. We believe in nurturing the land and growing food that nourishes our community."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Farmer's Products */}
            <div>
              <h2 className="text-2xl font-bold mb-6" data-testid={`text-farmer-products-title-${farmer.id}`}>
                Products from {farmer.farmName}
              </h2>
              
              {farmer.products && farmer.products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {farmer.products.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={{
                        ...product,
                        farmer,
                        category: { id: product.categoryId, name: "Product", icon: "default" }
                      }} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12" data-testid={`text-no-products-${farmer.id}`}>
                  <p className="text-muted-foreground text-lg">
                    This farmer hasn't listed any products yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12" data-testid="text-farmer-not-found">
            <p className="text-muted-foreground text-lg">
              Farmer not found.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
