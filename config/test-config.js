import dotenv from 'dotenv';
dotenv.config();

export const testConfig = {
  browser: process.env.BROWSER || 'chrome', // Changed from 'headless' to 'chrome' for visibility
  baseUrl: process.env.BASE_URL || 'https://demoqa.com/',
  aiProvider: process.env.AI_PROVIDER || 'groq',
};
