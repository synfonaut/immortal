const bitcoinfiles =  require('bitcoinfiles-sdk');

const immortal_protocol = "1NvmQsnpinHTf7KinvHmqLCM8hcaYaFbg4";

(async () => {
    var result = await bitcoinfiles.find({
        address: immortal_protocol,
        limit: 10
    });
    console.log(result);

    var tx = await bitcoinfiles.get('217320fc694cc2d984aea3ca2e5ff91caf0ceb9e797d62f019e043d90aee0b9f');
    console.log(tx)
})();

