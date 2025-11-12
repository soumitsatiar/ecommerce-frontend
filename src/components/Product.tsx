import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Eye, Heart, ShoppingCart } from "lucide-react";

type Product = {
  id: string;
  productName: string;
  price: number;
  body: string;
};

type ProductProps = {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onView?: (product: Product) => void;
  className?: string;
};

export default function Product({
  product,
  onAddToCart,
  onView,
  className,
}: ProductProps) {
  const initials = getInitials(product.productName);
  const price = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(product.price ?? 0);

  return (
    <Card
      className={cn(
        "group overflow-hidden hover:shadow-lg transition-all",
        className
      )}
    >
      <div className="relative">
        {/* Media / placeholder */}
        <div
          className="aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-muted to-muted/70 flex items-center justify-center"
          aria-label={`${product.productName} image placeholder`}
        >
          <div className="text-3xl font-semibold text-muted-foreground/80 select-none">
            {initials}
          </div>
        </div>

        {/* Floating wishlist button */}
        <div className="absolute right-3 top-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60"
                aria-label="Add to wishlist"
              >
                <Heart className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add to wishlist</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <CardHeader className="pb-0">
        <CardTitle className="line-clamp-2 leading-tight">
          {product.productName}
        </CardTitle>
        <CardDescription className="text-base font-medium text-primary">
          {price}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-2">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {product.body}
        </p>
      </CardContent>

      <CardFooter className="gap-2">
        <Button
          className="flex-1"
          onClick={() => onAddToCart?.(product)}
          aria-label={`Add ${product.productName} to cart`}
        >
          <ShoppingCart />
          Add to cart
        </Button>
        <Button
          variant="outline"
          onClick={() => onView?.(product)}
          aria-label={`View details for ${product.productName}`}
        >
          <Eye />
          View
        </Button>
      </CardFooter>
    </Card>
  );
}

function getInitials(name: string) {
  if (!name) return "";
  const [a = "", b = ""] = name.trim().split(/\s+/);
  return (a[0] || "").toUpperCase() + (b[0] || "").toUpperCase();
}
