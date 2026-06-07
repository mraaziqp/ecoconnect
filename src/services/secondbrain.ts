import { GoogleGenAI } from "@google/genai";
import { RegistryApp } from "../types";

const genAI = new GoogleGenAI({
  apiKey: process.env.VITE_GEMINI_API_KEY || "",
});

export interface SearchResult {
  appId: string;
  appName: string;
  relevanceScore: number;
  reason: string;
}

export interface SearchResponse {
  recommendations: SearchResult[];
  aiSummary: string;
}

export interface ChatMessage {
  role: "user" | "secondbrain";
  content: string;
}

export interface ChatContext {
  activeProfile?: string;
  activeAppId?: string;
  recentLogs?: Array<{ message: string; appSource: string }>;
}

/**
 * Secondbrain: Intelligent ecosystem orchestrator powered by Gemini AI
 * Provides semantic search across all registered applications and context-aware chat
 */
export class SecondbrainAI {
  private conversationHistory: ChatMessage[] = [];

  /**
   * Semantic search across all registered applications
   * Uses AI to understand user intent and recommend relevant apps
   */
  async search(
    query: string,
    appsRegistry: RegistryApp[]
  ): Promise<SearchResponse> {
    const appDescriptions = appsRegistry
      .map(
        (app) =>
          `- ${app.name} (${app.category}): ${app.longDesc}`
      )
      .join("\n");

    const prompt = `You are Secondbrain, the intelligent orchestrator of a software ecosystem.
A user has submitted this search query: "${query}"

Here are all available applications in the ecosystem:
${appDescriptions}

Task:
1. Analyze the user's query semantically
2. Identify which 1-3 apps are MOST relevant to their intent
3. Provide a brief reasoning for each recommendation
4. Provide a concise AI summary (1-2 sentences) explaining what the user is trying to accomplish and how the ecosystem can help

Respond in this exact JSON format:
{
  "recommendations": [
    {"appId": "app_id", "appName": "App Name", "relevanceScore": 95, "reason": "Why this is relevant"},
    {"appId": "app_id", "appName": "App Name", "relevanceScore": 85, "reason": "Why this is relevant"}
  ],
  "aiSummary": "One or two sentence summary of the user's intent and ecosystem response"
}`;

    try {
      const result = await genAI.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.1,
        },
      });

      const responseText = result.text || "{}";
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Invalid JSON response from AI");
      }

      const parsed = JSON.parse(jsonMatch[0]);
      return {
        recommendations: parsed.recommendations || [],
        aiSummary:
          parsed.aiSummary || "Search completed with Secondbrain orchestration",
      };
    } catch (error) {
      console.error("Secondbrain search error:", error);
      return {
        recommendations: [],
        aiSummary:
          "Secondbrain experienced a temporary disruption. Please try again.",
      };
    }
  }

  /**
   * Context-aware conversational AI
   * Maintains conversation history and understands user intent within the ecosystem
   */
  async chat(
    userMessage: string,
    context?: ChatContext
  ): Promise<string> {
    // Add user message to history
    this.conversationHistory.push({
      role: "user",
      content: userMessage,
    });

    const contextString = context
      ? `Current Context:
- Active Profile: ${context.activeProfile || "Not set"}
- Active Application: ${context.activeAppId || "Dashboard"}
- Recent Events: ${context.recentLogs?.map((l) => `${l.appSource}: ${l.message}`).join("; ") || "None"}`
      : "";

    const conversationString = this.conversationHistory
      .slice(-10) // Keep last 10 messages
      .map((m) => `${m.role === "user" ? "User" : "Secondbrain"}: ${m.content}`)
      .join("\n");

    const prompt = `You are Secondbrain, the omnipresent AI orchestrator of a personal software ecosystem.
You manage 9+ integrated applications (FinancePlay, Project Cupid, Lifestack, OpsNexus, Deenify, Familyverse, Familytree, etc).

${contextString}

Recent Conversation:
${conversationString}

Your role:
- Provide intelligent insights about the user's workflow
- Suggest ecosystem features that could help
- Answer questions about available applications
- Orchestrate cross-app operations and insights
- Be concise, technical yet friendly
- Respond in 1-3 sentences unless elaboration is requested

Respond naturally as Secondbrain AI, helping the user navigate their personal ecosystem.`;

    try {
      const result = await genAI.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
        config: {
          temperature: 0.7,
        },
      });

      const aiResponse =
        result.text || "Secondbrain neural pathways disrupted. Please rephrase your query.";

      // Add AI response to history
      this.conversationHistory.push({
        role: "secondbrain",
        content: aiResponse,
      });

      return aiResponse;
    } catch (error) {
      console.error("Secondbrain chat error:", error);
      return "⚠️ Secondbrain experiencing critical handshake failure. Core neural pathways offline. Attempting recovery...";
    }
  }

  /**
   * Get recent conversation history for context
   */
  getHistory(): ChatMessage[] {
    return this.conversationHistory;
  }

  /**
   * Reset conversation for new session or profile switch
   */
  resetHistory(): void {
    this.conversationHistory = [];
  }

  /**
   * Analyze ecosystem health and suggest optimizations
   */
  async analyzeEcosystemHealth(
    appStats: Array<{ name: string; status: string; lastUsed: string }>
  ): Promise<string> {
    const statsString = appStats
      .map((a) => `${a.name}: ${a.status} (last used: ${a.lastUsed})`)
      .join("\n");

    const prompt = `As Secondbrain, analyze this ecosystem status and provide 1-2 optimization suggestions:

${statsString}

Provide actionable insights for improving productivity.`;

    try {
      const result = await genAI.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
        config: {
          temperature: 0.7,
        },
      });

      return result.text || "Ecosystem analysis complete";
    } catch (error) {
      console.error("Ecosystem analysis error:", error);
      return "Unable to analyze ecosystem health at this time.";
    }
  }
}

// Singleton instance
let secondbrainInstance: SecondbrainAI | null = null;

export function getSecondbrainInstance(): SecondbrainAI {
  if (!secondbrainInstance) {
    secondbrainInstance = new SecondbrainAI();
  }
  return secondbrainInstance;
}
