#!/usr/bin/env node

/**
 * Daily Database Backup Script for UniHub
 * 
 * This script creates a backup of the MongoDB database
 * Run this script daily using a cron job or task scheduler
 * 
 * Usage:
 *   node scripts/backup.js
 * 
 * Cron example (daily at 2 AM):
 *   0 2 * * * cd /path/to/unihub && node scripts/backup.js
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/unihub';
const BACKUP_DIR = path.join(__dirname, '..', 'backups');
const MAX_BACKUPS = 7; // Keep last 7 days of backups

// Create backup directory if it doesn't exist
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Generate backup filename with timestamp
const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
const backupPath = path.join(BACKUP_DIR, `backup-${timestamp}`);

console.log(`Starting database backup...`);
console.log(`Backup location: ${backupPath}`);

// Execute mongodump command
const command = `mongodump --uri="${MONGODB_URI}" --out="${backupPath}"`;

exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`Backup failed: ${error.message}`);
        return;
    }

    if (stderr) {
        console.error(`Backup stderr: ${stderr}`);
    }

    console.log(`Backup completed successfully!`);
    console.log(stdout);

    // Clean up old backups
    cleanupOldBackups();
});

function cleanupOldBackups() {
    const backups = fs.readdirSync(BACKUP_DIR)
        .filter(file => file.startsWith('backup-'))
        .map(file => ({
            name: file,
            path: path.join(BACKUP_DIR, file),
            time: fs.statSync(path.join(BACKUP_DIR, file)).mtime.getTime()
        }))
        .sort((a, b) => b.time - a.time);

    // Remove backups beyond MAX_BACKUPS
    if (backups.length > MAX_BACKUPS) {
        const toRemove = backups.slice(MAX_BACKUPS);
        toRemove.forEach(backup => {
            console.log(`Removing old backup: ${backup.name}`);
            fs.rmSync(backup.path, { recursive: true, force: true });
        });
    }

    console.log(`Kept ${Math.min(backups.length, MAX_BACKUPS)} most recent backups`);
}
