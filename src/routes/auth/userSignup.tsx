import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useEffect, useState, type FormEvent } from "react";
import axiosInstance from "@/utils/axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

export const Route = createFileRoute("/auth/userSignup")({
  component: UserSignupPage,
});

function UserSignupPage() {
  const [error, setError] = useState<boolean>(false);

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email") as String;
    const firstName = formData.get("firstName") as String;
    const lastName = formData.get("lastName") as String;
    const password = formData.get("password") as String;

    console.log({
      email,
      firstName,
      lastName,
      password,
    });

    try {
      const res = await axiosInstance.post("/auth/user/register", {
        email,
        firstName,
        lastName,
        password,
      });
      setError(false);
      toast.success(res.data?.message);
    } catch (error) {
      setError(true);
    }
  };

  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === "USER") {
        navigate({ to: "/user" });
      } else if (user?.role === "SELLER") {
        navigate({ to: "/seller" });
      }
    }
  }, [isAuthenticated]);

  return (
    <form
      className="min-h-screen flex items-center justify-center bg-background"
      onSubmit={handleFormSubmit}
    >
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Create Your Account</CardTitle>
          <CardDescription>
            Enter email, name and password to create your account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              {/* <Terminal /> */}
              <AlertTitle>Error during signup</AlertTitle>
              <AlertDescription>
                <ul className="list-inside list-disc text-sm">
                  <li>Password should be 8 to 16 digit long</li>
                  <li>email should be unique</li>
                  <li>firstname and lastname should be between 1 and 20</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@gmail.com"
                />
                <FieldDescription>
                  Choose a unique email for your account.
                </FieldDescription>
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                  <Input
                    name="firstName"
                    id="firstName"
                    type="text"
                    placeholder="John"
                  />
                  <FieldDescription>Enter your first name.</FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                  <Input
                    name="lastName"
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                  />
                  <FieldDescription>Enter your last name.</FieldDescription>
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  name="password"
                  id="password"
                  type="password"
                  placeholder="••••••••"
                />
                <FieldDescription>
                  Choose a strong and secure password for your account.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldSet>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">
            Signup
          </Button>
          <Button variant="outline" className="w-full">
            Signup with Google
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
