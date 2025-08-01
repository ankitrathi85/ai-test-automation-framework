export const aiProvidersConfig = {
  groq: {
    apiKey: process.env.GROQ_API_KEY,
    model: 'llama-3-70b-8192',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions'
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-3.5-turbo',
    endpoint: 'https://api.openai.com/v1/chat/completions'
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: 'claude-3-haiku-20240307',
    endpoint: 'https://api.anthropic.com/v1/messages'
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  azure: {
    apiKey: process.env.AZURE_OPENAI_API_KEY,
    endpoint: process.env.AZURE_OPENAI_ENDPOINT
  },
  google: {
    apiKey: process.env.GOOGLE_GENAI_API_KEY
  }
};
