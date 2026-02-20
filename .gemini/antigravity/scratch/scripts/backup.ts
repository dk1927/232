/**
 * DB Backup Script
 * Run: npx ts-node scripts/backup.ts
 * Or schedule via Windows Task Scheduler using scripts/backup.ps1
 */

import { copyFileSync, mkdirSync, existsSync, readdirSync, unlinkSync, statSync } from "fs";
import { join, basename } from "path";

const DB_PATH = join(__dirname, "..", "prisma", "dev.db");
const BACKUP_DIR = join(__dirname, "..", "backups");
const MAX_BACKUPS = 30; // Keep last 30 days

function backup() {
    // Create backup directory if not exists
    if (!existsSync(BACKUP_DIR)) {
        mkdirSync(BACKUP_DIR, { recursive: true });
    }

    // Check if source DB exists
    if (!existsSync(DB_PATH)) {
        console.error("❌ Database file not found:", DB_PATH);
        process.exit(1);
    }

    // Generate timestamped filename
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const backupName = `backup_${timestamp}.db`;
    const backupPath = join(BACKUP_DIR, backupName);

    // Copy database file
    try {
        copyFileSync(DB_PATH, backupPath);
        const size = statSync(backupPath).size;
        console.log(`✅ Backup created: ${backupName} (${(size / 1024).toFixed(1)} KB)`);
    } catch (err) {
        console.error("❌ Backup failed:", err);
        process.exit(1);
    }

    // Cleanup old backups (keep last MAX_BACKUPS)
    try {
        const files = readdirSync(BACKUP_DIR)
            .filter((f) => f.startsWith("backup_") && f.endsWith(".db"))
            .sort()
            .reverse();

        if (files.length > MAX_BACKUPS) {
            const toDelete = files.slice(MAX_BACKUPS);
            toDelete.forEach((f) => {
                unlinkSync(join(BACKUP_DIR, f));
                console.log(`🗑️ Deleted old backup: ${f}`);
            });
        }

        console.log(`📊 Total backups: ${Math.min(files.length, MAX_BACKUPS)}`);
    } catch (err) {
        console.error("⚠️ Cleanup failed:", err);
    }
}

backup();
