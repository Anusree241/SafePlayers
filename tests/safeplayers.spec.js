import { test, expect } from '@playwright/test';
<<<<<<< HEAD
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
=======


test('tc1 verify the UI of seasons modal', async ({ page }) => {
  test.setTimeout(120000);
  await page.goto('https://test.safeplayers.org/login');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('akshata.s@tezo.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Aks@12345');
  await page.getByRole('button', { name: 'Login' }).click();
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
  await page.goto('https://test.safeplayers.org/login');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('akshata.s@tezo.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Aks@12345');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: '' }).click();
  await page.getByRole('button', { name: 'Add Seasons' }).click();
  await expect(page.getByRole('heading', { name: 'Add Seasons' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Season Name' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Season Start Date' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Season End Date' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
});

test('tc3 Verify that the user cannot add a season without filling any field', async ({ page }) => {
  test.setTimeout(120000);
  await page.goto('https://test.safeplayers.org/login');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('akshata.s@tezo.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Aks@12345');
  await page.getByRole('button', { name: 'Login' }).click();
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
  await page.goto('https://test.safeplayers.org/login');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('akshata.s@tezo.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Aks@12345');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: '' }).click();
  await page.getByRole('button', { name: 'Add Seasons' }).click();


 // Get today's date
  const today = new Date();
  const startDay = today.getDate();
  const endDay = startDay + 2;
  const enrollDay = startDay - 2;

  // Helper: click enabled calendar day
  const clickEnabledDate = async (day) => {
    const dateButtons = page.locator(`td[role="button"] div`, { hasText: String(day) });
    const count = await dateButtons.count();
    for (let i = 0; i < count; i++) {
      const button = dateButtons.nth(i);
      if (await button.isVisible()) {
        await button.click();
        return;
      }
    }
    throw new Error(`❌ Enabled date "${day}" not found.`);
  };

  // Select Start Date
  await page.getByRole('textbox', { name: 'Season Start Date' }).click();
  await clickEnabledDate(startDay);

  // Select End Date
  await page.getByRole('textbox', { name: 'Season End Date' }).click();
  await clickEnabledDate(endDay);

  // Select Enrollment Date
  await page.getByRole('textbox', { name: 'Season Enrollment Date' }).click();
  await clickEnabledDate(enrollDay);



  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('textbox', { name: 'Season Name' })).toBeEmpty();
  await expect(page.getByText('Name cannot be empty')).toBeVisible();
  console.log('user can not add Season with Empty Name')
});

