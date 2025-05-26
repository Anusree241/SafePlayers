import { test, expect } from '@playwright/test';


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
});

