import { Home, LogOut } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Button } from "./ui/button";
import { ItemActions } from "@/components/ui/item";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "./ui/avatar";

import axiosInstance from "@/utils/axios";
import { Link, useNavigate } from "@tanstack/react-router";
import { logout } from "@/store/features/auth";

// Menu items.
const items1 = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
];

type itemsType = typeof items1;

export function AppSidebar({ items }: { items: itemsType }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const auth = useSelector((state: RootState) => state.auth);

  console.log(auth);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      dispatch(logout());
      navigate({ to: "/" });
    } catch (error) {}
  };

  console.log(items);

  return (
    <Sidebar>
      <SidebarHeader className="text-center py-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Marketplace
        </h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <Item variant="muted" size="sm">
          <ItemMedia>
            <Avatar className="size-10">
              <AvatarFallback>
                {auth.user?.firstName.charAt(0) +
                  "" +
                  auth.user?.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>
              {auth.user?.firstName + " " + auth.user?.lastName}
            </ItemTitle>
            <ItemDescription>{auth.user?.email}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-red-600 cursor-pointer"
                  aria-label="Logout"
                  onClick={handleLogout}
                >
                  <LogOut className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Logout</TooltipContent>
            </Tooltip>
          </ItemActions>
        </Item>
      </SidebarFooter>
    </Sidebar>
  );
}
