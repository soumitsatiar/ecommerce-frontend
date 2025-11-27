import axiosInstance from "@/utils/axios";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/user/cart")({
  component: RouteComponent,
});

interface Cart {
  id: string;
  quantity: number;
  productId: ProductId;
  userId: UserId;
}

interface ProductId {
  id: string;
  tag: Tag;
  quantity: number;
  productName: string;
  price: number;
  body: string;
  imageUrl: string[];
}

interface Tag {
  id: string;
  name: string;
}

interface UserId {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
  products: any[];
}

function RouteComponent() {
  const [cart, setCart] = useState<Cart[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get("/user/getCart");
      setCart(res.data);
    } catch (error) {
      toast.error("Failed to load cart");
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setUpdatingItems((prev) => new Set(prev).add(cartItemId));
    try {
      await axiosInstance.put(`/user/updateCart/${cartItemId}`, {
        quantity: newQuantity,
      });
      setCart(
        (prev) =>
          prev?.map((item) =>
            item.id === cartItemId ? { ...item, quantity: newQuantity } : item
          ) ?? null
      );
      toast.success("Cart updated");
    } catch (error) {
      toast.error("Failed to update cart");
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(cartItemId);
        return newSet;
      });
    }
  };

  const removeItem = async (cartItemId: string) => {
    setUpdatingItems((prev) => new Set(prev).add(cartItemId));
    try {
      await axiosInstance.delete(`/user/removeFromCart/${cartItemId}`);
      setCart((prev) => prev?.filter((item) => item.id !== cartItemId) ?? null);
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(cartItemId);
        return newSet;
      });
    }
  };

  const handleCheckout = async () => {
    try {
      // Implement checkout logic here
      toast.success("Proceeding to checkout...");
    } catch (error) {
      toast.error("Checkout failed");
    }
  };

  const calculateTotal = () => {
    return (
      cart?.reduce(
        (total, item) => total + item.productId.price * item.quantity,
        0
      ) ?? 0
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Spinner />
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
        <div className="rounded-full bg-muted p-6 mb-6">
          <ShoppingCart className="h-16 w-16 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Your Cart is Empty</h2>
        <p className="text-muted-foreground max-w-md">
          Looks like you haven't added any items to your cart yet. Start
          shopping to fill it up!
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <Card key={item.id} className="py-4">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <img
                    src={
                      import.meta.env.VITE_CLOUDFLARE_R2_URL +
                      item.productId.imageUrl[0]
                    }
                    alt={item.productId.productName}
                    className="w-24 h-24 object-cover rounded-md"
                  />

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-1">
                        {item.productId.productName}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        ${item.productId.price.toFixed(2)} each
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon-sm"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={
                            item.quantity <= 1 || updatingItems.has(item.id)
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon-sm"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={
                            item.quantity >= item.productId.quantity ||
                            updatingItems.has(item.id)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-semibold">
                          ${(item.productId.price * item.quantity).toFixed(2)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => removeItem(item.id)}
                          disabled={updatingItems.has(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Subtotal ({cart.length} item{cart.length !== 1 ? "s" : ""})
                </span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Marketplace Fee (2%)
                </span>
                <span>${(calculateTotal() * 0.02).toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${(calculateTotal() * 1.02).toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg" onClick={handleCheckout}>
                Checkout
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
