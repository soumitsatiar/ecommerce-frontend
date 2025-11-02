import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import type { RootState } from "@/store";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Heart, Home, Search, Settings, ShoppingBag } from "lucide-react";
export const Route = createFileRoute("/user")({
  component: RouteComponent,
});

const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "My Purchases",
    url: "#",
    icon: ShoppingBag,
  },
  {
    title: "Wishlist",
    url: "#",
    icon: Heart,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

function RouteComponent() {
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === "SELLER") {
        navigate({ to: "/seller" });
      }
    } else {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated]);

  return (
    <div>
      <SidebarProvider>
        <AppSidebar items={items} />
        <main>
          <SidebarTrigger />
          <Outlet />
        </main>
      </SidebarProvider>
    </div>
  );
}
