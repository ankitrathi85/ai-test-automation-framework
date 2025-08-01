import { Stagehand } from '@browserbasehq/stagehand';
import { aiProvidersConfig } from './ai-provider-factory.js';
import { testConfig } from '../config/test-config.js';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

export class StagehandClient {
  constructor() {
    this.stagehand = null;
    this.page = null;
    this.isInitialized = false;
  }

  async init() {
    if (this.isInitialized) {
      console.log('StagehandClient already initialized');
      return;
    }

    try {
      const { aiProvider, browser } = testConfig;
      const browserMode = browser;
      const isDebug = process.env.DEBUG === 'true' || process.env.NODE_ENV === 'development';
      const useLocal = true; // Always use local browser for reliability
      
      console.log(`Initializing with AI provider: ${aiProvider}`);
      console.log(`Browser mode: ${browserMode}`);
      console.log(`Debug mode: ${isDebug}`);
      console.log(`Use local browser: ${useLocal}`);

      let stagehandConfig = {
        env: useLocal ? 'LOCAL' : 'BROWSERBASE',
        headless: browserMode === 'headless',
        debugDom: isDebug,
        verbose: isDebug ? 2 : 1,
        browserOptions: {
          args: [
            '--start-fullscreen',
            '--start-maximized',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-web-security',
            '--allow-running-insecure-content'
          ]
        }
      };

      // Set environment variables for AI provider
      const modelConfig = this.getModelConfig(aiProvider);
      if (!modelConfig.apiKey) {
        throw new Error(`API key not found for provider: ${aiProvider}. Please check your .env file.`);
      }

      // Configure based on provider
      if (aiProvider === 'openai') {
        process.env.LLM_PROVIDER = 'openai';
        process.env.MODEL_NAME = modelConfig.modelName;
        process.env.OPENAI_API_KEY = modelConfig.apiKey;
      } else {
        // For other providers, try setting as environment variables
        process.env.LLM_PROVIDER = aiProvider;
        process.env.MODEL_NAME = modelConfig.modelName;
        if (aiProvider === 'groq') {
          process.env.GROQ_API_KEY = modelConfig.apiKey;
        }
      }

      console.log(`AI Provider: ${aiProvider}`);
      console.log(`Using model: ${modelConfig.modelName}`);
      console.log(`API key found: ${modelConfig.apiKey ? 'Yes' : 'No'}`);
      console.log(`API key length: ${modelConfig.apiKey ? modelConfig.apiKey.length : 0}`);

      console.log('🔧 Creating Stagehand instance...');
      this.stagehand = new Stagehand(stagehandConfig);
      
      console.log('🔧 Initializing Stagehand...');
      await this.stagehand.init();
      
      console.log('🔧 Getting page reference...');
      this.page = this.stagehand.page;
      this.isInitialized = true;
      
      // Set fullscreen viewport immediately after initialization
      if (this.page) {
        await this.page.setViewportSize({ width: 1920, height: 1080 });
        console.log('Browser initialized with fullscreen viewport (1920x1080)');
      }
      
      console.log(`✅ StagehandClient initialized successfully with ${aiProvider} provider`);
    } catch (error) {
      console.error('Failed to initialize StagehandClient:', error);
      this.isInitialized = false;
      this.page = null;
      throw error;
    }
  }

  getModelConfig(provider) {
    switch (provider.toLowerCase()) {
      case 'groq':
        return {
          modelName: 'llama-3.1-8b-instant', // Remove groq/ prefix
          apiKey: process.env.GROQ_API_KEY || aiProvidersConfig.groq?.apiKey
        };
      case 'openai':
        return {
          modelName: 'gpt-4',
          apiKey: process.env.OPENAI_API_KEY || aiProvidersConfig.openai?.apiKey
        };
      case 'anthropic':
        return {
          modelName: 'claude-3-sonnet-20240229',
          apiKey: process.env.ANTHROPIC_API_KEY || aiProvidersConfig.anthropic?.apiKey
        };
      case 'aws':
        return {
          modelName: 'anthropic.claude-3-sonnet-20240229-v1:0',
          apiKey: process.env.AWS_ACCESS_KEY_ID || aiProvidersConfig.aws?.accessKeyId
        };
      case 'azure':
        return {
          modelName: 'gpt-4',
          apiKey: process.env.AZURE_OPENAI_API_KEY || aiProvidersConfig.azure?.apiKey
        };
      case 'google':
        return {
          modelName: 'gemini-pro',
          apiKey: process.env.GOOGLE_GENAI_API_KEY || aiProvidersConfig.google?.apiKey
        };
      default:
        throw new Error(`Unsupported AI provider: ${provider}`);
    }
  }

