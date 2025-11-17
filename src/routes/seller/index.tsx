import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package, ShoppingBag, Users } from "lucide-react";

export const Route = createFileRoute("/seller/")({
  component: RouteComponent,
});

export const meta = {
  breadcrumb: () => "Home",
};

const stats = [
  {
    label: "Total Products",
    value: "128",
    change: "+12 this month",
    icon: Package,
  },
  {
    label: "Active Orders",
    value: "24",
    change: "3 awaiting fulfillment",
    icon: ShoppingBag,
  },
  {
    label: "Customers",
    value: "1,042",
    change: "+58 new",
    icon: Users,
  },
];

function RouteComponent() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Top heading */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Get a quick snapshot of how your marketplace store is performing
          today.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((item) => (
          <Card key={item.label} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.label}
              </CardTitle>
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <item.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{item.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {item.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick actions & spotlight */}
      <div className="grid gap-4 lg:grid-cols-[2fr,3fr]">
        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
            <CardDescription>
              Jump straight into the most common tasks.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button className="justify-between" asChild>
              <a href="/seller/addProduct">
                <span>Add new product</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" className="justify-between" asChild>
              <a href="/seller/products">
                <span>Manage listings</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" className="justify-between" asChild>
              <a href="/seller">
                <span>View recent orders</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's snapshot</CardTitle>
            <CardDescription>
              A simple demo view of how your marketplace dashboard could look.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                You&apos;ve had{" "}
                <span className="font-semibold text-foreground">47 visits</span>{" "}
                and
                <span className="font-semibold text-foreground">
                  {" "}
                  9 orders
                </span>{" "}
                so far today.
              </p>
              <p>
                Your best-selling category is{" "}
                <span className="font-semibold text-foreground">
                  Accessories
                </span>
                , followed by{" "}
                <span className="font-semibold text-foreground">
                  Electronics
                </span>
                .
              </p>
              <p>
                This is just demo content – wire it up to your real analytics
                and order data when you&apos;re ready.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
