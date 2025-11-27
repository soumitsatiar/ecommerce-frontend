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
import { fetchProducts } from "@/store/features/products";
import { Spinner } from "./ui/spinner";

export default function AddProduct({
  children,
  tags,
}: {
  children: React.ReactNode;
  tags: { id: string; name: string }[];
}) {
  const dispatch = useDispatch<AppDispatch>();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [data, setData] = useState({
    productName: "",
    body: "",
    price: "",
    quantity: "",
    tagId: "",
  });

  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setData((prevData) => ({
      ...prevData,
      tagId: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const product = {
        productName: data.productName,
        body: data.body,
        price: data.price,
        quantity: data.quantity,
        tagId: data.tagId,
      };

      const formData = new FormData();

      formData.append(
        "product",
        new Blob([JSON.stringify(product)], { type: "application/json" })
      );

      files.forEach((file) => {
        formData.append(`productImage`, file);
      });

      const res = await axiosInstance.post("/seller/test", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
                  <FieldLabel htmlFor="productName">Product Title</FieldLabel>
                  <Input
                    id="productName"
                    name="productName"
                    type="text"
                    placeholder="e.g., Wireless Bluetooth Headphones"
                    value={data.productName}
                    onChange={handleChange}
                    required
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldContent>
                  <FieldLabel htmlFor="body">Description</FieldLabel>
                  <Textarea
                    id="body"
                    name="body"
                    placeholder="Enter product description..."
                    rows={5}
                    value={data.body}
                    onChange={handleChange}
                    required
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
                    value={data.price}
                    onChange={handleChange}
                    required
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
                    value={data.quantity}
                    onChange={handleChange}
                    required
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldContent>
                  <FieldLabel htmlFor="productImage">Product Image</FieldLabel>
                  <Input
                    id="productImage"
                    name="productImage"
                    type="file"
                    onChange={handleFileChange}
                    required
                    accept="image/*"
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldContent>
                  <FieldLabel htmlFor="tagId">Category</FieldLabel>
                  <Select
                    name="tagId"
                    required
                    onValueChange={handleSelectChange}
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
