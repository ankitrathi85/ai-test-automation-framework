// Simple script to validate your .env configuration
import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 Validating your .env configuration...\n');

let hasErrors = false;

// Check BrowserBase configuration
console.log('📱 BrowserBase Configuration:');
if (process.env.BROWSERBASE_API_KEY) {
  console.log('  ✅ BROWSERBASE_API_KEY is set');
} else {
  console.log('  ❌ BROWSERBASE_API_KEY is missing');
  hasErrors = true;
}

if (process.env.BROWSERBASE_PROJECT_ID) {
  console.log('  ✅ BROWSERBASE_PROJECT_ID is set');
} else {
  console.log('  ❌ BROWSERBASE_PROJECT_ID is missing');
  hasErrors = true;
}

// Check AI Provider configuration
console.log('\n🤖 AI Provider Configuration:');
const aiProvider = process.env.AI_PROVIDER || 'openai';
console.log(`  📝 AI_PROVIDER is set to: ${aiProvider}`);

switch (aiProvider) {
  case 'groq':
    if (process.env.GROQ_API_KEY) {
      console.log('  ✅ GROQ_API_KEY is set');
    } else {
      console.log('  ❌ GROQ_API_KEY is missing (required for AI_PROVIDER=groq)');
      hasErrors = true;
    }
    break;
    
  case 'openai':
    if (process.env.OPENAI_API_KEY) {
      console.log('  ✅ OPENAI_API_KEY is set');
    } else {
      console.log('  ❌ OPENAI_API_KEY is missing (required for AI_PROVIDER=openai)');
      hasErrors = true;
    }
    break;
    
  case 'anthropic':
    if (process.env.ANTHROPIC_API_KEY) {
      console.log('  ✅ ANTHROPIC_API_KEY is set');
    } else {
      console.log('  ❌ ANTHROPIC_API_KEY is missing (required for AI_PROVIDER=anthropic)');
      hasErrors = true;
    }
    break;
    
  default:
    console.log(`  ⚠️  Unknown AI_PROVIDER: ${aiProvider}`);
    console.log('     Supported providers: groq, openai, anthropic');
    hasErrors = true;
}

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ Configuration has errors!');
  console.log('\n💡 To fix:');
  console.log('1. Create/update your .env file');
  console.log('2. Get API keys from:');
  console.log('   - BrowserBase: https://browserbase.com');
  console.log('   - Groq (free): https://console.groq.com');
  console.log('   - OpenAI: https://platform.openai.com');
  console.log('   - Anthropic: https://console.anthropic.com');
  console.log('3. Run this script again: node validate-env.js');
} else {
  console.log('✅ Configuration looks good!');
  console.log('\n🚀 You can now run your tests:');
  console.log('   npm run test:elements');
  console.log('   npm run test:forms');
}
console.log('='.repeat(50));
