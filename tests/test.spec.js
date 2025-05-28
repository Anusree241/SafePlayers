import { test, expect } from '@playwright/test';
import {
  login,
  ClubContact,
  verifyContainsText,
  clickTab,
  clickButton,
  verifyTextboxVisible,
  verifyValidationMessage,
  fillTextboxAndVerify,
  verifyStatusInLastColumn,
  getRowData,
  currentDate,
  onboardClubContact,
  verifyReInviteModalUI,
  countClubDropdownOptions

} from '../club contact functions/club contact functions';

import {
  loginData,
  invalidInputData,
  inviteContactData,
  reinviteContactData,
  cancelreinviteContactData,
  reinviteDiffContactData
} from '../club contact test data/club contact test data';

let page;     // shared page across tests 
let context;

test.beforeAll(async ({ browser }) => {

  // Create a new context and page manually
  context = await browser.newContext();
  page = await context.newPage();

  // Perform login and navigation steps
  await login(page, loginData.url, loginData.email, loginData.password);

  // Navigate to club contact page
  await ClubContact(page);
});

// Test Case - 1 [ Verify UI of Club contact page ]
test('Verify Club Contacts page elements - UI @smoke', async () => {

  // Verify main heading and description
  await verifyContainsText(page.getByRole('main'), 'Club Contacts');
  await verifyContainsText(page.getByRole('main'), 'Overview all the Club contacts');

  // Verify Onboard button
  await verifyContainsText(page.getByRole('main'), 'Onboard');

  // Verify Members and Invites tabs
  await verifyContainsText(page.getByRole('group'), 'Members');
  await verifyContainsText(page.getByRole('group'), 'Invites');

  // Verify Members tab headers
  await verifyContainsText(page.locator('thead'), 'Name');
  await verifyContainsText(page.locator('thead'), 'Email');
  await verifyContainsText(page.locator('thead'), 'Title');
  await verifyContainsText(page.locator('thead'), 'Club');

   // Navigate to Invites tab
  await clickTab(page, 'Invites');

  // Verify Invites tab headers
  await verifyContainsText(page.getByRole('row'), 'Name');
  await verifyContainsText(page.getByRole('row'), 'Email');
  await verifyContainsText(page.getByRole('row'), 'Club');
  await verifyContainsText(page.getByRole('row'), 'Invited On');

  //Verify presence of status filter
  await verifyContainsText(page.getByRole('row'), 'Status');

  // Verify default status filter value
  await verifyContainsText(page.getByRole('main'), 'All');
  console.log("Club Contacts Page Elements are verified");
 });

// Test Case -2 [ Verify UI of Onboard Club Contact Modal ]
test('Verify UI of Onboard Club Contact modal @smoke', async () => {

  // Navigate to Onboard club contact modal
  await clickButton(page, 'Onboard');

  // Verify modal heading and form text
  await verifyContainsText(page.locator('h5'), 'Onboard a new Club Contact');
  await verifyContainsText(page.locator('form'), 'New Club Contact');
  await verifyContainsText(page.locator('form'), 'Provide details');

  // Verify textboxes in the form
  await verifyTextboxVisible(page, 'Name');
  await verifyTextboxVisible(page, 'Email');

  // Verify the visibility of Club and Club Title dropdown
  const clubTextbox = page.locator('form').getByRole('textbox', { name: 'Club' }).first();
  await expect(clubTextbox).toBeVisible();
  await verifyTextboxVisible(page, 'Club Title');

  // Verify Submit button inside the form
  await expect(page.locator('form div').filter({ hasText: 'Submit' })).toBeVisible();

  // Verify Close button presence
  await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
  await clickButton(page, 'Close');
  await verifyContainsText(page.getByRole('main'), 'Club Contacts');
  console.log('Onboard Club contact Modal UI verified');
});

