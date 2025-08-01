
# 🧪 AI-Powered Test Automation Framework

## Overview
A modern, production-ready test automation framework using [Stagehand](https://github.com/browserbase/stagehand) for AI-powered browser automation with OpenAI integration.

## ✨ Features
- 🤖 **AI-Powered Automation**: Stagehand with OpenAI for intelligent browser interactions
- 🥒 **BDD Testing**: Cucumber.js framework with Gherkin syntax  
- ⚡ **JavaScript/ESM**: Modern ES modules with clean architecture
- 🎯 **Natural Language Actions**: Click, fill, and interact using plain English
- 📊 **Enhanced Reporting**: Beautiful HTML reports with statistics and styling
- 📸 **Screenshot Support**: Automatic capture during test execution
- 🧹 **Smart Cleanup**: Automated cleanup with configurable retention
- � **Multiple Providers**: OpenAI tested and working, extensible for others

## 🚀 Quick Start

### Prerequisites
- Node.js (version 18 or higher)
- npm package manager
- OpenAI API key

### Installation
1. **Clone and install dependencies:**
   ```bash
   git clone https://github.com/ankitrathi85/ai-test-automation-framework.git
   cd ai-test-automation-framework
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env and add your OpenAI API key:
   # OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Validate configuration:**
   ```bash
   npm run validate-env
   ```

4. **Run tests:**
   ```bash
   npm run test:elements  # Test element interactions
   npm run test:forms     # Test form submissions
   npm run test           # Run all tests
   ```

## 📁 Project Structure
```
llmFramework/
├── features/                    # Cucumber BDD features and step definitions
│   ├── elements.feature        # Element interaction tests  
│   ├── forms.feature           # Form submission tests
│   ├── step_definitions/       # JavaScript step implementations
│   │   ├── common.steps.js     # Shared step definitions
│   │   ├── elements.steps.js   # Element-specific steps
│   │   └── forms.steps.js      # Form-specific steps
│   └── support/                # Test support files
├── utils/                      # Core utilities and helpers
│   ├── stagehand-client.js     # AI browser automation client
│   ├── test-helpers.js         # Enhanced reporting and utilities
│   ├── ai-provider-factory.js  # AI provider configuration
│   └── reportGenerator.js      # Backup reporting system
├── reports/                    # Generated test reports (auto-created)
├── screenshots/                # Test screenshots (auto-created)
├── .env                        # Environment variables (not committed)
├── .env.example               # Environment template
├── cucumber.cjs               # Cucumber configuration
├── cleanup.js                 # Cleanup utility script
└── package.json              # Dependencies and scripts
```

## 📋 Available Scripts
| Command | Description |
|---------|-------------|
| `npm run validate-env` | Validate environment configuration and API keys |
| `npm run test` | Run all tests (auto-cleanup + auto-report) |
| `npm run test:elements` | Run element interaction tests only |
| `npm run test:forms` | Run form submission tests only |
| `npm run test:headless` | Run tests in headless browser mode |
| `npm run test:debug` | Run tests with detailed debug output |
| `npm run clean` | Remove all previous reports and screenshots |
| `npm run clean:reports` | Remove only report files (.html, .json) |
| `npm run clean:screenshots` | Remove only screenshot files |
| `npm run clean:old` | Keep latest 5 reports, remove older ones |
| `npm run report` | Generate enhanced HTML report |
| `npm run report:backup` | Generate simple backup HTML report |

## 🤖 AI Integration
This framework uses [Stagehand](https://github.com/browserbase/stagehand) for AI-powered browser automation with OpenAI.

### How It Works
- **Natural Language Actions**: Interact with web elements using plain English
- **Smart Element Detection**: AI automatically finds elements without complex selectors  
- **Context Awareness**: Understands page context for intelligent interactions
- **OpenAI Integration**: Leverages GPT models for reliable automation

### Example Usage in Step Definitions
```javascript
// Navigate and interact naturally
await client.act('click on the Submit button');
await client.act('fill in the email field with john@example.com');
await client.act('select "Canada" from the country dropdown');
await client.act('click on the checkbox next to "I agree"');
```

### Supported AI Provider
- **OpenAI** ✅ (tested and working)
  ```bash
  # In .env file
  OPENAI_API_KEY=your_openai_api_key_here
  AI_PROVIDER=openai
  ```

## 🧪 Test Coverage
### Element Tests (`elements.feature`)
- ✅ Navigation to demo websites
- ✅ Element clicking and interaction
- ✅ Text box form filling with multiple fields
- ✅ Form submission and validation
- ✅ Dynamic content verification

### Form Tests (`forms.feature`)  
- ✅ Complex form field completion
- ✅ File upload handling
- ✅ Multi-step form workflows
- ✅ Form validation testing
- ✅ Success message verification

## 📊 Enhanced Reporting System

### 🌟 Main Enhanced Reports
Generate with: `npm run report`
- 🎨 **Professional Styling**: Modern CSS with gradients and responsive design
- 📊 **Detailed Statistics**: Pass/fail ratios, success rates, execution timing
- � **Progress Visualization**: Interactive progress bars and status indicators
- 🎯 **Feature Breakdown**: Per-feature statistics with color-coded results
- ⏱️ **Performance Metrics**: Duration tracking and timing analysis

### 📋 Backup Reports  
Generate with: `npm run report:backup`
- ✅ **Simple Format**: Basic HTML with essential statistics
- � **Raw Data Display**: Complete JSON test data for debugging
- 🔧 **Lightweight**: Fast generation without complex processing
- ⚡ **Fallback Option**: When enhanced reporting isn't available

### Generated Files
```
reports/
├── cucumber_report.json           # Raw test data (JSON format)
├── test-report-[timestamp].html   # Timestamped enhanced report
├── latest-report.html             # Always current enhanced report
└── simple_report.html             # Backup simple report
```

## 🚀 Usage Examples

### Basic Test Execution
```bash
# Complete workflow with cleanup and reporting
npm test                    # Run all tests + cleanup + report
npm run test:elements       # Run only element tests  
npm run test:forms          # Run only form tests

# Alternative execution modes
npm run test:headless       # Run without visible browser
npm run test:debug          # Run with detailed console output
```

### Cleanup Management
```bash
# Smart cleanup (recommended)
npm run clean:old           # Keep latest 5 reports, remove older

# Complete cleanup
npm run clean               # Remove all reports and screenshots

# Selective cleanup  
npm run clean:reports       # Remove only HTML/JSON report files
npm run clean:screenshots   # Remove only screenshot files

# Manual cleanup with options
node cleanup.js old 3       # Keep only 3 latest reports
node cleanup.js all         # Remove everything
```

### Report Generation
```bash
# Enhanced reporting (recommended)
npm run report              # Generate beautiful HTML report

# Backup reporting
npm run report:backup       # Generate simple fallback report

# Direct script execution
node utils/test-helpers.js report    # Direct enhanced report generation
```

## 🛠️ Development

### Adding New Test Features
1. **Create feature file**: Add new `.feature` file in `features/` directory
2. **Add step definitions**: Create corresponding `.steps.js` file in `features/step_definitions/`
3. **Use shared context**: Access browser client via `testContext` from `common.steps.js`

### Step Definition Template
```javascript
import { Given, When, Then } from '@cucumber/cucumber';
import { testContext } from './common.steps.js';

Given('I do something specific', async function() {
  const { client } = testContext;
  await client.act('describe the action in natural language');
});

When('I interact with an element', async function() {
  const { client } = testContext;
  await client.act('click on the specific button');
});

Then('I should see the expected result', async function() {
  const { client } = testContext;
  // Add assertions here
});
```

### Framework Architecture
- **Modular Design**: Separate utilities for different concerns
- **Shared Context**: Browser client shared across all step definitions
- **Error Handling**: Automatic screenshot capture on failures
- **Cleanup Integration**: Built-in cleanup before each test run

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`  
3. Follow JavaScript ES module patterns
4. Add tests for new features
5. Update documentation
6. Ensure all tests pass: `npm test`
7. Submit a Pull Request

## 🚀 GitHub Setup Instructions

### 1. Initialize Git Repository
```bash
cd llmFramework
git init
git add .
git commit -m "Initial commit: AI-powered test automation framework"
```

### 2. Create GitHub Repository
1. Go to [GitHub](https://github.com/new)
2. Create a new repository (e.g., `ai-test-automation-framework`)
3. **Important**: Do NOT initialize with README (you already have one)

### 3. Connect and Push
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 4. Verify Security
- ✅ `.env` file is in `.gitignore` (API keys protected)
- ✅ `node_modules/` excluded from repository  
- ✅ `reports/` and `screenshots/` excluded (generated content)

## 📝 License
This project is licensed under the MIT License.

## 🚨 Troubleshooting

### Common Issues

#### ❌ **Environment Setup**
```bash
# Check configuration
npm run validate-env               # Verify API keys and setup
cat .env                          # Review environment variables
node --version                    # Ensure Node.js >= 18

# Fix dependencies
npm install                       # Reinstall packages
npm audit fix                     # Fix security issues
```

#### ❌ **Test Execution Failures**
```bash
# Browser connection issues
npm run test:headless             # Try headless mode
DEBUG=true npm run test:debug     # Enable detailed logging

# Step definition errors  
./node_modules/.bin/cucumber-js --dry-run   # Validate step definitions
```

#### ❌ **Report Generation Problems**
```bash
# Enhanced report fails
ls -la reports/                   # Check if JSON exists
npm run report:backup             # Try backup reporting
cat reports/cucumber_report.json  # Inspect raw data

# Permission issues
chmod -R 755 reports/ screenshots/   # Fix permissions
```

### 💡 Quick Fixes
- **API Key Issues**: Verify `OPENAI_API_KEY` in `.env` file
- **Browser Hanging**: Check internet connection and API quotas
- **Missing Reports**: Ensure tests ran successfully first  
- **Screenshot Failures**: Check disk space and write permissions
- **Module Errors**: Run `npm install` to ensure dependencies

### 🔗 Useful Links
- [Stagehand Documentation](https://github.com/browserbase/stagehand)
- [Cucumber.js Documentation](https://cucumber.io/docs/cucumber/)
- [OpenAI API Documentation](https://platform.openai.com/docs)

---
**Made with ❤️ for intelligent test automation**
