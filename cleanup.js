#!/usr/bin/env node
// Advanced cleanup script for test automation framework
import { cleanupAllReports, cleanupOldReports } from './utils/test-helpers.js';
import fs from 'fs';
import path from 'path';

const command = process.argv[2];

switch (command) {
  case 'all':
    console.log('🧹 Performing complete cleanup...');
    cleanupAllReports();
    break;
    
  case 'old':
    const keepCount = parseInt(process.argv[3]) || 5;
    console.log(`🧹 Cleaning old reports (keeping latest ${keepCount})...`);
    cleanupOldReports(keepCount);
    break;
    
  case 'reports':
    console.log('🧹 Cleaning only report files...');
    const reportsDir = path.join(process.cwd(), 'reports');
    if (fs.existsSync(reportsDir)) {
      const files = fs.readdirSync(reportsDir);
      files.forEach(file => {
        if (file.endsWith('.html') || file.endsWith('.json')) {
          fs.unlinkSync(path.join(reportsDir, file));
          console.log(`  ❌ Deleted: ${file}`);
        }
      });
    }
    break;
    
  case 'screenshots':
    console.log('🧹 Cleaning only screenshot files...');
    const screenshotsDir = path.join(process.cwd(), 'screenshots');
    if (fs.existsSync(screenshotsDir)) {
      const files = fs.readdirSync(screenshotsDir);
      files.forEach(file => {
        if (file.endsWith('.png') || file.endsWith('.jpg')) {
          fs.unlinkSync(path.join(screenshotsDir, file));
          console.log(`  📸 Deleted: ${file}`);
        }
      });
    }
    break;
    
  default:
    console.log('🧹 Test Framework Cleanup Tool');
    console.log('');
    console.log('Usage: node cleanup.js <command> [options]');
    console.log('');
    console.log('Commands:');
    console.log('  all                    - Remove all reports and screenshots');
    console.log('  old [count]           - Keep only latest N reports (default: 5)');
    console.log('  reports               - Remove only report files (.html, .json)');
    console.log('  screenshots           - Remove only screenshot files');
    console.log('');
    console.log('Examples:');
    console.log('  node cleanup.js all              # Clean everything');
    console.log('  node cleanup.js old 3            # Keep only 3 latest reports');
    console.log('  node cleanup.js reports          # Clean only reports');
    break;
}
