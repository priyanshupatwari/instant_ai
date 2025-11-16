import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessageProps {
  text: string;
  className?: string;
}

export default function ChatMessage({ text, className = "" }: ChatMessageProps) {
  return (
    <div className={`chat-msg ${className}`.trim()}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
    </div>
  );
}
