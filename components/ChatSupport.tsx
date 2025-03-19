'use client'

import { Send } from "lucide-react";
import {
    ChatBubble,
    ChatBubbleAvatar,
    ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";
import {
    ExpandableChat,
    ExpandableChatHeader,
    ExpandableChatBody,
    ExpandableChatFooter,
} from "@/components/ui/chat/expandable-chat";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { Button } from "./ui/button";

import { useChat } from '@ai-sdk/react';

export default function ChatSupport() {
    const { input, messages, handleInputChange, handleSubmit } = useChat();

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
        }
    };

    return (
        <ExpandableChat size="lg" position="bottom-right">
            <ExpandableChatHeader className="flex-col text-center justify-center">
                <h1 className="text-xl font-semibold">Chat with Venture Meda AI ✨</h1>
                <p>Ask any question about the lesson for our AI to answer</p>
            </ExpandableChatHeader>
            <ExpandableChatBody>
                <ChatMessageList>
                    {messages && messages.map((message, index) => (
                        <ChatBubble key={index} variant={message.role === 'user' ? 'sent' : 'received'}>
                            <ChatBubbleAvatar
                                src=""
                                fallback={message.role == "user" ? "👨🏽" : "🤖"}
                            />
                            {message.parts.map((part, index) => {
                                switch (part.type) {
                                    case 'text':
                                        return <ChatBubbleMessage key={index} layout={message.role == "user" ? "default" : "ai"}>{part.text}</ChatBubbleMessage>
                                }
                            })}
                        </ChatBubble>

                    ))}
                </ChatMessageList>
            </ExpandableChatBody>
            <ExpandableChatFooter>
                <form className="flex gap-2 items-end" onSubmit={handleSubmit}>
                    <ChatInput value={input} onChange={handleInputChange} onKeyDown={onKeyDown} />
                    <Button type="submit" size="icon">
                        <Send className="size-4" />
                    </Button>
                </form>
            </ExpandableChatFooter>
        </ExpandableChat>
    );
}