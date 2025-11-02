import { Toaster } from "@/components/ui/sonner";
import { Spinner } from "@/components/ui/spinner";
import type { AppDispatch } from "@/store";
import { login } from "@/store/features/auth";
import axiosInstance from "@/utils/axios";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const [loading, setLoading] = useState<boolean>(true);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axiosInstance.get("/me");
        dispatch(login(res.data));
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen min-w-screen flex items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
}
