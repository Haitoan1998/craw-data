const puppeteer = require("puppeteer");

const startBrowser = async () => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: false, //hiện trình duyệt để tương tác
      args: ["--disable-setuid-sandbox"], //tin tưởng nội dụng web
      ignoreHTTPSErrors: true, //truy cặp web bỏ qua lỗi http secure
    }); //khởi tạo trình duyệt
  } catch (error) {
    console.log("không tạo được browser error: " + error);
  }

  return browser;
};

module.exports = startBrowser;
