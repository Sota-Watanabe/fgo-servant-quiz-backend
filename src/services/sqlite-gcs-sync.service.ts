import { Injectable, Logger } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { existsSync } from 'node:fs';
import { mkdir, access } from 'node:fs/promises';
import { dirname } from 'node:path';

export type DatabaseType = 'mysql' | 'sqlite';

@Injectable()
export class SqliteGcsSyncService {
  private readonly logger = new Logger(SqliteGcsSyncService.name);
  private readonly storage: Storage | null;
  private readonly bucketName: string;
  private readonly dbPath: string;
  private readonly objectName: string;

  constructor() {
    this.bucketName = process.env.GCS_BUCKET_NAME || '';
    this.dbPath = process.env.SQLITE_PATH || '/tmp/fgo-servant-quiz.db';
    this.objectName =
      process.env.SQLITE_GCS_OBJECT || 'sqlite/fgo-servant-quiz.db';

    this.storage =
      process.env.GCP_PROJECT_ID && this.bucketName
        ? new Storage({ projectId: process.env.GCP_PROJECT_ID })
        : null;
  }

  static resolveDbType(): DatabaseType {
    const value = (process.env.DB_TYPE || 'mysql').trim().toLowerCase();
    return value === 'sqlite' ? 'sqlite' : 'mysql';
  }

  static resolveDbPath(): string {
    return process.env.SQLITE_PATH || '/tmp/fgo-servant-quiz.db';
  }

  isConfigured(): boolean {
    return (
      SqliteGcsSyncService.resolveDbType() === 'sqlite' && !!this.bucketName
    );
  }

  async downloadDbFromGcs(): Promise<boolean> {
    if (!this.isConfigured() || !this.storage) {
      this.logger.debug(
        'SQLite/GCS sync is disabled or GCS is not configured.',
      );
      return false;
    }

    const localExists = existsSync(this.dbPath);
    if (localExists) {
      this.logger.log(
        `SQLite already exists at ${this.dbPath}. Skipping GCS download.`,
      );
      return false;
    }

    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(this.objectName);

    try {
      const [exists] = await file.exists();
      if (!exists) {
        this.logger.warn(
          `GCS object ${this.objectName} not found. Creating a fresh local SQLite DB.`,
        );
        await mkdir(dirname(this.dbPath), { recursive: true });
        return false;
      }

      await mkdir(dirname(this.dbPath), { recursive: true });
      await file.download({ destination: this.dbPath });
      this.logger.log(
        `Downloaded SQLite DB from GCS object ${this.objectName} to ${this.dbPath}`,
      );
      return true;
    } catch (error) {
      this.logger.warn(
        `Could not download SQLite from GCS. Starting with a fresh local DB. Error: ${error instanceof Error ? error.message : String(error)}`,
      );
      await mkdir(dirname(this.dbPath), { recursive: true });
      return false;
    }
  }

  async uploadDbToGcs(): Promise<boolean> {
    if (!this.isConfigured() || !this.storage) {
      return false;
    }

    try {
      await access(this.dbPath);
    } catch {
      this.logger.warn(
        `SQLite DB file not found at ${this.dbPath}. Skipping upload.`,
      );
      return false;
    }

    try {
      const bucket = this.storage.bucket(this.bucketName);
      await bucket.upload(this.dbPath, {
        destination: this.objectName,
        metadata: {
          cacheControl: 'no-cache',
        },
      });
      this.logger.log(`Uploaded SQLite DB to GCS object ${this.objectName}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to upload SQLite DB to GCS: ${error instanceof Error ? error.message : String(error)}`,
      );
      return false;
    }
  }
}
