const express = require('express')
const screenshot = require('./screenshot')

const app = express()
const port = 3000

app.get('/scrape', async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');

    const url = req.query.url;
    try {
        var screenshot_url = await screenshot.getScreenshotForURL(url);
        res.send({
            "status": "ok",
            "url": url,
            "screenshot": screenshot_url,
        });
    } catch (e) {
        res.send({
            "status": "err",
        });
    }
})

app.listen(port, () => console.log(`immortal scraper listening on port ${port}!`))