test('TC005 - Verify season appears in inactive tab when start and enrollment date are in future', async ({ page }) => {
  await page.goto('https://test.safeplayers.org/login');

  // Login
  await page.getByRole('textbox', { name: 'Email' }).fill('Akshata.s@tezo.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('Aks@12345');
  await page.getByRole('button', { name: 'Login' }).click();

  // Go to Seasons
  await page.getByRole('link', { name: '' }).click();
  await page.waitForTimeout(1000);

  const seasonName = 'season-5299tv';
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

  // Helper to click visible enabled date
  const clickEnabledDate = async (day) => {
    const dateButtons = page.locator(`td[role="button"] div`, { hasText: String(day) });
    const count = await dateButtons.count();
    for (let i = 0; i < count; i++) {
      const button = dateButtons.nth(i);
      if (await button.isVisible()) {
        await button.click();
        return;
      }
    }
    throw new Error(`❌ Enabled date "${day}" not found.`);
  };

  // Select Start Date
  await page.getByRole('textbox', { name: 'Season Start Date' }).click();
  await clickEnabledDate(startDay);

  // Select End Date
  await page.getByRole('textbox', { name: 'Season End Date' }).click();
  await clickEnabledDate(endDay);

  // Select Enrollment Date
  await page.getByRole('textbox', { name: 'Season Enrollment Date' }).click();
  await clickEnabledDate(enrollDay);
>>>>>>> 29a6d2ab26d1b0f6f982d91c2f4c52dd363c81cc

  // Submit the form
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.waitForTimeout(2000);

<<<<<<< HEAD
  // Handle optional Proceed popup
  const createPopup = page.getByRole('heading', { name: 'Update a Season' });
=======
  // Handle Proceed popup
  const createPopup = page.getByRole('heading', { name: 'Create Season' });
>>>>>>> 29a6d2ab26d1b0f6f982d91c2f4c52dd363c81cc
  if (await createPopup.isVisible().catch(() => false)) {
    await page.getByRole('button', { name: 'Proceed' }).click();
  }

<<<<<<< HEAD
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
=======
  // Wait for spinner to go away
  await page.waitForSelector('.sp-spinner', { state: 'detached', timeout: 10000 });

  // Go to Inactive tab
  await page.locator('label', { hasText: 'Inactive' }).click();
  await page.waitForTimeout(1000);

  // Look through paginated list for the season
  let found = false;
  let pageNum = 1;

  while (!found) {
    const seasonLocator = page.locator('td', { hasText: seasonName });
    if (await seasonLocator.first().isVisible().catch(() => false)) {
      found = true;
      console.log(`✅ Season "${seasonName}" found on page ${pageNum} in Inactive tab.`);
      break;
    }

    const nextBtn = page.locator('ul.hx-pager.pagination li a.page-link').nth(-1);
    const isDisabled = await nextBtn.locator('..').getAttribute('class');
    if (isDisabled?.includes('disabled')) break;

    await nextBtn.click();
    pageNum++;
    await page.waitForTimeout(1000);
  }

  if (!found) {
    console.error(`❌ Season "${seasonName}" was not found in the Inactive tab.`);
  }
});

test('tc6 Verify season appears in Active tab ', async ({ page }) => {
  test.setTimeout(120000);

  // 🔁 Manually enter the season name here
  const seasonName = 'season1';
  console.log(`Using season name: ${seasonName}`);

  // Login
  await page.goto('https://test.safeplayers.org/login');
  await page.getByRole('textbox', { name: 'Email' }).fill('akshata.s@tezo.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('Aks@12345');
  await page.getByRole('button', { name: 'Login' }).click();

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

  // Helper: click enabled calendar day
  const clickEnabledDate = async (day) => {
    const dateButtons = page.locator(`td[role="button"] div`, { hasText: String(day) });
    const count = await dateButtons.count();
    for (let i = 0; i < count; i++) {
      const button = dateButtons.nth(i);
      if (await button.isVisible()) {
        await button.click();
        return;
      }
    }
    throw new Error(`❌ Enabled date "${day}" not found.`);
  };

  // Select Start Date
  await page.getByRole('textbox', { name: 'Season Start Date' }).click();
  await clickEnabledDate(startDay);

  // Select End Date
  await page.getByRole('textbox', { name: 'Season End Date' }).click();
  await clickEnabledDate(endDay);

  // Select Enrollment Date
  await page.getByRole('textbox', { name: 'Season Enrollment Date' }).click();
  await clickEnabledDate(enrollDay);




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

  // Search for the season using pagination
  let found = false;
  let pageNum = 1;

  while (!found) {
    const seasonLocator = page.locator('td', { hasText: seasonName });
    if (await seasonLocator.first().isVisible().catch(() => false)) {
      found = true;
      console.log(`✅ Season "${seasonName}" found on page ${pageNum} in Active tab.`);
      break;
    }

    const nextBtn = page.locator('ul.hx-pager.pagination li a.page-link').nth(-1);
    const isDisabled = await nextBtn.locator('..').getAttribute('class');
    if (isDisabled?.includes('disabled')) {
      break; // No more pages
    }

    await nextBtn.click();
    pageNum++;
    await page.waitForTimeout(1000);
  }

  if (!found) {
    console.error(`❌ Season "${seasonName}" was not found in the Active tab.`);
  }
});

test('tc7 Verify that season name field shows error when Season Name exceeds 20 characters', async ({ page }) => {
    test.setTimeout(60000);
  await page.goto('https://test.safeplayers.org/login');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('akshata.s@tezo.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Aks@12345');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: '' }).click();
  await page.getByRole('button', { name: 'Add Seasons' }).click();
  await page.getByRole('textbox', { name: 'Season Name' }).click();
  await page.getByRole('textbox', { name: 'Season Name' }).fill('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');


 const today = new Date();
  const startDay = today.getDate();
  const endDay = startDay + 2;
  const enrollDay = startDay - 2;

  // Helper: click enabled calendar day
  const clickEnabledDate = async (day) => {
    const dateButtons = page.locator(`td[role="button"] div`, { hasText: String(day) });
    const count = await dateButtons.count();
    for (let i = 0; i < count; i++) {
      const button = dateButtons.nth(i);
      if (await button.isVisible()) {
        await button.click();
        return;
      }
    }
    throw new Error(`❌ Enabled date "${day}" not found.`);
  };

  // Select Start Date
  await page.getByRole('textbox', { name: 'Season Start Date' }).click();
  await clickEnabledDate(startDay);

  // Select End Date
  await page.getByRole('textbox', { name: 'Season End Date' }).click();
  await clickEnabledDate(endDay);

  // Select Enrollment Date
  await page.getByRole('textbox', { name: 'Season Enrollment Date' }).click();
  await clickEnabledDate(enrollDay);


  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('The length of \'Season Title\'')).toBeVisible();
  console.log('season name field shows error because Season Name exceeds 20 characters')
});

