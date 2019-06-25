# twitter_unfollower_script

## Purpose

Finding the fools and traitors who 'unfollowed' me. Why did they leave? Am I worth less now than when they joined me? Probably not, but I will lose sleep over it nonetheless.

NEW! That's right! I remembered I made this! There's a new feature! You can now sort a user's followers by their worth (follower count).

## How to use

1. npm install
2. (steps in before running)
3. get the JSON viewer extension if you have not already
4. npm start (starts server and opens a browser to localhost)
5. navigate to traitors or business. traitors finds unfollowers, business orders followers by their follower count.

## Before running:

* You need to make sure you have filled out the configuration file in /config/config.js. This contains the dev keys that will be sent with your requests. The developer keys can take a bit to be sent to you but that's just because twitter is awful. 

* Once you have the dev keys, fill out each empty string value below
```javascript
module.exports = {
    consumer_key: '',
    consumer_secret: '',
    access_token_key: '',
    access_token_secret: ''
}
```

*  Once you've completed the config file, simply add the twitter accounts you want to track in config/accounts.json and run the script every once in a while. The format looks like this:
```javascript
{
    "accounts": [
        [ "some account I want to track",        "8080" ],
        [ "stringify all twitter IDs like so :", "1234567890"]
    ]
}
```

** Note that all twitter IDs must remain strings, as many twitter IDs are greater than 2^53, the maximum number value that JavaScript can represent exactly.

#### Thank you for checking out the only hobby code I've decided was even remotely fit for GitHub! Please hire me!
### I'm desparate for a job and halfway decent at JavaScript!!!
## I will continue to write terrible un-styled hobby code until I am hired! 
## Please!
## PLEASE!
## PLEASE !!!!!!
