const Twitter       = require('twitter');
const config                    = require('../config/config');
const { flatten, segment100 }   = require('../utils/utils');

let T = new Twitter(config);

const queryUsers = followers => {
    return new Promise((resolve, reject) => {

        // Array of userIDs => array of arrays of 100 userIDs
        const in100s = segment100(followers);

        // Create promise array of Twitter data queries.
        let queryPromises = in100s.map(ids => new Promise((rslv, rjct) => {
            const user_id = ids.join(','); // Stringify list of user IDs

            // Query Twitter API for user data
            T.get('users/lookup', { user_id }, (err, data, _) => {
                if(err) rjct(err);
                else    rslv(data);
            });
        }));

        // Concatenate all user arrays and resolve promise
        Promise.all(queryPromises)
            .then(values => resolve(flatten(values))) 
            .catch(uhoh => reject(uhoh));
    });
};

module.exports = queryUsers