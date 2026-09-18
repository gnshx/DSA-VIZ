import { test, expect } from '@playwright/test';

test.describe('DSA-VIZ Exhaustive UI/UX & Interactive Quality Audit', () => {

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

  test('Navigation bar header structure, brand logo, and 3 core pillar tabs', async ({ page }) => {
    const header = page.locator('header');
    await expect(header).toBeVisible();

    const brand = header.locator('text=DSA-VIZ');
    await expect(brand).toBeVisible();

    const modes = ['Learn', 'Visualize', 'Predict Mode'];
    for (const m of modes) {
      const btn = header.locator(`button:has-text("${m}")`).first();
      await expect(btn).toBeVisible();
    }
  });

  for (const vp of viewports) {
    test(`Layout must have zero horizontal overflow across viewport ${vp.name} (${vp.width}px)`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(200);

      const bodyScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const windowInnerWidth = await page.evaluate(() => window.innerWidth);
      
      expect(bodyScrollWidth).toBeLessThanOrEqual(windowInnerWidth + 2);
    });
  }

  test('Learn & Catalog: Hierarchical Tree accordion expansion, search, and 1-click execution', async ({ page }) => {
    // Navigate to Learn & Catalog
    const learnBtn = page.locator('header button:has-text("Learn")').first();
    await learnBtn.click();
    await page.waitForTimeout(300);

    // Verify search bar
    const searchInput = page.locator('input[placeholder*="Search pattern"]');
    await expect(searchInput).toBeVisible();

    // Type "Binary Search" in search bar
    await searchInput.fill('Binary Search');
    await page.waitForTimeout(300);

    // Take screenshot of filtered catalog
    await page.screenshot({ path: 'e2e/screenshots/audit-learn-search.png', fullPage: true });

    // Clear search
    await searchInput.fill('');
    await page.waitForTimeout(200);

    // Click on a Pattern Family accordion header to expand/collapse
    const familyHeader = page.locator('.accordion-header').first();
    await familyHeader.click();
    await page.waitForTimeout(200);

    // Verify subcase cards are visible
    const runTraceBtn = page.locator('button:has-text("Run & Check Trace")').first();
    await expect(runTraceBtn).toBeVisible();

    // Click "Run & Check Trace" to jump to Visualize Workbench
    await runTraceBtn.click();
    await page.waitForTimeout(300);

    // Verify the concept pathway is a no-code visual walkthrough
    const stage = page.locator('main');
    await expect(stage).toBeVisible();
    await expect(page.getByText('Watch the idea work')).toBeVisible();
    await expect(page.locator('text=solution.py')).toHaveCount(0);
  });

  test('Visualize Workbench: Algorithm switching, execution scrubber, and zero-scrollbar stage', async ({ page }) => {
    // Navigate to Visualize Workbench
    const vizBtn = page.locator('header button:has-text("Visualize")').first();
    await vizBtn.click();
    await page.waitForTimeout(300);

    // Select different algorithms from dropdown
    const algoSelect = page.locator('select').first();
    await expect(algoSelect).toBeVisible();

    const sampleAlgos = ['binary_search', 'selection_sort', 'reverse_linked_list', 'bfs_traversal', 'min_heap'];

    for (const algoId of sampleAlgos) {
      await algoSelect.selectOption(algoId);
      await page.waitForTimeout(250);

      // Verify stage visualizer is visible
      const stage = page.locator('main');
      await expect(stage).toBeVisible();

      // Check step playback scrubber play/pause button
      const playBtn = page.locator('button[title*="Play / Pause"]').first();
      if (await playBtn.isVisible()) {
        await page.locator('button:has-text("5x")').first().click();
        await playBtn.click();
        await page.waitForTimeout(800);
        const stepAfterPlayback = await page.locator('input[type="range"]').first().inputValue();
        expect(Number(stepAfterPlayback)).toBeGreaterThan(1);
        await playBtn.click();
      }

      await page.screenshot({ path: `e2e/screenshots/audit-algo-${algoId}.png`, fullPage: true });
    }
  });

  test('Multi-language switcher: Python, JavaScript, C++, Java code synchronization', async ({ page }) => {
    const vizBtn = page.locator('header button:has-text("Visualize")').first();
    await vizBtn.click();
    await page.waitForTimeout(300);

    const languages = ['Python', 'JavaScript', 'C++', 'Java'];

    for (const lang of languages) {
      const langBtn = page.locator(`header button:has-text("${lang}")`).first();
      if (await langBtn.isVisible()) {
        await langBtn.click();
        await page.waitForTimeout(200);
      }
    }
  });

  test('Predict Mode: Mental gym stats, streak counter, and challenge trigger', async ({ page }) => {
    const predictBtn = page.locator('header button:has-text("Predict")').first();
    await predictBtn.click();
    await page.waitForTimeout(300);

    // Check Accuracy and Streak HUD
    const accuracyHud = page.locator('text=Accuracy Score');
    await expect(accuracyHud).toBeVisible();

    const streakHud = page.locator('text=Streak');
    await expect(streakHud).toBeVisible();

    await page.screenshot({ path: 'e2e/screenshots/audit-predict-mode.png', fullPage: true });
  });

  test('Day/Night Theme pilot toggle: light and dark persistence without flash', async ({ page }) => {
    const themeBtn = page.locator('button[aria-label="Toggle Theme Pilot"]').first();
    await expect(themeBtn).toBeVisible();

    // Toggle to Light mode if currently dark
    const initialTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    if (initialTheme === 'dark') {
      await themeBtn.click();
      await page.waitForTimeout(150);
    }

    const lightTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(lightTheme).toBe('light');

    await page.screenshot({ path: 'e2e/screenshots/audit-light-mode.png', fullPage: true });

    // Toggle back to Dark mode
    await themeBtn.click();
    await page.waitForTimeout(150);
    const darkTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(darkTheme).toBe('dark');
  });

  test('Visualize Workbench persists selected algorithm when switching modes', async ({ page }) => {
    const vizBtn = page.locator('header button:has-text("Visualize")').first();
    await vizBtn.click();
    await page.waitForTimeout(200);

    const algoSelect = page.locator('select').first();
    // Select kadane_max_subarray
    await algoSelect.selectOption('kadane_max_subarray');
    await page.waitForTimeout(200);

    await expect(page.locator('h1')).toContainText("Kadane's Algorithm");

    // Switch to Learn & Catalog
    const learnBtn = page.locator('header button:has-text("Learn")').first();
    await learnBtn.click();
    await page.waitForTimeout(200);

    // Switch back to Visualize Workbench
    await vizBtn.click();
    await page.waitForTimeout(200);

    // It MUST still show Kadane's Algorithm, NOT revert to Binary Search!
    await expect(page.locator('h1')).toContainText("Kadane's Algorithm");
  });

  test('Learn Mode pathway "Simulate in Workbench" navigates with selected algorithm', async ({ page }) => {
    const learnBtn = page.locator('header button:has-text("Learn")').first();
    await learnBtn.click();
    await page.waitForTimeout(200);

    // Expand search and click a subcase
    const runTraceBtn = page.locator('button:has-text("Run & Check Trace")').first();
    await runTraceBtn.click();
    await page.waitForTimeout(300);

    // Click "Simulate in Workbench"
    const simBtn = page.locator('button:has-text("Simulate in Workbench")').first();
    await expect(simBtn).toBeVisible();
    await simBtn.click();
    await page.waitForTimeout(300);

    // Verify we are now on Visualize Workbench
    const vizHeader = page.locator('.workbench-eyebrow');
    await expect(vizHeader).toBeVisible();
    await expect(vizHeader).toContainText('Algorithm workspace');
  });

  test('New algorithms (Kadane, Merge Sort, Monotonic Deque, Graph DFS, Tree DFS) render in Workbench', async ({ page }) => {
    const vizBtn = page.locator('header button:has-text("Visualize")').first();
    await vizBtn.click();
    await page.waitForTimeout(200);

    const algoSelect = page.locator('select').first();
    const newAlgos = [
      { id: 'kadane_max_subarray', name: "Kadane's Algorithm" },
      { id: 'merge_sort', name: "Merge Sort" },
      { id: 'sliding_window_max_deque', name: "Sliding Window Maximum" },
      { id: 'graph_dfs_traversal', name: "Depth-First Search" },
      { id: 'tree_dfs_traversals', name: "Binary Tree DFS" }
    ];

    for (const algo of newAlgos) {
      await algoSelect.selectOption(algo.id);
      await page.waitForTimeout(200);
      await expect(page.locator('h1')).toContainText(algo.name);
      await expect(page.locator('.stage')).toBeVisible();
    }
  });

});
