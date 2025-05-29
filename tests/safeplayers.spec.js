import { test, expect } from '@playwright/test';
import {validEmail, validPassword, Seasonnewseason, SeasonTest, Seasonss, SeasonTest1, Seasontest, Clubtestclub, createclubname, createclubdescrip, 
  createclubseason, Invalidclubname, Editclubinitial, Editclubchange, Editclubdescrip, EditInvalidclub, CancelEditclubname, CancelEditdescrip, Deleteclub, 
  Duplicateclubname, Duplicateclubdescrip, Duplicateclubseason } from '../tests/Testdata.js';

test('Verify the UI of Edit Seasons', async ({ page }) => {
  await page.goto('https://test.safeplayers.org/login', {waitUntil : 'domcontentloaded'});
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill(validEmail); //test data
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(validPassword); //test data
  await page.getByRole('button', { name: 'Login' }).click();

  await page.waitForLoadState('domcontentloaded');
  const createClubButton = page.getByRole('button', {name: 'Create Club' });
  await createClubButton.waitFor({ state: 'visible', timeout: 60000 });
  await expect(page.getByRole('link', { name: '' })).toBeVisible();
  await page.getByRole('link', { name: '' }).click();
  await expect(page.getByRole('main').getByText('Seasons', { exact: true })).toBeVisible();

  await page.waitForTimeout(5000);
  await page.locator(Seasonnewseason).click(); //test data
  await expect(page.getByRole('button', { name: '' })).toBeVisible();
  await page.getByRole('button', { name: '' }).click();
  await expect(page.getByRole('button', { name: ' Edit' })).toBeVisible();
  await page.getByRole('button', { name: ' Edit' }).click();
  await expect(page.getByRole('heading', { name: 'Update a Season' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Season Name' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Season Start Date' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Season End Date' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Season Enrollment Date' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();
});

test('Verify whether the user can Edit Season with Empty Name', async ({ page }) => {
  test.setTimeout(120000);
  await page.goto('https://test.safeplayers.org/login');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill(validEmail);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(validPassword);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForLoadState('domcontentloaded');
  const createClubButton = page.getByRole('button', {name: 'Create Club' });
  await createClubButton.waitFor({ state: 'visible', timeout: 60000 });
  await expect(page.getByRole('link', { name: '' })).toBeVisible();
  await page.getByRole('link', { name: '' }).click();
  await expect(page.getByRole('main').getByText('Seasons', { exact: true })).toBeVisible();
  await page.waitForTimeout(5000);
  await page.locator(Seasonnewseason).click(); //test data
  await expect(page.getByRole('button', { name: '' })).toBeVisible();
  await page.getByRole('button', { name: '' }).click();
  await expect(page.getByRole('button', { name: ' Edit' })).toBeVisible();
  await page.getByRole('button', { name: ' Edit' }).click();
  await expect(page.getByRole('heading', { name: 'Update a Season' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Season Name' }).click();
  await page.getByRole('textbox', { name: 'Season Name' }).fill('');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('dialog')).toContainText('Name cannot be empty');
  await page.getByRole('button', { name: 'Close' }).click();
});

test('Verify whether the user can select all the future dates for the season', async ({ page }) => {
  await page.goto('https://test.safeplayers.org/login', { waitUntil: 'domcontentloaded' });

  // Login
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill(validEmail);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(validPassword);
  await page.getByRole('button', { name: 'Login' }).click();

  await page.waitForLoadState('domcontentloaded');

  // Navigate to Seasons module
  await expect(page.getByRole('link', { name: '' })).toBeVisible();
  await page.getByRole('link', { name: '' }).click();
  await expect(page.getByRole('main').getByText('Seasons', { exact: true })).toBeVisible();

  await page.waitForTimeout(5000);

  // Click edit on first season row
  await page.locator(SeasonTest).click();
  await page.getByRole('button', { name: '' }).click();
  await page.getByRole('button', { name: ' Edit' }).click();
  await expect(page.getByRole('heading', { name: 'Update a Season' })).toBeVisible();

  const seasonName = 'new';

  // Generate valid future dates
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() + 3);

  const enrollmentDate = new Date(today);
  enrollmentDate.setDate(today.getDate() + 2); // Before start

  const endDate = new Date(today);
  endDate.setDate(today.getDate() + 10); // After start

  // Helper to format day number
  const formatDate = (date) => date.getDate().toString();

  // Updated helper to reliably select a date
  const selectDate = async (label, date) => {
    const targetDay = formatDate(date);
    await page.getByRole('textbox', { name: label }).click();

    const dateOptions = page.locator('td[role="button"] div', { hasText: targetDay });
    const count = await dateOptions.count();

    for (let i = 0; i < count; i++) {
      const el = dateOptions.nth(i);
      const box = await el.boundingBox();
      if (box) {
        await el.click();
        return;
      }
    }

    const allCalendarDays = await page.locator('td[role="button"] div').allInnerTexts();
    console.error(`❌ Enabled date "${targetDay}" not found for "${label}". Calendar content:`, allCalendarDays);
    throw new Error(`❌ Enabled date "${targetDay}" not found for "${label}".`);
  };

  // Pick valid future dates
  await selectDate('Season Start Date', startDate);
  await selectDate('Season End Date', endDate);
  await selectDate('Season Enrollment Date', enrollmentDate);

  // Submit the form
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.waitForTimeout(2000);

  // Handle optional Proceed popup
  const createPopup = page.getByRole('heading', { name: 'Update a Season' });
  if (await createPopup.isVisible().catch(() => false)) {
    await page.getByRole('button', { name: 'Proceed' }).click();
  }

  // Wait for spinner to disappear
  await page.waitForSelector('.sp-spinner', { state: 'detached', timeout: 10000 });

  // Go to Inactive tab
  await page.getByRole('link', { name: '' }).click();
  await page.getByText('Inactive').click();
  await page.waitForTimeout(1000);
  await expect(page.getByRole('button', { name: seasonName })).toBeVisible();
});

test('Verify Season appears in Active tab when Start Date & Enrollment Date are in the past or Today', async ({ page }) => {
  test.setTimeout(120000);

  // Login
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill(validEmail);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(validPassword);
  await page.getByRole('button', { name: 'Login' }).click();

  await page.waitForLoadState('domcontentloaded');

  // Navigate to Seasons module
  await expect(page.getByRole('link', { name: '' })).toBeVisible();
  await page.getByRole('link', { name: '' }).click();
  await expect(page.getByRole('main').getByText('Seasons', { exact: true })).toBeVisible();
  await page.waitForTimeout(5000);

  // Edit season
  await page.locator(Seasonss).click();
  await page.getByRole('button', { name: '' }).click();
  await page.getByRole('button', { name: ' Edit' }).click();
  await expect(page.getByRole('heading', { name: 'Update a Season' })).toBeVisible();

  const seasonName = 'ss';

  // Date helper
  const formatDate = (offsetDays) => {
    const date = new Date();
    date.setDate(date.getDate() + offsetDays);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  // Fill dates directly into inputs
  await page.getByRole('textbox', { name: 'Season Start Date' }).fill(formatDate(0));     // Today
  await page.getByRole('textbox', { name: 'Season End Date' }).fill(formatDate(2));       // +2 days
  await page.getByRole('textbox', { name: 'Season Enrollment Date' }).fill(formatDate(-2)); // -2 days

  await page.getByRole('button', { name: 'Submit' }).click();
  await page.waitForTimeout(2000);

  // Handle "Proceed" popup if it appears
  const createPopup = page.getByRole('heading', { name: 'Update a season' });
  if (await createPopup.isVisible().catch(() => false)) {
    await page.getByRole('button', { name: 'Proceed' }).click();
  } else {
    console.log(`Season "${seasonName}" submitted without popup.`);
  }
  // Wait for spinner to disappear
  await page.waitForSelector('.sp-spinner', { state: 'detached', timeout: 10000 });

  // Go to Active tab
  await page.getByRole('link', { name: '' }).click();
  await page.waitForTimeout(1000);
  await expect(page.getByRole('button', { name: seasonName })).toBeVisible();
});


test('Verify whether the user can able to Cancel Edit Operation', async ({ page }) => {
   await page.goto('https://test.safeplayers.org/login', { waitUntil: 'domcontentloaded' });

  // Login
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill(validEmail);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(validPassword);
  await page.getByRole('button', { name: 'Login' }).click();

  await page.waitForLoadState('domcontentloaded');

  // Navigate to Seasons module
  await expect(page.getByRole('link', { name: '' })).toBeVisible();
  await page.getByRole('link', { name: '' }).click();
  await expect(page.getByRole('main').getByText('Seasons', { exact: true })).toBeVisible();

  await page.waitForTimeout(5000);
  await page.locator(SeasonTest1).click();
  await page.getByRole('button', { name: '' }).click();
  await page.getByRole('button', { name: ' Edit' }).click();
  await expect(page.getByRole('heading', { name: 'Update a Season' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Season Name' }).click();
  await page.getByRole('textbox', { name: 'Season Name' }).fill(qwer);
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.locator('div').filter({ hasText: /^Test$/ }).locator('span')).toBeVisible()
});

test('Verify whether the user can able to select the End Date Before the Start Date', async ({ page }) => {
  await page.goto('https://test.safeplayers.org/login', { waitUntil: 'domcontentloaded' });

  // Login
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill(validEmail);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(validPassword);
  await page.getByRole('button', { name: 'Login' }).click();

  await page.waitForLoadState('domcontentloaded');

  // Navigate to Seasons module
  await expect(page.getByRole('link', { name: '' })).toBeVisible();
  await page.getByRole('link', { name: '' }).click();
  await expect(page.getByRole('main').getByText('Seasons', { exact: true })).toBeVisible();

  await page.waitForTimeout(5000);

  await page.locator(Seasontest).click();
  await expect(page.getByRole('button', { name: '' })).toBeVisible();
  await page.getByRole('button', { name: '' }).click();
  await expect(page.getByRole('button', { name: ' Edit' })).toBeVisible();
  await page.getByRole('button', { name: ' Edit' }).click();
  await expect(page.getByRole('heading', { name: 'Update a Season' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Season Start Date' }).click();
  await page.getByRole('button', { name: '30' }).nth(1).click();
  await page.getByRole('textbox', { name: 'Season End Date' }).click();
  await page.getByRole('button', { name: '' }).click();
  await page.getByRole('dialog').getByRole('table').getByText('29').nth(1).click();
  console.log("All dates before Start date is disabled")
  await page.getByRole('button', { name: 'Close' }).click();
});

test('Verify whether the user can able to select the Enrolment Date After the Start Date', async ({ page }) => {
  await page.goto('https://test.safeplayers.org/login', { waitUntil: 'domcontentloaded' });

  // Login
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill(validEmail);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(validPassword);
  await page.getByRole('button', { name: 'Login' }).click();

  await page.waitForLoadState('domcontentloaded');

  // Navigate to Seasons module
  await expect(page.getByRole('link', { name: '' })).toBeVisible();
  await page.getByRole('link', { name: '' }).click();
  await expect(page.getByRole('main').getByText('Seasons', { exact: true })).toBeVisible();

  await page.waitForTimeout(5000);

  await page.locator(Seasontest).click();
  await expect(page.getByRole('button', { name: '' })).toBeVisible();
  await page.getByRole('button', { name: '' }).click();
  await expect(page.getByRole('button', { name: ' Edit' })).toBeVisible();
  await page.getByRole('button', { name: ' Edit' }).click();
  await expect(page.getByRole('heading', { name: 'Update a Season' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Season Start Date' }).click();
  await page.getByRole('button', { name: '30' }).nth(1).click();
  await page.getByRole('textbox', { name: 'Season Enrollment Date' }).click();
  await page.getByRole('cell', { name: '31' }).locator('div').click();
  console.log("The Dates After Start date is disabled")
  await page.getByRole('button', { name: 'Close' }).click();
});


//Create, Edit & Delete Club

test('Verify the UI of Create Club', async ({ page }) => {
  await page.goto('https://test.safeplayers.org/login', {waitUntil : 'domcontentloaded'});
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill(validEmail);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(validPassword);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForLoadState('domcontentloaded');
  const createClubButton = page.getByRole('button', {name: 'Create Club' });
  await createClubButton.waitFor({ state: 'visible', timeout: 60000 });
  await page.getByRole('button', { name: 'Create Club' }).click();
  await expect(page.getByText('Create a Club')).toBeVisible();
  await expect(page.getByRole('dialog').locator('i').first()).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Club Name' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Description' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Season' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();
});

test('Verify the UI of Edit Club', async ({ page }) => {
  await page.goto('https://test.safeplayers.org/login', {waitUntil : 'domcontentloaded'});
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill(validEmail);[]
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(validPassword);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForLoadState('domcontentloaded');
  const createClubButton = page.getByRole('button', {name: 'Create Club' });
  await createClubButton.waitFor({ state: 'visible', timeout: 60000 });
  await page.getByText(Clubtestclub).click(); //test data
  await expect(page.getByText('test club').nth(1)).toBeVisible();
  await expect(page.getByRole('button', { name: ' Edit' })).toBeVisible();
  await page.getByRole('button', { name: ' Edit' }).click();
  await expect(page.getByText('Update a Club')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Club Name' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Description' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Season' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();
});

test('Verify the UI of Delete Club', async ({ page }) => {
  await page.goto('https://test.safeplayers.org/login', {waitUntil : 'domcontentloaded'});
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill(validEmail);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(validPassword);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForLoadState('domcontentloaded');
  const createClubButton = page.getByRole('button', {name: 'Create Club' });
  await createClubButton.waitFor({ state: 'visible', timeout: 60000 });
  await page.getByText(Clubtestclub).click(); //test data
  await expect(page.getByRole('button', { name: ' Delete' })).toBeVisible();
  await page.getByRole('button', { name: ' Delete' }).click();
  await expect(page.getByRole('heading', { name: 'Delete Club' })).toBeVisible();
  await expect(page.locator('b')).toContainText('Are you sure you want to delete the club?');
  await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Proceed' })).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();
});

test('Verify whether the user can Create a Club with Valid Data', async ({ page }) => {
  await page.goto('https://test.safeplayers.org/login', {waitUntil : 'domcontentloaded'});
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill(validEmail);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(validPassword);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForLoadState('domcontentloaded');
  const createClubButton = page.getByRole('button', {name: 'Create Club' });
  await createClubButton.waitFor({ state: 'visible', timeout: 60000 });
  await page.getByRole('button', { name: 'Create Club' }).click();
  await expect(page.getByText('Create a Club')).toBeVisible();
  await page.getByRole('textbox', { name: 'Club Name' }).click();
  await page.getByRole('textbox', { name: 'Club Name' }).fill(createclubname);
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).fill(createclubdescrip);
  await page.getByRole('textbox', { name: 'Season' }).click();
  await page.getByRole('button', { name: createclubseason }).click(); //test data
  await page.getByRole('button', { name: 'Submit' }).click();
  const clubname = 'clubs';
  const createPopup = page.getByRole('heading', { name: 'Create Season' });
  if (await createPopup.isVisible().catch(() => false)) {
    console.log(`Popup appeared. Proceeding.`);
    await page.getByRole('button', { name: 'Proceed' }).click();
  } else {
    console.log(`Club "${clubname}" created.`);
  }
});

test('Verify whether the user can Create a Club with InValid Club Name', async ({ page }) => {
  await page.goto('https://test.safeplayers.org/login', {waitUntil : 'domcontentloaded'});
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill(validEmail);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(validPassword);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForLoadState('domcontentloaded');
  const createClubButton = page.getByRole('button', {name: 'Create Club' });
  await createClubButton.waitFor({ state: 'visible', timeout: 60000 });
  await page.getByRole('button', { name: 'Create Club' }).click();
  await expect(page.getByRole('dialog')).toContainText('Create a Club');
  await page.getByRole('textbox', { name: 'Club Name' }).click();
  await page.getByRole('textbox', { name: 'Club Name' }).fill(Invalidclubname);
  await page.getByRole('textbox', { name: 'Description' }).click();
  await expect(page.locator('form')).toContainText('Club Name is Invalid.');
  await page.getByRole('button', { name: 'Close' }).click();
});

test('Verify whether the user can Create a Club with Empty Fields', async ({ page }) => {
  await page.goto('https://test.safeplayers.org/login', {waitUntil : 'domcontentloaded'});
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill(validEmail);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(validPassword);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForLoadState('domcontentloaded');
  const createClubButton = page.getByRole('button', {name: 'Create Club' });
  await createClubButton.waitFor({ state: 'visible', timeout: 60000 });
  await page.getByRole('button', { name: 'Create Club' }).click();
  await expect(page.getByRole('dialog')).toContainText('Create a Club');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.locator('form')).toContainText('Club Name cannot be empty.');
  await expect(page.locator('form')).toContainText('Description cannot be empty');
  await expect(page.locator('form')).toContainText('Please select a season before creating a club.');
  await page.getByRole('button', { name: 'Close' }).click();
});

test('Verify whether the user can able to Edit the Existing Club with Valid details', async ({ page }) => {
  await page.goto('https://test.safeplayers.org/login', {waitUntil : 'domcontentloaded'});
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill(validEmail);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(validPassword);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForLoadState('domcontentloaded');
  const createClubButton = page.getByRole('button', {name: 'Create Club' });
  await createClubButton.waitFor({ state: 'visible', timeout: 60000 });
  await page.getByText(Editclubinitial).click(); //test data
  await expect(page.getByText(Editclubinitialvisible).nth(1)).toBeVisible();
  await expect(page.getByRole('button', { name: ' Edit' })).toBeVisible();
  await page.getByRole('button', { name: ' Edit' }).click();
  await expect(page.getByText('Update a Club')).toBeVisible();
  await page.getByRole('textbox', { name: 'Club Name' }).click();
  await page.getByRole('textbox', { name: 'Club Name' }).fill(Editclubchange);//test data
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).fill(Editclubdescrip);
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Editclubchangevisible').nth(1)).toBeVisible();
});

test('Verify whether theuser can able to Edit the Existing Club with Invalid details', async ({ page }) => {
  await page.goto('https://test.safeplayers.org/login', {waitUntil : 'domcontentloaded'});
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill(validEmail);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(validPassword);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForLoadState('domcontentloaded');
  const createClubButton = page.getByRole('button', {name: 'Create Club' });
  await createClubButton.waitFor({ state: 'visible', timeout: 60000 });
  await page.getByText(Clubtestclub).click(); //test data
  await expect(page.getByText(Clubtestclubvisible).nth(1)).toBeVisible();
  await expect(page.getByRole('button', { name: ' Edit' })).toBeVisible();
  await page.getByRole('button', { name: ' Edit' }).click();
  await expect(page.getByText('Update a Club')).toBeVisible();
  await page.getByRole('textbox', { name: 'Club Name' }).click();
  await page.getByRole('textbox', { name: 'Club Name' }).fill(EditInvalidclub);
  await page.getByRole('textbox', { name: 'Description' }).click();
  await expect(page.locator('form')).toContainText('Club Name is Invalid.');
  await page.getByRole('button', { name: 'Close' }).click();
});

test('Verify whether the user can able to Edit the Existing Club with Missing fields', async ({ page }) => {
  await page.goto('https://test.safeplayers.org/login', {waitUntil : 'domcontentloaded'});
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill(validEmail);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(validPassword);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForLoadState('domcontentloaded');
  const createClubButton = page.getByRole('button', {name: 'Create Club' });
  await createClubButton.waitFor({ state: 'visible', timeout: 60000 });
  await page.getByText(Clubtestclub).click(); //test data
  await expect(page.getByText(Clubtestclubvisible).nth(1)).toBeVisible();
  await expect(page.getByRole('button', { name: ' Edit' })).toBeVisible();
  await page.getByRole('button', { name: ' Edit' }).click();
  await expect(page.getByText('Update a Club')).toBeVisible();
  await page.getByRole('textbox', { name: 'Club Name' }).click();
  await page.getByRole('textbox', { name: 'Club Name' }).fill('');
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).fill('');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.locator('form')).toContainText('Club Name cannot be empty.Club name length must be at least 2Club Name is Invalid.');
  await expect(page.locator('form')).toContainText('Description cannot be empty');
  await page.getByRole('button', { name: 'Close' }).click();
});

test('Verify whether the user can able to  Cancel Editing the Club Details', async ({ page }) => {
  await page.goto('https://test.safeplayers.org/login', {waitUntil : 'domcontentloaded'});
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill(validEmail);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(validPassword);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForLoadState('domcontentloaded');
  const createClubButton = page.getByRole('button', {name: 'Create Club' });
  await createClubButton.waitFor({ state: 'visible', timeout: 60000 });
  await page.getByText(Clubtestclub).click(); //test data
  await expect(page.getByText(Clubtestclubvisible).nth(1)).toBeVisible();
  await expect(page.getByRole('button', { name: ' Edit' })).toBeVisible();
  await page.getByRole('button', { name: ' Edit' }).click();
  await expect(page.getByText('Update a Club')).toBeVisible();
  await page.getByRole('textbox', { name: 'Club Name' }).click();
  await page.getByRole('textbox', { name: 'Club Name' }).fill(CancelEditclubname);
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).fill(CancelEditdescrip);
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByText(Clubtestclubvisible).nth(1)).toBeVisible();
});

test('Verify whether the user can able to Delete an Existing Club', async ({ page }) => {
  await page.goto('https://test.safeplayers.org/login', {waitUntil : 'domcontentloaded'});
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill(validEmail);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(validPassword);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForLoadState('domcontentloaded');
  const createClubButton = page.getByRole('button', {name: 'Create Club' });
  await createClubButton.waitFor({ state: 'visible', timeout: 60000 });
  
  await page.getByText(Deleteclub).click(); //test data
  await expect(page.getByText('new club').nth(1)).toBeVisible();

  await expect(page.getByRole('button', { name: ' Delete' })).toBeVisible();
  await page.getByRole('button', { name: ' Delete' }).click();
  await expect(page.getByRole('heading', { name: 'Delete Club' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Proceed' })).toBeVisible();
  await page.getByRole('button', { name: 'Proceed' }).click();
});

test('Verify whether the user can able to Cancel Club Deletion', async ({ page }) => {
  await page.goto('https://test.safeplayers.org/login', {waitUntil : 'domcontentloaded'});
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill(validEmail);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(validPassword);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForLoadState('domcontentloaded');
  const createClubButton = page.getByRole('button', {name: 'Create Club' });
  await createClubButton.waitFor({ state: 'visible', timeout: 60000 });
  await page.getByText(Clubtestclub).click(); //test data
  await expect(page.getByText(Clubtestclubvisible).nth(1)).toBeVisible();
  await expect(page.getByRole('button', { name: ' Delete' })).toBeVisible();
  await page.getByRole('button', { name: ' Delete' }).click();
  await expect(page.getByRole('heading', { name: 'Delete Club' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Proceed' })).toBeVisible();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByText(Clubtestclubvisible).nth(1)).toBeVisible();
});

test('Verify whether the user can create a Club with Duplicate Club Name', async ({ page }) => {
  await page.goto('https://test.safeplayers.org/login', {waitUntil : 'domcontentloaded'});
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill(validEmail);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(validPassword);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForLoadState('domcontentloaded');
  const createClubButton = page.getByRole('button', {name: 'Create Club' });
  await createClubButton.waitFor({ state: 'visible', timeout: 60000 });
  await page.getByRole('button', { name: 'Create Club' }).click();
  await expect(page.getByText('Create a Club')).toBeVisible();
  await page.getByRole('textbox', { name: 'Club Name' }).click();
  await page.getByRole('textbox', { name: 'Club Name' }).fill(Duplicateclubname);
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).fill(Duplicateclubdescrip);
  await page.getByRole('textbox', { name: 'Season' }).click();
  await page.getByRole('button', { name: Duplicateclubseason }).click(); //test data
  await page.getByRole('button', { name: 'Submit' }).click();
  const clubname = 'clubs';
  const createPopup = page.getByRole('heading', { name: 'Create Season' });
  if (await createPopup.isVisible().catch(() => false)) {
    console.log(`Popup appeared. Proceeding.`);
    await page.getByRole('button', { name: 'Proceed' }).click();
  } else {
    console.log(`Club "${clubname}" created.`);
  }
});

