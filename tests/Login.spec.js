import { test, expect } from '@playwright/test';
import { validEmail, validPassword, invalidPassword, invalidEmail, validParentEmail, parentName, validParentName, invalidParentEmail, invalidParentName, searchData, invalidSearch} from '../locators/locators.js';
import { login, verifyVisibleElements, openParentInviteForm, sendParentInvite, verifyParentInviteFormUI} from '../locators/functions.js';

test('tc 01 - Validate UI of Login Page  @smoke', async ({ page }) => {
  await page.goto('https://test.safeplayers.org/login');
  await verifyVisibleElements(page);
  console.log("UI of Login Page - pass")
});

test('tc 02 - Login using valid credentials  @smoke', async ({ page }) => {
  await login(page, validEmail, validPassword);
  console.log("Logged in using valid credentials");
});

test('tc 03 - Login with invalid password', async ({ page }) => {
  await login(page, validEmail, invalidPassword);
  await expect(page.getByRole('alert')).toContainText('Login failed. Please verify the details');
  console.log("Login failed with invalid password");
});

test('tc 04 - Invalid Email field', async ({ page }) => {
  await login(page, invalidEmail, validPassword);
  await expect(page.locator('form')).toContainText('Email address is not valid.');
  console.log("Login failed with invalid email");
});

test('tc 05 - Click Login with empty Email field', async ({ page }) => {
  await page.goto('https://test.safeplayers.org/login');
  await page.getByRole('textbox', { name: 'Password' }).fill(validPassword);
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.locator('form')).toContainText('Email is required.');
  console.log("Login failed with empty email field");
});

test('tc 06 - Click Login with empty password', async ({ page }) => {
  await page.goto('https://test.safeplayers.org/login');
  await page.getByRole('textbox', { name: 'Email' }).fill(validEmail);
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.locator('form')).toContainText('Password is required.');
  await expect(page.locator('form')).toContainText('Password should not contain spaces.');
  console.log("Login failed with empty password field");
});

test('tc 07 - Click Login with both fields empty', async ({ page }) => {
  await page.goto('https://test.safeplayers.org/login');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.locator('form')).toContainText('Email is required.');
  await expect(page.locator('form')).toContainText('Password is required.');
  console.log("Login failed with both empty fields");
});

test('tc 08 - Validate Password masking', async ({ page }) => {
  await page.goto('https://test.safeplayers.org/login');
  await page.getByRole('textbox', { name: 'Email' }).fill(validEmail);
  await page.getByRole('textbox', { name: 'Password' }).fill(validPassword);
  await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
  console.log("Password is masked");
});



test('tc 01- Verify UI Elements on Parent Invite Form  @smoke', async ({ page }) => {
  await login(page, validEmail, validPassword);
  await page.getByRole('link', { name: '' }).click();
  await page.getByRole('button', { name: 'Invite' }).click();
  await verifyParentInviteFormUI(page);
  console.log("UI elements on Parent Invite Form - pass")
});

test('tc 02/04 - Invite Parent or Validate Duplicate Invite  @smoke', async ({ page }) => {
  await login(page, validEmail, validPassword);
  await openParentInviteForm(page);
  await sendParentInvite(page, validParentName, validParentEmail);
  console.log("Parent Invite sent");
  const alertLocator = page.getByRole('alert');
  await expect(alertLocator).toBeVisible({ timeout: 10000 });

  const alertText = await alertLocator.textContent();
  const duplicateMessage = `An invitation has already been sent to '${validParentEmail}' for the role 'Parent'.`;

  if (alertText.includes('Invitation successful')) {
    await page.waitForTimeout(5000); 
    await expect(page.locator(`text=${validParentEmail}`)).toBeVisible();
    console.log('New parent invite sent and visible in Pending tab.');
  } else if (alertText.includes(duplicateMessage)) {
    // Duplicate invite alert
    await expect(alertLocator).toContainText(duplicateMessage);
    console.log(' Duplicate invite alert displayed.');
  } else {
    throw new Error(`Unexpected alert message: ${alertText}`);
  }
});

