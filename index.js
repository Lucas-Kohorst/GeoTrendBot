const twitter = require("./twitterAPI");
var express = require("express");
var opencage = require("opencage-api-client");
var path = require('path');
var app = express();

// Routes
app.get("/", function(req, res) {
    res.send("Hello World!");
});
app.get("/user/:name", function(req, res) {
    twitter.user(req.params.name).then(value => {
        try {
            res.send(value.screenName + " " + value.location);
        } catch (error) {
            res.send(error);
        }
    });
});
app.get("/map", function(req, res) {
    res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/map/:hashtag", function(req, res) {
    twitter
        .search(req.params.hashtag)
        .then(async function(value) {
            var tweets = [];
            for (var i = 0; i < value.statuses.length; i++) {
                var text = value.statuses[i].text;
                var name = value.statuses[i].user.screen_name;
                // Getting users location
                var location = {
                    lat: null,
                    long: null
                };
                await twitter.user(name).then(value => {
                    try {
                        opencage
                            .geocode({ q: value.location })
                            .then(data => {
                                try {
                                    location = {
                                        lat: data.results[0].geometry.lat,
                                        long: data.results[0].geometry.lng
                                    };
                                    if (
                                        location.lat != null &&
                                        location.long != null
                                    ) {
                                        console.log(
                                            value.location
                                        );
                                        tweets.push({
                                            name: name,
                                            tweet: text,
                                            location: location,
                                            place: value.location
                                        });
                                    }
                                } catch (error) {}
                            })
                            .catch(error => {});
                    } catch (error) {}
                });
            }
            res.send({
                "tweets": tweets
            });
        })
        .catch(error => {
            res.send(error);
        });
});


var port = 3000;
var server = app.listen(port, function() {
    console.log("App is listening on: http://localhost:" + port);
});

// twitter
//   .mentions()
//   .then(value => {
//     res.send(
//       JSON.stringify(value[0]) +
//         "<br /><br /><br /><br />" +
//         value[0].user.screen_name +
//         " " +
//         value[0].user.location
//     );
//   })
//   .catch(error => {
//     res.send(error);
//   });