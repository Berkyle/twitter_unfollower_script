const express   = require('express');
const fs        = require('fs');

const traitors  = require('./lib/petty');
const business  = require('./lib/business');

let app = express();
const port = 3000;

let accounts = [];

app.get('/', (_, res) => {
    const jsx1 = `<a href="/traitors">traitors</a><br>`;
    const jsx2 = `<a href="/business">business</a>`;

    fs.readFile('config/accounts.json', (err, acntStrng) => {
        accounts = JSON.parse(acntStrng).accounts;

        res.send(jsx1+jsx2);
    });
});

app.get('/traitors', (_, res) => {
    traitors(accounts)
        .then((data) => res.send(data))
        .catch((error) => res.send(error));
});

app.get('/business', (_, res) => {
    business(accounts)
        .then((data) => res.send(data[0]))
        .catch((error) => res.send(error));
});

app.listen(port, () => {
    console.log("Let's get it.");
});