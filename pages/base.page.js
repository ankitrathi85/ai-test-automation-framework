import { StagehandClient } from '../utils/stagehand-client.js';

export class BasePage {
  constructor(client) {
    this.client = client;
  }

  async open(url) {
    console.log(`Opening URL: ${url}`);
    await this.client.open(url);
    
    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  async screenshot(name) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `screenshots/${name}-${timestamp}.png`;
    console.log(`Taking screenshot: ${filename}`);
    await this.client.screenshot(filename);
  }

  async getTitle() {
    return await this.client.getTitle();
  }

  async waitForElement(description) {
    console.log(`Waiting for element: ${description}`);
    await this.client.runAction(`Wait for "${description}" to be visible`);
  }

  async verifyElementVisible(description) {
    console.log(`Verifying element is visible: ${description}`);
    await this.client.runAction(`Verify that "${description}" is visible`);
  }

  async verifyElementNotVisible(description) {
    console.log(`Verifying element is not visible: ${description}`);
    await this.client.runAction(`Verify that "${description}" is not visible`);
  }

  async verifyTextPresent(text) {
    console.log(`Verifying text is present: ${text}`);
    await this.client.runAction(`Verify that the text "${text}" is present on the page`);
  }
}
