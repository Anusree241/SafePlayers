import { test, expect } from '@playwright/test';
import {
  login,
  clickEnabledDate,
  verifyDisabledEnrollmentDate,verifyDisabledEndDate,findSeasonInPagination
} from '../addseasons/functions.js';
import { season } from '../addseasons/testdata.js';

test('tc1 verify the UI of seasons modal', async ({ page }) => {
  test.setTimeout(120000);
  
  //login
  await login(page)

  
  await page.getByRole('link', { name: '' }).click();
  await expect(page.getByRole('main').getByText('Seasons', { exact: true })).toBeVisible();
  await expect(page.getByText('Manage seasons for the')).toBeVisible();
  await expect(page.getByText('Active', { exact: true })).toBeVisible();
  await expect(page.getByText('Inactive')).toBeVisible();
  await expect(page.getByText('Expired')).toBeVisible();
  await page.getByRole('button', { name: 'Add Seasons' }).click();
  await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Search' })).toBeVisible();
});

test('tc2 verify the UI of "Add season" popup', async ({ page }) => {
  test.setTimeout(120000);
  
  //login
  await login(page)

  await page.getByRole('link', { name: '' }).click();
  await page.getByRole('button', { name: 'Add Seasons' }).click();
  await expect(page.getByRole('heading', { name: 'Add a Season' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Season Name' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Season Start Date' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Season End Date' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
});

test('tc3 Verify that the user cannot add a season without filling any field', async ({ page }) => {
  test.setTimeout(120000);
 
  //login
  await login(page)

  await page.getByRole('link', { name: '' }).click();
  await page.getByRole('button', { name: 'Add Seasons' }).click();
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('textbox', { name: 'Season Name' })).toBeEmpty();
  await expect(page.getByRole('textbox', { name: 'Season Start Date' })).toBeEmpty();
  await page.getByRole('textbox', { name: 'Season End Date' }).click();
  await expect(page.getByRole('textbox', { name: 'Season Enrollment Date' })).toBeEmpty();
  await page.getByRole('textbox', { name: 'Season End Date' }).click();
  await expect(page.getByText('Name cannot be empty')).toBeVisible();
  await expect(page.getByText('Start Date cannot be empty')).toBeVisible();
  await expect(page.getByText('End Date cannot be empty')).toBeVisible();
  await expect(page.getByText('Enrollment Date cannot be')).toBeVisible();
  console.log('Error or validation message appeared for each required field ')
});


test('tc4 Verify whether the user can add Season with Empty Name', async ({ page }) => {
    test.setTimeout(120000);
  
    //login
  await login(page)

  await page.getByRole('link', { name: '' }).click();
  await page.getByRole('button', { name: 'Add Seasons' }).click();


 // Get today's date
  const today = new Date();
  const startDay = today.getDate();
  const endDay = startDay + 2;
  const enrollDay = startDay - 2;

  // Select Start Date
  await page.getByRole('textbox', { name: 'Season Start Date' }).click();
  await clickEnabledDate(page,startDay);

  // Select End Date
  await page.getByRole('textbox', { name: 'Season End Date' }).click();
  await clickEnabledDate(page,endDay);

  // Select Enrollment Date
  await page.getByRole('textbox', { name: 'Season Enrollment Date' }).click();
  await clickEnabledDate(page,enrollDay);



  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('textbox', { name: 'Season Name' })).toBeEmpty();
  await expect(page.getByText('Name cannot be empty')).toBeVisible();
  console.log('user can not add Season with Empty Name')
});

test('TC005 - Verify season appears in inactive tab when start and enrollment date are in future', async ({ page }) => {
  //login
  await login(page)

  // Go to Seasons
  await page.getByRole('link', { name: '' }).click();
  await page.waitForTimeout(1000);

  const seasonName = season.name;
  await page.getByRole('button', { name: 'Add Seasons' }).click();
  await page.getByRole('textbox', { name: 'Season Name' }).fill(seasonName);

  // Date calculations
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() + 2);

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 3);

  const enrollmentDate = new Date(startDate);
  enrollmentDate.setDate(startDate.getDate() - 1);

  const startDay = startDate.getDate();
  const endDay = endDate.getDate();
  const enrollDay = enrollmentDate.getDate();

  
  // Select Start Date
  await page.getByRole('textbox', { name: 'Season Start Date' }).click();
  await clickEnabledDate(page,startDay);

  // Select End Date
  await page.getByRole('textbox', { name: 'Season End Date' }).click();
  await clickEnabledDate(page,endDay);

  // Select Enrollment Date
  await page.getByRole('textbox', { name: 'Season Enrollment Date' }).click();
  await clickEnabledDate(page,enrollDay);

  // Submit the form
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.waitForTimeout(2000);

  // Handle Proceed popup
  const createPopup = page.getByRole('heading', { name: 'Create Season' });
  if (await createPopup.isVisible().catch(() => false)) {
    await page.getByRole('button', { name: 'Proceed' }).click();
  }

  // Wait for spinner to go away
  await page.waitForSelector('.sp-spinner', { state: 'detached', timeout: 10000 });

  // Go to Inactive tab
  await page.locator('label', { hasText: 'Inactive' }).click();
  await page.waitForTimeout(1000);

  // Use pagination utility
const found = await findSeasonInPagination(page, seasonName);
});

