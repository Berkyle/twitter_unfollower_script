// Create HTML string of menu-like links
const createDirMenu = (route, accounts, all = true) => {
    let jsx = `<br><br>`;

    if(all) 
        jsx += `<a href="/${route}/all">all</a><br>`;

    for(let acc of accounts)
        jsx += `<a href="/${route}/${acc[0]}">${acc[0]}</a><br>`;

    return jsx;
}

// Generate filename to store user's follower data
const path = require('path');
const fileName = (id, n) =>
    path.join(__dirname, '../lib/data', `${id}_${n}.json`);

// Retrieve only the desired account
const findAccount = (uname, accounts) => 
    accounts.find(account => account[0] === uname);

// Concatentate arrays together
const flatten = arr =>
    arr.reduce((acc, val) => acc.concat(val), []);

// Break an array of users into segments of 100 users
const segment100 = followers => {
    let in100s = [];
    const arrayMax = followers.length - 1;
    for(let i=0; i<arrayMax; i+=100)
        in100s[i/100] = followers.slice(i, i + Math.min(arrayMax-i, 99));

    return in100s;
}

// Sort an array of users by their follow count (summarized first)
const sortByFollowers = summarized =>
    summarized.sort((a, b) => b.followers - a.followers);

// Summarize each value in an array of user objects
const summarize = data => data.map(acc => ({
        user: `${acc.name} (@${acc.screen_name}, id ${acc.id_str})`,
        followers: acc.followers_count,
        following: acc.friends_count
    }));

module.exports = {
    createDirMenu,
    fileName,
    findAccount,
    flatten,
    segment100,
    sortByFollowers,
    summarize
};