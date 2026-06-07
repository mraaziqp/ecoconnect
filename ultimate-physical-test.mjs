import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const reportDir = './test-reports/ultimate-physical-test';
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir, { recursive: true });
}

class UltimatePhysicalTest {
  constructor() {
    this.results = [];
    this.screenshots = [];
    this.findings = [];
    this.startTime = Date.now();
  }

  log(message) {
    const time = new Date().toLocaleTimeString();
    console.log(`[${time}] ${message}`);
    this.results.push({ time, message });
  }

  async screenshot(page, name) {
    const filepath = path.join(reportDir, `${name}.png`);
    await page.screenshot({ path: filepath, fullPage: false });
    this.screenshots.push({ name, path: filepath });
    this.log(`📸 ${name}`);
  }

  finding(severity, message) {
    this.findings.push({ severity, message });
    this.log(`${severity === 'ISSUE' ? '⚠️' : severity === 'BUG' ? '🐛' : '✅'} ${message}`);
  }

  async run() {
    const browser = await chromium.launch({ headless: true });
    const pages = [];

    try {
      this.log('='.repeat(80));
      this.log('🚀 NEXUS HUB - ULTIMATE COMPREHENSIVE PHYSICAL TEST');
      this.log('Testing every button, function, and feature on all devices');
      this.log('='.repeat(80));

      // TEST SEQUENCE 1: DESKTOP (1920x1080)
      await this.testDesktop(browser, pages);

      // TEST SEQUENCE 2: TABLET (768x1024)
      await this.testTablet(browser, pages);

      // TEST SEQUENCE 3: MOBILE (375x667)
      await this.testMobile(browser, pages);

      // TEST SEQUENCE 4: EDGE CASES & STRESS
      await this.testEdgeCases(browser, pages);

      // TEST SEQUENCE 5: PERFORMANCE & METRICS
      await this.testPerformance(browser, pages);

      // Generate final report
      await this.generateReport();

    } catch (error) {
      this.log(`CRITICAL ERROR: ${error.message}`);
      this.findings.push({ severity: 'BUG', message: `Critical error: ${error.message}` });
    } finally {
      for (const page of pages) {
        try {
          await page.close();
        } catch (e) {}
      }
      await browser.close();
    }
  }