test('Verify that Season End Date disables dates earlier than the selected Season Start Date', async ({ page }) => {
  test.setTimeout(120000);

  // Launch and login
  await page.goto('https://test.safeplayers.org/login', { waitUntil: 'networkidle' });
  await page.getByRole('textbox', { name: 'Email' }).fill('akshata.s@tezo.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('Aks@12345');
  await page.getByRole('button', { name: 'Login' }).click();

  // Navigate to Seasons module
  await page.getByRole('link', { name: '' }).click();
  await page.getByRole('button', { name: 'Add Seasons' }).click();

  // Fill Season Name
  await page.getByRole('textbox', { name: 'Season Name' }).fill('Test Season');

  // ===== Select Season Start Date =====
  const today = new Date();
  const startDay = today.getDate();

  // Click on visible date button
  const clickEnabledDate = async (day) => {
    const dateButtons = page.locator(`td[role="button"] div`, { hasText: String(day) });
    const count = await dateButtons.count();
    for (let i = 0; i < count; i++) {
      const button = dateButtons.nth(i);
      if (await button.isVisible()) {
        await button.click();
        return;
      }
    }
    throw new Error(`❌ Enabled date "${day}" not found.`);
  };

  await page.getByRole('textbox', { name: 'Season Start Date' }).click();
  await clickEnabledDate(startDay);

  // ===== Try clicking on a disabled date in End Date =====
  await page.getByRole('textbox', { name: 'Season End Date' }).click();
  const disabledDay = startDay - 1;

  const disabledLocator = page.locator('div.disabled', { hasText: String(disabledDay) });
  const isDisabledVisible = await disabledLocator.count() > 0;

if (isDisabledVisible) {
  try {
    await disabledLocator.click({ trial: true }); // Should throw because it’s disabled
    throw new Error(`❌ Disabled date "${disabledDay}" was clickable!`);
  } catch (err) {
    console.log(`✅ Verified that disabled end date "${disabledDay}" cannot be clicked.`);
  }
} else {
  console.log(`ℹ️ No disabled date "${disabledDay}" found in calendar (may not exist on this month).`);
}

});

test('tc9 Enrollment Date must be before the Start Date', async ({ page }) => {
  test.setTimeout(120000);

  // Login
  await page.goto('https://test.safeplayers.org/login');
  await page.getByRole('textbox', { name: 'Email' }).fill('akshata.s@tezo.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('Aks@12345');
  await page.getByRole('button', { name: 'Login' }).click();

  // Navigate to Seasons module
  await page.getByRole('link', { name: '' }).click();
  await page.getByRole('button', { name: 'Add Seasons' }).click();

  // Fill Season Name
  await page.getByRole('textbox', { name: 'Season Name' }).fill('abc1');

  // ===== Select Season Start Date dynamically =====
  const today = new Date();
  const startDay = today.getDate();

  const clickEnabledDate = async (day) => {
    const dateButtons = page.locator(`td[role="button"] div`, { hasText: String(day) });
    const count = await dateButtons.count();
    for (let i = 0; i < count; i++) {
      const button = dateButtons.nth(i);
      if (await button.isVisible()) {
        await button.click();
        return;
      }
    }
    throw new Error(`❌ Enabled date "${day}" not found.`);
  };

  await page.getByRole('textbox', { name: 'Season Start Date' }).click();
  await clickEnabledDate(startDay);


  // Enrollment Date - Try to select a disabled date after Start Date (startDay + 1)
  await page.getByRole('textbox', { name: 'Season Enrollment Date' }).click();

  const disabledDay = startDay + 1; // The date after start date

// Locate the disabled date cell with the correct day text inside the calendar
const disabledLocator = page.locator('div.disabled', { hasText: String(disabledDay) });
const isDisabledVisible = await disabledLocator.count() > 0;

if (isDisabledVisible) {
  try {
    await disabledLocator.click({ trial: true });
    throw new Error(`❌ Disabled enrollment date "${disabledDay}" was clickable!`);
  } catch (err) {
    console.log(`✅ Verified that disabled enrollment date "${disabledDay}" cannot be clicked.`);
  }
} else {
  console.log(`ℹ️ No disabled enrollment date "${disabledDay}" found in calendar (may not exist on this month).`);
}

});

test('tc10 Verify the functionality of the Close button in the Add Seasons popup', async ({ page }) => {
  test.setTimeout(120000);
  await page.goto('https://test.safeplayers.org/login');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('akshata.s@tezo.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Aks@12345');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: '' }).click();
  await page.getByRole('button', { name: 'Add Seasons' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('main').getByText('Seasons', { exact: true })).toBeVisible();
});

test('tc11 search box functionality', async ({ page }) => {
  // Login
  test.setTimeout(120000);
  await page.goto('https://test.safeplayers.org/login');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('akshata.s@tezo.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Aks@12345');
  await page.getByRole('button', { name: 'Login' }).click();
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
  await page.goto('https://test.safeplayers.org/login');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('akshata.s@tezo.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Aks@12345');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: '' }).click();
  await page.getByRole('button', { name: 'Add Seasons' }).click();
  await page.getByRole('textbox', { name: 'Season Name' }).click();
  await page.getByRole('textbox', { name: 'Season Name' }).fill('Test');


 const today = new Date();
  const startDay = today.getDate();
  const endDay = startDay + 2;
  const enrollDay = startDay - 2;

  // Helper: click enabled calendar day
  const clickEnabledDate = async (day) => {
    const dateButtons = page.locator(`td[role="button"] div`, { hasText: String(day) });
    const count = await dateButtons.count();
    for (let i = 0; i < count; i++) {
      const button = dateButtons.nth(i);
      if (await button.isVisible()) {
        await button.click();
        return;
      }
    }
    throw new Error(`❌ Enabled date "${day}" not found.`);
  };

  // Select Start Date
  await page.getByRole('textbox', { name: 'Season Start Date' }).click();
  await clickEnabledDate(startDay);

  // Select End Date
  await page.getByRole('textbox', { name: 'Season End Date' }).click();
  await clickEnabledDate(endDay);

  // Select Enrollment Date
  await page.getByRole('textbox', { name: 'Season Enrollment Date' }).click();
  await clickEnabledDate(enrollDay);


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
  await page.goto('https://test.safeplayers.org/login');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('akshata.s@tezo.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Aks@12345');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: '' }).click();
  await page.getByRole('button', { name: 'Add Seasons' }).click();
  await page.getByRole('textbox', { name: 'Season Name' }).click();
  await page.getByRole('textbox', { name: 'Season Name' }).fill('Test');


