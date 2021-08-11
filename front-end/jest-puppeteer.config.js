module.exports = {
  launch: {
    product: 'firefox',
    headless: (process.env.HEADLESS || "true") === "true",
    slowMo: process.env.SLO_MO || 0,
    devtools: true,
  },
};
