import { createRouter, RouterProvider } from "@tanstack/react-router";
import { ThemeProvider } from "./components/ThemeProvider";
import { routeTree } from "./routeTree.gen";

import { Provider } from "react-redux";
import store from "./store/index";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ThemeProvider>
  );
}
