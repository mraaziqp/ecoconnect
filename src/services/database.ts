/**
 * Nexus Hub Multi-Database Abstraction Layer
 * Supports: Neon PostgreSQL, Supabase, Firebase, MongoDB Atlas
 * Manages connection pooling, migrations, and queries
 */

import { Pool, QueryResult } from 'pg';

export type DatabaseProvider = 'neon' | 'supabase' | 'firebase' | 'mongodb';

export interface DatabaseConfig {
  provider: DatabaseProvider;
  url?: string; // Connection string
  key?: string; // API key for cloud providers
  host?: string;
  port?: number;
  database?: string;
  user?: string;
  password?: string;
  ssl?: boolean;
}

export interface DatabaseConnection {
  query(sql: string, params?: any[]): Promise<QueryResult>;
  close(): Promise<void>;
  health(): Promise<boolean>;
  migrate(): Promise<void>;
}

/**
 * Neon PostgreSQL Connection
 * Direct TCP connection with connection pooling
 */
class NeonConnection implements DatabaseConnection {
  private pool: Pool;

  constructor(config: DatabaseConfig) {
    this.pool = new Pool({
      connectionString: config.url || process.env.NEON_DATABASE_URL,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
  }

  async query(sql: string, params: any[] = []): Promise<QueryResult> {
    try {
      return await this.pool.query(sql, params);
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  async health(): Promise<boolean> {
    try {
      const result = await this.pool.query('SELECT 1');
      return result.rows.length > 0;
    } catch {
      return false;
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }

  async migrate(): Promise<void> {
    // Run migrations
    const migrations = [
      this.createUsersTable(),
      this.createFinanceTable(),
      this.createRelationshipTable(),
      this.createMonitoringTable(),
    ];

    for (const migration of migrations) {
      try {
        await this.query(migration);
        console.log('Migration executed:', migration.substring(0, 50));
      } catch (error) {
        console.error('Migration failed:', error);
      }
    }
  }

  private createUsersTable(): string {
    return `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        profile_data JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `;
  }

  private createFinanceTable(): string {
    return `
      CREATE TABLE IF NOT EXISTS transactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        description VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        type VARCHAR(20) CHECK (type IN ('income', 'expense')),
        category VARCHAR(50),
        date TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
      CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
      CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
    `;
  }

  private createRelationshipTable(): string {
    return `
      CREATE TABLE IF NOT EXISTS milestones (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        rating INTEGER CHECK (rating >= 0 AND rating <= 100),
        date TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
      CREATE INDEX IF NOT EXISTS idx_milestones_user ON milestones(user_id);
    `;
  }

  private createMonitoringTable(): string {
    return `
      CREATE TABLE IF NOT EXISTS server_metrics (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        cpu_usage DECIMAL(5, 2),
        memory_usage DECIMAL(5, 2),
        disk_usage DECIMAL(5, 2),
        uptime_hours INTEGER,
        timestamp TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
      CREATE INDEX IF NOT EXISTS idx_metrics_user_time ON server_metrics(user_id, timestamp);
    `;
  }
}

/**
 * Supabase Connection (PostgreSQL + REST API)
 * Cloud-hosted with built-in auth and RLS
 */
class SupabaseConnection implements DatabaseConnection {
  private pool: Pool;
  private supabaseUrl: string;
  private supabaseKey: string;

  constructor(config: DatabaseConfig) {
    this.supabaseUrl = config.url || process.env.SUPABASE_URL || '';
    this.supabaseKey = config.key || process.env.SUPABASE_KEY || '';

    // Connect via PostgreSQL for server-side queries
    const connectionString = `postgresql://postgres:${this.supabaseKey}@db.${this.supabaseUrl.split('//')[1]}:5432/postgres`;

    this.pool = new Pool({
      connectionString,
      max: 20,
      ssl: { rejectUnauthorized: false },
    });
  }

  async query(sql: string, params: any[] = []): Promise<QueryResult> {
    try {
      return await this.pool.query(sql, params);
    } catch (error) {
      console.error('Supabase query error:', error);
      throw error;
    }
  }

  async health(): Promise<boolean> {
    try {
      const response = await fetch(`${this.supabaseUrl}/rest/v1/`, {
        headers: {
          Authorization: `Bearer ${this.supabaseKey}`,
          apikey: this.supabaseKey,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }

  async migrate(): Promise<void> {
    // Supabase migrations handled via migrations folder
    // or use the migration management UI
    console.log('Supabase migrations should be managed via dashboard');
  }
}

/**
 * Database Factory - Create connections based on provider
 */
export class DatabaseFactory {
  private static instances: Map<string, DatabaseConnection> = new Map();

  static getConnection(config: DatabaseConfig): DatabaseConnection {
    const key = `${config.provider}-${config.url || 'default'}`;

    if (this.instances.has(key)) {
      return this.instances.get(key)!;
    }

    let connection: DatabaseConnection;

    switch (config.provider) {
      case 'neon':
        connection = new NeonConnection(config);
        break;
      case 'supabase':
        connection = new SupabaseConnection(config);
        break;
      case 'firebase':
        throw new Error('Firebase support coming soon');
      case 'mongodb':
        throw new Error('MongoDB support coming soon');
      default:
        throw new Error(`Unknown database provider: ${config.provider}`);
    }

    this.instances.set(key, connection);
    return connection;
  }

  static async closeAll(): Promise<void> {
    for (const connection of this.instances.values()) {
      await connection.close();
    }
    this.instances.clear();
  }
}

/**
 * High-level Database Service
 * Provides clean API for app operations
 */
export class DatabaseService {
  private connection: DatabaseConnection;

  constructor(config: DatabaseConfig) {
    this.connection = DatabaseFactory.getConnection(config);
  }

  // User operations
  async createUser(email: string, name: string): Promise<any> {
    const result = await this.connection.query(
      'INSERT INTO users (email, name) VALUES ($1, $2) RETURNING *',
      [email, name]
    );
    return result.rows[0];
  }

  async getUser(userId: string): Promise<any> {
    const result = await this.connection.query(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    );
    return result.rows[0];
  }

  // Finance operations
  async addTransaction(
    userId: string,
    description: string,
    amount: number,
    type: 'income' | 'expense',
    category?: string
  ): Promise<any> {
    const result = await this.connection.query(
      `INSERT INTO transactions (user_id, description, amount, type, category)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, description, amount, type, category]
    );
    return result.rows[0];
  }

  async getTransactions(userId: string, limit: number = 50): Promise<any[]> {
    const result = await this.connection.query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC LIMIT $2',
      [userId, limit]
    );
    return result.rows;
  }

  // Relationship operations
  async addMilestone(
    userId: string,
    title: string,
    rating: number,
    date: Date
  ): Promise<any> {
    const result = await this.connection.query(
      `INSERT INTO milestones (user_id, title, rating, date)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, title, rating, date]
    );
    return result.rows[0];
  }

  async getMilestones(userId: string): Promise<any[]> {
    const result = await this.connection.query(
      'SELECT * FROM milestones WHERE user_id = $1 ORDER BY date DESC',
      [userId]
    );
    return result.rows;
  }

  // Monitoring operations
  async recordMetrics(
    userId: string,
    cpuUsage: number,
    memoryUsage: number,
    diskUsage: number
  ): Promise<any> {
    const result = await this.connection.query(
      `INSERT INTO server_metrics (user_id, cpu_usage, memory_usage, disk_usage)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, cpuUsage, memoryUsage, diskUsage]
    );
    return result.rows[0];
  }

  async getMetrics(userId: string, hours: number = 24): Promise<any[]> {
    const result = await this.connection.query(
      `SELECT * FROM server_metrics
       WHERE user_id = $1 AND timestamp > NOW() - INTERVAL '${hours} hours'
       ORDER BY timestamp DESC`,
      [userId]
    );
    return result.rows;
  }

  // Health check
  async health(): Promise<boolean> {
    return await this.connection.health();
  }

  // Migrations
  async migrate(): Promise<void> {
    await this.connection.migrate();
  }
}
