const fs        = require('fs');
const Twitter   = require('twitter');
const config                    = require('../config/config');
const { summarize, fileName }    = require('../utils/utils');

let T = new Twitter(config);

const updateAccounts = accounts => {
    return Promise.all(accounts.map(account => {
        return queryTwitter(account);
    }));
}

// Returns a promise that resolves with the account's unfollower data
const queryTwitter = account => { // max of 5000 followers
    return new Promise((resolve, reject) => {
        T.get('followers/ids', { 
            user_id: account[1], 
            stringify_ids: true 
        }, (err, data, _) => {
            if(err) reject(err);
            else findTraitors(data.ids, account)
                    .then(unfollowerData => resolve(unfollowerData))
                    .catch(error => reject(error));
        });
    });
};

// Compare the user's current followers with their previous followers
const findTraitors = (ids, [name, id]) => {
    return new Promise((resolve, reject) => {
        // Determine next filename for specified user
        let fileCount = 0;
        let nextfile = fileName(id, fileCount);
        while(fs.existsSync( nextfile )) {
            fileCount++;
            nextfile = fileName(id, fileCount);
        }

        // Create a new data point for the user
        const newEntry = fileName(id, fileCount);
        writeNewFile(newEntry, ids);

        // Check if this is the user's first datapoint
        if(fileCount == 0) {
            resolve({ 
                name, 
                unfollowers: "First list created!" 
            });
        }
        else {
            // Get the name of the last file entry for this user
            const lastEntry = fileName(id, fileCount-1);

            // Read from last file entry for this user
            fs.readFile(lastEntry, (err, data) => {
                if (err) reject(err);
                // Compare follower lists, determine unfollowers
                const prevList = JSON.parse(data).followers;
                const filterFunc = user => !(ids.includes(user));
                const traitors = prevList.filter(filterFunc);
                
                if(traitors.length > 0) {
                    queryUsers(traitors)
                        .then(data => resolve({ 
                            name, 
                            numberOfUnfollowers: traitors.length,
                            unfollowers: data }))
                        .catch(error => reject(error));
                }
                else {
                    resolve({ 
                        name, 
                        unfollowers: "No unfollowers" 
                    });
                }
            });
        }
    });
};

// Write the user's follower list to a file as a JSON object
const writeNewFile = (toWrite, arrayOfFollowers) => {
    const data = JSON.stringify({ followers: arrayOfFollowers });
    fs.writeFile(toWrite, data, (err) => { if (err) console.log(err) });
};

// Query for the unfollowers' account data from Twitter
const queryUsers = unfollowers => {
    return new Promise((resolve, reject) => {
        const toQuery = unfollowers.join(',');
        T.get('users/lookup', { user_id: toQuery }, (err, data, _) => {
            if(!err) resolve(summarize(data));
            else if(err[0].code === 17) resolve("Lost accounts were bots");
            else resolve(err);
        });
    });
};

module.exports = updateAccounts;