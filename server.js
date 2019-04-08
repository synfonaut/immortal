const express = require('express')

const screenshot = require('./screenshot')

const app = express()
const port = 3000

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.use(express.static('public'))

app.post('/scrape', async (req, res, next) => {

    const url = req.body.url;
    console.log("Fetching screenshot for " + url);

    try {
        var screenshot_url = await screenshot.getScreenshotForURL(url);
        res.send({
            "status": "ok",
            "url": url,
            "mimeType": "image/jpeg",
            "screenshot": screenshot_url,
        });
    } catch (e) {
        res.send({
            "status": "err",
        });
    }
})

app.listen(port, () => console.log(`immortal scraper listening on port ${port}!`))
