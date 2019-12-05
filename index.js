const twitter = require("./twitterAPI");
var dateHelper = require("./DateHelper");
var express = require("express");
var path = require("path");
var app = express();

// Routes
app.get("/trends/", function(req, res) {
    console.log(new Date() + " [REQUEST] Trends");
    twitter.trends().then(function(value) {
        res.send(value);
        console.log(new Date() + " [REQUEST] Served");
    }).catch(err => {
        res.send(err)
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
            ...values[5].statuses
        ];
        res.send({ tweets: tweetsArray });
        console.log(new Date() + " [REQUEST] Served");
    });
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
    })
}

const port = process.env.PORT || 5000;

var server = app.listen(port, function() {
    console.log("App is listening on: http://localhost:" + port);
});

function searchTweets(q, date) {
    return new Promise((resolve, error) => {
        twitter
            .search(q, dateHelper.formatDate(date))
            .then(async function(value) {
                resolve(value);
            })
            .catch(error => {
                console.log(new Date() + " [Error] Username: " + error);
            });
    });
}