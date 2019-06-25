const fs        = require('fs');
const Twitter   = require('twitter');

const config                    = require('../config/config');
const queryUsers                = require('./queryUsers');
const { summarize, fileName }   = require('../utils/utils');

let T = new Twitter(config);

const updateAccounts = accounts => {
    const traitorPromises = accounts.map(account => getUnfollowers(account));

    return new Promise((resolve, reject) => {
        Promise.all(traitorPromises)
        .then(myUsers => {
            // Find which users lost followers
            const vip = acc =>  typeof acc === 'object' && 
                                typeof acc.unfollowers === "object";
            let needToQuery = myUsers.filter(vip);

            // Create comprehensive list of all lost followers
            const allTraitors = needToQuery.reduce((list, acct) =>
                list.concat(acct.unfollowers), []);

            // Don't need to use a twitter request if no lost followers
            const total = allTraitors.length;
            if(total === 0)
                return resolve(myUsers);

            queryUsers(allTraitors)
            .then(traitorObjs => {
                // Summarize Traitor data for viewing and map back to arrays
                let mappedTraitorData = mapDataToIDs(myUsers, traitorObjs);

                // Show total number of unfollowers at the top of the page
                mappedTraitorData.unshift({totalUnfollowers: total});

                resolve(mappedTraitorData);
            })
            .catch(error => reject(error));
        })
        .catch(error => reject(error));
    });
}

// Returns a promise that resolves with the account's unfollower data
const getUnfollowers = account => { // max of 5000 followers
    return new Promise((resolve, reject) => {
        T.get('followers/ids', {
            user_id: account[1],
            stringify_ids: true
        }, (err, data, _) => {
            if(err) resolve({...err, account});
            else findTraitors(data.ids, account)
                    .then(unfollowerData => resolve(unfollowerData))
                    .catch(error => resolve({...error, account}));
        });
    });
};

// Compare the user's current followers with their previous followers
    // and return the difference
const findTraitors = (ids, [name, id]) => {
    return new Promise((resolve, _) => {

        // Determine next filename for specified user
        let fileCount = 0;
        let nextFile = fileName(id, fileCount);
        while(fs.existsSync( nextFile ))
            nextFile = fileName(id, ++fileCount);

        // Create a new data point for specified user
        writeNewFile(nextFile, ids);

        // Check if this is the user's first datapoint
        if(fileCount === 0)
            return resolve({
                name,
                numberOfUnfollowers: 0,
                unfollowers: "First list created!"
            });
        
        // Get the name of the last file entry for this user
        const lastEntry = fileName(id, fileCount-1);

        // Read from last file entry for this user
        fs.readFile(lastEntry, (err, data) => {
            if (err) return resolve({...err, loc: "read file to compare"});

            // Compare follower lists, determine unfollowers
            const prevList = JSON.parse(data).followers;
            const filterFunc = user => !(ids.includes(user));
            const traitors = prevList.filter(filterFunc);

            // Resolve with data about who unfollowed this user
            resolve({
                name,
                numberOfUnfollowers: traitors.length,
                unfollowers: traitors.length ? traitors : 'None'
            });
        });
    });
};

// Write the user's follower list to a file as a JSON object
const writeNewFile = (toWrite, arrayOfFollowers) => {
    const data = JSON.stringify({
        followers: arrayOfFollowers
    });

    fs.writeFile(toWrite, data, (err) => {
        if (err) console.log(err)
    });
};

const mapDataToIDs = (myUsers, traitorObjs) => {
    const ids = traitorObjs.map(user => user.id_str);
    const summaries = summarize(traitorObjs);

    // Now, map each traitor's summary back to its id string
    // ....
    // For each resulting traitor's summary,
    for(let i = 0; i < summaries.length; i++) {

        // and for each user,
        for(let j = 0; j < myUsers.length; j++) {

            // so long as the user has a list of unfollowers,
            if(typeof myUsers[j].unfollowers === "object") {
                
                // Search the user's unfollower array ...
                const numTraitors = myUsers[j].unfollowers.length;
                for(let k = 0; k < numTraitors; k++) {

                    // for the matching ID. If a matching ID is found,
                    if(myUsers[j].unfollowers[k] === ids[i]) {

                        // substitute it with the traitor's data
                        myUsers[j].unfollowers[k] = summaries[i];

                        // then do the same for the next user
                        break;
                    }
                }
            }
        }
    }

    return myUsers;
}

module.exports = updateAccounts;