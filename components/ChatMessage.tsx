import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessageProps {
    role: "user" | "assistant";
    content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
    const isUser = role === "user";

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
                "flex w-full gap-4 p-4 md:p-6",
                isUser ? "bg-transparent" : "bg-muted/50"
            )}
        >
            <div className="flex size-8 shrink-0 select-none items-center justify-center rounded-md border bg-background shadow">
                {isUser ? (
                    <User className="size-4" />
                ) : (
                    <Bot className="size-4" />
                )}
            </div>
            <div className="flex-1 space-y-2 overflow-hidden">
                <div className="prose prose-invert max-w-none leading-7 text-foreground prose-p:leading-7 prose-pre:bg-muted prose-pre:border prose-pre:border-border">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            a: ({ node, ...props }) => (
                                <a {...props} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4 hover:text-primary/80" />
                            ),
                        }}
                    >
                        {content}
                    </ReactMarkdown>
                </div>
            </div>
        </motion.div>
    );
}
