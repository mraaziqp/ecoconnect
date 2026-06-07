/**
 * Database Configuration Endpoint
 * Manage database connections for different providers
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { DatabaseFactory, DatabaseService, DatabaseConfig } from '../../src/services/database';

interface DatabaseConnectionRequest {
  provider: 'neon' | 'supabase';
  name: string;
  credentials: {
    url?: string;
    key?: string;
  };
  test?: boolean;
}

// Store active database configurations
const activeConnections: Map<string, DatabaseConfig> = new Map();

export default async (req: VercelRequest, res: VercelResponse) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token,X-Requested-With,Accept,Accept-Version,Content-Length,Content-MD5,Content-Type,Date,X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'POST') {
      // Add new database connection
      const body: DatabaseConnectionRequest = req.body;

      if (!body.provider || !body.name || !body.credentials) {
        return res.status(400).json({
          error: 'Missing required fields: provider, name, credentials',
        });
      }

      const config: DatabaseConfig = {
        provider: body.provider,
        url: body.credentials.url,
        key: body.credentials.key,
      };

      // Test connection if requested
      if (body.test) {
        try {
          const db = new DatabaseService(config);
          const healthy = await db.health();

          if (!healthy) {
            return res.status(400).json({
              error: 'Database connection test failed',
              status: 'unhealthy',
            });
          }

          await db.migrate();
        } catch (error: any) {
          return res.status(400).json({
            error: 'Database connection failed',
            details: error.message,
          });
        }
      }

      // Store configuration
      activeConnections.set(body.name, config);

      return res.status(201).json({
        success: true,
        database: body.name,
        provider: body.provider,
        message: 'Database connection configured successfully',
      });
    }

    if (req.method === 'GET') {
      // List active database connections
      const databases = Array.from(activeConnections.entries()).map(([name, config]) => ({
        name,
        provider: config.provider,
        status: 'configured',
      }));

      return res.status(200).json({
        databases,
        count: databases.length,
      });
    }

    if (req.method === 'PUT') {
      // Update database connection
      const body: DatabaseConnectionRequest = req.body;

      if (!body.name) {
        return res.status(400).json({ error: 'Database name required' });
      }

      const config: DatabaseConfig = {
        provider: body.provider,
        url: body.credentials.url,
        key: body.credentials.key,
      };

      activeConnections.set(body.name, config);

      return res.status(200).json({
        success: true,
        database: body.name,
        message: 'Database connection updated',
      });
    }

    if (req.method === 'DELETE') {
      // Remove database connection
      const { name } = req.query;

      if (!name || typeof name !== 'string') {
        return res.status(400).json({ error: 'Database name required' });
      }

      const existed = activeConnections.delete(name);

      if (!existed) {
        return res.status(404).json({ error: 'Database connection not found' });
      }

      return res.status(200).json({
        success: true,
        database: name,
        message: 'Database connection removed',
      });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Database config error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message,
    });
  }
};
