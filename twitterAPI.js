var Twitter = require("twitter");
var scrapeTwitter = require("scrape-twitter");

var client = new Twitter({
    consumer_key: "yGNZeX4d4hHRWkpnZ2TCBWdZ6",
    consumer_secret: "asOAgcrcjVmArgRUltV2JcCLbRnPVWf6MKCQ6cSJbbqxxmXgWs",
    access_token_key: "981264506214080512-aC58OZliG1jiOV1Kl4NZVdwl8tNeeVy",
    access_token_secret: "o77pQQy5yU8Zfd004AfvSci5yX9wJfM3ra80O5EjjFY9h"
});

/**
 * Get the mentions timeline for the authenticated user
 */
function mentions() {
    return new Promise((resolve, reject) => {
        client.get("statuses/mentions_timeline", function(error, tweets, response) {
            if (!error) {
                resolve(tweets);
            } else {
                reject(error);
            }
        });
    });
}

/**
 * Get a random trend from a random place
 */
function trends() {
    return new Promise((resolve, reject) => {
        var params = {
            id: 1
        };
        client.get("trends/place", params, function(error, tweets, response) {
            if (!error) {
                resolve(tweets);
            } else {
                reject(error);
            }
        });
    });
}

/**
 * Searches the given hashtag and returns results
 * with the Twitter API
 */
function search(hashtag, date) {
    return new Promise((resolve, reject) => {
        var params = {
            q: hashtag,
            count: 100,
            result_type: "recent",
            until: date
        };
        client.get("search/tweets", params, function(error, tweets, response) {
            if (!error) {
                resolve(tweets);
            } else {
                reject(error);
            }
        });
    });
}

/**
 * Gets the user using twitter-scraper
 * rather than the API
 * used to avoid rate limits
 */
function user(name) {
    return new Promise((resolve, reject) => {
        scrapeTwitter
            .getUserProfile(name)
            .then(userProfile => {
                resolve(userProfile);
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports.mentions = mentions;
module.exports.user = user;
module.exports.search = search;
module.exports.trends = trends;