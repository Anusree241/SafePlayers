import { expect } from '@playwright/test';
import { validEmail, validPassword } from '../locators/locators.js';

export async function login(page, email, password) {
  await page.goto('https://test.safeplayers.org/login', {waitUntil : 'domcontentloaded'});
  await page.getByRole('textbox', { name: 'Email' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Login' }).click({ timeout: 50000 });
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle');
  if(password == validPassword && email == validEmail)
  {
    const createClubButton = page.getByRole('button', {name: 'Create Club' });
    await createClubButton.waitFor({ state: 'visible', timeout: 120000 });
  }
}
  
  export async function verifyVisibleElements(page) {
    await expect(page.getByRole('img', { name: 'SP Logo' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
    await expect(page.getByText('Forgot Password?')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    await expect(page.getByText("Don't have an account?")).toBeVisible();
  }

  export async function openParentInviteForm(page) {
    await page.getByRole('link', { name: '' }).click(); // dashboard
    await page.getByText('Parents', { exact: true }).click();
    await expect(page.getByRole('main')).toContainText('Parents');
    await page.getByRole('button', { name: 'Invite' }).click();
    await expect(page.locator('h5')).toContainText('Invite Parent');
  }
  
  export async function verifyParentInviteFormUI(page) {
    await expect(page.getByRole('textbox', { name: 'Parent Name' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Parent Email' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
  }
  
  export async function sendParentInvite(page, name, email) {
    await page.getByRole('textbox', { name: 'Parent Name' }).click();
      await page.getByRole('textbox', { name: 'Parent Name' }).fill(name);
      await page.getByRole('textbox', { name: 'Parent Email' }).click();
      await page.getByRole('textbox', { name: 'Parent Email' }).fill(email);
      await page.getByRole('button', { name: 'Submit' }).click();
  }
