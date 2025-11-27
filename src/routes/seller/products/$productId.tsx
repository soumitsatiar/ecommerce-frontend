import type { AppDispatch } from "@/store";
import { fetchProduct, getProduct } from "@/store/features/product";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Package, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/seller/products/$productId")({
  component: RouteComponent,
  loader: ({ params }) => {
    return {
      crumb: `${params.productId}`,
    };
  },
});

function RouteComponent() {
  const { productId } = Route.useParams();
  const dispatch = useDispatch<AppDispatch>();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchProduct(productId));
  }, [dispatch, productId]);

  const { product, loading, error } = useSelector(getProduct);
  const url = import.meta.env.VITE_CLOUDFLARE_R2_URL;

  if (loading) {
    return <ProductSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Package className="size-16 text-muted-foreground" />
        <h2 className="text-2xl font-semibold">Product not found</h2>
        <p className="text-muted-foreground">
          The product you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  const images = product.imageUrl || [];
  const currentImage = images[selectedImageIndex];

  const price = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(product.price ?? 0);

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery Section */}
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-square bg-muted">
                {currentImage ? (
                  <img
                    src={url + currentImage}
                    alt={`${product.productName} - Image ${selectedImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="size-24 text-muted-foreground" />
                  </div>
                )}

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="size-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur"
                      onClick={nextImage}
                    >
                      <ChevronRight className="size-4" />
                    </Button>
                  </>
                )}

                {/* Image Counter */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur px-3 py-1 rounded-full text-sm">
                    {selectedImageIndex + 1} / {images.length}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={cn(
                    "relative aspect-square rounded-lg overflow-hidden border-2 transition-all",
                    selectedImageIndex === idx
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-transparent hover:border-muted-foreground/20"
                  )}
                >
                  <img
                    src={url + img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div className="space-y-6">
          {/* Title and Badge */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
                {product.productName}
              </h1>
            </div>

            {product.tag && (
              <Badge variant="secondary" className="text-sm">
                {product.tag.name}
              </Badge>
            )}

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "size-4",
                      i < 4 ? "fill-yellow-400 text-yellow-400" : "text-muted"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                4.0 (128 reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-1">
            <div className="text-4xl font-bold text-primary">{price}</div>
            <p className="text-sm text-muted-foreground">
              Inclusive of all taxes
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.body}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Package className="size-5 text-green-600" />
            <span className="font-medium">
              {product.quantity > 0 ? (
                <span className="text-green-600">
                  In Stock ({product.quantity} available)
                </span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
