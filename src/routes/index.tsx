import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

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
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen min-w-screen flex items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="max-w-2xl w-full px-6 text-center space-y-12">
        <div className="space-y-6">
          <h1 className="text-5xl font-bold tracking-tight text-foreground">
            Welcome to Our Marketplace
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Join our community of buyers and sellers. Discover unique products
            or start selling today.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="w-full sm:w-auto min-w-[180px]">
            <Link to="/auth/userSignup">User Signup</Link>
          </Button>
          <Button asChild size="lg" className="w-full sm:w-auto min-w-[180px]">
            <Link to="/auth/SellerSignup">Seller Signup</Link>
          </Button>
        </div>
        <div className="flex items-center justify-center">
          <p>Already have an account?</p>
          <Button variant="link" size="sm" asChild>
            <Link to="/login" title="Login">
              Login
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
