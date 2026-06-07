import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Lazy initialization check of GoogleGenAI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error("GEMINI_API_KEY is not configured in the environment variables.");
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Secondbrain Dynamic Chat/Orchestration Endpoint
  app.post("/api/secondbrain/chat", async (req, res) => {
    const { messages, context } = req.body;
    
    try {
      const client = getGeminiClient();
      
      // Build a comprehensive prompt showcasing Secondbrain as the overarching cognitive system
      const systemInstruction = `
You are "Secondbrain AI", the omnipresent AI orchestrator, API gateway supervisor, and master nervous system of the "Nexus Hub" custom software suite.
The Nexus Hub includes:
1. Productivity & Life: FinancePlay (budgeting), Project Cupid (partnership logger), Lifestack (routines).
2. Utility & Management: OpsNexus (cloud node monitoring), SMLYSAPPLOADER (distribution daemon).
3. Family & Community: Deenify (spiritual compass), Familyverse (bulletin board), Familytree (heritage index).
4. Sandbox: Hustle Studio (freelance fixers, requests like Dial-a-Braai).

Your personality is highly technical, elegant, cinematic, and responsive. You talk with crisp confidence, serving as the web OS assistant.
Current environment details:
- Active Profile: ${context?.activeProfile?.name || "Unknown"} (Role: ${context?.activeProfile?.role || "Visitor"})
- Active App: ${context?.activeAppId || "Desktop Overview"}
- Recent System Events: ${JSON.stringify(context?.recentLogs || [])}

When users ask questions, provide analytical answers, routing advice, configuration suggestions, or dynamic summaries of their current system's health.
Keep your answers beautifully concise, styled with Markdown. Refer directly to the user as "Master Developer" if their role is Developer. If their role is Partner, refer to them as "Colleague". Give responses as if you run in their infrastructure on port 3000.
`;

      const contents = messages.map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }]
      }));

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Secondbrain AI Error:", error);
      
      // Return beautiful fallback message if API key isn't setup
      if (error.message && error.message.includes("GEMINI_API_KEY")) {
        res.json({
          text: `**[Secondbrain operating in Sandbox Mode]**
          
Greetings, Master. I am online and managing your local event router, but my **Gemini cognitive synthesis module** is waiting for high-altitude sync.
          
To connect my neural pipeline:
1. Click the **Settings (Gear icon)** in Google AI Studio.
2. Select **Secrets**.
3. Add a new secret called \`GEMINI_API_KEY\` with a valid Gemini credential.
          
*In the meantime, I have synchronized your simulated databases and key vault. Press any button to simulate database signals or query my manual backup channels.*`,
          offline: true
        });
      } else {
        res.status(500).json({ error: error.message || "Cognitive node handshake failed." });
      }
    }
  });

  // API Route: Global Search over Apps and system commands
  app.post("/api/secondbrain/search", async (req, res) => {
    const { query, apps } = req.body;
    
    try {
      const client = getGeminiClient();
      const prompt = `
You are "Secondbrain Search", an indexing query router.
The user is searching for: "${query}".
Analyze the following app suite metadata and prioritize which apps are most relevant to their inquiry.
Apps List:
${JSON.stringify(apps)}

Provide a strict, tiny JSON response in the following schema:
{
  "recommendations": [
    { "appId": "app_id_here", "matchScore": 95, "reason": "Reason for recommendation in 1 sentence" }
  ],
  "aiSummary": "A 2-sentence summary answering which application/section can assist them with this request."
}
`;
      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.1,
        }
      });
      
      res.json(JSON.parse(response.text || "{}"));
    } catch (error: any) {
      // Fallback local searches if offline / keys missing
      const terms = query.toLowerCase();
      const recs = apps.map((app: any) => {
        let score = 0;
        let reason = "Contextual match checked.";
        if (app.name.toLowerCase().includes(terms) || app.shortDesc.toLowerCase().includes(terms)) {
          score = 85;
          reason = `Direct text match on name/description for "${query}".`;
        } else if (app.longDesc.toLowerCase().includes(terms)) {
          score = 60;
          reason = `Keyword matching within documentation.`;
        }
        return { appId: app.id, matchScore: score, reason };
      }).filter((rec: any) => rec.matchScore > 0)
        .sort((a: any, b: any) => b.matchScore - a.matchScore);

      res.json({
        recommendations: recs.slice(0, 3),
        aiSummary: `Local search index scanned for "${query}". Found ${recs.length} matching application entries. Sync API Key to trigger deep Gemini contextual mapping.`
      });
    }
  });

  // Live Secondbrain API Gateway Router Endpoint
  app.post("/api/gateway", (req, res) => {
    const { apiKey, targetService, payload } = req.body;
    
    if (!apiKey) {
      return res.status(401).json({ error: "Access Denied: Missing api authentication parameter." });
    }

    const SECURE_MASTER_KEYS: Record<string, string> = {
      nexus: "601a699f41445939e101d9d642f3b0386602f225451d972611f972f284a40f6c",
      awehchat: "a7f2e9c4d1b8f3a6e5c2d9f1a4b7e0c3",
      consolidated_hub: "mak_7f8b9e2c1a5d3f6e4b9c2a8d5f1e3a7c",
      axion: "axm_5a964afe59e6bb741257ff492b063960",
      financeplay: "SB-8f3d4e6a2c9b7f1e5d3a8c2b6f9e1d4a7c3b5f2e8d9a6c1b4e7f3d8a2c5b",
      secondbrain_master: "5d50b3e58d586060470a26e56a8f973b22334ed0fe85d6b6c1105b3e3cf997d8"
    };

    const serviceKey = SECURE_MASTER_KEYS[targetService || ""] || "Not configured";
    
    // Simulate gateway verification & routing log construction
    res.json({
      status: "AUTHENTICATED_AND_ROUTED",
      authenticated: true,
      serviceName: targetService,
      routingLog: `Secondbrain Node successfully authenticated key proxy request. Mapped secure master key signature: [${serviceKey.substring(0, 8)}...] leading to local endpoint synchronization.`,
      destinationUrl: `https://${targetService || "service"}.savestate.co.za/api/sync`
    });
  });

  // Vite middleware for development / routing for static files for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
