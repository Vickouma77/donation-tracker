import mongoose from 'mongoose';
import logger from './logger.js';
import config from '../config/index.js';

class Database {
  private static instance: Database;
  private isConnected: boolean = false;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    try {
      if (this.isConnected) {
        logger.info('MongoDB already connected');
        return;
      }

      const mongoUrl = config.mongoUrl;

      if (!mongoUrl) {
        throw new Error('MongoDB connection URL is not configured');
      }

      // Set mongoose options for better performance and compatibility
      const options = {
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        bufferCommands: false, // Disable mongoose buffering
        bufferMaxEntries: 0, // Disable mongoose buffering
      };

      await mongoose.connect(mongoUrl, options);

      this.isConnected = true;

      logger.info('MongoDB connected successfully', {
        url: mongoUrl.replace(/\/\/.*@/, '//***:***@'), // Hide credentials in logs
      });

      // Handle connection events
      mongoose.connection.on('error', (error) => {
        logger.error('MongoDB connection error', { error: error.message });
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected');
        this.isConnected = false;
      });

      mongoose.connection.on('reconnected', () => {
        logger.info('MongoDB reconnected');
        this.isConnected = true;
      });

    } catch (error) {
      const err = error as Error;
      logger.error('MongoDB connection failed', {
        error: err.message,
        stack: err.stack
      });
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      this.isConnected = false;
      logger.info('MongoDB disconnected successfully');
    } catch (error) {
      const err = error as Error;
      logger.error('MongoDB disconnection failed', { error: err.message });
      throw error;
    }
  }

  public getConnectionStatus(): boolean {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  public async healthCheck(): Promise<boolean> {
    try {
      if (!this.isConnected) {
        return false;
      }

      // Simple ping to check if database is responsive
      if (mongoose.connection.db) {
        await mongoose.connection.db.admin().ping();
      } else {
        // Fallback check using mongoose connection ready state
        return mongoose.connection.readyState === 1;
      }
      return true;
    } catch (error) {
      logger.error('Database health check failed', { error: (error as Error).message });
      return false;
    }
  }
}

export default Database;