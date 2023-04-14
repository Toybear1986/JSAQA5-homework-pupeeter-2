const puppeteer = require("puppeteer");
const chai = require("chai");
const expect = chai.expect;
const { Given, When, Then, Before, After } = require("@cucumber/cucumber");
const { getText } = require("../../lib/commands.js");
const { generateSeanceSelector } = require("../../lib/util.js");

let day;
let seanceSelector;

Before(async function () {
  const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
  const page = await browser.newPage();
  this.browser = browser;
  this.page = page;
});

After(async function () {
  if (this.browser) {
    await this.browser.close();
  }
});

Given("user is on page {string}", async function (string) {
  return await this.page.goto(`${string}`);
});

When(
  "user make booking for weekend, and choose {string} в {string} в {string}",
  async function (film, hall, time) {
    day = await this.page.$x('//a[contains(@class, "page-nav__day_weekend")]');
    day[0].click();
    await this.page.waitForSelector("h2");
    seanceSelector = await this.page.$x(
      generateSeanceSelector(film, hall, time)
    );
    seanceSelector[0].click();
    return await this.page.waitForSelector("div.buying__info-description");
  }
);

Then(
  "user sees proper information {string} в {string} в {string} for her booking",
  async function (film, hall, time) {
    const actualFilm = await getText(this.page, "h2.buying__info-title");
    expect(actualFilm).equal(film);

    const actualBegining = await getText(this.page, "p.buying__info-start");
    expect(actualBegining).equal("Начало сеанса: " + time);

    const actualHall = await getText(this.page, "p.buying__info-hall");
    expect(actualHall).equal(hall);
  }
);