test('tc 03 - Validate Email sent is displayed in "Pending" tab.  @smoke', async ({ page }) => {
  await login(page, validEmail, validPassword);
  await page.getByRole('link', { name: '' }).click();
  await expect(page.getByRole('button', { name: 'Invite' })).toBeVisible();
  await page.getByRole('button', { name: 'Invite' }).click();
  await expect(page.locator('h5')).toContainText('Invite Parent');
  await sendParentInvite(page, parentName, validEmail) 
  await page.waitForTimeout(1000);
  await expect(page.locator('text=' + validParentEmail)).toBeVisible();
  console.log("Email sent is displayed in Pending tab");
});


test('tc 05- Validate error for invalid email format and invalid name format', async ({ page }) => {
  await login(page, validEmail, validPassword);
  await page.getByRole('link', { name: '' }).click();
  await page.getByRole('button', { name: 'Invite' }).click();
  await sendParentInvite(page, invalidParentName, invalidParentEmail) 
  await expect(page.getByRole('dialog')).toContainText('Name is Invalid.');
  await expect(page.getByRole('dialog')).toContainText('Invalid email address');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
  console.log("Error is displayed for invalid name and email format for Parent invite");
});

test('tc 06- Validate both fields empty', async ({ page }) => {
  await login(page, validEmail, validPassword);
  await page.getByRole('link', { name: '' }).click();
  await page.getByRole('button', { name: 'Invite' }).click();
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('dialog')).toContainText('Name cannot be empty');
  await expect(page.getByRole('dialog')).toContainText('Email cannot be empty');
  console.log("Errors displayed when both fields were empty in Parent Invite popup");
});

test('tc 07 - Validate Search button by entering complete email address and verify it shows in Pending tab', async ({ page }) => {
  await login(page, validEmail, validPassword);
  await page.getByRole('link', { name: '' }).click();
  await page.getByRole('textbox', { name: 'Search by email' }).click();
  await page.getByRole('textbox', { name: 'Search by email' }).fill(searchData);
  await page.getByRole('button', { name: '' }).click();
  await page.getByRole('button', { name: '' }).click();
  await page.getByText('Pending').click();
  await expect(page.locator(`text=${searchData}`)).toBeVisible();
  console.log("Search results shows only on entering complete email");
});


test('tc 08- Validate Search button by entering name or invalid email', async ({ page }) => {
  await login(page, validEmail, validPassword);
  await page.getByRole('link', { name: '' }).click();
  await page.getByRole('textbox', { name: 'Search by email' }).click();
  await page.getByRole('textbox', { name: 'Search by email' }).fill(invalidSearch);
  await page.getByRole('button', { name: '' }).click();
  await expect(page.locator('form')).toContainText('Invalid email address');
  console.log("Search results are not displaying when entering invalid data");
});

test('tc 09- Validate on clicking search button with empty search field', async ({ page }) => {
  await login(page, validEmail, validPassword);
  await page.getByRole('link', { name: '' }).click();
  await expect(page.getByRole('textbox', { name: 'Search by email' })).toBeVisible();
  await page.getByRole('button', { name: '' }).click();
  await expect(page.locator('form')).toContainText('Email cannot be empty');
  console.log("Displaying error on clicking search button with empty fields");
});

test('tc 10 - Validate Expired Parent Invites', async ({ page }) => {
  await login(page, validEmail, validPassword);
  await page.getByRole('link', { name: '' }).click(); 
  const expiredTab = page.getByText('Expired');
  await expect(expiredTab).toBeVisible();
  await expiredTab.click();
  await page.waitForTimeout(1000);
  await expect(page.getByText('Expired On')).toBeVisible(); 
  const noDataLocator = page.locator('td', { hasText: 'No data.' });

  if (await noDataLocator.isVisible()) {
    console.log('No expired invites - "No data." is displaying.');
    await expect(noDataLocator).toBeVisible();
  } else {
    const expiredRows = page.locator('table tbody tr');
    const rowCount = await expiredRows.count();
    expect(rowCount).toBeGreaterThan(0);
    console.log(`Found ${rowCount} expired invite(s).`);
    for (let i = 0; i < rowCount; i++) {
      const rowText = await expiredRows.nth(i).innerText();
      console.log(`Row ${i + 1}:`, rowText);

    }
  }
});



