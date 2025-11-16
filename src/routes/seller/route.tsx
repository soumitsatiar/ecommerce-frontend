import { AppSidebar } from "@/components/AppSidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import type { RootState } from "@/store";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { Handbag, Home, MessageSquareText, ShoppingBag } from "lucide-react";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export const Route = createFileRoute("/seller")({
  component: RouteComponent,
});

const items = [
  {
    title: "Home",
    url: "/seller",
    icon: Home,
  },
  {
    title: "Products",
    url: "/seller/products",
    icon: Handbag,
  },
  {
    title: "Orders",
    url: "/seller/orders",
    icon: ShoppingBag,
  },
  {
    title: "Comments",
    url: "/seller/comments",
    icon: MessageSquareText,
  },
];

function RouteComponent() {
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === "USER") {
        navigate({ to: "/user" });
      }
    } else {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated]);

  return (
    <div>
      <SidebarProvider>
        <AppSidebar items={items} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </header>
          <div className="p-6">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
