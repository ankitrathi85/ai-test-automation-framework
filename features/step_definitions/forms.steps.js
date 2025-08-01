import { When, Then } from '@cucumber/cucumber';
import { getDateYearsAgo } from '../../utils/test-helpers.js';
import { testContext } from '../support/context.js';

console.log('✅ Forms step definitions loaded!');

When('I fill in the student registration form with:', async function (dataTable) {
  console.log('📝 Filling in student registration form...');
  
  const client = testContext.getClient();
  const rows = dataTable.rows();
  
  for (const row of rows) {
    const [field, value] = row;
    let processedValue = value;
    
    // Handle special date processing
    if (field === 'Date of Birth' && value.includes('years ago from today')) {
      const yearsMatch = value.match(/(\d+)\s+years ago/);
      if (yearsMatch) {
        const years = parseInt(yearsMatch[1]);
        processedValue = getDateYearsAgo(years);
        console.log(`  Processing date: ${value} -> ${processedValue}`);
      }
    }
    
    console.log(`  Filling ${field}: ${processedValue}`);
    
    // Use improved AI prompts with specific instructions and timeouts
    if (field === 'Gender') {
      await client.runAction(`Find and select the gender option "${processedValue}". Look for radio buttons or dropdown with gender options.`, 15000);
    } else if (field === 'Date of Birth') {
      await client.runAction(`Find the date of birth field and enter the date "${processedValue}". This might be a date picker or text input field.`, 15000);
    } else if (field === 'Subjects') {
      await client.runAction(`Find the subjects field and enter or select "${processedValue}". This might be a multi-select dropdown or autocomplete field.`, 15000);
    } else if (field === 'Hobbies') {
      await client.runAction(`Find and select the hobby checkboxes for "${processedValue}". Look for checkbox options related to hobbies.`, 15000);
    } else if (field === 'State') {
      await client.runAction(`Find the state/region dropdown and select "${processedValue}".`, 15000);
    } else if (field === 'City') {
      await client.runAction(`Find the city dropdown and select "${processedValue}".`, 15000);
    } else {
      await client.runAction(`Find the input field labeled "${field}" and enter the text "${processedValue}". Look for text input, textarea, or form field with this label.`, 15000);
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000)); // Increased delay between fields
  }
  
  console.log('✅ Student registration form filled successfully');
});

Then('I should see the registration confirmation', async function () {
  console.log('🔍 Verifying registration confirmation...');
  
  const client = testContext.getClient();
  
  // Wait for the confirmation to appear
  await new Promise(resolve => setTimeout(resolve, 4000));
  
  // More specific verification prompt
  await client.runAction('Look for a registration confirmation modal, popup, or message that shows the submitted student information. This might be a success message or summary of entered data.', 15000);
  
  console.log('✅ Registration confirmation verification completed');
});
