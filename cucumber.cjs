module.exports = {
  import: ['features/step_definitions/*.js'],
  format: [
    'progress-bar',
    'json:reports/cucumber_report.json'
  ],
  formatOptions: {
    snippetInterface: 'async-await'
  },
  publishQuiet: true,
  paths: ['features/elements.feature', 'features/forms.feature'],
  // Increase step timeout to handle AI action delays
  timeout: 60000, // 60 seconds timeout for steps
  // Ensure reports directory exists
  worldParameters: {
    reportDir: 'reports'
  }
};