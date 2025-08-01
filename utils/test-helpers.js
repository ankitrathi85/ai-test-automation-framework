import fs from 'fs';
import path from 'path';

export function getDateYearsAgo(years) {
  const date = new Date();
  date.setFullYear(date.getFullYear() - years);
  return date.toISOString().split('T')[0];
}

export async function takeScreenshot(client, name) {
  const screenshotPath = `screenshots/${name}-${Date.now()}.png`;
  await client.screenshot(screenshotPath);
  return screenshotPath;
}

// Enhanced HTML Report Generator
export function generateEnhancedHTMLReport() {
  console.log('📋 Generating enhanced HTML report...');
  
  const reportsDir = path.join(process.cwd(), 'reports');
  const jsonReportPath = path.join(reportsDir, 'cucumber_report.json');
  
  if (!fs.existsSync(jsonReportPath)) {
    console.log('❌ No cucumber report found. Tests may not have run successfully.');
    return;
  }
  
  try {
    const reportData = JSON.parse(fs.readFileSync(jsonReportPath, 'utf8'));
    const stats = calculateTestStats(reportData);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const htmlReportPath = path.join(reportsDir, `test-report-${timestamp}.html`);
    
    const html = generateHTMLContent(reportData, stats);
    fs.writeFileSync(htmlReportPath, html);
    
    // Also create a latest report
    const latestReportPath = path.join(reportsDir, 'latest-report.html');
    fs.writeFileSync(latestReportPath, html);
    
    console.log(`✅ Enhanced HTML report generated: ${htmlReportPath}`);
    console.log(`📂 Latest report: ${latestReportPath}`);
  } catch (error) {
    console.error('❌ Error generating enhanced HTML report:', error);
  }
}

function calculateTestStats(reportData) {
  let totalFeatures = 0;
  let totalScenarios = 0;
  let passed = 0;
  let failed = 0;
  let skipped = 0;
  let duration = 0;

  if (Array.isArray(reportData)) {
    totalFeatures = reportData.length;
    
    reportData.forEach((feature) => {
      if (feature.elements) {
        totalScenarios += feature.elements.length;
        
        feature.elements.forEach((scenario) => {
          if (scenario.steps) {
            let scenarioFailed = false;
            let scenarioSkipped = false;
            
            scenario.steps.forEach((step) => {
              if (step.result) {
                if (step.result.duration) {
                  duration += step.result.duration;
                }
                if (step.result.status === 'failed') {
                  scenarioFailed = true;
                } else if (step.result.status === 'skipped') {
                  scenarioSkipped = true;
                }
              }
            });
            
            if (scenarioFailed) {
              failed++;
            } else if (scenarioSkipped) {
              skipped++;
            } else {
              passed++;
            }
          }
        });
      }
    });
  }

  return { 
    totalFeatures, 
    totalScenarios, 
    passed, 
    failed, 
    skipped, 
    duration: Math.round(duration / 1000000), // Convert nanoseconds to milliseconds
    passRate: totalScenarios > 0 ? Math.round((passed / totalScenarios) * 100) : 0
  };
}

