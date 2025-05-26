// Login function
export async function login(page) {
  await page.goto('https://test.safeplayers.org/login', { waitUntil: 'networkidle' });
  await page.getByRole('textbox', { name: 'Email' }).fill('anusree.e+eorgadmin@tezo.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('@nuUr333');
  await page.getByRole('button', { name: 'Login' }).click();
}


// Click an enabled date on calendar
export async function clickEnabledDate(page, day) {
  const dateButtons = page.locator(`td[role="button"]`, { hasText: String(day) });
  const count = await dateButtons.count();

  for (let i = 0; i < count; i++) {
    const button = dateButtons.nth(i);
    if (await button.isVisible()) {
      await button.click();
      return;
    }
  }

  throw new Error(`❌ Enabled date "${day}" not found.`);
}

// Try clicking a disabled date and verify it cannot be clicked
export async function verifyDisabledEnrollmentDate(page, day) {
  const disabledLocator = page.locator('div.disabled', { hasText: String(day) });
  const isDisabledVisible = await disabledLocator.count() > 0;

  if (isDisabledVisible) {
    try {
      await disabledLocator.click({ trial: true }); // attempt click in trial mode
      throw new Error(`❌ Disabled enrollment date "${day}" was clickable!`);
    } catch (err) {
      console.log(`✅ Verified that disabled enrollment date "${day}" cannot be clicked.`);
    }
  } else {
    console.log(`ℹ️ No disabled enrollment date "${day}" found in calendar (may not exist this month).`);
  }
}

 export async function verifyDisabledEndDate(page, disabledDay) {
  const disabledLocator = page.locator('div.disabled', { hasText: String(disabledDay) });
  const isDisabledVisible = (await disabledLocator.count()) > 0;

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
}

export const findSeasonInPagination = async (page, seasonName) => {
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
    if (isDisabled?.includes('disabled')) {
      break;
    }

    await nextBtn.click();
    pageNum++;
    await page.waitForTimeout(1000);
  }

  if (!found) {
    console.error(`❌ Season "${seasonName}" was not found in the Inactive tab.`);
  }

  return found;
};





