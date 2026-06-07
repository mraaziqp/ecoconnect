/**
 * Database Query Endpoint
 * Execute queries across multiple database providers
 * Supports transactions and complex operations
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { DatabaseService, DatabaseConfig } from '../../src/services/database';

// In-memory storage (replace with Redis in production)
const databaseConfigs: Map<string, DatabaseConfig> = new Map();

interface QueryRequest {
  database: string;
  operation: 'addTransaction' | 'getTransactions' | 'addMilestone' | 'getMilestones' | 'recordMetrics' | 'getMetrics';
  userId: string;
  params: Record<string, any>;
}

export default async (req: VercelRequest, res: VercelResponse) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body: QueryRequest = req.body;

    if (!body.database || !body.operation || !body.userId) {
      return res.status(400).json({
        error: 'Missing required fields: database, operation, userId',
      });
    }

    // Get database config
    let config = databaseConfigs.get(body.database);

    if (!config) {
      // Try to load from environment
      if (body.database === 'neon' && process.env.NEON_DATABASE_URL) {
        config = {
          provider: 'neon',
          url: process.env.NEON_DATABASE_URL,
        };
      } else if (body.database === 'supabase' && process.env.SUPABASE_URL) {
        config = {
          provider: 'supabase',
          url: process.env.SUPABASE_URL,
          key: process.env.SUPABASE_KEY,
        };
      } else {
        return res.status(400).json({
          error: `Database '${body.database}' not configured`,
        });
      }
    }

    // Initialize database service
    const db = new DatabaseService(config);

    // Check health
    const healthy = await db.health();
    if (!healthy) {
      return res.status(503).json({
        error: 'Database unavailable',
        database: body.database,
      });
    }

    let result: any;

    // Execute operation
    switch (body.operation) {
      case 'addTransaction':
        result = await db.addTransaction(
          body.userId,
          body.params.description,
          body.params.amount,
          body.params.type,
          body.params.category
        );
        break;

      case 'getTransactions':
        result = await db.getTransactions(body.userId, body.params.limit || 50);
        break;

      case 'addMilestone':
        result = await db.addMilestone(
          body.userId,
          body.params.title,
          body.params.rating,
          new Date(body.params.date)
        );
        break;

      case 'getMilestones':
        result = await db.getMilestones(body.userId);
        break;

      case 'recordMetrics':
        result = await db.recordMetrics(
          body.userId,
          body.params.cpuUsage,
          body.params.memoryUsage,
          body.params.diskUsage
        );
        break;

      case 'getMetrics':
        result = await db.getMetrics(body.userId, body.params.hours || 24);
        break;

      default:
        return res.status(400).json({
          error: `Unknown operation: ${body.operation}`,
        });
    }

    return res.status(200).json({
      success: true,
      operation: body.operation,
      database: body.database,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Query error:', error);
    res.status(500).json({
      error: 'Query execution failed',
      details: error.message,
    });
  }
};
