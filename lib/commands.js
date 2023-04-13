module.exports = {
  getColorForSelector: async function (page, seatSelector) {
    try {
      await page.waitForSelector(seatSelector);
      return await page.$eval(
        seatSelector,
        (el) => getComputedStyle(el).backgroundColor
      );
    } catch (error) {
      throw new Error(`Can't get color from selector ` + seatSelector);
    }
  },

  getPrice: (color) => {
    let price = null;
    if (color === "rgb(249, 149, 58)") {
      price = 3500;
    } else {
      price = 1000;
    }
    return price;
  },

  getText: async function (page, selector) {
    try {
      await page.waitForSelector(selector);
      return await page.$eval(selector, (el) => el.textContent);
    } catch (error) {
      throw new Error(`Text is not available for selector: ${selector}`);
    }
  },

  getActualButtonStatus: async function (page, selector) {
    try {
      await page.waitForSelector(selector);
      return await page.$eval(selector, (el) => el.getAttribute("disabled"));
    } catch (error) {
      throw new Error(`Can't get actual button status`);
    }
  },
};
