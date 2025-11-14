import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { Edit } from "lucide-react";
import { Input } from "./ui/input";
import { Field, FieldContent, FieldLabel } from "./ui/field";
import { Textarea } from "./ui/textarea";
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useState } from "react";
import axiosInstance from "@/utils/axios";
import { toast } from "sonner";
import type { AppDispatch } from "@/store";
import { useDispatch } from "react-redux";
import { fetchProducts } from "@/store/features/product";

type Product = {
  id: string;
  productName: string;
  price: number;
  quantity: number;
  body: string;
  tag: {
    id: string;
    name: string;
  };
};

export default function EditProduct({
  product,
  tags,
}: {
  product: Product;
  tags: { id: string; name: string }[];
}) {
  const [productName, setProductName] = useState(product.productName);
  const [body, setBody] = useState(product.body);
  const [price, setPrice] = useState(product.price);
  const [quantity, setQuantity] = useState(product.quantity);
  const [tagId, setTagId] = useState(product.tag.id);

  const dispatch = useDispatch<AppDispatch>();

  const handleEditProduct = async () => {
    const updatedProduct = {
      productName,
      body,
      price,
      quantity,
      tagId,
    };

    try {
      const res = await axiosInstance.put(
        `/seller/product/${product.id}`,
        updatedProduct
      );
      toast.success(res.data?.message || "Product updated successfully");
      dispatch(fetchProducts());
    } catch (error) {
      toast.error("Failed to update product");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size={"sm"} className="cursor-pointer">
          <Edit size={16} />
          Edit
        </Button>
      </AlertDialogTrigger>
      <AlertDialogDescription></AlertDialogDescription>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{product.productName}</AlertDialogTitle>
          <form className="space-y-6">
            <Field>
              <FieldContent>
                <FieldLabel htmlFor="title">Product Title</FieldLabel>

                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="e.g., Wireless Bluetooth Headphones"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldContent>
                <FieldLabel htmlFor="description">Description</FieldLabel>

                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter product description..."
                  rows={5}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldContent>
                <FieldLabel htmlFor="price">Price</FieldLabel>

                <Input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="e.g., 99.99"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldContent>
                <FieldLabel htmlFor="quantity">Quantity</FieldLabel>

                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min={0}
                  step={1}
                  placeholder="e.g., 10"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldContent>
                <FieldLabel htmlFor="tagId">Category</FieldLabel>
                <Select defaultValue={tagId} onValueChange={setTagId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {tags.map((tag) => (
                      <SelectItem key={tag.id} value={tag.id}>
                        {tag.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>
          </form>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleEditProduct}>
            Save Changes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
