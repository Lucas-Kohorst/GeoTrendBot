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
 * Searches the given hashtag and returns results
 * with the Twitter API
 */
function search(hashtag) {
    return new Promise((resolve, reject) => {
        var params = {
            q: hashtag,
            count: 100,
            result_type: "recent"
        };
        client.get("search/tweets", params, function(error, tweets, response) {
            if (!error) {
                resolve(tweets);
            } else {
                reject(error)
            }
        });
    })
}

// /**
//  * Searches the given hashtag and returns results
//  * with twitter scrapers
//  * tops out at 40 and doesn't always work
//  */
// function search(hashtag) {
//     return new Promise((resolve, reject) => {
//         scrapeTwitter
//             .TweetStream('teamtrees', "latest", {
//                 count: 10
//             })
//         console.log("Hello")
//     });
// }

/**
 * Gets the user using twitters API
 */
// function user(name) {
//     var params = {
//         q: name,
//         count: 1
//     };
//     return new Promise((resolve, reject) => {
//         client.get("users/search", params, function(error, user, response) {
//             if (!error) {
//                 resolve(user);
//             } else {
//                 reject(error)
//             }
//         });
//     })
// }

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