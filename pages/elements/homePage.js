import { BasePage } from '../base.page.js';

export class HomePage extends BasePage {
  async openElements() {
    console.log('Opening Elements section');
    await this.client.runAction('Click on "Elements" card or button on the homepage');
    
    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  async openForms() {
    console.log('Opening Forms section');
    await this.client.runAction('Click on "Forms" card or button on the homepage');
    
    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  async verifyPageLoaded() {
    console.log('Verifying home page is loaded');
    await this.client.runAction('Verify that the DemoQA homepage with various category cards (Elements, Forms, etc.) is visible');
  }
}
