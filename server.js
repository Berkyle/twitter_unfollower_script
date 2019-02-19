const express       = require('express');
const fs            = require('fs');

const queryTwitter  = require('./lib/petty');

let app = express();
const port = 3000;

app.get('/', (_, res) => {
    fs.readFile('config/accounts.json', (err, acntStrng) => {
        const accounts = JSON.parse(acntStrng).accounts;

        queryTwitter(accounts).then((data) => {
            res.send(data);
        }).catch((error) => {
            res.send(error);
        });
    });
});

app.listen(port, () => {
    console.log("Let's get it.");
});