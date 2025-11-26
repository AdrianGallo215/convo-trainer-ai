import { useState } from "react";

//export function useInterviewChat(assistantId) {
export function useChat(assistantId) {
  const [threadId, setThreadId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const startInterview = async () => {
    setLoading(true);
    try {
      const res = await fetch("/start-interview", { method: "POST" });
      const data = await res.json();
      setThreadId(data.threadId);

      await sendMessage("Hola, quiero empezar la entrevista.");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, assistantId }),
      });

      const data = await res.json();
      setMessages(data.messages.data.reverse());
    } finally {
      setLoading(false);
    }
  };

  return {
    threadId,
    messages,
    loading,
    startInterview,
    sendMessage,
  };
}
