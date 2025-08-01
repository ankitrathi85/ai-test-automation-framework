import { aiProvidersConfig } from '../config/ai-providers-config.js';
import { testConfig } from '../config/test-config.js';

export class AIProviderFactory {
  static getProvider() {
    switch (testConfig.aiProvider) {
      case 'groq':
        return aiProvidersConfig.groq;
      case 'openai':
        return aiProvidersConfig.openai;
      case 'anthropic':
        return aiProvidersConfig.anthropic;
      case 'aws':
        return aiProvidersConfig.aws;
      case 'azure':
        return aiProvidersConfig.azure;
      case 'google':
        return aiProvidersConfig.google;
      default:
        return aiProvidersConfig.groq;
    }
  }
}
export { aiProvidersConfig };
