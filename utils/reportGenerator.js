// Simple backup report generator utility
import fs from 'fs';
import path from 'path';

export class ReportGenerator {
  /**
   * Generate a simple HTML report with basic styling (backup option)
   * Use test-helpers.js for the enhanced report with screenshots
   */
  static generateHTMLReport(results, fileName) {
    const stats = this.calculateStats(results);
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Test Report - Backup</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .header { background: #007bff; color: white; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        .stats { display: flex; gap: 20px; margin-bottom: 20px; }
        .stat-box { background: #f8f9fa; padding: 15px; border-radius: 5px; flex: 1; text-align: center; }
        .passed { color: #28a745; font-weight: bold; }
        .failed { color: #dc3545; font-weight: bold; }
        .skipped { color: #ffc107; font-weight: bold; }
        .raw-data { background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 20px; }
        pre { background: #e9ecef; padding: 10px; border-radius: 3px; overflow-x: auto; font-size: 12px; }
        .notice { background: #fff3cd; padding: 10px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #ffc107; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧪 Test Report (Simple Backup)</h1>
            <p>Generated: ${new Date().toLocaleString()}</p>
        </div>
        
        <div class="notice">
            <strong>💡 Note:</strong> This is a simple backup report. For enhanced reports with screenshots, use the main reporting system: <code>npm run report</code>
        </div>
        
        <div class="stats">
            <div class="stat-box">
                <h3>Total Features</h3>
                <div style="font-size: 24px; font-weight: bold;">${stats.totalFeatures}</div>
            </div>
            <div class="stat-box">
                <h3>Total Scenarios</h3>
                <div style="font-size: 24px; font-weight: bold;">${stats.totalScenarios}</div>
            </div>
            <div class="stat-box">
                <h3 class="passed">Passed</h3>
                <div style="font-size: 24px;" class="passed">${stats.passed}</div>
            </div>
            <div class="stat-box">
                <h3 class="failed">Failed</h3>
                <div style="font-size: 24px;" class="failed">${stats.failed}</div>
            </div>
            <div class="stat-box">
                <h3 class="skipped">Skipped</h3>
                <div style="font-size: 24px;" class="skipped">${stats.skipped}</div>
            </div>
        </div>
        
        <div class="raw-data">
            <h3>📄 Raw Test Data</h3>
            <pre>${JSON.stringify(results, null, 2)}</pre>
        </div>
    </div>
</body>
</html>`;
    
    const reportsDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(reportsDir, fileName), html);
    console.log(`📋 Simple backup HTML report generated: ${path.join(reportsDir, fileName)}`);
  }

  /**
   * Generate JSON report
   */
  static generateJSONReport(results, fileName) {
    const reportsDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(reportsDir, fileName), JSON.stringify(results, null, 2));
    console.log(`📄 JSON report generated: ${path.join(reportsDir, fileName)}`);
  }

  /**
   * Calculate basic statistics from test results
   */
  static calculateStats(results) {
    let totalFeatures = 0;
    let totalScenarios = 0;
    let passed = 0;
    let failed = 0;
    let skipped = 0;

    if (Array.isArray(results)) {
      totalFeatures = results.length;
      
      results.forEach((feature) => {
        if (feature.elements) {
          totalScenarios += feature.elements.length;
          
          feature.elements.forEach((scenario) => {
            if (scenario.steps) {
              const hasFailedStep = scenario.steps.some((step) => step.result?.status === 'failed');
              const hasSkippedStep = scenario.steps.some((step) => step.result?.status === 'skipped');
              
              if (hasFailedStep) {
                failed++;
              } else if (hasSkippedStep) {
                skipped++;
              } else {
                passed++;
              }
            }
          });
        }
      });
    }

    return { totalFeatures, totalScenarios, passed, failed, skipped };
  }
}
