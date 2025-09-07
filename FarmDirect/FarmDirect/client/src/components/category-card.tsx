import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { 
  Carrot, 
  Apple, 
  Milk, 
  Beef, 
  Egg, 
  Wheat,
  LucideIcon
} from "lucide-react";
import type { Category } from "@shared/schema";

interface CategoryCardProps {
  category: Category;
}

const iconMap: Record<string, LucideIcon> = {
  vegetables: Carrot,
  fruits: Apple,
  dairy: Milk,
  meat: Beef,
  eggs: Egg,
  grains: Wheat,
};

export default function CategoryCard({ category }: CategoryCardProps) {
  const IconComponent = iconMap[category.icon] || Carrot;

  return (
    <Link href={`/marketplace?category=${category.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer border border-border" data-testid={`card-category-${category.id}`}>
        <CardContent className="p-6 text-center">
          <IconComponent className="h-8 w-8 text-primary mb-3 mx-auto" />
          <h3 className="font-semibold" data-testid={`name-category-${category.id}`}>
            {category.name}
          </h3>
        </CardContent>
      </Card>
    </Link>
  );
}
