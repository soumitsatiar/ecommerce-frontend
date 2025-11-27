import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Package } from "lucide-react";
import axiosInstance from "@/utils/axios";
import { Spinner } from "@/components/ui/spinner";
import Product from "@/components/user/Product";

export const Route = createFileRoute("/user/")({
  component: RouteComponent,
});

interface Product {
  id: string;
  productName: string;
  price: number;
  quantity: number;
  body: string;
  tag: {
    id: string;
    name: string;
  };
  imageUrl: string[];
}

function RouteComponent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/user/products");
        setProducts(response.data);
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
        <Spinner />
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
          <Product key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
