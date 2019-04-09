const express = require('express')

const screenshot = require('./screenshot')

const app = express()
const port = 3000

app.use(express.json());
app.use(express.urlencoded());

app.use(express.static('public'))

app.post('/scrape', async (req, res, next) => {

    const url = req.body.url;
    const watermark = req.body.watermark || false;
    console.log("Fetching screenshot for " + url + " (watermark=" + watermark + ")");

    try {
        var screenshot_url = await screenshot.getScreenshotForURL(url, watermark);
        res.send({
            "status": "ok",
            "url": url,
            "mimeType": "image/jpeg",
            "screenshot": screenshot_url,
        });
    } catch (e) {
        console.log("ERROR: " + e);
        res.send({
            "status": "err",
        });
    }
})

app.get('/*', function(req, res) {
    const path = req.url;
    if (path[0] == "/") {
        const url = path.slice(1);

        if (url.indexOf(".") != -1) {
            res.redirect("/?url=" + url);
            return;
        }
    }

    res.status(404).send("not found");
});

app.listen(port, () => console.log(`immortal scraper listening on port ${port}!`))
