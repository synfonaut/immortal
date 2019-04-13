const express = require('express')
const fs = require("fs");

const screenshot = require('./screenshot')
const bitcoinfiles =  require('bitcoinfiles-sdk');
const bsv =  require('bsv');


function sign_opreturn(args, private_key) {

    const identityPrivateKey = new bsv.PrivateKey(private_key);
    const identityAddress = identityPrivateKey.toAddress().toString();

    args.push('0x' + Buffer.from('|').toString('hex'));

    const arr = bitcoinfiles.buildAuthorIdentity({
        args: args,
        address: identityAddress,
        key: private_key
    });

    return args.concat(arr);
}

const app = express()
const port = 3000

const tip_address = "16srSTytNdk11V8xBKYuJQFZKGThzN4GzU";
const bitcom_protocol = "19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut";
const map_protocol = "1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5";
const immortal_protocol = "1NvmQsnpinHTf7KinvHmqLCM8hcaYaFbg4";

app.use(express.json());
app.use(express.urlencoded());

app.use(express.static('public'))

app.post('/scrape', async (req, res, next) => {


    const url = req.body.url;
    const watermark = req.body.watermark || false;
    console.log("Fetching screenshot for " + url + " (watermark=" + watermark + ")");

    try {
        var object = await screenshot.getScreenshotForURL(url, watermark);

        var screenshot_url = object.screenshot_url;
        var screenshot_path = object.screenshot_path;

        if (!screenshot_path || !screenshot_url) {
            throw new Error("ERROR: Invalid screenshot url and path returned for url " + url);
        }

        fs.readFile(screenshot_path, (err, file) => {
            if (err) {
                console.log("Error while reading file " + file);
                res.send({"status": "err"});
                return;
            }

            const data = [
                "0x" + Buffer.from(bitcom_protocol).toString("hex"),
                "0x" + Buffer.from(file).toString("hex"),
                "0x" + Buffer.from("image/jpeg").toString("hex"),
                "0x" + Buffer.from("binary").toString("hex"),
                "0x" + Buffer.from(url).toString("hex"),
                "0x" + Buffer.from("|").toString("hex"),
                "0x" + Buffer.from(map_protocol).toString("hex"),
                "0x" + Buffer.from("SET").toString("hex"),
                "0x" + Buffer.from("url").toString("hex"),
                "0x" + Buffer.from(url).toString("hex"),
            ];

            const signed_data = sign_opreturn(data, process.env.PRIVATE_KEY);

            (async () => {
                const verification = await bitcoinfiles.verifyAuthorIdentity(signed_data, [immortal_protocol]);

                if (!verification.verified) {
                    console.log(verification);
                    res.send({"status": "err"});
                    return;
                }

                res.send({
                    "status": "ok",
                    "url": url,
                    "mimeType": "image/jpeg",
                    "screenshot": screenshot_url,
                    "data": signed_data 
                });
            })();
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
