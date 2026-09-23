// backup.js - Node.js backup for a Node/Express app
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";

const execAsync = promisify(exec);

const config = {
  backupRoot: "/var/backups/myapp",
  dbName: "myapp_production",
  dbUser: "backup_user",
  uploadsDir: "/var/www/myapp/uploads",
};

async function createBackup() {
  // Timestamp safe for file names, e.g. 2026-09-03T02-00-00
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const targetDir = path.join(config.backupRoot, timestamp);
  await mkdir(targetDir, { recursive: true });

  console.log(`[backup] Starting into ${targetDir}`);

  // 1. Dump the database (PGPASSWORD comes from process.env, never hardcoded)
  const dumpPath = path.join(targetDir, "db.dump");
  await execAsync(
    `pg_dump -U ${config.dbUser} -Fc ${config.dbName} > "${dumpPath}"`,
  );

  // 2. Fail fast if the dump is empty (a silent, dangerous failure mode)
  const { size } = await stat(dumpPath);
  if (size === 0) {
    throw new Error("Database dump is empty - aborting backup");
  }

  // 3. Archive the uploads directory
  const archivePath = path.join(targetDir, "uploads.tar.gz");
  const parent = path.dirname(config.uploadsDir);
  const base = path.basename(config.uploadsDir);
  await execAsync(`tar -czf "${archivePath}" -C "${parent}" "${base}"`);

  console.log(
    `[backup] Done. Dump size: ${(size / 1024 / 1024).toFixed(2)} MB`,
  );
  return { targetDir, size };
}

createBackup().catch((err) => {
  // Non-zero exit code lets cron / CI know the job failed
  console.error("[backup] FAILED:", err.message);
  process.exit(1);
});
