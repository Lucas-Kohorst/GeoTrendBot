var moment = require("moment");
moment().format();

function formatDate(date) {
    return moment(date).format("YYYY-MM-DD");
}

function getDate(previousDate) {
    var date = moment(previousDate).subtract(1, "days");
    return formatDate(date);
}

module.exports.formatDate = formatDate;
module.exports.getDate = getDate;