const puppeteer = require("puppeteer");

let element;
async function provideTermsAndConditions(page) {
  await page.waitForSelector(".submit");
  element = await page.$(".submit button");
  await element.click();
}

async function provideEmail(page) {
  await page.waitForSelector("#email");
  element = await page.$("#email");
  await element.type("rjyala@cegid.com");
  element = await page.$(".submit button");
  await element.click();
}

async function selectBank(page) {
  await page.waitForSelector("input[type=text]");
  element = await page.$("input[type=text]");
  await element.type("Simulator");

  await page.waitForSelector(".search-results");
  element = await page.$(".search-results .result span");
  await element.click();
}

async function provideBankConsent(page) {
  await page.waitForSelector("input[type=password]");
  element = await page.$("input[type=text]");
  await element.type("123456789");

  element = await page.$("input[type=password]");
  await element.type("demoComplete");

  element = await page.$("button[type=submit]");
  await element.click();
}

async function selectAccount(page) {
  await page.waitForSelector("input[type=radio]");
  element = await page.$("input[type=radio]");
  await element.click();

  element = await page.$(".submit button");
  await element.click();
}

async function redirectToPage(page) {
  await page.waitForSelector(".submit");
  element = await page.$(".submit button");
  await element.click();
}

async function provideUserConsentAspsp(page) {
  await provideTermsAndConditions(page);
  await page.waitForNavigation();

  await provideEmail(page);
  await page.waitForNavigation();

  await selectBank(page);
  await page.waitForNavigation();

  await provideBankConsent(page);
  await page.waitForTimeout(100);
  await page.waitForNavigation();

  await selectAccount(page);
  await page.waitForNavigation();

  await redirectToPage(page);
  await page.waitForNavigation();
  console.log(page.url(), "URL");
}

async function provideUserConsent(consentUrl, aspspId) {
  // open consent url in browser
  const browser = await puppeteer.launch({
    // It's highly discouraged to run chrome with no sandbox but it causes issues in CI otherwise.
    // So long as we only load internal sites, we should be safe but it is worth noting.
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: false,
  }); // set headless to false for opening bowser UI
  const page = await browser.newPage();
  await page.goto(consentUrl);
  await provideUserConsentAspsp(page);

  // extra wait time for any other page redirects
  await page.waitForTimeout(10 * 1000);
  await browser.close();
}

(async () => {
  await provideUserConsent(
    "https://connect.bridgeapi.io?connect_request_id=605&context=INIT&token_uuid=70af0e2d-f2fe-4035-ae38-c0e4a46fa118",
    null
  );
})();
