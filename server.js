const express   = require('express');
const fs        = require('fs');

const traitors          = require('./lib/petty');
const business          = require('./lib/business');
const { createDirMenu, findAccount } = require('./utils/utils');

let app = express();
const port = 3000;
const home = `<a href="/">Home</a>`;
let accounts = [];

// =========================================================
// ===================== START ROUTES ======================

app.get('/', (_, res) => {
    const jsx1 = `<a href="/traitors">traitors</a><br>`;
    const jsx2 = `<a href="/business">business</a>`;

    // Read and save accounts file in memory on first navigation
    fs.readFile('config/accounts.json', (err, acntStrng) => {
        accounts = JSON.parse(acntStrng).accounts;

        res.send(jsx1+jsx2);
    });
});

// =========================================================
// ==================== TRAITORS ROUTES ====================
// =========================================================
app.get('/traitors/all', (_, res) => {
    traitors(accounts)
        .then((data) => res.send(data))
        .catch((error) => res.send(error));
});

app.get('/traitors/:account', (req, res) => {
    const mono_account = findAccount(req.params.account, accounts);

    if(mono_account) {
        traitors([mono_account])
            .then((data) => res.send(data))
            .catch((error) => res.send(error));
    } else {
        res.status(403).send("Account doesn't exist<br>"+home);
    }
});

app.get('/traitors', (_, res) => {
    let jsx = home+createDirMenu('traitors', accounts)

    res.send(jsx);
});

// =========================================================
// ==================== BUSINESS ROUTES ====================
// =========================================================
app.get('/business/:account', (req, res) => {
    const mono_account = findAccount(req.params.account, accounts);

    if(mono_account) {
        business(mono_account)
            .then((data) => res.send(data))
            .catch((error) => res.send(error));
    } else {
        res.status(403).send("Account doesn't exist<br>"+home);
    }
});

app.get('/business', (_, res) => {
    let jsx = home+createDirMenu('business', accounts, false)

    res.send(jsx);
});

// ====================== END ROUTES =======================
// =========================================================

app.listen(port, () => {
    console.log("Let's get it.");
});
