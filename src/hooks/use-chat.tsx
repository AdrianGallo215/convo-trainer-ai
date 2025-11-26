import { useState } from "react";

export function useInterviewAgent(assistantId: string) {
  const [threadId, setThreadId] = useState<string | null>(null);
  const [agentMessages, setAgentMessages] = useState<
    Array<{ role: "user" | "assistant"; text: string }>
  >([]);

  // Crear un thread nuevo
  const startInterview = async () => {
    const res = await fetch("/start-interview", { method: "POST" });
    const data = await res.json();

    setThreadId(data.threadId);

    // Mandamos el primer mensaje (dispara la dinámica)
    sendMessage("Hola, quiero empezar la entrevista.");
  };

  // Enviar mensaje al agente
  const sendMessage = async (text: string) => {
    if (!threadId) return;

    // Añadir tu mensaje al estado local
    setAgentMessages((prev) => [...prev, { role: "user", text }]);

    const res = await fetch("/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        threadId,
        assistantId,
      }),
    });

    const data = await res.json();

    // Normalizar las respuestas
    const formatted = data.messages.data
      .reverse()
      .map((m: any) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        text: m.content[0]?.text?.value || "",
      }));

    setAgentMessages(formatted);
  };

  return {
    threadId,
    agentMessages,
    startInterview,
    sendMessage,
  };
}
