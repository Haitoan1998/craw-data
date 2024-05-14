const scrapers = require("./scraper");
const fs = require("fs");
let page = [];
for (let index = 1; index < 6; index++) {
  page.push(index);
}
const scrapeController = async (browserInstance) => {
  const url = "https://4menshop.com/";
  try {
    const browser = await browserInstance;

    //lấy Navbar
    const categories = await scrapers.scrapeCategory(browser, url);
    const seletedCategories = categories.filter((item, index) => {
      return index > 0 && index < 10;
    });
    console.log(seletedCategories);
    // lấy trang theo tab navbar
    let result1 = [];
    let result2 = [];
    let result3 = [];
    let result4 = [];
    let result5 = [];
    let result6 = [];
    for (const [index, item] of page.entries()) {
      let rs1 = await scrapers.scrape(browser, seletedCategories[1].link, item);
      result1 = result1.concat(rs1);
      console.log(result1);
      // let rs2 = await scrapers.scrape(browser, seletedCategories[0].link, item);
      // result2 = result1.concat(rs2);
      // let rs3 = await scrapers.scrape(browser, seletedCategories[0].link, item);
      // result3 = result1.concat(rs3);
      // let rs4 = await scrapers.scrape(browser, seletedCategories[3].link, 1);
      // result4 = result1.concat(rs4);
      // let rs6 = await scrapers.scrape(browser, seletedCategories[4].link, 1);
      // result5 = result1.concat(rs5);
      // let rs5 = await scrapers.scrape(browser, seletedCategories[5].link, 1);
      // result6 = result1.concat(rs6);
    }
    const dataAddToJson1 = JSON.stringify(result1);
    fs.writeFile("hangmoive.json", dataAddToJson1, (err) => {
      if (err) console.log("ghi data faild", err);
      console.log("thêm data thành công");
    });

    // const dataAddToJson2 = JSON.stringify(result2);
    // fs.writeFile("aonam.json", dataAddToJson2, (err) => {
    //   if (err) console.log("ghi data faild", err);
    //   console.log("thêm data thành công");
    // });

    // const dataAddToJson3 = JSON.stringify(result3);
    // fs.writeFile("quannam1.json", dataAddToJson3, (err) => {
    //   if (err) console.log("ghi data faild", err);
    //   console.log("thêm data thành công");
    // });

    // const dataAddToJson4 = JSON.stringify(result4);
    // fs.writeFile("phukien.json", dataAddToJson4, (err) => {
    //   if (err) console.log("ghi data faild", err);
    //   console.log("thêm data thành công");
    // });

    // const dataAddToJson5 = JSON.stringify(result5);
    // fs.writeFile("giaydep.json", dataAddToJson5, (err) => {
    //   if (err) console.log("ghi data faild", err);
    //   console.log("thêm data thành công");
    // });

    // const dataAddToJson6 = JSON.stringify(result6);
    // fs.writeFile("outletsale.json", dataAddToJson6, (err) => {
    //   if (err) console.log("ghi data faild", err);
    //   console.log("thêm data thành công");
    // });

    // await browser.close();
  } catch (error) {
    console.log("lỗi ở scrapeController" + error);
  }
};

module.exports = scrapeController;
