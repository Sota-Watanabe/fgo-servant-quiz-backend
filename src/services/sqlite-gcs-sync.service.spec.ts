import { SqliteGcsSyncService } from './sqlite-gcs-sync.service';

describe('SqliteGcsSyncService', () => {
  it('uses SQLite settings when DB_TYPE=sqlite', () => {
    process.env.DB_TYPE = 'sqlite';
    expect(SqliteGcsSyncService.resolveDbType()).toBe('sqlite');
  });

  it('defaults to MySQL when DB_TYPE is unset', () => {
    delete process.env.DB_TYPE;
    expect(SqliteGcsSyncService.resolveDbType()).toBe('mysql');
  });
});
