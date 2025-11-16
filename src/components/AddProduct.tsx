import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Field, FieldContent, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
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
import { Spinner } from "./ui/spinner";
import { ScrollArea } from "./ui/scroll-area";

export default function AddProduct({
  children,
  tags,
}: {
  children: React.ReactNode;
  tags: { id: string; name: string }[];
}) {
  const dispatch = useDispatch<AppDispatch>();

  const [productName, setProductName] = useState("");
  const [body, setBody] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [tagId, setTagId] = useState("");

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axiosInstance.post("/seller/create/product", {
        productName,
        body,
        price,
        quantity,
        tagId,
      });
      setLoading(false);
      setOpen(false);
      toast.success(res.data?.message || "Product added successfully");
      dispatch(fetchProducts());
    } catch (error) {
      setLoading(false);
      setOpen(false);
      toast.error("Failed to add product. Please try again.");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button>
          <Plus />
          {children}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <AlertDialogHeader>
            <AlertDialogTitle>Add New Product</AlertDialogTitle>
            <AlertDialogDescription></AlertDialogDescription>
            <div className="space-y-4">
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
                    required
                  />
                  {/* {errors.title && <FieldError>{errors.title}</FieldError>} */}
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
                    required
                  />
                  {/* {errors.description && (
                    <FieldError>{errors.description}</FieldError>
                    )} */}
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
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                  {/* {errors.price && <FieldError>{errors.price}</FieldError>} */}
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
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                  {/* {errors.quantity && <FieldError>{errors.quantity}</FieldError>} */}
                </FieldContent>
              </Field>

              <Field>
                <FieldContent>
                  <FieldLabel htmlFor="tagId">Category</FieldLabel>
                  <Select
                    name="tagId"
                    required
                    onValueChange={(value) => setTagId(value)}
                    // value={tagId}
                  >
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
                  {/* {errors.tagId && <FieldError>{errors.tagId}</FieldError>} */}
                </FieldContent>
              </Field>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner /> Submit
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
