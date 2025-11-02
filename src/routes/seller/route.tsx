import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import type { RootState } from "@/store";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { Home, Plus } from "lucide-react";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export const Route = createFileRoute("/seller")({
  component: RouteComponent,
});

const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Add Products",
    url: "#",
    icon: Plus,
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
        <main>
          <SidebarTrigger />
          <Outlet />
        </main>
      </SidebarProvider>
    </div>
  );
}
