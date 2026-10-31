/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChatMessage } from "../types";
import { cleanAsterisks } from "../lib/utils";

export function getStoredApiKey(): string {
  return '';
}

export function saveCustomApiKey(_key: string): void {
  // Server-managed API key via Settings > Secrets; client-side key storage removed
}

export function hasActiveGeminiKey(): boolean {
  return true;
}

export async function getAIResponse(messages: ChatMessage[]): Promise<string> {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const data = await response.json();
    return cleanAsterisks(data.text || "Halo! Saya SIGUNTANG AI Guide. Selamat datang di platform Nusantara Gemilang.");
  } catch (error) {
    console.warn("AI Guide service call fallback:", error);
    return "Maaf, asisten SIGUNTANG saat ini sedang memproses permintaan data lainnya. Silakan coba kembali sesaat lagi.";
  }
}

export async function generateAndRefineProposal(
  customPrompt: string,
  currentTitle: string,
  currentDescription: string
): Promise<{ title: string; description: string }> {
  try {
    const response = await fetch("/api/proposal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customPrompt,
        currentTitle,
        currentDescription,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const data = await response.json();
    if (data.title && data.description) {
      return {
        title: cleanAsterisks(data.title),
        description: cleanAsterisks(data.description),
      };
    }

    return {
      title: currentTitle,
      description: currentDescription + `\n\n[Revisi Catatan: ${customPrompt}]`,
    };
  } catch (error) {
    console.warn("Proposal Refinement service fallback:", error);
    return {
      title: currentTitle,
      description: currentDescription + `\n\n[Revisi Catatan: ${customPrompt}]`,
    };
  }
}