function generateHTMLContent(reportData, stats) {
  const featureRows = reportData.map((feature) => {
    const featureStats = { passed: 0, failed: 0, skipped: 0 };
    
    if (feature.elements) {
      feature.elements.forEach((scenario) => {
        if (scenario.steps) {
          const hasFailedStep = scenario.steps.some((step) => step.result?.status === 'failed');
          const hasSkippedStep = scenario.steps.some((step) => step.result?.status === 'skipped');
          
          if (hasFailedStep) {
            featureStats.failed++;
          } else if (hasSkippedStep) {
            featureStats.skipped++;
          } else {
            featureStats.passed++;
          }
        }
      });
    }
    
    const status = featureStats.failed > 0 ? 'failed' : 
                  featureStats.skipped > 0 ? 'skipped' : 'passed';
    
    return `
      <tr class="${status}">
        <td>${feature.name || 'Unnamed Feature'}</td>
        <td>${featureStats.passed + featureStats.failed + featureStats.skipped}</td>
        <td class="passed">${featureStats.passed}</td>
        <td class="failed">${featureStats.failed}</td>
        <td class="skipped">${featureStats.skipped}</td>
        <td><span class="status-badge ${status}">${status.toUpperCase()}</span></td>
      </tr>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Automation Report</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f7fa; color: #333; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px; text-align: center; }
        .header h1 { font-size: 2.5rem; margin-bottom: 10px; }
        .header p { font-size: 1.1rem; opacity: 0.9; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: white; padding: 25px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; border-left: 4px solid #667eea; }
        .stat-card.passed { border-left-color: #48bb78; }
        .stat-card.failed { border-left-color: #f56565; }
        .stat-card.skipped { border-left-color: #ed8936; }
        .stat-value { font-size: 2.5rem; font-weight: bold; margin-bottom: 5px; }
        .stat-label { color: #666; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; }
        .stat-card.passed .stat-value { color: #48bb78; }
        .stat-card.failed .stat-value { color: #f56565; }
        .stat-card.skipped .stat-value { color: #ed8936; }
        
        .features-section { background: white; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; }
        .section-header { background: #f8f9fa; padding: 20px; border-bottom: 1px solid #e2e8f0; }
        .section-header h2 { color: #2d3748; font-size: 1.5rem; }
        
        .features-table { width: 100%; border-collapse: collapse; }
        .features-table th { background: #f8f9fa; padding: 15px; text-align: left; font-weight: 600; color: #4a5568; border-bottom: 2px solid #e2e8f0; }
        .features-table td { padding: 15px; border-bottom: 1px solid #e2e8f0; }
        .features-table tr:hover { background: #f8f9fa; }
        .features-table tr.failed { border-left: 4px solid #f56565; }
        .features-table tr.passed { border-left: 4px solid #48bb78; }
        .features-table tr.skipped { border-left: 4px solid #ed8936; }
        
        .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; }
        .status-badge.passed { background: #c6f6d5; color: #22543d; }
        .status-badge.failed { background: #fed7d7; color: #742a2a; }
        .status-badge.skipped { background: #feebc8; color: #7b341e; }
        
        .passed { color: #48bb78; font-weight: 600; }
        .failed { color: #f56565; font-weight: 600; }
        .skipped { color: #ed8936; font-weight: 600; }
        
        .footer { text-align: center; margin-top: 30px; padding: 20px; color: #666; }
        .progress-bar { width: 100%; height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden; margin: 10px 0; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #48bb78, #38a169); border-radius: 4px; transition: width 0.3s ease; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧪 Test Automation Report</h1>
            <p>Generated on ${new Date().toLocaleString()}</p>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${stats.passRate}%"></div>
            </div>
            <p>Success Rate: ${stats.passRate}%</p>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">${stats.totalFeatures}</div>
                <div class="stat-label">Features</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.totalScenarios}</div>
                <div class="stat-label">Scenarios</div>
            </div>
            <div class="stat-card passed">
                <div class="stat-value">${stats.passed}</div>
                <div class="stat-label">Passed</div>
            </div>
            <div class="stat-card failed">
                <div class="stat-value">${stats.failed}</div>
                <div class="stat-label">Failed</div>
            </div>
            <div class="stat-card skipped">
                <div class="stat-value">${stats.skipped}</div>
                <div class="stat-label">Skipped</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.duration}ms</div>
                <div class="stat-label">Duration</div>
            </div>
        </div>
        
        <div class="features-section">
            <div class="section-header">
                <h2>📋 Feature Results</h2>
            </div>
            <table class="features-table">
                <thead>
                    <tr>
                        <th>Feature Name</th>
                        <th>Scenarios</th>
                        <th>Passed</th>
                        <th>Failed</th>
                        <th>Skipped</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${featureRows}
                </tbody>
            </table>
        </div>
        
        <div class="footer">
            <p>Generated by Test Automation Framework • ${new Date().getFullYear()}</p>
        </div>
    </div>
</body>
</html>`;
}

// Cleanup functionality
export function cleanupOldReports(keepLatest = 5) {
  console.log('🧹 Cleaning up old test reports...');
  
  const reportsDir = path.join(process.cwd(), 'reports');
  const screenshotsDir = path.join(process.cwd(), 'screenshots');
  
  // Ensure directories exist
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }
  
  try {
    // Clean old HTML reports (keep only latest)
    const htmlFiles = fs.readdirSync(reportsDir)
      .filter(file => file.endsWith('.html') && file.startsWith('test-report-'))
      .map(file => ({
        name: file,
        path: path.join(reportsDir, file),
        time: fs.statSync(path.join(reportsDir, file)).mtime
      }))
      .sort((a, b) => b.time.getTime() - a.time.getTime());
    
    if (htmlFiles.length > keepLatest) {
      const filesToDelete = htmlFiles.slice(keepLatest);
      filesToDelete.forEach(file => {
        fs.unlinkSync(file.path);
        console.log(`  ❌ Deleted old report: ${file.name}`);
      });
    }
    
    // Clean old screenshots (older than 1 hour from non-current run)
    const screenshotFiles = fs.readdirSync(screenshotsDir)
      .filter(file => file.endsWith('.png'))
      .map(file => ({
        name: file,
        path: path.join(screenshotsDir, file),
        time: fs.statSync(path.join(screenshotsDir, file)).mtime
      }));
    
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const oldScreenshots = screenshotFiles.filter(file => file.time < oneHourAgo);
    
    oldScreenshots.forEach(file => {
      fs.unlinkSync(file.path);
      console.log(`  📸 Deleted old screenshot: ${file.name}`);
    });
    
    console.log(`✅ Cleanup complete. Kept ${Math.min(htmlFiles.length, keepLatest)} reports, removed ${oldScreenshots.length} old screenshots`);
    
  } catch (error) {
    console.warn('⚠️  Warning: Could not complete cleanup:', error instanceof Error ? error.message : String(error));
  }
}

export function cleanupAllReports() {
  console.log('🧹 Cleaning all previous test reports and screenshots...');
  
  const reportsDir = path.join(process.cwd(), 'reports');
  const screenshotsDir = path.join(process.cwd(), 'screenshots');
  
  try {
    // Remove all files in reports directory
    if (fs.existsSync(reportsDir)) {
      const reportFiles = fs.readdirSync(reportsDir);
      reportFiles.forEach(file => {
        const filePath = path.join(reportsDir, file);
        if (fs.statSync(filePath).isFile()) {
          fs.unlinkSync(filePath);
          console.log(`  ❌ Deleted: reports/${file}`);
        }
      });
    }
    
    // Remove all files in screenshots directory  
    if (fs.existsSync(screenshotsDir)) {
      const screenshotFiles = fs.readdirSync(screenshotsDir);
      screenshotFiles.forEach(file => {
        const filePath = path.join(screenshotsDir, file);
        if (fs.statSync(filePath).isFile()) {
          fs.unlinkSync(filePath);
          console.log(`  📸 Deleted: screenshots/${file}`);
        }
      });
    }
    
    // Recreate directories
    fs.mkdirSync(reportsDir, { recursive: true });
    fs.mkdirSync(screenshotsDir, { recursive: true });
    
    console.log('✅ All previous reports and screenshots cleaned successfully');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error instanceof Error ? error.message : String(error));
  }
}

// CLI support for npm run report
if (process.argv[2] === 'report') {
  generateEnhancedHTMLReport();
}
