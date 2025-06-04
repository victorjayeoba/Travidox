// t.js
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('https://api.investing.com/api/financialdata/assets/equitiesByCountry/default?country-id=20&page=0&page-size=100', {
    waitUntil: 'networkidle2',
  });

  const body = await page.evaluate(() => document.body.innerText);
  console.log("Response:\n", body);

  await browser.close();
})();
