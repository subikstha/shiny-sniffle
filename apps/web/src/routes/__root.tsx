import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const route = createRootRoute({
  component: () => {
    return (
      <>
        <div>
          <Outlet />
        </div>
        <TanStackRouterDevtools />
      </>
    );
  },
});
