// Updated club contacts functions.js with reusable functions
import { expect } from '@playwright/test';

// 1 - Login
async function login(page, url, email, password) {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.getByRole('textbox', { name: 'Email' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('button', { name: 'Create Club' })).toBeVisible();
  console.log("User is on Homepage");
}

// 2 - Navigate to club contact page 
async function ClubContact(page) {
  await page.getByRole('link', { name: '' }).click();
  console.log("User is on Club Contact page");
}

// 3-  Verify that a given locator contains expected text
async function verifyContainsText(locator, expectedText) {
  await expect(locator).toContainText(expectedText);
}


// 4 - Click tab by visible text
async function clickTab(page, tabText) {
  await page.getByText(tabText, { exact: true }).click();
}

// 5 - Click button by accessible name
async function clickButton(page, buttonName, exact = false) {
  await page.getByRole('button', { name: buttonName, exact }).click();
}

// 6 - Verify if the textbox visibility by accessible name
async function verifyTextboxVisible(page, textboxName) {
  await expect(page.getByRole('textbox', { name: textboxName })).toBeVisible();
}

// 7 - Verify validation message visibility by exact text
async function verifyValidationMessage(page, message) {
  await expect(page.getByText(message)).toBeVisible();
}

// 8 - Fill a textbox by accessible name with given value and verify the value
async function fillTextboxAndVerify(page, textboxName, value) {
  await verifyTextboxVisible(page, textboxName);
  const textbox = page.getByRole('textbox', { name: textboxName });
  await textbox.fill(value);
  await expect(textbox).toHaveValue(value);
}

// 9 - Verifying the values of the last column in the table - Invites tab
async function verifyStatusInLastColumn(page, tableSelector, expectedStatus) {
  const rows = await page.locator(`${tableSelector} tr`);
  const rowCount = await rows.count();
  for (let i = 0; i < rowCount; i++) {
    const lastCell = rows.nth(i).locator('td:last-child');
    await expect(lastCell).toHaveText(new RegExp(`^${expectedStatus}$`, 'i'));
  }
}

// 11 - Function for capturing all the row data into an array in invites tab 
async function getRowData(page) {
  //await clickTab(page, 'Invites');
  await page.getByText('Invites', { exact: true }).click();
  const allRows = [];
  while (true) {
    await page.waitForSelector('tr[role="button"]', { timeout: 10000 });
    const rows = await page.$$eval('tr[role="button"]', trs => trs.map(tr => {
      const cells = tr.querySelectorAll('td');
      if (cells.length < 5) return null;
      const name = tr.querySelector('span.text-capitalize')?.innerText.trim();
      const email = cells[1]?.innerText.trim();
      const club = cells[2]?.innerText.trim();
      const date = cells[3]?.innerText.trim();
      const status = cells[4]?.innerText.trim();
      return { name, email, club, date, status };
    }).filter(Boolean));
    allRows.push(...rows);
    const isDisabled = await page.$('li.page-item.disabled i.icon-ic_fluent_arrow_circle_right_20_regular');
    if (isDisabled) break;
    const prevFirstRow = await page.$eval('tr[role="button"]', tr => tr.innerText.trim());
    await page.locator('li.page-item i.icon-ic_fluent_arrow_circle_right_20_regular').click();
    try {
      await page.waitForFunction(prev => {
        const row = document.querySelector('tr[role="button"]');
        return row && row.innerText.trim() !== prev;
      }, prevFirstRow, { timeout: 10000 });
    } catch {
      break;
    }
    await page.waitForLoadState('networkidle');
  }
  return allRows;
}

// 12 - Function to store current date 
function currentDate() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  return `${day}/${month}/${year}`;
}

// 13 - Function to fill and submit onboard modal
async function onboardClubContact(page, contactData, club,clubTitle) {
  await fillTextboxAndVerify(page, 'Name', contactData.name);
  await fillTextboxAndVerify(page, 'Email', contactData.email);
  await page.getByRole('textbox', { name: 'Club', exact: true }).click();

  // Wait for the dropdown to be visible
  const dropdown = page.locator('ul.dropdown-menu:visible');
  await expect(dropdown.first()).toBeVisible({ timeout: 5000 });
  
  // Locate all dropdown options
  const clubOptions = dropdown.first().locator('.request-type-list-item');
  
  // Define the option text you want to click
  const optionText = club ; 
  
  // Find the option by text and click it
  const optionToClick = clubOptions.filter({ hasText: optionText }).first();
  await expect(optionToClick).toBeVisible({ timeout: 5000 });
  await optionToClick.scrollIntoViewIfNeeded();
  await optionToClick.click();

  // Open the Club Title dropdown
  await page.getByRole('textbox', { name: 'Club Title', exact: true }).click();

  // Wait for the dropdown to become visible
  const titleDropdowns = page.locator('ul.dropdown-menu:visible');
  await expect(titleDropdowns.first()).toBeVisible({ timeout: 5000 });

  // Get all the visible options
  const titleOptions = titleDropdowns.first().locator('.request-type-list-item');

  // Define the option text you want to select
  const titleOptionText = clubTitle;

  // Find the option by its text
  const clubTitleElement = titleOptions.filter({ hasText: titleOptionText }).first();
  await expect(clubTitleElement).toBeVisible({ timeout: 5000 });
  await clubTitleElement.scrollIntoViewIfNeeded();
  await clubTitleElement.click();

  // Click Submit button
  await clickButton(page, 'Submit');

  console.log("Data entered in Onboard modal and Submit button clicked");

  //return {selectedClubOptionText,selectedClubTitleOptionText};
}

// 14 - Function to count dropodwn options
async function countClubDropdownOptions(page, textboxName) {
  // Click the textbox to open the dropdown
  await page.getByRole('textbox', { name: textboxName, exact: true }).click();

  // Wait for the dropdown menu to appear
  const dropdowns = page.locator('ul.dropdown-menu:visible');
  await expect(dropdowns.first()).toBeVisible({ timeout: 5000 });

  // Find all option elements in the dropdown
  const options = dropdowns.first().locator('.request-type-list-item');

  // Ensure the first option is visible before counting
  await expect(options.first()).toBeVisible({ timeout: 5000 });
  
  const count = await options.count();
  await page.getByRole('heading', { name: 'Onboard a new Club Contact' }).click();
  const res = (count > 0) ? count : "No club options are available in the dropdown";
  return res;
}

// 15 - Function to verify re invite modal UI
async function verifyReInviteModalUI(page, contactData) {
  await expect(page.locator('h5')).toContainText('Re Invite');
  await expect(page.getByRole('dialog')).toContainText(contactData.name);
  await expect(page.getByRole('dialog')).toContainText(contactData.email);
  await expect(page.getByRole('dialog')).toContainText('This will cancel the existing invitation');
  await expect(page.locator('b')).toContainText('Are you sure you want to re-invite this club contact?');
  await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Proceed' })).toBeVisible();
  console.log("Re Invite modal UI verified");
}

module.exports = {
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
};
