import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type ChatSession = {
  id: string;
  sessionId: string;
  createdAt: string;
  updatedAt: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

async function fetchAgentSessions(): Promise<ChatSession[]> {
  const res = await fetch(`${API_BASE_URL}/chat`, {
    method: "GET",
  });
  const data = await res.json();
  return data;
}

export const Route = createFileRoute("/")({
  loader: async () => {
    return fetchAgentSessions();
  },
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string>();
  const chatSessions = Route.useLoaderData();

  async function handleNewChat() {
    setIsCreating(true);
    setError(undefined);

    try {
      const res = await fetch(`${API_BASE_URL}/chat/new`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to create chat session.");
      }

      const { sessionId } = (await res.json()) as { sessionId: string };
      await navigate({ to: "/$sessionId", params: { sessionId } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create chat.");
      setIsCreating(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-md flex-col justify-center gap-6 bg-background px-4 py-10">
      <div className="flex flex-col gap-2">
        <Button type="button" onClick={handleNewChat} disabled={isCreating}>
          {isCreating ? "Creating..." : "New chat"}
        </Button>
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium text-muted-foreground">
          Recent chats
        </h2>
        {chatSessions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No chats yet.</p>
        ) : (
          <ul className="divide-y divide-border rounded-lg border border-border">
            {chatSessions.map((session) => (
              <li key={session.id}>
                <Link
                  to="/$sessionId"
                  params={{ sessionId: session.sessionId }}
                  className="flex flex-col gap-0.5 px-3 py-2.5 transition-colors hover:bg-muted/50"
                >
                  <span className="truncate text-sm font-medium">
                    {session.sessionId}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(session.updatedAt).toLocaleString()}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
