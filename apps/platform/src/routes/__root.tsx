import { Outlet, createRootRoute } from "@tanstack/react-router";

import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";

import "../styles.css";

export const Route = createRootRoute({
  component: RootComponent,
  errorComponent: RootErrorComponent,
});

function RootComponent() {
  return (
    <>
      <Outlet />
      <TanStackDevtools
        config={{
          position: "bottom-right",
        }}
        plugins={[
          {
            name: "TanStack Router",
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  );
}

function RootErrorComponent({ error }: { error: Error }) {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-4 text-foreground">
      <div className="max-w-md space-y-2">
        <h1 className="text-lg font-semibold">Unable to load the page</h1>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
    </main>
  );
}
