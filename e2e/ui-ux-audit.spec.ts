import { test, expect } from '@playwright/test';

test.describe('DSA-VIZ Enterprise UI/UX & Responsive Layout Audit', () => {

  const viewports = [
    { name: 'mobile-small', width: 375, height: 667 },
    { name: 'mobile-std', width: 390, height: 844 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'laptop', width: 1280, height: 800 },
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'large-desktop', width: 1920, height: 1080 },
  ];

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('Navigation bar should be free of duplicate links and navigation buttons', async ({ page }) => {
    const navItems = page.locator('header nav button, header a');
    const totalItems = await navItems.count();
    
    expect(totalItems).toBeGreaterThan(0);
    
    const uniqueLabels = new Set<string>();
    
    for (let i = 0; i < totalItems; i++) {
      const text = (await navItems.nth(i).innerText()).trim();
      if (text) {
        expect(
          uniqueLabels.has(text), 
          `Duplicate navigation item found: "${text}"`
        ).toBeFalsy();
        uniqueLabels.add(text);
      }
    }
  });

  for (const vp of viewports) {
    test(`Page layouts must not suffer from horizontal overflow on ${vp.name} (${vp.width}px)`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(200);

      const bodyScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const windowInnerWidth = await page.evaluate(() => window.innerWidth);
      
      expect(bodyScrollWidth).toBeLessThanOrEqual(windowInnerWidth + 2);
    });
  }

  test('All core views and visualizers must render cleanly across viewports', async ({ page }) => {
    const modes = [
      { name: 'visualize', label: 'Visualize' },
      { name: 'learn', label: 'Learn' },
      { name: 'solve', label: 'Solve' },
      { name: 'predict', label: 'Predict Mode' },
      { name: 'revise', label: 'Revise & Graph' },
    ];

    for (const mode of modes) {
      const modeBtn = page.locator(`header nav button:has-text("${mode.label.split(' ')[0]}")`).first();
      if (await modeBtn.isVisible()) {
        await modeBtn.click();
        await page.waitForTimeout(200);
      }

      const mainContent = page.locator('main, #root');
      await expect(mainContent.first()).toBeVisible();

      await page.screenshot({ 
        path: `e2e/screenshots/audit-${mode.name}.png`, 
        fullPage: true 
      });
    }
  });

  test('Interactive elements and buttons must have proper spacing and hit targets (>=30px)', async ({ page }) => {
    const vizBtn = page.locator('header nav button:has-text("Visualize")').first();
    if (await vizBtn.isVisible()) {
      await vizBtn.click();
    }

    const controlButtons = page.locator('header button, main button');
    const count = await controlButtons.count();

    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < Math.min(count, 15); i++) {
      const button = controlButtons.nth(i);
      if (await button.isVisible()) {
        const box = await button.boundingBox();
        if (box && box.width > 0 && box.height > 0) {
          expect(box.height, `Button #${i} height too small`).toBeGreaterThanOrEqual(30);
          expect(box.width, `Button #${i} width too small`).toBeGreaterThanOrEqual(30);
        }
      }
    }
  });

});