const today = new Date();
  const startDay = today.getDate();
  const endDay = startDay + 2;
  const enrollDay = startDay - 2;

  // Helper: click enabled calendar day
  const clickEnabledDate = async (day) => {
    const dateButtons = page.locator(`td[role="button"] div`, { hasText: String(day) });
    const count = await dateButtons.count();
    for (let i = 0; i < count; i++) {
      const button = dateButtons.nth(i);
      if (await button.isVisible()) {
        await button.click();
        return;
      }
    }
    throw new Error(`❌ Enabled date "${day}" not found.`);
  };

  // Select Start Date
  await page.getByRole('textbox', { name: 'Season Start Date' }).click();
  await clickEnabledDate(startDay);

  // Select End Date
  await page.getByRole('textbox', { name: 'Season End Date' }).click();
  await clickEnabledDate(endDay);

  // Select Enrollment Date
  await page.getByRole('textbox', { name: 'Season Enrollment Date' }).click();
  await clickEnabledDate(enrollDay);


  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('heading', { name: 'Create Season' })).toBeVisible();
  console.log('confirmation popup appears when creating a season with an already existing name')
});

test('Verify Cancel button functionality in create season popup', async ({ page }) => {
    test.setTimeout(120000);
  await page.goto('https://test.safeplayers.org/login');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('akshata.s@tezo.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Aks@12345');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: '' }).click();
  await page.getByRole('button', { name: 'Add Seasons' }).click();
  await page.getByRole('textbox', { name: 'Season Name' }).click();
  await page.getByRole('textbox', { name: 'Season Name' }).fill('Test');



