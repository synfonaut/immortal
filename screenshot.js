const slugify = require('@sindresorhus/slugify');
const puppeteer = require('puppeteer');

async function getScreenshotForURL(url) {

    const browser = await puppeteer.launch({
       ignoreHTTPSErrors: true
     });

    const page = await browser.newPage();
    page.setViewport({
        width: 1024,
        height: 768,
    });

    await page.goto(url, {"waitUntil" : "networkidle0"});
    const fileName = slugify(url + "-" + (new Date().getTime())) + ".jpg";
    const uploadPath = "public/uploads/" + fileName;
    const downloadPath = "https://immortalsv.com/uploads/" + fileName;
    await page.screenshot({path: uploadPath, quality: 85});

    await browser.close();

    return new Promise(resolve => {
        resolve(downloadPath);
    });
}

module.exports = {
    'getScreenshotForURL': getScreenshotForURL
}
