const startbrowser = require("./browser");
const scrapeController = require("./scrapeController");

let browser = startbrowser();
scrapeController(browser);
