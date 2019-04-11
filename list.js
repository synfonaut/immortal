const sdk =  require('bitcoinfiles-sdk');

(async () => {
    var result = await sdk.find({
        address: "1NvmQsnpinHTf7KinvHmqLCM8hcaYaFbg4",
        contentType: "application/json",
        limit: 10
    });

    console.log(result);
})();

