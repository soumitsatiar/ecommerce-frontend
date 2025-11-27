import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/seller/reviews")({
  component: RouteComponent,
  loader: () => {
    return {
      crumb: "Comments",
    };
  },
});

function RouteComponent() {
  return <div>Hello "/seller/comments"!</div>;
}
