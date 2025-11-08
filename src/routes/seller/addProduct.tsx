import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import axiosInstance from "@/utils/axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/seller/addProduct")({
  component: RouteComponent,
});

interface Tag {
  id: string;
  name: string;
}

interface ProductFormData {
  title: string;
  description: string;
  price: string;
  tagId: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  price?: string;
  tagId?: string;
}

function RouteComponent() {
  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    description: "",
    price: "",
    tagId: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const resp = await axiosInstance.get("/seller/getTags");
        setTags(resp.data || []);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags().finally(() => {
      setLoading(false);
    });
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(formData.price))) {
      newErrors.price = "Price must be a valid number";
    } else if (Number(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (!formData.tagId) {
      newErrors.tagId = "Please select a tag";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Add API call to submit product
      console.log("Submitting product:", {
        ...formData,
        price: Number(formData.price),
      });

      const product = {
        productName: formData.title,
        body: formData.description,
        price: Number(formData.price),
        tagId: formData.tagId,
      };

      console.log(product);

      // Simulate API call
      await axiosInstance.post("/seller/create/product", product);

      // Reset form on success
      setFormData({ title: "", description: "", price: "", tagId: "" });
      setErrors({});

      toast.success("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">Add New Product</h1>
        <p className="text-muted-foreground text-sm">
          Create a new product listing by filling out the form below
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Field data-invalid={!!errors.title}>
          <FieldContent>
            <FieldLabel htmlFor="title">Product Title</FieldLabel>

            <Input
              id="title"
              name="title"
              type="text"
              placeholder="e.g., Wireless Bluetooth Headphones"
              value={formData.title}
              onChange={handleChange}
              aria-invalid={!!errors.title}
              disabled={isSubmitting}
            />
            {errors.title && <FieldError>{errors.title}</FieldError>}
          </FieldContent>
        </Field>

        <Field data-invalid={!!errors.description}>
          <FieldContent>
            <FieldLabel htmlFor="description">Description</FieldLabel>

            <Textarea
              id="description"
              name="description"
              placeholder="Enter product description..."
              value={formData.description}
              onChange={handleChange}
              aria-invalid={!!errors.description}
              disabled={isSubmitting}
              rows={5}
            />
            {errors.description && (
              <FieldError>{errors.description}</FieldError>
            )}
          </FieldContent>
        </Field>

        <Field data-invalid={!!errors.price}>
          <FieldContent>
            <FieldLabel htmlFor="price">Price</FieldLabel>

            <Input
              id="price"
              name="price"
              type="text"
              placeholder="e.g., 99.99"
              value={formData.price}
              onChange={handleChange}
              aria-invalid={!!errors.price}
              disabled={isSubmitting}
            />
            {errors.price && <FieldError>{errors.price}</FieldError>}
          </FieldContent>
        </Field>

        <Field data-invalid={!!errors.tagId}>
          <FieldContent>
            <FieldLabel htmlFor="tagId">Category</FieldLabel>
            <Select
              value={formData.tagId}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, tagId: value }));
                if (errors.tagId) {
                  setErrors((prev) => ({ ...prev, tagId: undefined }));
                }
              }}
              disabled={isSubmitting}
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
            {errors.tagId && <FieldError>{errors.tagId}</FieldError>}
          </FieldContent>
        </Field>

        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? <Spinner /> : "Add Product"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFormData({ title: "", description: "", price: "", tagId: "" });
              setErrors({});
            }}
            disabled={isSubmitting}
          >
            Clear
          </Button>
        </div>
      </form>
    </div>
  );
}
