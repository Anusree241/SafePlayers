import { test, expect } from '@playwright/test';

test('Verify the UI of Create Club', async ({ page }) => {
  await page.goto('https://test.safeplayers.org/login', {waitUntil : 'domcontentloaded'});
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('anusree.e+eorgadmin@tezo.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('@nuUr333');
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
  await page.getByRole('textbox', { name: 'Email' }).fill('anusree.e+eorgadmin@tezo.com');[]
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('@nuUr333');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForLoadState('domcontentloaded');
  const createClubButton = page.getByRole('button', {name: 'Create Club' });
  await createClubButton.waitFor({ state: 'visible', timeout: 60000 });
  await page.getByText('test club Active Players 0').click(); //test data
  await expect(page.getByText('test club').nth(1)).toBeVisible(); //test data
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
  await page.getByRole('textbox', { name: 'Email' }).fill('anusree.e+eorgadmin@tezo.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('@nuUr333');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForLoadState('domcontentloaded');
  const createClubButton = page.getByRole('button', {name: 'Create Club' });
  await createClubButton.waitFor({ state: 'visible', timeout: 60000 });
  await page.getByText('test club Active Players 0 Total').click(); //test data
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
  await page.getByRole('textbox', { name: 'Email' }).fill('anusree.e+eorgadmin@tezo.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('@nuUr333');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForLoadState('domcontentloaded');
  const createClubButton = page.getByRole('button', {name: 'Create Club' });
  await createClubButton.waitFor({ state: 'visible', timeout: 60000 });
  await page.getByRole('button', { name: 'Create Club' }).click();
  await expect(page.getByText('Create a Club')).toBeVisible();
  await page.getByRole('textbox', { name: 'Club Name' }).click();
  await page.getByRole('textbox', { name: 'Club Name' }).fill('tstcb');
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).fill('test');
  await page.getByRole('textbox', { name: 'Season' }).click();
  await page.getByRole('button', { name: 'test 5/31/2025 - 6/5/' }).click(); //test data
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
  await page.getByRole('textbox', { name: 'Email' }).fill('anusree.e+eorgadmin@tezo.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('@nuUr333');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForLoadState('domcontentloaded');
  const createClubButton = page.getByRole('button', {name: 'Create Club' });
  await createClubButton.waitFor({ state: 'visible', timeout: 60000 });
  await page.getByRole('button', { name: 'Create Club' }).click();
  await expect(page.getByRole('dialog')).toContainText('Create a Club');
  await page.getByRole('textbox', { name: 'Club Name' }).click();
  await page.getByRole('textbox', { name: 'Club Name' }).fill('......');
  await page.getByRole('textbox', { name: 'Description' }).click();
  await expect(page.locator('form')).toContainText('Club Name is Invalid.');
  await page.getByRole('button', { name: 'Close' }).click();
});

test('Verify whether the user can Create a Club with Empty Fields', async ({ page }) => {
  await page.goto('https://test.safeplayers.org/login', {waitUntil : 'domcontentloaded'});
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('anusree.e+eorgadmin@tezo.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('@nuUr333');
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
  await page.getByRole('textbox', { name: 'Email' }).fill('anusree.e+eorgadmin@tezo.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('@nuUr333');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForLoadState('domcontentloaded');
  const createClubButton = page.getByRole('button', {name: 'Create Club' });
  await createClubButton.waitFor({ state: 'visible', timeout: 60000 });
  await page.getByText('clubszz Active Players 0 Total').click(); //test data
  await expect(page.getByText('clubszz').nth(1)).toBeVisible(); //test data
  await expect(page.getByRole('button', { name: ' Edit' })).toBeVisible();
  await page.getByRole('button', { name: ' Edit' }).click();
  await expect(page.getByText('Update a Club')).toBeVisible();
  await page.getByRole('textbox', { name: 'Club Name' }).click();
  await page.getByRole('textbox', { name: 'Club Name' }).fill('clubzz');//test data
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).fill('testt');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('clubzz').nth(1)).toBeVisible();
});

test('Verify whether theuser can able to Edit the Existing Club with Invalid details', async ({ page }) => {
  await page.goto('https://test.safeplayers.org/login', {waitUntil : 'domcontentloaded'});
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('anusree.e+eorgadmin@tezo.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('@nuUr333');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForLoadState('domcontentloaded');
  const createClubButton = page.getByRole('button', {name: 'Create Club' });
  await createClubButton.waitFor({ state: 'visible', timeout: 60000 });
  await page.getByText('test club Active Players 0').click(); //test data
  await expect(page.getByText('test club').nth(1)).toBeVisible(); //test data
  await expect(page.getByRole('button', { name: ' Edit' })).toBeVisible();
  await page.getByRole('button', { name: ' Edit' }).click();
  await expect(page.getByText('Update a Club')).toBeVisible();
  await page.getByRole('textbox', { name: 'Club Name' }).click();
  await page.getByRole('textbox', { name: 'Club Name' }).fill('>>?&^)*&)');
  await page.getByRole('textbox', { name: 'Description' }).click();
  await expect(page.locator('form')).toContainText('Club Name is Invalid.');
  await page.getByRole('button', { name: 'Close' }).click();
});

test('Verify whether the user can able to Edit the Existing Club with Missing fields', async ({ page }) => {
  await page.goto('https://test.safeplayers.org/login', {waitUntil : 'domcontentloaded'});
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('anusree.e+eorgadmin@tezo.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('@nuUr333');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForLoadState('domcontentloaded');
  const createClubButton = page.getByRole('button', {name: 'Create Club' });
  await createClubButton.waitFor({ state: 'visible', timeout: 60000 });
  await page.getByText('test club Active Players 0').click(); //test data
  await expect(page.getByText('test club').nth(1)).toBeVisible(); //test data
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
  await page.getByRole('textbox', { name: 'Email' }).fill('anusree.e+eorgadmin@tezo.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('@nuUr333');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForLoadState('domcontentloaded');
  const createClubButton = page.getByRole('button', {name: 'Create Club' });
  await createClubButton.waitFor({ state: 'visible', timeout: 60000 });
  await page.getByText('test club Active Players 0').click(); //test data
  await expect(page.getByText('test club').nth(1)).toBeVisible(); //test data
  await expect(page.getByRole('button', { name: ' Edit' })).toBeVisible();
  await page.getByRole('button', { name: ' Edit' }).click();
  await expect(page.getByText('Update a Club')).toBeVisible();
  await page.getByRole('textbox', { name: 'Club Name' }).click();
  await page.getByRole('textbox', { name: 'Club Name' }).fill('IPLmu');
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).fill('sample1fdgt');
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByText('test club').nth(1)).toBeVisible();
});

// test('Verify whether the user can able to Delete an Existing Club', async ({ page }) => {
//   await page.goto('https://test.safeplayers.org/login', {waitUntil : 'domcontentloaded'});
//   await page.getByRole('textbox', { name: 'Email' }).click();
//   await page.getByRole('textbox', { name: 'Email' }).fill('anusree.e+eorgadmin@tezo.com');
//   await page.getByRole('textbox', { name: 'Password' }).click();
//   await page.getByRole('textbox', { name: 'Password' }).fill('@nuUr333');
//   await page.getByRole('button', { name: 'Login' }).click();
//   await page.waitForLoadState('domcontentloaded');
//   const createClubButton = page.getByRole('button', {name: 'Create Club' });
//   await createClubButton.waitFor({ state: 'visible', timeout: 60000 });
  
//   await page.getByText('new club').click(); //test data
//   await expect(page.getByText('new club').nth(1)).toBeVisible(); //test data

//   await expect(page.getByRole('button', { name: ' Delete' })).toBeVisible();
//   await page.getByRole('button', { name: ' Delete' }).click();
//   await expect(page.getByRole('heading', { name: 'Delete Club' })).toBeVisible();
//   await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
//   await expect(page.getByRole('button', { name: 'Proceed' })).toBeVisible();
//   await page.getByRole('button', { name: 'Proceed' }).click();
// });

test('Verify whether the user can able to Cancel Club Deletion', async ({ page }) => {
  await page.goto('https://test.safeplayers.org/login', {waitUntil : 'domcontentloaded'});
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('anusree.e+eorgadmin@tezo.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('@nuUr333');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForLoadState('domcontentloaded');
  const createClubButton = page.getByRole('button', {name: 'Create Club' });
  await createClubButton.waitFor({ state: 'visible', timeout: 60000 });
  await page.getByText('test club Active Players 0').click(); //test data
  await expect(page.getByText('test club').nth(1)).toBeVisible(); //test data
  await expect(page.getByRole('button', { name: ' Delete' })).toBeVisible();
  await page.getByRole('button', { name: ' Delete' }).click();
  await expect(page.getByRole('heading', { name: 'Delete Club' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Proceed' })).toBeVisible();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByText('test club').nth(1)).toBeVisible();
});

test('Verify whether the user can create a Club with Duplicate Club Name', async ({ page }) => {
  await page.goto('https://test.safeplayers.org/login', {waitUntil : 'domcontentloaded'});
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('anusree.e+eorgadmin@tezo.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('@nuUr333');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForLoadState('domcontentloaded');
  const createClubButton = page.getByRole('button', {name: 'Create Club' });
  await createClubButton.waitFor({ state: 'visible', timeout: 60000 });
  await page.getByRole('button', { name: 'Create Club' }).click();
  await expect(page.getByText('Create a Club')).toBeVisible();
  await page.getByRole('textbox', { name: 'Club Name' }).click();
  await page.getByRole('textbox', { name: 'Club Name' }).fill('clubs');
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).fill('testing');
  await page.getByRole('textbox', { name: 'Season' }).click();
  await page.getByRole('button', { name: 'test 5/31/2025 - 6/5/' }).click(); //test data
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