test('tc6 Verify season appears in Active tab ', async ({ page }) => {
  test.setTimeout(120000);

  // 🔁 Manually enter the season name here
  const seasonName = season.seasonname;
  console.log(`Using season name: ${seasonName}`);

  //login
  await login(page)

  // Navigate to Seasons section
  await page.getByRole('link', { name: '' }).click();
  await page.waitForTimeout(1000);

  // Add new season
  await page.getByRole('button', { name: 'Add Seasons' }).click();
  await page.getByRole('textbox', { name: 'Season Name' }).fill(seasonName);

  // Get today's date
  const today = new Date();
  const startDay = today.getDate();
  const endDay = startDay + 2;
  const enrollDay = startDay - 2;

  // Select Start Date
  await page.getByRole('textbox', { name: 'Season Start Date' }).click();
  await clickEnabledDate(page,startDay);

  // Select End Date
  await page.getByRole('textbox', { name: 'Season End Date' }).click();
  await clickEnabledDate(page,endDay);

  // Select Enrollment Date
  await page.getByRole('textbox', { name: 'Season Enrollment Date' }).click();
  await clickEnabledDate(page,enrollDay);




  await page.getByRole('button', { name: 'Submit' }).click();

  // Wait a bit for possible popup
  await page.waitForTimeout(2000);

  // Handle "Proceed" popup if it appears
  const createPopup = page.getByRole('heading', { name: 'Create Season' });
  if (await createPopup.isVisible().catch(() => false)) {
    console.log(`⚠️ 'Proceed' popup appeared. Clicking Proceed.`);
    await page.getByRole('button', { name: 'Proceed' }).click();
  } else {
    console.log(`✅ Season "${seasonName}" submitted without popup.`);
  }

  // // Wait for spinner to disappear if any
  // await page.waitForSelector('.sp-spinner', { state: 'detached', timeout: 10000 });

  // // Switch to Active tab
  // await page.getByRole('tab', { name: 'Active' }).click();
  // await page.waitForTimeout(1000);

  // Use pagination utility
const found = await findSeasonInPagination(page, seasonName);
});

test('tc7 Verify that season name field shows error when Season Name exceeds 20 characters', async ({ page }) => {
    test.setTimeout(60000);
  //login
  await login(page)

  await page.getByRole('link', { name: '' }).click();
  await page.getByRole('button', { name: 'Add Seasons' }).click();
  await page.getByRole('textbox', { name: 'Season Name' }).click();

  const seasonName = season.invalidname;
  await page.getByRole('textbox', { name: 'Season Name' }).fill(seasonName);


 const today = new Date();
  const startDay = today.getDate();
  const endDay = startDay + 2;
  const enrollDay = startDay - 2;


  // Select Start Date
  await page.getByRole('textbox', { name: 'Season Start Date' }).click();
  await clickEnabledDate(page,startDay);

  // Select End Date
  await page.getByRole('textbox', { name: 'Season End Date' }).click();
  await clickEnabledDate(page,endDay);

  // Select Enrollment Date
  await page.getByRole('textbox', { name: 'Season Enrollment Date' }).click();
  await clickEnabledDate(page,enrollDay);


  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('The length of \'Season Title\'')).toBeVisible();
  console.log('season name field shows error because Season Name exceeds 20 characters')
});

