const path = require('path');

const summarize = data => data
    .map(acc => ({
        user: `${acc.name} (@${acc.screen_name}, id ${acc.id_str})`,
        followers: acc.followers_count,
        following: acc.friends_count
    }));

const fileName = (id, n) => path.join(__dirname, '../lib/data', `${id}_${n}.json`);

module.exports = {
    summarize,
    fileName
};