var Twit = require("twit");
const twitter = require("../twitterAPI");

console.log("The bot is starting");

var T = new Twit({
    consumer_key: "yGNZeX4d4hHRWkpnZ2TCBWdZ6",
    consumer_secret: "asOAgcrcjVmArgRUltV2JcCLbRnPVWf6MKCQ6cSJbbqxxmXgWs",
    access_token: "981264506214080512-aC58OZliG1jiOV1Kl4NZVdwl8tNeeVy",
    access_token_secret: "o77pQQy5yU8Zfd004AfvSci5yX9wJfM3ra80O5EjjFY9h"
});

//Setting up a user stream
var stream = T.stream("statuses/filter", {
    track: "@GeoTrendBot"
});
stream.on("tweet", tweetEvent);

function tweetEvent(tweet) {
    console.log("Hello")
    var reply_to = tweet.in_reply_to_screen_name;
    var text = tweet.text;
    var from = tweet.user.screen_name;
    var nameID = tweet.id_str;
    // params just to see what is going on with the tweets
    var params = { reply_to, text, from, nameID };

    if (reply_to === "GeoTrendBot" && from != "GeoTrendBot") {
        var base_url = "https://geotrendbot.herokuapp.com/";
        // If  there is a hashtag in the tweet
        if (params.text.search("#") != -1) {
            var hashtag = params.text.split("#")[1];
            var new_tweet = "@" + from + " Here you go " + base_url + hashtag;
            var tweet = {
                status: new_tweet,
                in_reply_to_status_id: nameID
            };
            T.post("statuses/update", tweet, tweeted);
            console.log("Tweeted: " + tweet);
        } else {
            twitter
                .trends()
                .then(function(value) {
                    var randomNum = Math.floor(Math.random() * 49 + 0);
                    var randomTrend = value[0].trends[randomNum];
                    randomTrend = randomTrend.name.split("#")[1];
                    var new_tweet =
                        "@" +
                        from +
                        " I couldn't understand that. Please reply with a valid hashtag. Here's a random map " +
                        base_url +
                        randomTrend;
                    var tweet = {
                        status: new_tweet,
                        in_reply_to_status_id: nameID
                    };
                    T.post("statuses/update", tweet, tweeted);
                    console.log("Tweeted: " + tweet);
                })
                .catch(err => console.log("Error: " + JSON.stringify(err, null, 2)));
        }

        function tweeted(err, data, response) {
            if (err) {
                console.log("Error! " + err);
            } else {
                console.log("Tweet Sent!");
            }
        }
    }
}