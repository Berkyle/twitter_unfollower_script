const Twitter = require('twitter');

const config                            = require('../config/config');
const queryUsers                        = require('./queryUsers');
const { summarize, sortByFollowers }    = require('../utils/utils');

let T = new Twitter(config);

// Returns a promise that resolves with the account's follower data
const queryAndSort = account => { // max of 5000 followers
    return new Promise((resolve, reject) => {
        T.get('followers/ids', { 
            user_id: account[1],
            stringify_ids: true
        }, (err, data, _) => {
            if(err) reject(err);
            else {
                queryUsers(data.ids)
                    .then(userObjects => {
                        const summaries = summarize(userObjects);
                        const sorted = sortByFollowers(summaries);
                        resolve(sorted);
                    })
                    .catch(uhoh => reject(uhoh));
            }
        });
    });
};

module.exports = queryAndSort;