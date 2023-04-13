module.exports = {
  generateRow: function () {
    return (row = Math.floor(Math.random() * 10 + 1));
  },

  generateSeat: function () {
    return (seat = Math.floor(Math.random() * 10 + 1));
  },

  generateSeanceSelector: (film, hall, time) => {
    return (seanceSelector = `//h2[contains(text(), "${film}")]//ancestor::section//h3[contains(text(), "${hall}")]//ancestor::div//a[contains(text(), "${time}")]`);
  },

  generateSeatSelector: (row, seat) => {
    return (seatSelector = `div.buying-scheme__wrapper > div:nth-child(${row}) > span:nth-child(${seat})`);
  },
};
