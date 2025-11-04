import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/seller/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div className="">seller homepage</div>;
}
