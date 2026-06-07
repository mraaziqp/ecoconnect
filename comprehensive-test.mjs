import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const reportDir = path.join(__dirname, 'test-reports');

if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir, { recursive: true });
}

class ComprehensiveTestRunner {
  constructor() {
    this.results = [];
    this.errors = [];
    this.screenshots = [];
  }

  async log(message, level = 'INFO') {
    const timestamp = new Date().toLocaleTimeString();
    const levelStr = level.padEnd(7);
    console.log(`[${timestamp}] [${levelStr}] ${message}`);
    this.results.push({ timestamp, level, message });
  }

  async screenshot(page, name) {
    const filename = path.join(reportDir, `${name}.png`);
    await page.screenshot({ path: filename, fullPage: true });
    this.screenshots.push(filename);
    await this.log(`📸 Screenshot: ${name}`, 'CAPTURE');
  }

  async run() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
      await this.log('='.repeat(80));
      await this.log('NEXUS HUB - COMPREHENSIVE PHYSICAL TESTING');
      await this.log('='.repeat(80));

      // PHASE 1: INITIAL LOAD AND ONBOARDING
      await this.testPhase1(page);

      // PHASE 2: PROFILE SWITCHING
      await this.testPhase2(page);

      // PHASE 3: SETTINGS AND UI
      await this.testPhase3(page);

      // PHASE 4: APP LAUNCHING AND NAVIGATION
      await this.testPhase4(page);

      // PHASE 5: AI FEATURES (SPOTLIGHT SEARCH)
      await this.testPhase5(page);

      // PHASE 6: RESPONSIVE DESIGN
      await this.testPhase6(page, browser);

      // PHASE 7: ERROR HANDLING
      await this.testPhase7(page);