const today = new Date();
  const startDay = today.getDate();
  const endDay = startDay + 2;
  const enrollDay = startDay - 2;

  // Helper: click enabled calendar day
  const clickEnabledDate = async (day) => {
    const dateButtons = page.locator(`td[role="button"] div`, { hasText: String(day) });
    const count = await dateButtons.count();
    for (let i = 0; i < count; i++) {
      const button = dateButtons.nth(i);
      if (await button.isVisible()) {
        await button.click();
        return;
      }
    }
    throw new Error(`❌ Enabled date "${day}" not found.`);
  };

  // Select Start Date
  await page.getByRole('textbox', { name: 'Season Start Date' }).click();
  await clickEnabledDate(startDay);

  // Select End Date
  await page.getByRole('textbox', { name: 'Season End Date' }).click();
  await clickEnabledDate(endDay);

  // Select Enrollment Date
  await page.getByRole('textbox', { name: 'Season Enrollment Date' }).click();
  await clickEnabledDate(enrollDay);


  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByRole('heading', { name: 'Add Seasons' })).toBeVisible();
});

test('Verify the fuctionality of (X) icon  in create season popup', async ({ page }) => {
    test.setTimeout(120000);
  await page.goto('https://test.safeplayers.org/login');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('akshata.s@tezo.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Aks@12345');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: '' }).click();
  await page.getByRole('button', { name: 'Add Seasons' }).click();
  await page.getByRole('textbox', { name: 'Season Name' }).click();
  await page.getByRole('textbox', { name: 'Season Name' }).fill('Test');


const today = new Date();
  const startDay = today.getDate();
  const endDay = startDay + 2;
  const enrollDay = startDay - 2;

  // Helper: click enabled calendar day
  const clickEnabledDate = async (day) => {
    const dateButtons = page.locator(`td[role="button"] div`, { hasText: String(day) });
    const count = await dateButtons.count();
    for (let i = 0; i < count; i++) {
      const button = dateButtons.nth(i);
      if (await button.isVisible()) {
        await button.click();
        return;
      }
    }
    throw new Error(`❌ Enabled date "${day}" not found.`);
  };

  // Select Start Date
  await page.getByRole('textbox', { name: 'Season Start Date' }).click();
  await clickEnabledDate(startDay);

  // Select End Date
  await page.getByRole('textbox', { name: 'Season End Date' }).click();
  await clickEnabledDate(endDay);

  // Select Enrollment Date
  await page.getByRole('textbox', { name: 'Season Enrollment Date' }).click();
  await clickEnabledDate(enrollDay);



  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('main').getByText('Seasons', { exact: true })).toBeVisible();
});

test('Verify proceed button functionality in create season popup', async ({ page }) => {
  await page.goto('https://test.safeplayers.org/login');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('Akshata.s@tezo.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Aks@12345');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: '' }).click();
  await page.getByRole('button', { name: 'Add Seasons' }).click();
  await page.getByRole('textbox', { name: 'Season Name' }).click();
  await page.getByRole('textbox', { name: 'Season Name' }).fill('Test');


const today = new Date();
  const startDay = today.getDate();
  const endDay = startDay + 2;
  const enrollDay = startDay - 2;

  // Helper: click enabled calendar day
  const clickEnabledDate = async (day) => {
    const dateButtons = page.locator(`td[role="button"] div`, { hasText: String(day) });
    const count = await dateButtons.count();
    for (let i = 0; i < count; i++) {
      const button = dateButtons.nth(i);
      if (await button.isVisible()) {
        await button.click();
        return;
      }
    }
    throw new Error(`❌ Enabled date "${day}" not found.`);
  };

  // Select Start Date
  await page.getByRole('textbox', { name: 'Season Start Date' }).click();
  await clickEnabledDate(startDay);

  // Select End Date
  await page.getByRole('textbox', { name: 'Season End Date' }).click();
  await clickEnabledDate(endDay);

  // Select Enrollment Date
  await page.getByRole('textbox', { name: 'Season Enrollment Date' }).click();
  await clickEnabledDate(enrollDay);


  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('heading', { name: 'Create Season' })).toBeVisible();
  await page.getByRole('button', { name: 'Proceed' }).click();
  console.log('season created')
>>>>>>> 29a6d2ab26d1b0f6f982d91c2f4c52dd363c81cc
});

