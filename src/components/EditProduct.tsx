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

type Product = {
  id: string;
  productName: string;
  price: number;
  quantity: number;
  body: string;
};

export default function EditProduct({ product }: { product: Product }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size={"sm"} className="cursor-pointer">
          <Edit size={16} />
          Edit
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{product.productName}</AlertDialogTitle>
          {/* <AlertDialogDescription>{product.body}</AlertDialogDescription> */}
          <form className="space-y-6">
            <Field>
              <FieldContent>
                <FieldLabel htmlFor="title">Product Title</FieldLabel>

                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="e.g., Wireless Bluetooth Headphones"
                  value={product.productName}
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
                  value={product.body}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldContent>
                <FieldLabel htmlFor="price">Price</FieldLabel>

                <Input
                  id="price"
                  name="price"
                  type="text"
                  placeholder="e.g., 99.99"
                  value={product.price}
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
                  value={product.quantity}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldContent>
                <FieldLabel htmlFor="tagId">Category</FieldLabel>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* {tags.map((tag) => (
                      <SelectItem key={tag.id} value={tag.id}>
                        {tag.name}
                      </SelectItem>
                    ))} */}
                    {/* <SelectItem value={product.}>Category 1</SelectItem> */}
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>
          </form>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Save Changes</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