test('Verify that Season End Date disables dates earlier than the selected Season Start Date', async ({ page }) => {
  test.setTimeout(120000);

  // Launch and login
  //login
  await login(page)

  // Navigate to Seasons module
  await page.getByRole('link', { name: '' }).click();
  await page.getByRole('button', { name: 'Add Seasons' }).click();

  // Fill Season Name
  const seasonName = season.invalidname;
  await page.getByRole('textbox', { name: 'Season Name' }).fill(seasonName);

  // ===== Select Season Start Date =====
  const today = new Date();
  const startDay = today.getDate();


  await page.getByRole('textbox', { name: 'Season Start Date' }).click();
  await clickEnabledDate(page,startDay);

  // ===== Try clicking on a disabled date in End Date =====
  await page.getByRole('textbox', { name: 'Season End Date' }).click();
  const disabledDay = startDay - 1;

  await verifyDisabledEndDate(page,disabledDay)

});

test('tc9 Enrollment Date must be before the Start Date', async ({ page }) => {
  test.setTimeout(120000);

  //login
  await login(page)

  // Navigate to Seasons module
  await page.getByRole('link', { name: '' }).click();
  await page.getByRole('button', { name: 'Add Seasons' }).click();

  // Fill Season Name
  const seasonName = season.name;
  await page.getByRole('textbox', { name: 'Season Name' }).fill(seasonName);

  // ===== Select Season Start Date dynamically =====
  const today = new Date();
  const startDay = today.getDate();

  await page.getByRole('textbox', { name: 'Season Start Date' }).click();
  await clickEnabledDate(page,startDay);


  // Enrollment Date - Try to select a disabled date after Start Date (startDay + 1)
  await page.getByRole('textbox', { name: 'Season Enrollment Date' }).click();

  const disabledDay = startDay + 1; // The date after start date

  await verifyDisabledEnrollmentDate(page,disabledDay)

});

test('tc10 Verify the functionality of the Close button in the Add Seasons popup', async ({ page }) => {
  test.setTimeout(120000);
  //login
  await login(page)

  await page.getByRole('link', { name: '' }).click();
  await page.getByRole('button', { name: 'Add Seasons' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('main').getByText('Seasons', { exact: true })).toBeVisible();
});

test('tc11 search box functionality', async ({ page }) => {
  // Login
  test.setTimeout(120000);
  //login
  await login(page)
  await page.waitForTimeout(1000);


  // Click some icon ()
  await page.getByRole('link', { name: '' }).click();

  const searchTerm = 'test';
  await page.getByRole('textbox', { name: 'Search' }).click();
  await page.getByRole('textbox', { name: 'Search' }).fill(searchTerm);
  await page.getByRole('button', { name: '' }).click();
  await page.getByRole('button', { name: '' }).click();
  await expect(page.getByRole('textbox', { name: 'Search' })).toBeVisible();
  await page.waitForTimeout(1000);


const resultRows = page.locator('table tbody tr');

 // Optional: waits for at least 1 row

const rowCount = await resultRows.count();
expect(rowCount).toBeGreaterThan(0);
let matchedRowCount = 0;
timeout : 50000;
for (let i = 0; i < rowCount; i++) {
  const nameCell = resultRows.nth(i).locator('td').nth(0); // 1st column = Name
  const nameText = (await nameCell.innerText()).trim().toLowerCase();
  console.log(`Row ${i} Name: "${nameText}"`);

  if (nameText.includes(searchTerm.toLowerCase())) {
    matchedRowCount++;
  }
}

// Assert that all visible rows match the search term in Name column
expect(matchedRowCount).toBe(rowCount);
console.log('✅ All visible rows match the search term in the Name column.');
});

test('tc12 verify the UI of create season popup', async ({ page }) => {
    test.setTimeout(120000);
  //login
  await login(page)
  await page.getByRole('link', { name: '' }).click();
  await page.getByRole('button', { name: 'Add Seasons' }).click();
  await page.getByRole('textbox', { name: 'Season Name' }).click();
  await page.getByRole('textbox', { name: 'Season Name' }).fill('Test');


 const today = new Date();
  const startDay = today.getDate();
  const endDay = startDay + 2;
  const enrollDay = startDay - 2;



  // Select Start Date
  await page.getByRole('textbox', { name: 'Season Start Date' }).click();
  await clickEnabledDate(page,startDay);

  // Select End Date
  await page.getByRole('textbox', { name: 'Season End Date' }).click();
  await clickEnabledDate(page,endDay);

  // Select Enrollment Date
  await page.getByRole('textbox', { name: 'Season Enrollment Date' }).click();
  await clickEnabledDate(page,enrollDay);


  await page.getByRole('button', { name: 'Submit' }).click();
  await page.waitForTimeout(1000);
  await expect(page.getByRole('heading', { name: 'Create Season' })).toBeVisible();
  await expect(page.getByText('The season with name Test is')).toBeVisible();
  await expect(page.getByText('Are you sure you want to')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Proceed' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
});

test('tc13 Verify confirmation popup appears when creating a season with an already existing name', async ({ page }) => {
    test.setTimeout(120000);
  //login
  await login(page)

  await page.getByRole('link', { name: '' }).click();
  await page.getByRole('button', { name: 'Add Seasons' }).click();
  await page.getByRole('textbox', { name: 'Season Name' }).click();
  const seasonName = season.name;
  await page.getByRole('textbox', { name: 'Season Name' }).fill(seasonName);


const today = new Date();
  const startDay = today.getDate();
  const endDay = startDay + 2;
  const enrollDay = startDay - 2;


  // Select Start Date
  await page.getByRole('textbox', { name: 'Season Start Date' }).click();
  await clickEnabledDate(page,startDay);

  // Select End Date
  await page.getByRole('textbox', { name: 'Season End Date' }).click();
  await clickEnabledDate(page,endDay);

  // Select Enrollment Date
  await page.getByRole('textbox', { name: 'Season Enrollment Date' }).click();
  await clickEnabledDate(page,enrollDay);


  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('heading', { name: 'Create Season' })).toBeVisible();
  console.log('confirmation popup appears when creating a season with an already existing name')
});

test('Verify Cancel button functionality in create season popup', async ({ page }) => {
    test.setTimeout(120000);
  //login
  await login(page)

  await page.getByRole('link', { name: '' }).click();
  await page.getByRole('button', { name: 'Add Seasons' }).click();
  await page.getByRole('textbox', { name: 'Season Name' }).click();
  const seasonName = season.name;
  await page.getByRole('textbox', { name: 'Season Name' }).fill(seasonName);



const today = new Date();
  const startDay = today.getDate();
  const endDay = startDay + 2;
  const enrollDay = startDay - 2;


  // Select Start Date
  await page.getByRole('textbox', { name: 'Season Start Date' }).click();
  await clickEnabledDate(page,startDay);

  // Select End Date
  await page.getByRole('textbox', { name: 'Season End Date' }).click();
  await clickEnabledDate(page,endDay);

  // Select Enrollment Date
  await page.getByRole('textbox', { name: 'Season Enrollment Date' }).click();
  await clickEnabledDate(page,enrollDay);


  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByRole('heading', { name: 'Add a Season' })).toBeVisible();
});