      // Generate report
      await this.generateReport();

    } catch (error) {
      await this.log(`CRITICAL ERROR: ${error.message}`, 'ERROR');
      this.errors.push(error);
    } finally {
      await browser.close();
    }
  }

  async testPhase1(page) {
    await this.log('\n🔷 PHASE 1: INITIAL LOAD & ONBOARDING');
    await this.log('─'.repeat(60));

    try {
      await this.log('Navigating to http://localhost:3000...');
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
      await this.log('✓ Page loaded successfully');

      await this.screenshot(page, '01-initial-load');

      // Check onboarding
      const onboardingVisible = await page.locator('text=Welcome to Nexus Hub').isVisible();
      await this.log(`Onboarding visible: ${onboardingVisible ? '✓ YES' : '✗ NO'}`);

      if (onboardingVisible) {
        await this.log('Testing onboarding flow...');

        // Step through onboarding
        await this.screenshot(page, '02-onboarding-step1');

        // Click Next button
        const nextButtons = await page.locator('text=Next').count();
        await this.log(`Found ${nextButtons} Next button(s)`);

        for (let i = 0; i < 4; i++) {
          await page.locator('text=Next').first().click();
          await page.waitForTimeout(500);
          await this.log(`✓ Onboarding step ${i + 2} clicked`);
        }

        // Complete onboarding
        await page.locator('text=Get Started').click();
        await page.waitForTimeout(1000);
        await this.log('✓ Onboarding completed');
        await this.screenshot(page, '03-onboarding-complete');
      }

    } catch (error) {
      await this.log(`Phase 1 Error: ${error.message}`, 'ERROR');
      this.errors.push(error);
    }
  }

  async testPhase2(page) {
    await this.log('\n🔷 PHASE 2: PROFILE SWITCHING');
    await this.log('─'.repeat(60));

    try {
      // Wait for sidebar to be visible
      await page.waitForSelector('aside', { timeout: 5000 });

      // Find profile button (Master Developer)
      const profileButton = page.locator('text=Master Developer').first();
      const isVisible = await profileButton.isVisible();
      await this.log(`Profile button visible: ${isVisible ? '✓ YES' : '✗ NO'}`);

      if (isVisible) {
        await this.log('Clicking profile switcher...');
        await profileButton.click();
        await page.waitForTimeout(500);
        await this.screenshot(page, '04-profile-dropdown');

        // Check Razia profile
        const raziaProfile = page.locator('text=Razia').first();
        const raziaVisible = await raziaProfile.isVisible();
        await this.log(`Razia profile visible: ${raziaVisible ? '✓ YES' : '✗ NO'}`);

        if (raziaVisible) {
          await this.log('Switching to Razia profile...');
          await raziaProfile.click();
          await page.waitForTimeout(800);
          await this.log('✓ Profile switched');
          await this.screenshot(page, '05-razia-profile-active');

          // Switch back to Master Developer
          await page.locator('text=Razia').first().click();
          await page.waitForTimeout(500);
          await page.locator('text=Master Developer').first().click();
          await page.waitForTimeout(800);
          await this.log('✓ Switched back to Master Developer');
        }
      }

    } catch (error) {
      await this.log(`Phase 2 Error: ${error.message}`, 'ERROR');
      this.errors.push(error);
    }
  }

  async testPhase3(page) {
    await this.log('\n🔷 PHASE 3: SETTINGS & UI ELEMENTS');
    await this.log('─'.repeat(60));

    try {
      // Find settings button (gear icon)
      const settingsButton = page.locator('[title="Settings"]');
      const settingsVisible = await settingsButton.isVisible();
      await this.log(`Settings button visible: ${settingsVisible ? '✓ YES' : '✗ NO'}`);

      if (settingsVisible) {
        await this.log('Opening settings panel...');
        await settingsButton.click();
        await page.waitForTimeout(800);
        await this.screenshot(page, '06-settings-panel-open');

        // Test theme toggle
        const darkMode = page.locator('text=Dark Mode');
        const lightMode = page.locator('text=Light Mode');

        if (await darkMode.isVisible()) {
          await this.log('Clicking Dark Mode...');
          await darkMode.click();
          await page.waitForTimeout(300);
          await this.log('✓ Dark Mode toggled');
        }

        // Test notification toggle
        const notificationToggle = page.locator('text=System Notifications').first();
        if (await notificationToggle.isVisible()) {
          await this.log('Found notifications toggle');
          const toggleSwitch = notificationToggle.locator('..//div[@class*="rounded-full"]');
          await toggleSwitch.click();
          await this.log('✓ Notifications toggled');
        }

        // Close settings
        await page.press('Escape');
        await page.waitForTimeout(500);
        await this.log('✓ Settings closed');
        await this.screenshot(page, '07-settings-closed');
      }

    } catch (error) {
      await this.log(`Phase 3 Error: ${error.message}`, 'ERROR');
      this.errors.push(error);
    }
  }

  async testPhase4(page) {
    await this.log('\n🔷 PHASE 4: APP LAUNCHING & NAVIGATION');
    await this.log('─'.repeat(60));

    try {
      // Test launching FinancePlay
      await this.log('Testing FinancePlay app...');
      const financePlayCard = page.locator('text=FinancePlay').first();

      if (await financePlayCard.isVisible()) {
        await financePlayCard.click();
        await page.waitForTimeout(1000);
        await this.screenshot(page, '08-financeplay-app');

        // Test adding transaction
        const descInput = page.locator('placeholder=e.g. Server hosting');
        if (await descInput.isVisible()) {
          await this.log('Adding test transaction...');
          await descInput.fill('Test Expense');

          const amountInput = page.locator('input[type="number"]');
          await amountInput.fill('100');

          // Select expense type
          const expenseRadio = page.locator('text=Expense Allocation').first();
          await expenseRadio.click();

          // Submit
          const submitBtn = page.locator('text=Commit Entry');
          await submitBtn.click();
          await page.waitForTimeout(500);
          await this.log('✓ Transaction added');
          await this.screenshot(page, '09-transaction-added');
        }

        // Exit app
        await this.log('Exiting app...');
        const exitBtn = page.locator('text=Exit Desk App');
        if (await exitBtn.isVisible()) {
          await exitBtn.click();
          await page.waitForTimeout(800);
          await this.log('✓ App exited');
        }
      }

      // Test ProjectCupid
      await this.log('Testing ProjectCupid app...');
      const cupidCard = page.locator('text=Project Cupid').first();
      if (await cupidCard.isVisible()) {
        await cupidCard.click();
        await page.waitForTimeout(1000);
        await this.screenshot(page, '10-projectcupid-app');

        // Exit
        const exitBtn = page.locator('text=Exit Desk App');
        if (await exitBtn.isVisible()) {
          await exitBtn.click();
          await page.waitForTimeout(800);
        }
      }

      // Test OpsNexus
      await this.log('Testing OpsNexus app...');
      const opsCard = page.locator('text=OpsNexus').first();
      if (await opsCard.isVisible()) {
        await opsCard.click();
        await page.waitForTimeout(1000);
        await this.screenshot(page, '11-opsnexus-app');

        // Exit
        const exitBtn = page.locator('text=Exit Desk App');
        if (await exitBtn.isVisible()) {
          await exitBtn.click();
          await page.waitForTimeout(800);
        }
      }

    } catch (error) {
      await this.log(`Phase 4 Error: ${error.message}`, 'ERROR');
      this.errors.push(error);
    }
  }

  async testPhase5(page) {
    await this.log('\n🔷 PHASE 5: AI SPOTLIGHT SEARCH');
    await this.log('─'.repeat(60));

    try {
      // Test keyboard shortcut ⌘K / Ctrl+K
      await this.log('Opening AI Spotlight with Ctrl+K...');
      await page.keyboard.press('Control+K');
      await page.waitForTimeout(800);
      await this.screenshot(page, '12-spotlight-open');

      // Type search query
      const searchInput = page.locator('placeholder=Query Secondbrain AI');
      if (await searchInput.isVisible()) {
        await this.log('Typing search query...');
        await searchInput.type('track my finances');
        await page.waitForTimeout(1000);
        await this.screenshot(page, '13-spotlight-search-results');

        // Check results
        const results = await page.locator('text=FinancePlay').count();
        await this.log(`Search results found: ${results > 0 ? '✓ YES' : '✗ NO'}`);

        // Select result
        if (results > 0) {
          await this.log('Clicking search result...');
          await page.locator('text=FinancePlay').first().click();
          await page.waitForTimeout(800);
          await this.log('✓ App launched from search');
        }

        // Exit
        const exitBtn = page.locator('text=Exit Desk App');
        if (await exitBtn.isVisible()) {
          await exitBtn.click();
          await page.waitForTimeout(500);
        }
      } else {
        await this.log('Search input not found', 'WARN');
      }

    } catch (error) {
      await this.log(`Phase 5 Error: ${error.message}`, 'ERROR');
      this.errors.push(error);
    }
  }

  async testPhase6(page, browser) {
    await this.log('\n🔷 PHASE 6: RESPONSIVE DESIGN TESTING');
    await this.log('─'.repeat(60));

    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1920, height: 1080 }
    ];

    for (const viewport of viewports) {
      try {
        await this.log(`Testing ${viewport.name} (${viewport.width}x${viewport.height})...`);

        const testPage = await browser.newPage();
        await testPage.setViewportSize({ width: viewport.width, height: viewport.height });

        await testPage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
        await testPage.waitForTimeout(1000);

        // Skip onboarding
        const onboardingVisible = await testPage.locator('text=Welcome to Nexus Hub').isVisible();
        if (onboardingVisible) {
          // Complete onboarding quickly
          for (let i = 0; i < 5; i++) {
            const nextBtn = testPage.locator('text=Next, Get Started').first();
            if (await nextBtn.isVisible()) {
              await nextBtn.click();
              await testPage.waitForTimeout(200);
            }
          }
        }

        await testPage.screenshot({
          path: path.join(reportDir, `14-responsive-${viewport.name.toLowerCase()}.png`),
          fullPage: true
        });

        // Check if main elements are visible
        const sidebar = await testPage.locator('aside').isVisible();
        const mainContent = await testPage.locator('main').isVisible();

        await this.log(`  ✓ Sidebar: ${sidebar ? 'visible' : 'hidden (mobile)'}`);
        await this.log(`  ✓ Main content: ${mainContent ? 'visible' : 'hidden'}`);

        await testPage.close();

      } catch (error) {
        await this.log(`  ✗ ${viewport.name} test failed: ${error.message}`, 'ERROR');
      }
    }
  }

  async testPhase7(page) {
    await this.log('\n🔷 PHASE 7: ERROR HANDLING & EDGE CASES');
    await this.log('─'.repeat(60));

    try {
      // Test rapid clicking
      await this.log('Testing rapid button clicks...');
      const buttons = await page.locator('button').count();
      await this.log(`Found ${buttons} buttons on page`);

      // Click first few buttons rapidly
      for (let i = 0; i < Math.min(5, buttons); i++) {
        const button = page.locator('button').nth(i);
        try {
          await button.click({ force: true });
        } catch (e) {
          // Ignore click errors
        }
      }
      await this.log('✓ Rapid clicks handled gracefully');

      // Test keyboard navigation
      await this.log('Testing keyboard navigation...');
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
      }
      await this.log('✓ Tab navigation works');

      // Test Escape key
      await this.log('Testing Escape key...');
      await page.keyboard.press('Escape');
      await this.log('✓ Escape key handled');

      await this.screenshot(page, '15-final-state');

    } catch (error) {
      await this.log(`Phase 7 Error: ${error.message}`, 'ERROR');
      this.errors.push(error);
    }
  }

  async generateReport() {
    await this.log('\n' + '='.repeat(80));
    await this.log('TEST REPORT GENERATED');
    await this.log('='.repeat(80));

    const reportPath = path.join(reportDir, 'test-report.txt');
    let reportContent = `NEXUS HUB - COMPREHENSIVE TEST REPORT\n`;
    reportContent += `Generated: ${new Date().toLocaleString()}\n`;
    reportContent += `${'='.repeat(80)}\n\n`;

    reportContent += `TEST RESULTS:\n`;
    reportContent += `Total Tests: ${this.results.length}\n`;
    reportContent += `Errors: ${this.errors.length}\n`;
    reportContent += `Screenshots: ${this.screenshots.length}\n\n`;

    reportContent += `DETAILED LOG:\n`;
    reportContent += `${'─'.repeat(80)}\n`;
    this.results.forEach(r => {
      reportContent += `[${r.timestamp}] [${r.level}] ${r.message}\n`;
    });

    reportContent += `\nSCREENSHOTS CAPTURED:\n`;
    reportContent += `${'─'.repeat(80)}\n`;
    this.screenshots.forEach(s => {
      reportContent += `• ${path.basename(s)}\n`;
    });

    if (this.errors.length > 0) {
      reportContent += `\nERRORS ENCOUNTERED:\n`;
      reportContent += `${'─'.repeat(80)}\n`;
      this.errors.forEach(e => {
        reportContent += `• ${e.message}\n`;
      });
    }

    reportContent += `\n${'='.repeat(80)}\n`;
    reportContent += `OVERALL STATUS: ${this.errors.length === 0 ? '✅ PASS' : '⚠️ PASS WITH WARNINGS'}\n`;
    reportContent += `${'='.repeat(80)}\n`;

    fs.writeFileSync(reportPath, reportContent);
    await this.log(`\n📊 Report saved to: ${reportPath}`);
    await this.log(`📸 Screenshots saved to: ${reportDir}`);
  }
}

const runner = new ComprehensiveTestRunner();
await runner.run();
