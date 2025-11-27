import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heart, MinusIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import axiosInstance from "@/utils/axios";
import { toast } from "sonner";

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

export default function Product({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState<number>(1);

  const handleAddToCart = async () => {
    console.log(`Adding ${quantity} of ${product.id} to cart`);

    try {
      const res = await axiosInstance.post("/user/addToCart", {
        productId: product.id,
        quantity: quantity,
      });
      toast.success("Product added to cart successfully!");
      setQuantity(1);
    } catch (error) {
      toast.error("Failed to add product to cart.");
    }
  };

  return (
    <Card key={product.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <img
          src={import.meta.env.VITE_CLOUDFLARE_R2_URL + product.imageUrl[0]}
          alt={product.productName}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
        <CardTitle className="line-clamp-2">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <p>{product.productName}</p>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="link" size="icon">
                    <Heart className="size-5 text-muted-foreground hover:text-red-500 cursor-pointer" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add to wishlist</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex gap-2">
              <Badge>{product.tag.name}</Badge>
            </div>
          </div>
        </CardTitle>
        <CardDescription className="text-lg font-semibold text-primary flex justify-between">
          <div>${product.price.toFixed(2)}</div>
          <div className="text-sm text-muted-foreground">
            Qty: {product.quantity}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {product.body}
        </p>
      </CardContent>
      <CardFooter>
        <div className="flex flex-col w-full gap-2">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() =>
                setQuantity((prev) => (prev === 1 ? prev : prev - 1))
              }
            >
              <MinusIcon />
            </Button>
            <Input
              type="text"
              min={1}
              max={product.quantity}
              value={quantity}
              readOnly
            />
            <Button
              variant="outline"
              onClick={() =>
                setQuantity((prev) =>
                  prev === product.quantity ? prev : prev + 1
                )
              }
            >
              <PlusIcon />
            </Button>
          </div>
          <Button className="w-full" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
