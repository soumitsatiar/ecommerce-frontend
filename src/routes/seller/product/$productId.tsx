import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { AppDispatch } from "@/store";
import { fetchProduct, getProduct } from "@/store/features/product";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  Boxes,
  Hash,
  Package,
  RefreshCw,
  Tag as TagIcon,
} from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const Route = createFileRoute("/seller/product/$productId")({
  component: RouteComponent,
  loader: ({ params }) => {
    return {
      crumb: `Product ${params.productId}`,
    };
  },
});

function RouteComponent() {
  const { productId } = Route.useParams();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchProduct(productId));
  }, [dispatch, productId]);

  const { product, loading, error } = useSelector(getProduct);

  if (loading) {
    return <ProductSkeleton />;
  }

  if (error || !product) {
    return <ProductError onRetry={() => dispatch(fetchProduct(productId))} />;
  }

  const formattedPrice = formatCurrency(product.price);
  const formattedQuantity = formatNumber(product.quantity);
  const tagLabel = product.tag?.name ?? "Uncategorized";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Button variant="ghost" size="sm" className="-ml-2" asChild>
            <Link to="/seller/products">
              <ArrowLeft className="mr-2 size-4" />
              Back to products
            </Link>
          </Button>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            {product.productName}
          </h1>
          <p className="text-sm text-muted-foreground">
            Product ID: {product.id}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={() => dispatch(fetchProduct(productId))}
          >
            <RefreshCw className="mr-2 size-4" />
            Refresh
          </Button>
          <Button asChild>
            <Link to="/seller/products">Manage catalog</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card>
          <CardHeader className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="flex size-16 items-center justify-center rounded-lg bg-muted">
                <Package className="size-6 text-muted-foreground" />
              </div>
              <div>
                <CardTitle>{product.productName}</CardTitle>
                <CardDescription>{tagLabel}</CardDescription>
              </div>
            </div>
            <div className="text-3xl font-semibold">{formattedPrice}</div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="leading-relaxed text-muted-foreground">
              {product.body || "No description provided yet."}
            </p>
            <Separator />
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Product ID
                </p>
                <p className="text-base font-semibold break-all">
                  {product.id}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Available
                </p>
                <p className="text-base font-semibold">
                  {formattedQuantity} units
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Tag
                </p>
                <p className="text-base font-semibold">{tagLabel}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory snapshot</CardTitle>
              <CardDescription>Quick view of stock health.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                    <Boxes className="size-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">On hand</p>
                    <p className="text-base font-semibold">
                      {formattedQuantity} units
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                    <TagIcon className="size-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tag</p>
                    <p className="text-base font-semibold">{tagLabel}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                    <Hash className="size-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Identifier</p>
                    <p className="text-base font-semibold break-all">
                      {product.id}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Button variant="ghost" size="sm" className="-ml-2" asChild>
          <Link to="/seller/products">
            <ArrowLeft className="mr-2 size-4" />
            Back to products
          </Link>
        </Button>
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card className="p-6 space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Separator />
          <div className="grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
            ))}
          </div>
        </Card>
        <div className="space-y-4">
          <Card className="p-6 space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

type ProductErrorProps = {
  onRetry: () => void;
};

function ProductError({ onRetry }: ProductErrorProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
            <Package className="size-5 text-muted-foreground" />
          </div>
          <CardTitle>Unable to load product</CardTitle>
          <CardDescription>
            Something went wrong while fetching the product. Please try again.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full" onClick={onRetry}>
            <RefreshCw className="mr-2 size-4" />
            Try again
          </Button>
          <Button variant="ghost" className="w-full" asChild>
            <Link to="/seller/products">
              <ArrowLeft className="mr-2 size-4" />
              Back to products
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const quantityFormatter = new Intl.NumberFormat();

function formatCurrency(value?: number) {
  return currencyFormatter.format(value ?? 0);
}

function formatNumber(value?: number) {
  return quantityFormatter.format(value ?? 0);
}
