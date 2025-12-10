import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getChatTitle(scenarioType: string) {
  const titles: Record<string, string> = {
    entrevista: "Entrevista de Trabajo",
    casual: "Conversación Casual",
    presentacion: "Presentación Personal",
  };
  return titles[scenarioType] || "Conversación";
}