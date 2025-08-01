import { Given, When, Then, After } from '@cucumber/cucumber';
import { StagehandClient } from '../../utils/stagehand-client.js';
import { takeScreenshot } from '../../utils/test-helpers.js';
import { testContext } from '../support/context.js';

console.log('✅ Common step definitions loaded!');

// Navigation steps
Given('I navigate to {string}', async function (url) {
  console.log(`🌐 Navigating to: ${url}`);
  
  let client = testContext.getClientSafe(); // Use safe method that doesn't throw
  if (!client) {
    console.log('Creating new StagehandClient...');
    client = new StagehandClient();
    testContext.setClient(client);
    
    console.log('Initializing StagehandClient...');
    await client.init();
  }
  
  console.log('Opening URL...');
  await client.open(url);
  
  console.log('✅ Navigation completed');
});

// Common click actions
When('I click on {string}', async function (element) {
  console.log(`🖱️ Clicking on: ${element}`);
  
  const client = testContext.getClient();
  
  // More specific AI prompt with better instructions
  await client.runAction(`Find and click on the clickable element that contains the text "${element}". Look for buttons, links, or clickable areas with this text.`, 20000);
  await new Promise(resolve => setTimeout(resolve, 1000)); // Wait after click
  
  console.log(`✅ Clicked on: ${element}`);
});

When('I click on {string} in the left panel', async function (element) {
  console.log(`🖱️ Clicking on "${element}" in the left panel`);
  
  const client = testContext.getClient();
  
  // More specific prompt for left panel navigation
  await client.runAction(`In the left sidebar or left navigation panel, find and click on "${element}". This should be a menu item or navigation link.`, 20000);
  await new Promise(resolve => setTimeout(resolve, 1000)); // Wait after click
  
  console.log(`✅ Clicked on: ${element} in left panel`);
});

When('I click submit', async function () {
  console.log('🖱️ Clicking submit button');
  
  const client = testContext.getClient();
  
  // More specific prompt for submit button
  await client.runAction('Find and click the Submit button on the form. Look for a button with text "Submit" or similar submit action.', 15000);
  await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for submission
  
  console.log('✅ Submit button clicked');
});

// Cleanup after scenarios
After(async function () {
  console.log('🧹 Cleaning up browser client...');
  
  try {
    const client = testContext.getClientSafe(); // Use safe method that doesn't throw
    if (client) {
      console.log('Closing StagehandClient...');
      await client.close();
      testContext.clearClient();
      console.log('✅ Browser client closed successfully');
    } else {
      console.log('No client to cleanup');
    }
  } catch (error) {
    console.error('Error during cleanup:', error);
    // Force clear the client even if cleanup fails
    testContext.clearClient();
  }
});
