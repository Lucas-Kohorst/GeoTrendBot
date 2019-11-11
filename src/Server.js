const twitter = require("./twitterAPI");
var dateHelper = require("./DateHelper")
var express = require("express");
var app = express();

// Routes
app.get("/user/:name", function(req, res) {
    console.log(new Date() + " [REQUEST] Username: " + req.params.search)
    twitter.user(req.params.name).then(async function(value) {
        res.send(value);
        console.log(new Date() + " [REQUEST] Served");
    });
});

app.get("/search/:hashtag/", function(req, res) {
    console.log(new Date() + " [REQUEST] Search: " + req.params.hashtag);
    var date = new Date();
    var promises = [];
    for (var i = 0; i < 6; i++) {
        promises.push(searchTweets(req.params.hashtag, date));
        date = dateHelper.getDate(date);
    }
    Promise.all(promises).then(function(values) {
        var tweetsArray = [
            ...values[0].statuses,
            ...values[1].statuses,
            ...values[2].statuses,
            ...values[3].statuses,
            ...values[4].statuses,
            ...values[5].statuses,
        ];
        res.send({ "tweets": tweetsArray });
        console.log(new Date() + " [REQUEST] Served");
    })
});

var port = 5000;
var server = app.listen(port, function() {
    console.log("App is listening on: http://localhost:" + port);
});

function searchTweets(q, date) {
    return new Promise((resolve, error) => {
        twitter
            .search(q, dateHelper.formatDate(date))
            .then(async function(value) {
                resolve(value)
            })
            .catch(error => {
                console.log(new Date() + " [Error] Username: " + error);
            });
    })
}