# twitter_unfollower_script

## Purpose of this program

Finding the fools and traitors who 'unfollowed' me. Why did they leave? Am I worth less now than when they joined me? Probably not, but this program will cause me to lose sleep and fulfill my masochistic tendencies nonetheless.

## How to use

1. npm install
2. (steps in before running)
3. get the JSON viewer extension if you have not already
4. npm start
5. navigate to http://localhost:3000
6. cast scorn and fury upon your traitors. oh how we despise them

## Before running:

* You will need to make sure you have filled out the configuration file in config/config.js. Fill out the each empty string value below
```javascript
module.exports = {
    consumer_key: '',
    consumer_secret: '',
    access_token_key: '',
    access_token_secret: ''
}
```

*  Once you've completed the config file (the developer keys can take a bit but that's just because twitter is awful) simply add the twitter accounts you want to track in config/accounts.json and run the script every once in a while. The format looks like this:
```javascript
{
    "accounts": [
        [ "some account I want to track",        "8080" ],
        [ "stringify all twitter IDs like so :", "1234567890"]
    ]
}
```

** Note that all twitter IDs must remain strings, as many twitter IDs are greater than 2^53, which is the maximum value that JavaScript can safely represent.

### Thank you for checking out the only hobby code I've decided was even remotely fit for GitHub! 


## Please hire me!
## I'm desparate for a job and halfway decent at JavaScript!!!
# I will continue to write terrible un-styled hobby code until I am hired! Save the internet! Give a decent JS dev a job!
# Please!
# PLEASE!
# PLEASE !!!!!!
