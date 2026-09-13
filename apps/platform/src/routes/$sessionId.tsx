import { initialMessagesFromMemory, useChat } from "@anvia/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChatProvider,
  Thread,
  Composer,
  Message,
  useMessagePart,
} from "@anvia/react-ui";
import { useState } from "react";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/kibo-ui/dropzone";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { uploadDocument } from "../modules/attachment/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export const Route = createFileRoute("/$sessionId")({
  component: SessionChat,
  loader: async ({ params }) => {
    const res = await fetch(
      `${API_BASE_URL}/chat/${params.sessionId}`,
    );
    const messages = await res.json();
    return messages;
  },
});

function ReasoningBlock() {
  const { isLive } = useMessagePart();

  return (
    <Message.Reasoning
      open={isLive ? true : undefined}
      className={cn(
        "rounded-lg border border-border/60 bg-muted/30 text-muted-foreground",

        "[&_summary]:cursor-pointer [&_summary]:select-none [&_summary]:px-3 [&_summary]:py-2",
        "[&_summary]:text-xs [&_summary]:font-medium [&_summary]:tracking-wide",
        "[&_summary]:text-muted-foreground/90",

        "[&_pre]:m-0 [&_pre]:border-t [&_pre]:border-border/50 [&_pre]:px-3 [&_pre]:py-2",
        "[&_pre]:whitespace-pre-wrap",
        "[&_pre]:break-words",
        "[&_pre]:[overflow-wrap:anywhere]",
        "[&_pre]:font-sans [&_pre]:text-xs [&_pre]:leading-relaxed",

        isLive && "motion-safe:animate-pulse",
      )}
    />
  );
}

function ToolBlock() {
  const { part } = useMessagePart();
  if (part.type !== "tool") {
    return null;
  }

  const isPending =
    part.state === "input-streaming" || part.state === "input-available";
  const hasError = part.state === "error";
  const showDetails = hasError || isPending;

  return (
    <Message.Tool
      renderWhen="always"
      className={cn(
        "overflow-hidden rounded-lg border border-border/70 bg-card/80 text-sm",
        hasError && "border-destructive/40",
      )}
    >
      <div className="flex items-center justify-between gap-3 px-3 py-2">
        <Message.ToolName className="truncate font-medium text-foreground" />
        <Message.ToolStatus
          className={cn(
            "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide",
            isPending &&
              "bg-accent text-accent-foreground motion-safe:animate-pulse",
            part.state === "output-available" &&
              "bg-muted text-muted-foreground",
            hasError && "bg-destructive/15 text-destructive",
          )}
        />
      </div>

      <details open={showDetails} className="border-t border-border/60">
        <summary className="cursor-pointer select-none px-3 py-1.5 text-xs text-muted-foreground">
          Details
        </summary>
        <div className="space-y-2 px-3 pb-3">
          <Message.ToolInput className="overflow-x-auto rounded-md bg-muted/50 p-2 font-mono text-[11px] leading-relaxed text-muted-foreground" />
          <Message.ToolOutput className="overflow-x-auto rounded-md bg-muted/50 p-2 font-mono text-[11px] leading-relaxed text-muted-foreground" />
          <Message.ToolError className="rounded-md bg-destructive/10 px-2 py-1.5 text-xs text-destructive" />
        </div>
      </details>
    </Message.Tool>
  );
}

