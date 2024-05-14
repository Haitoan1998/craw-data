//lấy Navbar
async function wait(t) {
  await setTimeout(() => {}, t);
}
async function scrollToBottom(newPage) {
  await newPage.evaluate(async () => {
    await new Promise((resolve, reject) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}
const scrapeCategory = async (browser, url) =>
  new Promise(async (resolve, reject) => {
    {
      try {
        let page = await browser.newPage();

        await page.setViewport({ width: 1920, height: 1080 });
        console.log("mở tab mới...");

        await page.goto(url);
        console.log("truy cập vào" + url);

        await page.waitForSelector("#home1");
        console.log("website đã load xong");

        //cách lấy data 1
        const dataCategory = await page.$$eval(
          "ul.navbar-nav > li > a",
          (element) => {
            dataCategory = element.map((ele) => {
              return {
                category: ele.innerText,
                link: ele.href,
              };
            });
            return dataCategory;
          }
        );

        //cách lấy data 2
        // let crawdata = [];
        // const dataCategory = await page.$$("#navbar-menu > ul > li");
        // for (const element of dataCategory) {
        //   const data = await element.evaluate((item) => {
        //     return {
        //       category: item.querySelector("a").innerText,
        //       link: item.querySelector("a").href,
        //     };
        //   });
        //   crawdata.push(data);
        // }
        // console.log(crawdata);
        // await page.close();
        resolve(dataCategory);
      } catch (error) {
        console.log("lỗi ở scrape category" + error);
        reject(error);
      }
    }
  });

let scrapeData = [];
const scrape = (browser, url, page) =>
  new Promise(async (resolve, reject) => {
    try {
      let newPage = await browser.newPage();

      await newPage.setViewport({ width: 1920, height: 1080 });
      console.log("mở tab mới...");
      await wait(2000);
      await newPage.goto(
        page === 1
          ? "https://4menshop.com/thoi-trang-moi-nhat.html"
          : `${"https://4menshop.com/thoi-trang-moi-nhat.html".replace(
              ".html",
              ""
            )}/trang-${page}.html`
      );
      console.log("truy cập vào" + url);

      await newPage.waitForSelector(".shop-content");
      await wait(4000);

      await scrollToBottom(newPage);

      await wait(3000);

      console.log("website đã load xong");

      const haveProduct = await newPage.$$("#product-items > div.product-item");
      console.log(haveProduct);
      await wait(2000);

      if (haveProduct.length === 0) {
        return false;
      }
      await wait(2000);

      //lấy header
      // const headerData = await newPage.$eval("header", (element) => {
      //   return {
      //     title: element.querySelector("h1").innerText,
      //     description: element.querySelector("p").innerText,
      //   };
      // });
      // scrapeData.header = headerData;
      await wait(2000);
      //lấy list sp
      const listSP = await newPage.$$eval(
        "#product-items > div.product-item",
        (element) => {
          listSP = element.map((ele) => {
            return {
              image: [
                ele
                  .querySelector("div.item-thumb > .thumb-img > a > img")
                  ?.getAttribute("src")
                  ? ele
                      .querySelector("div.item-thumb > .thumb-img > a > img")
                      ?.getAttribute("src")
                  : "",
                ele
                  .querySelector("div.item-thumb > .thumb-img > a > div > img")
                  ?.getAttribute("src")
                  ? ele
                      .querySelector(
                        "div.item-thumb > .thumb-img > a > div > img"
                      )
                      ?.getAttribute("src")
                  : ele
                      .querySelector("div.item-thumb > .thumb-img > a > img")
                      ?.getAttribute("src"),
              ],
              new_product: ele.querySelector("div.item-thumb > span.new")
                ? true
                : false,
              title: ele.querySelector("div.product-info > a").innerText,
              link_details: ele.querySelector("div.product-info > a").href,
              price: ele.querySelector("div.product-info > span").innerText,
            };
          });

          return listSP;
        }
      );

      wait(2000);

      scrapeData = scrapeData.concat(listSP);

      wait(2000);

      // lấy links detail item (từng item cụ thể)
      const detailLinks = await newPage.$$eval(
        "div.product-info > a",
        (element) => {
          detailLinks = element.map((ele) => {
            return ele.href;
          });
          return detailLinks;
        }
      );

      // scrape Detail
      const scrapeDetail = async (link) =>
        new Promise(async (resolve, reject) => {
          try {
            let pageDetail = await browser.newPage();
            await pageDetail.setViewport({ width: 1920, height: 1080 });
            console.log("mở tab mới...");
            await wait(4000);

            await pageDetail.setDefaultNavigationTimeout(120000);

            await pageDetail.goto(link);
            console.log("truy cập vào" + link);

            await pageDetail.waitForSelector(".shop-single");

            await wait(2000);

            await scrollToBottom(newPage);
            await wait(4000);

            //cào ảnh tại trang detail
            const detailData = {};
            const images = await pageDetail.$$eval(
              "#slickVerticalContainer > div.item > a >img",
              (elements) => {
                images = elements.map((ele) => {
                  // if (ele.querySelector("img")) {
                  //   return ele.querySelector("img")?.src;
                  // } else {
                  //   return "https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ=";
                  // }
                  return ele.src;
                });
                return images;
              }
            );
            detailData.images = images;

            const imagesSlider = await pageDetail.$$eval(
              ".prod-slider > div.item >img",
              (elements) => {
                imagesSlider = elements.map((ele) => {
                  // if (ele.querySelector("img")) {
                  //   return ele.querySelector("img")?.src;
                  // } else {
                  //   return "https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ=";
                  // }
                  return ele.src;
                });
                return imagesSlider;
              }
            );
            detailData.images_slider = imagesSlider;

            const rating = await pageDetail.$$eval(
              ".ratings-wrap > .ratings > span",
              (elements) => {
                return elements.length;
              }
            );
            detailData.rating = rating;

            const purchases = await pageDetail.$$eval(
              ".ratings-wrap > .ratings > em",
              (elements) => {
                return elements[0].innerText;
              }
            );
            detailData.purchases = purchases;

            //cào thông tin tại trang detail

            // const header = await pageDetail.$eval(
            //   "header.page-header",
            //   (elements) => {
            //     return {
            //       title: elements.querySelector("h1 > a").innerText,
            //       star: elements
            //         .querySelector("h1 > span")
            //         ?.className.replace(/^\D+/g, ""),
            //       class: {
            //         content: elements.querySelector("p").innerText,
            //         classType:
            //           elements.querySelector("p > a > strong").innerText,
            //       },
            //       address: elements.querySelector("address").innerText,
            //       attributes: {
            //         price: elements.querySelector(
            //           "div.post-attributes > .price > span"
            //         ).innerText,
            //         acreage: elements.querySelector(
            //           "div.post-attributes > .acreage > span"
            //         ).innerText,
            //         published: elements.querySelector(
            //           "div.post-attributes > .published > span"
            //         ).innerText,
            //         hashtag: elements.querySelector(
            //           "div.post-attributes > .hashtag > span"
            //         ).innerText,
            //       },
            //     };
            //   }
            // );
            // detailData.header = header;

            //cào thông tin mô tả

            // cào Header
            // const mainContentHeader = await pageDetail.$eval(
            //   "#left-col > article.the-post > section.post-main-content",
            //   (elements) => {
            //     return elements.querySelector("div.section-header > h2")
            //       .innerText;
            //   }
            // );

            // //cào content header
            // const mainContentContent = await pageDetail.$$eval(
            //   "#left-col > article.the-post > section.post-main-content > .section-content > p",
            //   (elements) => elements.map((element) => element.innerText)
            // );

            // detailData.mainContent = {
            //   header: mainContentHeader,
            //   content: mainContentContent,
            // };

            //cào đặc điểm tin đăng
            // const overviewHeader = await pageDetail.$eval(
            //   "#left-col > article.the-post > section.post-overview",
            //   (elements) => {
            //     return elements.querySelector("div.section-header > h3")
            //       .innerText;
            //   }
            // );

            // const overviewContent = await pageDetail.$$eval(
            //   "#left-col > article.the-post > section.post-overview > .section-content > table.table > tbody > tr",
            //   (elements) =>
            //     elements.map((element) => {
            //       return {
            //         name: element.querySelector("td:first-child").innerText,
            //         content: element.querySelector("td:last-child").innerText,
            //       };
            //     })
            // );

            // detailData.overview = {
            //   header: overviewHeader,
            //   content: overviewContent,
            // };

            // //cào thông tin liên hệ
            // const contactHeader = await pageDetail.$eval(
            //   "#left-col > article.the-post > section.post-contact",
            //   (elements) => {
            //     return elements.querySelector("div.section-header > h3")
            //       .innerText;
            //   }
            // );

            // const contactContent = await pageDetail.$$eval(
            //   "#left-col > article.the-post > section.post-contact > .section-content > table.table > tbody > tr",
            //   (elements) =>
            //     elements.map((element) => {
            //       return {
            //         name: element.querySelector("td:first-child").innerText,
            //         content: element.querySelector("td:last-child").innerText,
            //       };
            //     })
            // );

            // detailData.contact = {
            //   header: contactHeader,
            //   content: contactContent,
            // };

            await pageDetail.close();
            console.log("đã đóng tab" + link);
            resolve(detailData);
          } catch (error) {
            console.log("lất data detail lỗi", error);
            reject(error);
          }
        });

      const detailsPromises = detailLinks.map(async (linkDetail) => {
        return await scrapeDetail(linkDetail);
      });

      const details = await Promise.all(detailsPromises);

      await wait(4000);

      for (const [index, item] of scrapeData.entries()) {
        for (const [index1, item1] of details.entries()) {
          if (index1 === index) {
            scrapeData[index].details = details[index1];
          }
        }
      }
      let newArr = [...scrapeData];
      await wait(4000);
      scrapeData = [];
      // await browser.close();
      console.log("trình duyệt đã đóng");
      resolve(newArr);
    } catch (error) {
      console.log("lấy trang theo navigation lỗi", error);
      reject(error);
    }
  });

module.exports = { scrapeCategory, scrape };
