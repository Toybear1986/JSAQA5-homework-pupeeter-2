const {  
  getColorForSelector,
  getPrice,
  getText,
  getActualButtonStatus,
} = require("./lib/commands.js");

const {
  generateRow,
  generateSeat,
  generateSeanceSelector,
  generateSeatSelector,
} = require("./lib/util.js");

let page;

beforeEach(async () => {
  page = await browser.newPage();
});

afterEach(() => {
  page.close();
});

describe("Booking tickets on weekend", () => {
  beforeEach(async () => {
    await page.goto("http://qamid.tmweb.ru/client/index.php");
    page.waitForSelector("h1");
    day = await page.$x('//a[contains(@class, "page-nav__day_weekend")]');
    day[0].click();
    await page.waitForSelector("h2");
  });

  let day;
  let film;
  let hall;
  let time;
  let seanceSelector;
  let actualButtonStatus;

  test("Choice day, film and time and check buying info", async () => {
    film = "Фильм 3";
    hall = "Зал 2";
    time = "15:00";
    seanceSelector = await page.$x(generateSeanceSelector(film, hall, time));
    seanceSelector[0].click();
    await page.waitForSelector("div.buying__info-description");

    const actualFilm = await getText(page, "h2.buying__info-title");
    expect(actualFilm).toEqual(film);

    const actualBegining = await getText(page, "p.buying__info-start");
    expect(actualBegining).toEqual("Начало сеанса: " + time);

    const actualHall = await getText(page, "p.buying__info-hall");
    expect(actualHall).toEqual(hall);
  });

  test("Button disabled if seats not selected", async () => {
    film = "Train arrival";
    hall = "SuperHall";
    time = "21:00";
    seanceSelector = await page.$x(generateSeanceSelector(film, hall, time));
    seanceSelector[0].click();
    await page.waitForSelector("div.buying__info-description");

    actualButtonStatus = await getActualButtonStatus(page, "button");
    expect(actualButtonStatus).toEqual("true");
  });

  test("Select seats, check ticket and finish booking", async () => {
    /* Test failed by check price with this data */
    film = "Фильм 3";
    hall = "data.newHall";
    time = "10:00";
    /* Test passed with this data */
    // film = "Train arrival";
    // hall = "SuperHall";
    // time = "21:00";
    seanceSelector = await page.$x(generateSeanceSelector(film, hall, time));
    seanceSelector[0].click();
    await page.waitForSelector("div.buying__info-description");
    
    const row = generateRow();
    const seat = generateSeat();
    const seatSelector = generateSeatSelector(row, seat);
    const price = getPrice(await getColorForSelector(page, seatSelector));
    const getSeatSelector = await page.$(seatSelector);    
    getSeatSelector.click();
    await page.waitForXPath(
      '//div[@class="buying-scheme__wrapper"]//span[contains(@class,"buying-scheme__chair_selected")]'
    );
    actualButtonStatus = await getActualButtonStatus(page, "button");
    expect(actualButtonStatus).toEqual(null);
    await page.click("button");
    await page.waitForXPath("//button");
    const filmOnTicket = await getText(page, "span.ticket__title");
    expect(filmOnTicket).toEqual(film);
    const seats = await getText(page, "span.ticket__chairs");
    expect(seats).toEqual(row + "/" + seat);
    const inHall = await getText(page, "span.ticket__hall");
    expect(inHall).toEqual(hall);
    const start = await getText(page, "span.ticket__start");
    expect(start).toEqual(time);
    const cost = await getText(page, "span.ticket__cost")
    expect(parseInt(cost)).toEqual(price);
    const acceptingButton = await page.$("button");
    acceptingButton.click();
    await page.waitForXPath('//img[@class="ticket__info-qr"]');
    const hint = await getText(page, "p.ticket__hint");
    expect(hint).toEqual(
      "Покажите QR-код нашему контроллеру для подтверждения бронирования."
    );
  });
});
