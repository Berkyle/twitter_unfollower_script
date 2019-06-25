const Twitter       = require('twitter');
const config        = require('../config/config');
const { summarize, sortByFollowers } = require('../utils/utils');

let T = new Twitter(config);

const updateAccounts = accounts => {
    return Promise.all(accounts.map(account => {
        return queryTwitter(account);
    }));
}

// Returns a promise that resolves with the account's follower data
const queryTwitter = account => { // max of 5000 followers
    return new Promise((resolve, reject) => {
        T.get('followers/ids', { 
            user_id: account[1], 
            stringify_ids: true 
        }, (err, data, _) => {
            if(err) reject(err);
            else queryUsers(data.ids)
                    .then(followerData => resolve(followerData))
                    .catch(error => reject(error));
        });
    });
};

// Query for all followers' account data from Twitter
const queryUsers = followers => {
    return new Promise((resolve, reject) => {

        // Break list of unfollowers into chunks of 100 users
        let in100s = [];
        const flwCount = followers.length;
        for(let i = 0; i < flwCount; i += 100)
            in100s[i/100] = followers.slice(i, i + Math.min(flwCount-i-1, 99));

        // Create array of promises for Twitter data.
        let followerPromises = in100s.map(ids => new Promise((rslv, rjct) => {
            const toQuery = ids.join(',');

            T.get('users/lookup', { user_id: toQuery }, (err, data, _) => {
                if(err) rjct(err);
                else    rslv(data);
            });
        }));


        // Sort list of followers by follower count
        Promise.all(followerPromises)
            .then(values => {
                // Concatenate sections of follower objects together
                const flatten = (acc, val) => acc.concat(val);
                const flattened = values.reduce(flatten, []);
                
                const summary = summarize(flattened); // from utils
                // const sortByFollowers = (a, b) => b.followers - a.followers;
                const sorted = sortByFollowers(summary); // from utils
                
                resolve(sorted);
            })
            .catch(uhoh => reject(uhoh));
    });
};

module.exports = updateAccounts;