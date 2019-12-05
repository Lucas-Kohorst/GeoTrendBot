var Twitter = require("twitter");
var scrapeTwitter = require("scrape-twitter");
var config = require("../.config.js");

var client = new Twitter(config.config);

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
            id: 2459115
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