const slugify = require('@sindresorhus/slugify');
const puppeteer = require('puppeteer');
var Jimp = require('jimp');

function makeIteratorThatFillsWithColor(color) {
    return function (x, y, offset) {
        this.bitmap.data.writeUInt32BE(color, offset, true);
    }
};

var endpoint = "https://immortalsv.com";
if (process.env.DEV) {
    endpoint = "http://localhost:3000";
}

async function getScreenshotForURL(url, shouldWatermark=true) {

    const browser = await puppeteer.launch({
        ignoreHTTPSErrors: true
    });

    const page = await browser.newPage();
    page.setViewport({
        width: 1024,
        height: 768,
    });

    page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36");

    page.goto(url);
    await Promise.race([
        page.waitForNavigation({waitUntil: 'load'}),
        page.waitForNavigation({waitUntil: 'networkidle0'})
    ]);

    await page.waitFor(1500);

    const fileName = slugify(url + "-" + (new Date().getTime())) + ".jpg";
    const uploadPath = "public/uploads/" + fileName;
    const downloadPath = endpoint + "/uploads/" + fileName;
    await page.screenshot({path: uploadPath, quality: 70});

    await browser.close();

    if (shouldWatermark) {
        return Jimp.read(uploadPath)
            .then(function (image) {
                loadedImage = image;
                return Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
            })
            .then(function (font) {

                const paddingX = 10;

                const text = "immortalsv.com " + url;

                const width = Jimp.measureText(font, text);
                const height = Jimp.measureTextHeight(font, text, width) * 0.95;

                const overlay = new Jimp(width + (paddingX * 2), height, makeIteratorThatFillsWithColor(Jimp.cssColorToHex("#000000"))).quality(70);
                overlay.scan(0, 0, width + (paddingX * 2), height, makeIteratorThatFillsWithColor(Jimp.cssColorToHex("#333")));

                const watermark = overlay.print(font, paddingX, (height / 2) - 10, text)
                const watermarkPath = "public/uploads/wm-" + fileName;
                const watermarkDownloadPath = endpoint + "/uploads/wm-" + fileName;

                loadedImage.quality(70).composite(watermark, 0, 768-height, {
                    mode: Jimp.BLEND_MULTIPLY,
                    opacitySource: 0.6,
                    opacityDest: 1,
                }).quality(70).resize(768, 576).write(watermarkPath);

                return new Promise(resolve => {
                    resolve(watermarkDownloadPath);
                });
            })
            .catch(function (err) {
                throw err;
            });
    } else {
        const finalUploadPath = "public/uploads/uwm-" + fileName;
        const finalDownloadPath = endpoint + "/uploads/uwm-" + fileName;
        return Jimp.read(uploadPath).then(image => {
            image.quality(70).resize(768, 576).write(finalUploadPath);
            return new Promise(resolve => {
                resolve(finalDownloadPath);
            });
        });
    }
}

module.exports = {
    'getScreenshotForURL': getScreenshotForURL
}