// Test case - 3 [ Validation message for mandatory fields ]
test('Validation messages for mandatory fields', async () => {

  // Navigate to Onboard club contact modal
  await clickButton(page, 'Onboard');

  // Verify required input fields are visible
  await verifyTextboxVisible(page, 'Name');
  await verifyTextboxVisible(page, 'Email');
  const clubTextbox = page.locator('form').getByRole('textbox', { name: 'Club' }).first();
  await expect(clubTextbox).toBeVisible();
  await verifyTextboxVisible(page, 'Club Title');

  // Click Submit button without entering data
  await clickButton(page, 'Submit');

  // Verify validation messages appear
  await verifyValidationMessage(page, 'Name cannot be empty');
  await verifyValidationMessage(page, 'Email cannot be empty');
  await verifyValidationMessage(page, 'Club cannot be empty');
  await verifyValidationMessage(page, 'Title cannot be empty');

  // Close the modal 
  await clickButton(page, 'Close');
  await verifyContainsText(page.getByRole('main'), 'Club Contacts');
  console.log('Mandatory field validations are displayed and user is on club contact page');
});

// Test Case -4 [ Validation messages for invalid input ]
test('Validation messages for invalid input', async () => {

  // Navigate to Onboard club contact modal
  await clickButton(page, 'Onboard');

  // Use test data for invalid inputs
  await fillTextboxAndVerify(page, 'Name', invalidInputData.invalidName);
  await fillTextboxAndVerify(page, 'Email', invalidInputData.invalidEmail);

  // Click Submit button
  await clickButton(page, 'Submit');

  // Verify validation messages
  await verifyValidationMessage(page, 'Name is Invalid.');
  await verifyValidationMessage(page, 'Invalid email address');
  await verifyValidationMessage(page, 'Club cannot be empty');
  await verifyValidationMessage(page, 'Title cannot be empty');

  // Close the onboard modal
  await clickButton(page, 'Close');
  console.log('Invalid field validation messages are displayed');
});

// Test case -5 [ Inviting a club contact ]
test('Inviting a club contact @smoke', async () => {
  
  // Navigate to Onboard club contact modal and enter the data 
  await clickButton(page, 'Onboard');

  // Count club and club title options
  const clubOptionsCount = await countClubDropdownOptions(page, 'Club');
  const clubTitleOptionsCount = await countClubDropdownOptions(page, 'Club Title');
  
  if(clubOptionsCount > 0 && clubTitleOptionsCount > 0){

  // Assign club and club title values to variables  
  var club = inviteContactData.club;
  var clubTitle = inviteContactData.clubTitle;

  // Fill the onboard modal and return the selected club and club title options 
  await onboardClubContact(page, inviteContactData, club, clubTitle);

  // Check if the club contact was already invited 
  const button = page.getByRole('button', { name: 'Proceed' });
  let isVisible = false;
  try {
    await button.waitFor({ state: 'visible', timeout: 20000 });
    isVisible = await button.isVisible();
  } catch (error) {
    console.log("Re Invite modal did not appear within 20 seconds.");
  }
  if (isVisible) {
    console.log("Club contact was already invited for the first time and is being re invited to the same club in the above steps for second time. So try with a new club or email for inviting a club contact for the first time!");

    // Close the Re Invite modal
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await clickButton(page, 'Cancel');

    // User lands on Onboard a new club contact modal 
    await expect(page.getByRole('heading', { name: 'Onboard a new Club Contact' })).toBeVisible();

    // Close the onboard new club contact modal 
    await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
    await clickButton(page, 'Close');
    await verifyContainsText(page.getByRole('main'), 'Club Contacts');
  } 
  else {

    // Navigate to Invites tab
    await clickTab(page, 'Invites');
    const allRows = await getRowData(page);
    console.log(allRows);
    const todaysdate = currentDate();
    const expectedRow = {
        name: inviteContactData.name,
        email: inviteContactData.email,
        club: inviteContactData.club,
        date: todaysdate,
        status: 'Pending'
      };
    console.log(expectedRow);
    const isMatchFound = allRows.some(row =>
        Object.entries(expectedRow).every(([key, val]) => row[key] === val)
      );
    console.log(isMatchFound ? 'Invite sent for the club contact' : 'Error - Invite is not sent, Try again!');
  }
  }
  else{
    console.log("Either club or club title options are not found to send the invite");
  }
});