  async open(url, retries = 2) {
    if (!this.page || !this.isInitialized) {
      throw new Error('StagehandClient not initialized. Call init() first.');
    }
    
    let lastError = null;
    
    for (let attempt = 1; attempt <= retries + 1; attempt++) {
      try {
        console.log(`Attempting to navigate to ${url} (attempt ${attempt}/${retries + 1})`);
        
        // Check if page is still valid
        if (!this.page || this.page.isClosed()) {
          throw new Error('Page context is closed, need to reinitialize');
        }
        
        await this.page.goto(url, { 
          waitUntil: 'domcontentloaded',
          timeout: 60000  // Increased timeout to 60 seconds
        });
        
        // Ensure fullscreen after navigation
        await this.ensureFullscreen();
        
        // Additional wait for the page to be fully interactive
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log(`✅ Successfully navigated to ${url}`);
        return;
        
      } catch (error) {
        console.error(`Navigation attempt ${attempt} failed:`, error);
        lastError = error;
        
        if (attempt <= retries) {
          console.log(`Retrying in 3 seconds...`);
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          // Try to reinitialize if the page context is closed
          const errorMessage = error instanceof Error ? error.message : String(error);
          if (errorMessage.includes('closed') || errorMessage.includes('Target page')) {
            try {
              console.log('Attempting to reinitialize browser...');
              await this.reinitialize();
            } catch (reinitError) {
              console.error('Failed to reinitialize:', reinitError);
            }
          }
        }
      }
    }
    
    console.error('Failed to navigate to URL after all attempts:', url);
    throw lastError;
  }

  async ensureFullscreen() {
    try {
      if (this.page && !this.page.isClosed()) {
        await this.page.setViewportSize({ width: 1920, height: 1080 });
        console.log('🖥️ Browser set to fullscreen (1920x1080)');
      }
    } catch (error) {
      console.warn('Failed to set fullscreen:', error);
    }
  }

  async reinitialize() {
    console.log('Reinitializing StagehandClient...');
    this.isInitialized = false;
    this.page = null;
    this.stagehand = null;
    await this.init();
  }

  async runAction(prompt, timeoutMs = 30000) {
    if (!this.page || !this.isInitialized) {
      throw new Error('StagehandClient not initialized. Call init() first.');
    }
    
    try {
      console.log(`🤖 AI Action: ${prompt}`);
      
      // Check if page is still valid
      if (this.page.isClosed()) {
        throw new Error('Page context is closed');
      }
      
      // Add timeout to the AI action
      const result = await Promise.race([
        this.page.act(prompt),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error(`AI action timed out after ${timeoutMs}ms: ${prompt}`)), timeoutMs)
        )
      ]);
      
      console.log(`✅ AI Action completed successfully`);
      return result;
    } catch (error) {
      console.error(`❌ AI Action failed: ${prompt}`, error);
      
      // Take a screenshot for debugging
      try {
        await this.screenshot(`debug-failed-action-${Date.now()}.png`);
        console.log('📸 Debug screenshot taken for failed action');
      } catch (screenshotError) {
        console.warn('Failed to take debug screenshot:', screenshotError);
      }
      
      throw error;
    }
  }

  // Helper method to wait for element and perform basic actions as fallback
  async runActionWithFallback(prompt, fallbackSelector, fallbackAction) {
    try {
      return await this.runAction(prompt, 20000);
    } catch (error) {
      console.warn(`Primary AI action failed, attempting fallback...`);
      
      if (fallbackSelector && fallbackAction) {
        try {
          switch (fallbackAction) {
            case 'click':
              await this.page.click(fallbackSelector, { timeout: 10000 });
              console.log(`✅ Fallback click on ${fallbackSelector} successful`);
              break;
            case 'fill':
              const value = prompt.match(/"([^"]+)"/)?.[1] || '';
              await this.page.fill(fallbackSelector, value, { timeout: 10000 });
              console.log(`✅ Fallback fill on ${fallbackSelector} successful`);
              break;
            default:
              throw new Error(`Unknown fallback action: ${fallbackAction}`);
          }
        } catch (fallbackError) {
          console.error(`Fallback action also failed:`, fallbackError);
          throw error; // Throw original error
        }
      } else {
        throw error;
      }
    }
  }

  async screenshot(path) {
    if (!this.page) {
      throw new Error('StagehandClient not initialized. Call init() first.');
    }
    
    try {
      await this.page.screenshot({ path, fullPage: true });
    } catch (error) {
      console.error('Failed to take screenshot:', error);
      throw error;
    }
  }

  async screenshotBuffer() {
    if (!this.page) {
      throw new Error('StagehandClient not initialized. Call init() first.');
    }
    
    try {
      return await this.page.screenshot({ fullPage: true });
    } catch (error) {
      console.error('Failed to take screenshot buffer:', error);
      throw error;
    }
  }

  async maximizeBrowser() {
    if (!this.page) {
      throw new Error('StagehandClient not initialized. Call init() first.');
    }
    
    try {
      // Set viewport to full screen size
      await this.page.setViewportSize({ width: 1920, height: 1080 });
      console.log('Browser window maximized to 1920x1080');
    } catch (error) {
      console.warn('Failed to maximize browser window:', error);
      // Don't throw - this is not critical
    }
  }

  // Helper method to check if client is ready
  isReady() {
    return this.isInitialized && this.page !== null;
  }

  async close() {
    if (this.stagehand) {
      try {
        await this.stagehand.close();
        console.log('StagehandClient closed successfully');
      } catch (error) {
        console.error('Error closing StagehandClient:', error);
      } finally {
        this.stagehand = null;
        this.page = null;
        this.isInitialized = false;
      }
    }
  }
}
