import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package } from "lucide-react";
import axiosInstance from "@/utils/axios";
import { Spinner } from "@/components/ui/spinner";

export const Route = createFileRoute("/user/")({
  component: RouteComponent,
});

interface Product {
  id: string;
  productName: string;
  price: number;
  body: string;
}

function RouteComponent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        // await new Promise((resolve) => setTimeout(resolve, 500));

        const response = await axiosInstance.get("/user/products");

        // Mock data - replace with actual API call
        const mockProducts: Product[] = [
          // Uncomment to see products displayed:
          {
            id: "1",
            productName: "Wireless Bluetooth Headphones",
            price: 79.99,
            body: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
          },
          {
            id: "2",
            productName: "Smart Fitness Tracker",
            price: 49.99,
            body: "Track your steps, heart rate, and sleep patterns with this advanced fitness tracker.",
          },
        ];
        setProducts(response.data || mockProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        {/* <Spinner /> */}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
        <div className="rounded-full bg-muted p-6 mb-6">
          <Package className="h-16 w-16 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">No Products Available</h2>
        <p className="text-muted-foreground max-w-md">
          There are currently no products listed. Check back soon for new items!
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Available Products</h1>
        <p className="text-muted-foreground">
          Browse our collection of {products.length} product
          {products.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="line-clamp-2">
                {product.productName}
              </CardTitle>
              <CardDescription className="text-lg font-semibold text-primary">
                ${product.price.toFixed(2)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {product.body}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
