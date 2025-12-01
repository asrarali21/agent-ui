import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { motion, AnimatePresence } from "framer-motion";
import { Github } from "lucide-react";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (input: string) => {
        // Add user message immediately
        const userMessage: Message = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        try {
            // Call the backend
            const response = await axios.post("http://localhost:8000/chat", {
                query: input,
            });

            // Add assistant message
            // Assuming response.data.response is the format, based on typical patterns. 
            // The original code just logged response, so I'll assume response.data is the string or has a property.
            // I'll assume response.data is the object and it might have a 'response' or 'answer' field.
            // Let's try to be safe and dump the whole data if unsure, or just response.data if it's a string.
            // Looking at the original code: const response = await axios.post("http://localhost:8000/chat" , {query :input} )
            // It didn't use the response.

            // I will assume the backend returns { response: string } or just the string.
            // For now, I'll use a safe fallback.
            const content = response.data.response || response.data.message || JSON.stringify(response.data);

            const assistantMessage: Message = {
                role: "assistant",
                content: content,
            };
            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error("Failed to send message:", error);
            const errorMessage: Message = {
                role: "assistant",
                content: "Sorry, I encountered an error while processing your request.",
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-background text-foreground">
            {/* Header */}
            <header className="sticky top-0 z-10 flex items-center gap-3 border-b bg-background/80 px-6 py-4 backdrop-blur-sm">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Github className="size-5" />
                </div>
                <h1 className="text-lg font-semibold tracking-tight">GitHub Agent</h1>
            </header>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="mx-auto max-w-3xl space-y-6">
                    {messages.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center space-y-4 py-20 text-center text-muted-foreground">
                            <div className="rounded-full bg-muted/50 p-4">
                                <Github className="size-12 opacity-50" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-semibold text-foreground">
                                    How can I help you today?
                                </h2>
                                <p>Ask me anything about your repositories or code.</p>
                            </div>
                        </div>
                    ) : (
                        <AnimatePresence initial={false}>
                            {messages.map((msg, index) => (
                                <ChatMessage
                                    key={index}
                                    role={msg.role}
                                    content={msg.content}
                                />
                            ))}
                        </AnimatePresence>
                    )}

                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex w-full gap-4 p-4 md:p-6 bg-muted/50"
                        >
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-md border bg-background shadow">
                                <Github className="size-4 animate-pulse" />
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="size-1.5 rounded-full bg-foreground/50 animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="size-1.5 rounded-full bg-foreground/50 animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="size-1.5 rounded-full bg-foreground/50 animate-bounce"></span>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="p-4 md:p-6 bg-background">
                <div className="mx-auto max-w-3xl">
                    <ChatInput onSend={handleSend} disabled={isLoading} />
                    <p className="mt-2 text-center text-xs text-muted-foreground">
                        AI can make mistakes. Please verify important information.
                    </p>
                </div>
            </div>
        </div>
    );
}