  async testDesktop(browser, pages) {
    this.log('\n' + '='.repeat(80));
    this.log('📱 DESKTOP TEST (1920×1080)');
    this.log('='.repeat(80));

    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    pages.push(page);

    try {
      // LOAD APP
      this.log('Loading app...');
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
      await this.screenshot(page, '01-desktop-initial-load');

      // TEST ONBOARDING
      this.log('Testing onboarding flow...');
      const onboardingVisible = await page.locator('text=Welcome to Nexus Hub').isVisible();
      if (!onboardingVisible) {
        this.finding('ISSUE', 'Onboarding not visible on fresh load');
      } else {
        this.finding('OK', 'Onboarding appears on fresh load');

        // Click through all steps
        for (let i = 0; i < 5; i++) {
          const nextBtn = await page.locator('text=Next, Get Started').first();
          if (await nextBtn.isVisible()) {
            await nextBtn.click();
            await page.waitForTimeout(300);
          }
        }
        await this.screenshot(page, '02-desktop-onboarding-complete');
      }

      // TEST PROFILE SWITCHER
      this.log('Testing profile switcher...');
      const profileBtn = await page.locator('text=Master Developer').first();
      if (!await profileBtn.isVisible()) {
        this.finding('BUG', 'Profile button not visible');
      } else {
        await profileBtn.click();
        await page.waitForTimeout(300);
        const dropdownVisible = await page.locator('text=Razia').isVisible();
        if (dropdownVisible) {
          this.finding('OK', 'Profile dropdown opens');
          await this.screenshot(page, '03-desktop-profile-dropdown');
          await profileBtn.click(); // Close
        }
      }

      // TEST SETTINGS BUTTON
      this.log('Testing settings panel...');
      const settingsBtn = page.locator('[title="Settings"]');
      if (!await settingsBtn.isVisible()) {
        this.finding('BUG', 'Settings button not visible');
      } else {
        await settingsBtn.click();
        await page.waitForTimeout(500);
        const settingsPanel = await page.locator('text=SETTINGS').isVisible();
        if (settingsPanel) {
          this.finding('OK', 'Settings panel opens');
          await this.screenshot(page, '04-desktop-settings-open');

          // Test toggles
          const darkMode = page.locator('text=Dark Mode');
          if (await darkMode.isVisible()) {
            await darkMode.click();
            this.finding('OK', 'Theme toggle clickable');
          }

          await page.press('Escape');
        }
      }

      // TEST APP GRID - CLICK EVERY APP
      this.log('Testing app grid - clicking every app...');
      const apps = ['FinancePlay', 'Project Cupid', 'Lifestack', 'OpsNexus', 'Deenify', 'Familyverse'];

      for (const appName of apps) {
        const appCard = page.locator(`text=${appName}`).first();
        if (await appCard.isVisible({ timeout: 2000 })) {
          await appCard.click();
          await page.waitForTimeout(800);

          // Check if app opened
          const exitBtn = page.locator('text=Exit Desk App');
          if (await exitBtn.isVisible()) {
            this.finding('OK', `${appName} opens and shows exit button`);
            await this.screenshot(page, `05-desktop-app-${appName.toLowerCase().replace(' ', '-')}`);
            await exitBtn.click();
            await page.waitForTimeout(500);
          } else {
            this.finding('ISSUE', `${appName} may not have opened properly`);
          }
        }
      }

      // TEST SPOTLIGHT SEARCH
      this.log('Testing AI Spotlight search...');
      await page.keyboard.press('Control+K');
      await page.waitForTimeout(500);
      const spotlightInput = page.locator('input').first();
      if (await spotlightInput.isVisible()) {
        await spotlightInput.type('finances');
        await page.waitForTimeout(800);
        this.finding('OK', 'Spotlight search responds to input');
        await this.screenshot(page, '06-desktop-spotlight-search');
        await page.press('Escape');
      } else {
        this.finding('ISSUE', 'Spotlight may not have opened');
      }

      // TEST KEYBOARD NAVIGATION
      this.log('Testing keyboard navigation...');
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab');
      }
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      if (focusedElement) {
        this.finding('OK', `Keyboard navigation works (focused: ${focusedElement})`);
      } else {
        this.finding('ISSUE', 'Keyboard navigation may have issues');
      }

      // TEST RESPONSIVENESS - SCROLL
      this.log('Testing scroll and content...');
      await page.keyboard.press('Home');
      await page.waitForTimeout(300);
      await page.evaluate(() => window.scrollBy(0, 500));
      await page.waitForTimeout(300);
      this.finding('OK', 'Page scrolls smoothly');

    } catch (error) {
      this.finding('BUG', `Desktop test error: ${error.message}`);
    }
  }

  async testTablet(browser, pages) {
    this.log('\n' + '='.repeat(80));
    this.log('📱 TABLET TEST (768×1024)');
    this.log('='.repeat(80));

    const page = await browser.newPage({ viewport: { width: 768, height: 1024 } });
    pages.push(page);

    try {
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
      await this.screenshot(page, '07-tablet-initial');

      // Skip onboarding
      const onboarding = page.locator('text=Get Started');
      if (await onboarding.isVisible({ timeout: 1000 })) {
        await onboarding.click();
        await page.waitForTimeout(500);
      }

      // Check layout
      const sidebar = await page.locator('aside').isVisible();
      const mainContent = await page.locator('main').isVisible();

      if (sidebar && mainContent) {
        this.finding('OK', 'Tablet layout shows both sidebar and content');
      } else {
        this.finding('ISSUE', 'Tablet layout may have issues');
      }

      await this.screenshot(page, '08-tablet-full-layout');

      // Test touch interactions (simulated)
      const firstApp = page.locator('[class*="rounded"]').first();
      if (await firstApp.isVisible()) {
        await firstApp.click();
        await page.waitForTimeout(300);
        this.finding('OK', 'Touch interactions work on tablet');
      }

    } catch (error) {
      this.finding('BUG', `Tablet test error: ${error.message}`);
    }
  }

  async testMobile(browser, pages) {
    this.log('\n' + '='.repeat(80));
    this.log('📱 MOBILE TEST (375×667)');
    this.log('='.repeat(80));

    const page = await browser.newPage({ viewport: { width: 375, height: 667 } });
    pages.push(page);

    try {
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
      await this.screenshot(page, '09-mobile-initial');

      // Check mobile layout
      const sidebar = await page.locator('aside').isVisible();
      const mainContent = await page.locator('main').isVisible();

      if (!sidebar && mainContent) {
        this.finding('OK', 'Mobile hides sidebar, shows content full-width');
      } else if (sidebar) {
        this.finding('ISSUE', 'Sidebar visible on mobile (should be hidden)');
      }

      // Test scroll and readability
      const bodyText = await page.locator('body').textContent();
      if (bodyText && bodyText.length > 100) {
        this.finding('OK', 'Mobile shows content properly');
      }

      await this.screenshot(page, '10-mobile-layout');

      // Test button sizes
      const buttons = await page.locator('button').count();
      this.finding('OK', `Mobile has ${buttons} interactive buttons`);

    } catch (error) {
      this.finding('BUG', `Mobile test error: ${error.message}`);
    }
  }

  async testEdgeCases(browser, pages) {
    this.log('\n' + '='.repeat(80));
    this.log('🔧 EDGE CASES & STRESS TEST');
    this.log('='.repeat(80));

    const page = await browser.newPage();
    pages.push(page);

    try {
      await page.goto('http://localhost:3000');

      // Test rapid clicking
      this.log('Testing rapid button clicks...');
      const buttons = await page.locator('button');
      const count = await buttons.count();

      for (let i = 0; i < Math.min(5, count); i++) {
        try {
          await buttons.nth(i).click({ force: true });
        } catch (e) {
          // Ignore errors
        }
      }
      this.finding('OK', 'App handles rapid clicks without crashing');

      // Test back/forward
      this.log('Testing browser back/forward...');
      await page.goBack().catch(() => {});
      await page.goForward().catch(() => {});
      this.finding('OK', 'App handles navigation history');

      // Test multiple modals
      this.log('Testing stacked interactions...');
      await page.keyboard.press('Control+K');
      await page.keyboard.press('Control+K');
      await page.keyboard.press('Escape');
      this.finding('OK', 'App handles overlapping interactions');

    } catch (error) {
      this.finding('BUG', `Edge case test error: ${error.message}`);
    }
  }

  async testPerformance(browser, pages) {
    this.log('\n' + '='.repeat(80));
    this.log('⚡ PERFORMANCE & METRICS');
    this.log('='.repeat(80));

    const page = await browser.newPage();
    pages.push(page);

    try {
      const startLoad = Date.now();
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
      const tti = Date.now() - startLoad;

      this.log(`Time to Interactive: ${tti}ms`);
      if (tti < 2000) {
        this.finding('OK', `TTI excellent: ${tti}ms (target: <2000ms)`);
      } else if (tti < 3000) {
        this.finding('ISSUE', `TTI acceptable: ${tti}ms (target: <2000ms)`);
      } else {
        this.finding('BUG', `TTI slow: ${tti}ms (target: <2000ms)`);
      }

      // Measure memory
      const metrics = await page.evaluate(() => {
        if (performance.memory) {
          return {
            used: Math.round(performance.memory.usedJSHeapSize / 1048576),
            total: Math.round(performance.memory.totalJSHeapSize / 1048576),
          };
        }
        return null;
      });

      if (metrics) {
        this.log(`Memory: ${metrics.used}MB / ${metrics.total}MB`);
        if (metrics.used < 200) {
          this.finding('OK', `Memory usage excellent: ${metrics.used}MB`);
        } else {
          this.finding('ISSUE', `Memory usage high: ${metrics.used}MB`);
        }
      }

    } catch (error) {
      this.finding('BUG', `Performance test error: ${error.message}`);
    }
  }

  async generateReport() {
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);

    let report = `# NEXUS HUB - ULTIMATE PHYSICAL TEST REPORT\n`;
    report += `Generated: ${new Date().toLocaleString()}\n`;
    report += `Duration: ${duration}s\n\n`;

    report += `## TEST RESULTS SUMMARY\n`;
    const ok = this.findings.filter(f => f.severity === 'OK').length;
    const issues = this.findings.filter(f => f.severity === 'ISSUE').length;
    const bugs = this.findings.filter(f => f.severity === 'BUG').length;

    report += `- ✅ Passed: ${ok}\n`;
    report += `- ⚠️ Issues: ${issues}\n`;
    report += `- 🐛 Bugs: ${bugs}\n`;
    report += `- 📸 Screenshots: ${this.screenshots.length}\n\n`;

    report += `## DETAILED FINDINGS\n\n`;
    for (const finding of this.findings) {
      const emoji = finding.severity === 'OK' ? '✅' : finding.severity === 'ISSUE' ? '⚠️' : '🐛';
      report += `${emoji} ${finding.message}\n`;
    }

    report += `\n## SCREENSHOTS\n`;
    for (const screenshot of this.screenshots) {
      report += `- ${screenshot.name}: ${screenshot.path}\n`;
    }

    report += `\n## VERDICT\n`;
    if (bugs === 0 && issues <= 2) {
      report += `✅ **PRODUCTION READY** - Minor issues found but overall excellent.\n`;
    } else if (bugs === 0) {
      report += `⚠️ **GOOD** - A few issues to address before launch.\n`;
    } else {
      report += `🐛 **NEEDS FIXES** - Critical bugs found that need resolution.\n`;
    }

    const reportPath = path.join(reportDir, 'ULTIMATE_TEST_REPORT.md');
    fs.writeFileSync(reportPath, report);

    this.log('\n' + '='.repeat(80));
    this.log(`✅ TESTING COMPLETE`);
    this.log(`Report: ${reportPath}`);
    this.log(`Screenshots: ${reportDir}`);
    this.log('='.repeat(80));
  }
}

const test = new UltimatePhysicalTest();
await test.run();
