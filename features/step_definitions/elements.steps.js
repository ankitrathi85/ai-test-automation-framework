import { When, Then } from '@cucumber/cucumber';
import { testContext } from '../support/context.js';

console.log('✅ Elements step definitions loaded!');

When('I fill in the text box form with:', async function (dataTable) {
  console.log('📝 Filling in text box form...');
  
  const client = testContext.getClient();
  const rows = dataTable.rows();
  
  for (const row of rows) {
    const [field, value] = row;
    console.log(`  Filling ${field}: ${value}`);
    
    // More specific AI prompt for form filling
    await client.runAction(`Find the input field labeled "${field}" and enter the text "${value}". Look for input boxes, text areas, or form fields with this label.`, 15000);
    await new Promise(resolve => setTimeout(resolve, 800)); // Small delay between fields
  }
  
  console.log('✅ Text box form filled successfully');
});

Then('I should see the submitted information displayed', async function () {
  console.log('🔍 Verifying submitted information is displayed...');
  
  const client = testContext.getClient();
  
  // Wait for the results to appear
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // More specific verification prompt
  await client.runAction('Look for a section or area on the page that displays the submitted form information. This might be a results section, output area, or confirmation display.', 15000);
  
  console.log('✅ Submitted information verification completed');
});
