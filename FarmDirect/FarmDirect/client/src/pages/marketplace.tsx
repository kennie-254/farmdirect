import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ProductCard from "@/components/product-card";
import CategoryCard from "@/components/category-card";
import type { ProductWithFarmer, Category } from "@shared/schema";

export default function Marketplace() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Parse URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1] || '');
    const search = params.get('search') || '';
    const category = params.get('category') || '';
    
    setSearchQuery(search);
    setSelectedCategory(category);
  }, [location]);

  // Build query string for products
  const getProductsQuery = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (selectedCategory) params.append('category', selectedCategory);
    return params.toString() ? `?${params.toString()}` : '';
  };

  const { data: products, isLoading: productsLoading } = useQuery<ProductWithFarmer[]>({
    queryKey: ["/api/products", getProductsQuery()],
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (selectedCategory) params.append('category', selectedCategory);
    
    window.history.pushState({}, '', `/marketplace${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? '' : categoryId);
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (categoryId !== selectedCategory) params.append('category', categoryId);
    
    window.history.pushState({}, '', `/marketplace${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4" data-testid="text-marketplace-title">Marketplace</h1>
          <p className="text-muted-foreground text-lg mb-6">
            Discover fresh, local produce from trusted farmers in your area
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative max-w-md mb-6">
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
              data-testid="input-marketplace-search"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          </form>

          {/* Categories Filter */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5" />
              <h3 className="font-semibold">Filter by Category</h3>
            </div>
            
            {categoriesLoading ? (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="flex-shrink-0 w-32">
                    <CardContent className="p-4 text-center">
                      <Skeleton className="h-6 w-6 rounded mx-auto mb-2" />
                      <Skeleton className="h-4 w-16 mx-auto" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-2">
                <Button
                  variant={selectedCategory === '' ? 'default' : 'outline'}
                  onClick={() => handleCategorySelect('')}
                  data-testid="button-category-all"
                >
                  All Categories
                </Button>
                {categories?.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    onClick={() => handleCategorySelect(category.id)}
                    className="flex-shrink-0"
                    data-testid={`button-category-${category.id}`}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-6">
          {searchQuery && (
            <p className="text-muted-foreground mb-4" data-testid="text-search-results">
              Showing results for "{searchQuery}"
            </p>
          )}
          {selectedCategory && categories && (
            <p className="text-muted-foreground mb-4" data-testid="text-category-filter">
              Filtered by: {categories.find(c => c.id === selectedCategory)?.name}
            </p>
          )}
        </div>

        {productsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden border border-border">
                <Skeleton className="w-full h-48" />
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
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
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12" data-testid="text-no-products">
            <p className="text-muted-foreground text-lg">
              {searchQuery || selectedCategory 
                ? "No products found matching your criteria." 
                : "No products available at the moment."}
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
