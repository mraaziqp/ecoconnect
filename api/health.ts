/**
 * Health Check Endpoint
 * Monitor app, database, and external service health
 * Critical for Vercel uptime monitoring
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { DatabaseService, DatabaseConfig } from '../src/services/database';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  services: {
    api: boolean;
    database: {
      neon?: boolean;
      supabase?: boolean;
    };
    external: {
      gemini?: boolean;
    };
  };
  metrics?: {
    responseTime: number;
    memoryUsage: number;
  };
}

let startTime = Date.now();

async function checkDatabaseHealth(provider: 'neon' | 'supabase', config: DatabaseConfig): Promise<boolean> {
  try {
    const db = new DatabaseService(config);
    return await db.health();
  } catch {
    return false;
  }
}

async function checkGeminiHealth(): Promise<boolean> {
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY || '',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'health check' }] }],
      }),
    });
    return response.ok || response.status === 400; // 400 ok, means API is responding
  } catch {
    return false;
  }
}

export default async (req: VercelRequest, res: VercelResponse) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  const startCheck = Date.now();

  try {
    // Check databases
    const neonConfig: DatabaseConfig = {
      provider: 'neon',
      url: process.env.NEON_DATABASE_URL,
    };

    const supabaseConfig: DatabaseConfig = {
      provider: 'supabase',
      url: process.env.SUPABASE_URL,
      key: process.env.SUPABASE_KEY,
    };

    const [neonHealth, supabaseHealth, geminiHealth] = await Promise.all([
      process.env.NEON_DATABASE_URL ? checkDatabaseHealth('neon', neonConfig) : Promise.resolve(false),
      process.env.SUPABASE_URL ? checkDatabaseHealth('supabase', supabaseConfig) : Promise.resolve(false),
      process.env.GEMINI_API_KEY ? checkGeminiHealth() : Promise.resolve(false),
    ]);

    const responseTime = Date.now() - startCheck;
    const uptime = Date.now() - startTime;

    // Determine overall status
    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    const databasesUp = [neonHealth, supabaseHealth].filter(Boolean).length;

    if (databasesUp === 0) {
      status = 'unhealthy';
    } else if (databasesUp === 1) {
      status = 'degraded';
    }

    const healthStatus: HealthStatus = {
      status,
      timestamp: new Date().toISOString(),
      uptime,
      services: {
        api: true,
        database: {
          ...(process.env.NEON_DATABASE_URL && { neon: neonHealth }),
          ...(process.env.SUPABASE_URL && { supabase: supabaseHealth }),
        },
        external: {
          ...(process.env.GEMINI_API_KEY && { gemini: geminiHealth }),
        },
      },
      metrics: {
        responseTime,
        memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024, // MB
      },
    };

    const statusCode = status === 'healthy' ? 200 : status === 'degraded' ? 503 : 503;

    res.status(statusCode).json(healthStatus);
  } catch (error: any) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
      services: {
        api: false,
        database: {},
        external: {},
      },
    });
  }
};