// Test Case -6 [ Status filter functionality ] 
test('Status filter functionality', async () => {

    // Navigate to Invites tab
    await clickTab(page, 'Invites');
  
    // Click "All" filter button and select "Pending"
    await clickButton(page, 'All');
    await clickButton(page, 'Pending', true);
  
    // Verify each row's last column contains "Pending"
    await verifyStatusInLastColumn(page, 'tbody', 'Pending');
  
    // Select "Expired" filter option
    await clickButton(page, 'Pending', true);
    await clickButton(page, 'Expired', true);
  
    // Verify each row's last column contains "Expired"
    await verifyStatusInLastColumn(page, 'tbody', 'Expired');
    console.log('Status filter functionality verified');

    await clickButton(page, 'Expired', true);
    await clickButton(page, 'All', true);
    console.log('Status filter functionality verified');
  
});

// Test Case -7 & 8 [ Re-invite club contact to same club and Verify the UI of Re Invite Modal ] 
test('Re-inviting a club contact to same club and verify UI @smoke', async () => {
  
  // Navigate to Onboard club contact modal and enter the data 
  await clickButton(page, 'Onboard');

  // Count club and club title options
  const clubOptionsCount = await countClubDropdownOptions(page, 'Club');
  const clubTitleOptionsCount = await countClubDropdownOptions(page, 'Club Title');

  if(clubOptionsCount > 0 && clubTitleOptionsCount > 0){
  // Generate random indices 
  var club = reinviteContactData.club;
  var clubTitle = reinviteContactData.clubTitle;
  // Fill the onboard modal and return the selected club and club title options 
  await onboardClubContact(page, reinviteContactData, club, clubTitle);
  console.log(club, clubTitle);

  // Check if the club contact was already invited 
  const button = page.getByRole('button', { name: 'Proceed' });
  let isVisible = false;
  try {
    await button.waitFor({ state: 'visible', timeout: 20000 });
    isVisible = await button.isVisible();
  } catch (error) {
    console.log("Re Invite modal did not appear within 20 seconds.");
  }
  if (isVisible) {
    await verifyReInviteModalUI(page,reinviteContactData);

    // Click on Proceed
    await expect(page.getByRole('button', { name: 'Proceed' })).toBeVisible();
    await page.getByRole('button', { name: 'Proceed' }).click();
    
    const allRows = await getRowData(page);
    const todaysdate = currentDate();
    const expectedRow = {
        name: reinviteContactData.name,
        email: reinviteContactData.email,
        club: reinviteContactData.club,
        date: todaysdate,
        status: 'Pending'
      };
    const isMatchFound = allRows.some(row =>
      Object.entries(expectedRow).every(([key, val]) => row[key] === val)
    );
    console.log(isMatchFound ? 'Re Invite is sent' : 'Error - Re Invite is not sent');
    const previousRow = {
        name: reinviteContactData.name,
        email: reinviteContactData.email,
        club: reinviteContactData.club,
        status: 'Expired'
    }
    const isMatchFound2 = allRows.some(row =>
        Object.entries(previousRow).every(([key, val]) => row[key] === val)
      );
      console.log(isMatchFound2 ? 'Previous Invite expired' : 'Error - Previous invite is not expired');
  } 
  else {

    // Re - invite the club contact 
    var club = reinviteContactData.club;
    var clubTitle = reinviteContactData.clubTitle;
    await clickButton(page, 'Onboard');
    await onboardClubContact(page, reinviteContactData, club, clubTitle);
    
    // Check if the Re invite modal is opened 

    await verifyReInviteModalUI(page,reinviteContactData);
      
      // Click on Proceed
      await expect(page.getByRole('button', { name: 'Proceed' })).toBeVisible();
      await page.getByRole('button', { name: 'Proceed' }).click();

      const allRows = await getRowData(page);
      console.log(allRows)
      const todaysdate = currentDate();
      const expectedRow = {
        name: reinviteContactData.name,
        email: reinviteContactData.email,
        club: reinviteContactData.club,
        date: todaysdate,
        status: 'Pending'
      };
      console.log(expectedRow);
    const isMatchFound3 = allRows.some(row =>
        Object.entries(expectedRow).every(([key, val]) => row[key] === val)
      );
    console.log(isMatchFound3 ? 'Re Invite is sent' : 'Error - Re Invite is not sent');
    const previosRow = {
        name: reinviteContactData.name,
        email: reinviteContactData.email,
        club: reinviteContactData.club,
        status: 'Expired'
      }
    const isMatchFound4 = allRows.some(row =>
        Object.entries(previosRow).every(([key, val]) => row[key] === val)
    );
    console.log(isMatchFound4 ? 'Previous Invite expired' : 'Error - Previous invite is not expired');
    }
  }
else{
    console.log("Either club or club title options are not found to re send the invite");
}

});

