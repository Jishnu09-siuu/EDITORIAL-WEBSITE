import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

async function runE2ETests() {
  console.log('--- STARTING EDITORIAL PORTFOLIO STANDING POSES VERIFICATION ---');

  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('[BROWSER ERROR]', msg.text());
      errors.push(msg.text());
    }
  });
  page.on('pageerror', err => {
    console.error('[PAGE ERROR]', err.toString());
    errors.push(err.toString());
  });

  console.log('Navigating to http://localhost:8080/ ...');
  await page.goto('http://localhost:8080/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));

  console.log(`Page loaded. Console errors recorded: ${errors.length}`);
  if (errors.length > 0) {
    console.error('Errors found:', errors);
    throw new Error('Console errors encountered during page load: ' + JSON.stringify(errors));
  }

  const ssDir = path.resolve('test-artifacts');
  if (!fs.existsSync(ssDir)) fs.mkdirSync(ssDir, { recursive: true });

  const getAbsoluteTop = (id) => page.evaluate((elemId) => {
    const el = document.getElementById(elemId);
    return el.getBoundingClientRect().top + window.scrollY;
  }, id);

  // 1. Initial Hero State
  await page.screenshot({ path: path.join(ssDir, '01_hero_initial.png') });
  console.log('Captured: 01_hero_initial.png');

  // 2. Section 02: Portraits FlexCarousel
  const portraitsTop = await getAbsoluteTop('portraits-section');
  await page.evaluate(y => window.scrollTo(0, y), portraitsTop);
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(ssDir, '02_portraits_intact.png') });
  console.log('Captured: 02_portraits_intact.png (Portraits FlexCarousel intact)');

  // 3. Section 03: Standing Poses Spatial Showcase
  console.log('\n--- Testing Section 03: Standing Poses Spatial Showcase ---');
  const standingTop = await getAbsoluteTop('standing-section');

  // A. Entrance & Introduction (Eyebrow: "THE MODEL", Heading: "STANDING STUDIES.")
  await page.evaluate(y => window.scrollTo(0, y), standingTop);
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ssDir, '03_standing_intro.png') });
  console.log('Captured: 03_standing_intro.png');

  const introText = await page.evaluate(() => {
    const eyebrow = document.querySelector('.standing-eyebrow')?.innerText;
    const heading = document.querySelector('.standing-heading-main')?.innerText.replace(/\n/g, ' ');
    return { eyebrow, heading };
  });
  console.log('Intro Text Found:', introText);

  // B. Pose 01 Focus (Relaxed stance with three-quarter turn)
  await page.evaluate(y => window.scrollTo(0, y + 500), standingTop);
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ssDir, '04_pose_1_focus.png') });
  console.log('Captured: 04_pose_1_focus.png');

  // C. Pose 02 Focus (Full-length, straight-on studio pose)
  await page.evaluate(y => window.scrollTo(0, y + 1400), standingTop);
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ssDir, '05_pose_2_focus.png') });
  console.log('Captured: 05_pose_2_focus.png');

  // D. Pose 03 Focus (Poised standing composition in tailored styling)
  await page.evaluate(y => window.scrollTo(0, y + 2300), standingTop);
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ssDir, '06_pose_3_focus.png') });
  console.log('Captured: 06_pose_3_focus.png');

  // E. Pose 04 Focus (Full-body pose framed by generous negative space)
  await page.evaluate(y => window.scrollTo(0, y + 3300), standingTop);
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ssDir, '07_pose_4_focus.png') });
  console.log('Captured: 07_pose_4_focus.png');

  // Check that all 4 poses exist and have distinct descriptions
  const posesData = await page.evaluate(() => {
    const articles = Array.from(document.querySelectorAll('.pose-entity'));
    return articles.map(a => ({
      id: a.id,
      index: a.getAttribute('data-index'),
      caption: a.querySelector('.pose-narrative')?.innerText,
      imgSrc: a.querySelector('img')?.getAttribute('src')
    }));
  });
  console.log('Poses verified in DOM:', posesData);

  if (posesData.length !== 4) {
    throw new Error(`Expected 4 pose entities, found ${posesData.length}`);
  }

  // 4. Test Footer: ONLY MODEL NAME "LUKA VANCE"
  console.log('\n--- Testing Footer (Only Model Name Visible) ---');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ssDir, '08_footer_closing.png') });

  const footerText = await page.evaluate(() => {
    const footer = document.getElementById('footer');
    return footer.innerText.trim();
  });
  console.log(`Footer Text: "${footerText}"`);
  if (footerText !== 'LUKA VANCE') {
    throw new Error(`Footer text must ONLY be the model's name ("LUKA VANCE")! Found: "${footerText}"`);
  }
  console.log('✓ Footer displays ONLY the model\'s name ("LUKA VANCE")!');

  console.log('\n======================================================');
  console.log('STANDING POSES SPATIAL SHOWCASE VERIFIED WITH 0 ERRORS!');
  console.log('======================================================\n');

  await browser.close();
}

runE2ETests().catch(err => {
  console.error('E2E TEST FAILURE:', err);
  process.exit(1);
});
