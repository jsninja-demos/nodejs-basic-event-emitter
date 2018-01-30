const MIN = 5;
const MAX = 35;

module.exports = {
  formatAnswer(yes = 0, no = 0) {
    const yesKoef = yes / no > 1 ? 1 : yes / no;
    const noKoef = no / yes > 1 ? 1 : no / yes;

    return {
      yesHeight: Math.max(5, MAX * yesKoef) || 0,
      noHeight: Math.max(5, MAX * noKoef) || 0,
    };
  },
};
