import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useEffect, useState, type FormEvent } from "react";
import axiosInstance from "@/utils/axios";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { login } from "@/store/features/auth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [error, setError] = useState<boolean>(false);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email") as String;
    const password = formData.get("password") as String;

    console.log({
      email,
      password,
    });

    try {
      const res = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      const x = await axiosInstance.get("/me");

      dispatch(login(x.data));
      navigate({ to: "/" });
    } catch (error) {
      setError(true);
    }
  };

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
      {error && <div>Invalid Credentials</div>}
      <form className="w-full max-w-lg" onSubmit={handleLogin}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Login to your account</CardTitle>
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
                </Field>

                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                  />
                </Field>
                <Field>
                  <Button className="w-full">Login</Button>
                  <Button variant="outline" className="w-full">
                    Login with Google
                  </Button>
                </Field>
              </FieldGroup>
            </FieldSet>
          </CardContent>
          <CardFooter className="flex justify-center items-center">
            <p>Don't have a account?</p>
            <Button variant="link" size="sm">
              <Link to="/auth/userSignup">Signup</Link>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
