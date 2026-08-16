import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Header from "../components/shared/Header";
import type { QueryClient } from "@tanstack/react-query";

// Define Router context interface
interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => {
    return (
      <>
        <div>
          <Header />
          <Outlet />
        </div>
        <TanStackRouterDevtools />
        <ReactQueryDevtools />
      </>
    );
  },
});
