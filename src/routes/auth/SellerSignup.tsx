import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";

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
import axiosInstance from "@/utils/axios";
import { useEffect, type FormEvent } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

export const Route = createFileRoute("/auth/SellerSignup")({
  component: SellerSignupPage,
});

function SellerSignupPage() {
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

    const res = await axiosInstance.post("/auth/seller/register", {
      email,
      firstName,
      lastName,
      password,
    });

    console.log(res.data?.message);
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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form className="w-full max-w-lg" onSubmit={handleFormSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Create Your Account</CardTitle>
            <CardDescription>
              Enter email, name and password to create your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
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
    </div>
  );
}
