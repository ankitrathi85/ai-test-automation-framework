#!/usr/bin/env node
// Simple script to generate backup reports using ReportGenerator
import { ReportGenerator } from './utils/reportGenerator.js';
import fs from 'fs';
import path from 'path';

const reportFile = path.join(process.cwd(), 'reports', 'cucumber_report.json');

if (!fs.existsSync(reportFile)) {
  console.log('❌ No test report found. Run tests first: npm run test');
  process.exit(1);
}

try {
  const data = JSON.parse(fs.readFileSync(reportFile, 'utf8'));
  ReportGenerator.generateHTMLReport(data, 'simple_report.html');
  console.log('✅ Simple backup report generated successfully!');
  console.log('📂 Location: reports/simple_report.html');
} catch (error) {
  console.error('❌ Error generating backup report:', error);
  process.exit(1);
}