test('Verify the fuctionality of (X) icon  in create season popup', async ({ page }) => {
    test.setTimeout(120000);
  //login
  await login(page)

  await page.getByRole('link', { name: '' }).click();
  await page.getByRole('button', { name: 'Add Seasons' }).click();
  await page.getByRole('textbox', { name: 'Season Name' }).click();
  const seasonName = season.name;
  await page.getByRole('textbox', { name: 'Season Name' }).fill(seasonName);


const today = new Date();
  const startDay = today.getDate();
  const endDay = startDay + 2;
  const enrollDay = startDay - 2;


  // Select Start Date
  await page.getByRole('textbox', { name: 'Season Start Date' }).click();
  await clickEnabledDate(page,startDay);

  // Select End Date
  await page.getByRole('textbox', { name: 'Season End Date' }).click();
  await clickEnabledDate(page,endDay);

  // Select Enrollment Date
  await page.getByRole('textbox', { name: 'Season Enrollment Date' }).click();
  await clickEnabledDate(page,enrollDay);



  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('main').getByText('Seasons', { exact: true })).toBeVisible();
});

test('Verify proceed button functionality in create season popup', async ({ page }) => {
  //login
  await login(page)

  await page.getByRole('link', { name: '' }).click();
  await page.getByRole('button', { name: 'Add Seasons' }).click();
  await page.getByRole('textbox', { name: 'Season Name' }).click();

  const seasonName = season.name;
  await page.getByRole('textbox', { name: 'Season Name' }).fill(seasonName);


const today = new Date();
  const startDay = today.getDate();
  const endDay = startDay + 2;
  const enrollDay = startDay - 2;


  // Select Start Date
  await page.getByRole('textbox', { name: 'Season Start Date' }).click();
  await clickEnabledDate(page,startDay);

  // Select End Date
  await page.getByRole('textbox', { name: 'Season End Date' }).click();
  await clickEnabledDate(page,endDay);



  // Select Enrollment Date
  await page.getByRole('textbox', { name: 'Season Enrollment Date' }).click();
  await clickEnabledDate(page,enrollDay);


  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('heading', { name: 'Create Season' })).toBeVisible();
  await page.getByRole('button', { name: 'Proceed' }).click();
  console.log('season created')
});

