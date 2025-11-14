import type { AppDispatch, RootState } from "@/store";
import { fetchProducts } from "@/store/features/product";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Package } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import axiosInstance from "@/utils/axios";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import EditProduct from "@/components/EditProduct";

export const Route = createFileRoute("/seller/products")({
  component: RouteComponent,
});

function RouteComponent() {
  const dispatch = useDispatch<AppDispatch>();

  const { products, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
  const [loadingTags, setLoadingTags] = useState<boolean>(true);

  const handleDeleteClick = async (id: string) => {
    setDeleteLoading(true);
    const resp = await axiosInstance.delete(`/seller/product/${id}`);
    toast.error(resp.data?.message || "Product deleted successfully");
    dispatch(fetchProducts());
    setDeleteLoading(false);
  };

  useEffect(() => {
    dispatch(fetchProducts());
    const fetchTags = async () => {
      try {
        const resp = await axiosInstance.get("/admin/tag/all");
        setTags(resp.data || []);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags().finally(() => {
      setLoadingTags(false);
    });
  }, [dispatch]);

  if (loading || loadingTags) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold mb-4">Your Products</h1>
          <Button>
            <Plus /> Add New Product
          </Button>
        </div>
        <Table>
          <TableCaption>A list of your products.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 6 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[70%]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-10" />
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (error) {
    return <div>Error loading products.</div>;
  }

  if (!loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-muted/40">
              <Package className="size-6 text-muted-foreground" />
            </div>
            <CardTitle>No products yet</CardTitle>
            <CardDescription>
              You haven’t added any products. Create your first product to get
              started.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button asChild>
              <Link to="/seller/addProduct">
                <Plus /> Add your first product
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-4">Your Products</h1>
        <Button asChild>
          <Link to="/seller/addProduct">
            <Plus /> Add New Product
          </Link>
        </Button>
      </div>
      <Table>
        <TableCaption>A list of your products.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Product Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">
                {product.productName}
              </TableCell>
              <TableCell>{product.body}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <EditProduct product={product} tags={tags} />
                  <Button
                    size={"sm"}
                    variant="destructive"
                    className="cursor-pointer"
                    onClick={() => handleDeleteClick(product.id)}
                    disabled={deleteLoading}
                  >
                    <Trash2 size={16} />
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter></TableFooter>
      </Table>
    </div>
  );
}
