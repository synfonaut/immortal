const slugify = require('@sindresorhus/slugify');
const puppeteer = require('puppeteer');

var endpoint = "https://immortalsv.com";
if (process.env.DEV) {
    endpoint = "http://localhost:3000";
}

async function getScreenshotForURL(url) {

    const browser = await puppeteer.launch({
       ignoreHTTPSErrors: true
     });

    const page = await browser.newPage();
    page.setViewport({
        width: 1024,
        height: 768,
    });

    page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36");

    await page.goto(url, {"waitUntil" : "networkidle0"});
    const fileName = slugify(url + "-" + (new Date().getTime())) + ".jpg";
    const uploadPath = "public/uploads/" + fileName;
    const downloadPath = endpoint + "/uploads/" + fileName;
    await page.screenshot({path: uploadPath, quality: 85});

    await browser.close();

    return new Promise(resolve => {
        resolve(downloadPath);
    });
}

module.exports = {
    'getScreenshotForURL': getScreenshotForURL
}
