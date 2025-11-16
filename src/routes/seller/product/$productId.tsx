import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/seller/product/$productId")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  return <div>Hello "/seller/product/{params.productId}"!</div>;
}