//Test Case - 8 [ User clicks on Cancel button in Re Invite modal ]
test('User clicks Cancel in Re Invite modal @smoke', async () => {

  // First invite a club contact to the club
  // Navigate to Onboard club contact modal
  await clickButton(page, 'Onboard');

  // Count club and club title options
  const clubOptionsCount = await countClubDropdownOptions(page, 'Club');
  const clubTitleOptionsCount = await countClubDropdownOptions(page, 'Club Title');

  if(clubOptionsCount > 0 && clubTitleOptionsCount > 0){
  // Generate random indices 
  var club = cancelreinviteContactData.club;
  var clubTitle = cancelreinviteContactData.clubTitle;

  // Fill the onboard modal and return the selected club and club title options 
  await onboardClubContact(page, cancelreinviteContactData, club , clubTitle);

  // Check if the club contact was already invited 
  const button = page.getByRole('button', { name: 'Proceed' });
  let isVisible = false;
  try {
    await button.waitFor({ state: 'visible', timeout: 20000 });
    isVisible = await button.isVisible();
  } catch (error) {
    console.log("Re Invite modal did not appear within 20 seconds.");
  }
  if (isVisible) {

    // Check for Cancel button
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
        
    // Click Cancel button
    await page.getByRole('button', { name: 'Cancel' }).click();

    // Assert UI 
    await expect(page.getByRole('heading', { name: 'Onboard a new Club Contact' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
    await clickButton(page, 'Close');
    console.log("Club contact is not re-invited and user is on club contact page");
  }
  else {
    await clickButton(page, 'Onboard');
    var club = cancelreinviteContactData.club;
    var clubTitle = cancelreinviteContactData.clubTitle
    await onboardClubContact(page, cancelreinviteContactData, club, clubTitle);

    // Check if the Re invite modal is opened 
    const button = page.getByRole('button', { name: 'Proceed' });
    let isVisible = false;
    try {
      await button.waitFor({ state: 'visible', timeout: 20000 });
      isVisible = await button.isVisible();
    } catch (error) {
      console.log("Re Invite modal did not appear within 20 seconds.");
    }
    if (isVisible) {
      // Check for Cancel button
      await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
        
      // Click Cancel button
      await page.getByRole('button', { name: 'Cancel' }).click();

      // Assert UI 
      await expect(page.getByRole('heading', { name: 'Onboard a new Club Contact' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
      await clickButton(page, 'Close');
      console.log("Club contact is not re-invited and user is on club contact page");
    } else {
        console.log("E - First Re -invite a club contact to cancel the re invite");
    }
  }}
  else{
    console.log("Either club or club title options are not found");
}

});

//Test Case - 9 [ Re-invite club contact to different club ]
test('Re-invite club contact to different club', async () => {
  
    
  // First invite a club contact to the club
  // Navigate to Onboard club contact modal
  await clickButton(page, 'Onboard');
  
  // Count club and club title options
  const clubOptionsCount = await countClubDropdownOptions(page, 'Club');
  const clubTitleOptionsCount = await countClubDropdownOptions(page, 'Club Title');

  if(clubOptionsCount > 0 && clubTitleOptionsCount > 0){
  // Generate random indices 
  var club1 = reinviteDiffContactData.club1;
  var club2 = reinviteDiffContactData.club2;
  var clubTitle = reinviteDiffContactData.clubTitle;

  // Fill the onboard modal 
  await onboardClubContact(page, reinviteDiffContactData, club1, clubTitle);

  // Check if the club contact was already invited 
  const button = page.getByRole('button', { name: 'Proceed' });
  let isVisible = false;
  try {
    await button.waitFor({ state: 'visible', timeout: 20000 });
    isVisible = await button.isVisible();
  } catch (error) {
    console.log("Re Invite modal did not appear within 20 seconds.");
  }
  if (isVisible) {

    // Check for Cancel button
    // Check for Cancel button
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
        
    // Click Cancel button
    await page.getByRole('button', { name: 'Cancel' }).click();

    // Assert UI 
    await expect(page.getByRole('heading', { name: 'Onboard a new Club Contact' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
    await clickButton(page, 'Close');
    console.log("Club contact is not re-invited and user is on club contact page");
    console.log("club contact is already invited to club : ", reinviteDiffContactData.club1);

    // Verify if the invite is present in invites tab
    const allRows = await getRowData(page);
    
    const previousRow = {
        name: reinviteDiffContactData.name,
        email: reinviteDiffContactData.email,
        club: reinviteDiffContactData.club1,
        
      }
      console.log(previousRow)
    const isMatchFound4 = allRows.some(row =>
        Object.entries(previousRow).every(([key, val]) => row[key] === val)
    );
    console.log(isMatchFound4 ? 'Previous Invite present in Invites tab' : 'Error - Previous invite is not present in Invites tab');
    
  }else{
    const allRows = await getRowData(page);
    const today = currentDate();
    const previousRow = {
        name: reinviteDiffContactData.name,
        email: reinviteDiffContactData.email,
        club: reinviteDiffContactData.club1,
        date: today,
        status: 'Pending'
      }
      console.log(previousRow)
    const isMatchFound4 = allRows.some(row =>
        Object.entries(previousRow).every(([key, val]) => row[key] === val)
    );
    console.log(isMatchFound4 ? 'First Invite for club 1 is present in Invites tab' : 'Error - Present invite for club 1 is not present in Invites tab');
  }

  // Invite club contact for different club 
  await clickButton(page, 'Onboard');
  
  // Count club and club title options
  var club2 = reinviteDiffContactData.club2;
  var clubTitle = reinviteDiffContactData.clubTitle;

  await onboardClubContact(page, reinviteDiffContactData, club2, clubTitle);
  // Check if the club contact was already invited 
  
  try {
    await button.waitFor({ state: 'visible', timeout: 20000 });
    isVisible = await button.isVisible();
  } catch (error) {
    console.log("Re Invite modal did not appear within 20 seconds.");
  }
  if (isVisible) {
    await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
    await clickButton(page, 'Close');
    console.log("Invite was already sent to club: ", reinviteDiffContactData.club2);
    console.log("Select another club [Change reinviteDiffContactData club 2 value in club contact test data file] ")
  } else{
    const allRows = await getRowData(page);
    const todaysdate = currentDate();
    const expectedRow = {
    name: reinviteDiffContactData.name,
    email: reinviteDiffContactData.email,
    club: reinviteDiffContactData.club2,
    date: todaysdate,
    status: 'Pending'
    };
    console.log(expectedRow);
    const isMatchFound3 = allRows.some(row =>
        Object.entries(expectedRow).every(([key, val]) => row[key] === val)
      );
    console.log(isMatchFound3 ? 'Invite sent for same club contact to join a different club' : 'Error - Invite is not sent');
  }  

  }
  else{
    console.log("Either club or club title options are not found");
}
});
  
  
  
  
  
  