function SessionChat() {
  const { sessionId } = Route.useParams();
  const messages = Route.useLoaderData();
  const [input, setInput] = useState("");
  const [documentId, setDocumentId] = useState<string | undefined>();
  const [files, setFiles] = useState<File[] | undefined>();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>();

  const chat = useChat({
    endpoint: `${API_BASE_URL}/chat/${sessionId}`,
    initialMessages: initialMessagesFromMemory(messages),
  });

  async function handleDrop(accepted: File[]) {
    const file = accepted[0];
    if (!file) {
      return;
    }

    setFiles(accepted);
    setDocumentId(undefined);
    setUploadError(undefined);
    setIsUploading(true);

    try {
      const document = await uploadDocument(file);
      setDocumentId(document.documentId);
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Document upload failed.",
      );
      setFiles(undefined);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="flex h-svh flex-col overflow-hidden bg-background text-foreground">
      <header className="flex shrink-0 items-center border-b border-border/60 px-4 py-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/">← Back</Link>
        </Button>
      </header>
      <ChatProvider controller={chat}>
        <section className="flex h-3/4 min-h-0 flex-col">
          <Thread.Root className="flex min-h-0 flex-1 flex-col">
            <Thread.Viewport
              className="min-h-0 flex-1 overflow-y-auto px-4 py-6"
              autoScroll
            >
              <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
                <Thread.Empty className="py-16 text-center text-sm tracking-wide text-muted-foreground">
                  Ask your first question.
                </Thread.Empty>

                <Thread.Suggestions className="flex flex-wrap gap-2" />

                <Thread.Messages className="flex flex-col gap-5">
                  {(message) => {
                    const isUser = message.role === "user";

                    return (
                      <Message.Root
                        className={cn(
                          "group flex w-full flex-col gap-2",
                          isUser ? "items-end" : "items-start",
                        )}
                      >
                        <Message.Content
                          className={cn(
                            "max-w-[min(100%,42rem)] space-y-2",
                            isUser
                              ? "rounded-2xl bg-primary px-4 py-2.5 text-primary-foreground"
                              : "w-full",
                          )}
                        >
                          <Message.Parts className="space-y-2">
                            {(part) => {
                              if (part.type === "reasoning") {
                                return (
                                  <Message.Part className="w-full">
                                    <div className="flex flex-col gap-2 min-w-0 max-w-full">
                                      <ReasoningBlock />
                                    </div>
                                  </Message.Part>
                                );
                              }

                              if (part.type === "text") {
                                return (
                                  <Message.Part
                                    className={cn(
                                      isUser
                                        ? "text-sm leading-relaxed"
                                        : "prose prose-sm max-w-none text-foreground prose-p:leading-relaxed prose-pre:rounded-lg",
                                    )}
                                  >
                                    {isUser ? (
                                      <Message.Text />
                                    ) : (
                                      <Message.Markdown />
                                    )}
                                  </Message.Part>
                                );
                              }

                              if (part.type === "attachment") {
                                return (
                                  <Message.Part className="inline-flex items-center gap-2 rounded-lg border border-border/70 bg-background/80 px-2.5 py-1.5 text-xs text-foreground">
                                    <Message.Attachment />
                                  </Message.Part>
                                );
                              }

                              if (part.type === "tool") {
                                return (
                                  <Message.Part className="w-full max-w-xl">
                                    <ToolBlock />
                                  </Message.Part>
                                );
                              }

                              if (part.type === "error") {
                                return (
                                  <Message.Part className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                    <Message.Error />
                                  </Message.Part>
                                );
                              }

                              if (part.type === "data") {
                                return (
                                  <Message.Part className="overflow-x-auto rounded-lg bg-muted/40 p-2 font-mono text-[11px] text-muted-foreground">
                                    <Message.Data />
                                  </Message.Part>
                                );
                              }

                              return <Message.Part />;
                            }}
                          </Message.Parts>
                        </Message.Content>

                        {!isUser ? (
                          <Message.Actions className="flex gap-1 opacity-70 transition-opacity duration-150 md:opacity-0 md:group-hover:opacity-100 md:has-[:focus-visible]:opacity-100">
                            <Message.Copy className="rounded-md px-2 py-1 text-xs text-muted-foreground transition-transform duration-100 active:scale-[0.97] hover:bg-muted hover:text-foreground" />
                            <Message.Regenerate className="rounded-md px-2 py-1 text-xs text-muted-foreground transition-transform duration-100 active:scale-[0.97] hover:bg-muted hover:text-foreground" />
                          </Message.Actions>
                        ) : null}
                      </Message.Root>
                    );
                  }}
                </Thread.Messages>

                <Thread.Error className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive" />
              </div>
            </Thread.Viewport>
          </Thread.Root>
        </section>

        <section
          className={cn(
            "flex max-h-1/4 h-full min-h-0 flex-col border-t border-white/40",
            "bg-background/70 px-4 py-3 backdrop-blur-xl backdrop-saturate-150",
            "supports-[backdrop-filter]:bg-background/55",
          )}
        >
          <div className="mx-auto flex h-full w-full max-w-3xl min-h-0 flex-col">
            <Dropzone
              accept={{ "application/pdf": [".pdf"] }}
              disabled={isUploading}
              maxFiles={1}
              maxSize={20 * 1024 * 1024}
              onDrop={handleDrop}
              onError={(err) => setUploadError(err.message)}
              src={files}
              className="h-auto shrink-0 p-2 transition-transform duration-100 active:scale-[0.99]"
            >
              <DropzoneEmptyState className="gap-1 [&_p]:my-0.5">
                {isUploading ? (
                  <p className="text-xs text-muted-foreground">Uploading…</p>
                ) : undefined}
              </DropzoneEmptyState>
              <DropzoneContent className="gap-1 [&_p]:my-0.5" />
            </Dropzone>

            {uploadError ? (
              <p className="text-xs text-destructive" role="alert">
                {uploadError}
              </p>
            ) : null}

            <Composer.Root
              className="mt-2 flex min-h-0 items-end gap-2 rounded-2xl border border-border/70 bg-card/90 p-2 shadow-sm"
              input={input}
              onInputChange={setInput}
              submitMessage={async ({ chat: chatController, clear }) => {
                const message = documentId
                  ? {
                      text: input,
                      metadata: { documentIds: [documentId] },
                    }
                  : input;

                clear();
                await chatController.sendMessage(message);
              }}
            >
              <Composer.Input
                minRows={1}
                maxRows={4}
                placeholder="Message Anvia..."
                className="min-w-0 flex-1 bg-transparent px-2 py-1.5 text-sm leading-relaxed outline-none focus:outline-none focus:ring-0 focus:border-transparent"
              />
              {chat.status === "streaming" ? (
                <Composer.Stop asChild>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="transition-transform duration-100 active:scale-[0.97]"
                  >
                    Stop
                  </Button>
                </Composer.Stop>
              ) : (
                <Composer.Submit asChild>
                  <Button
                    type="submit"
                    size="sm"
                    className="transition-transform duration-100 active:scale-[0.97]"
                  >
                    Send
                  </Button>
                </Composer.Submit>
              )}
            </Composer.Root>
          </div>
        </section>
      </ChatProvider>
    </div>
  );
}
