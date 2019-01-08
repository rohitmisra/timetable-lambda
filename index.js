var pt = require("public-transport");
exports.handler = function(event, context, callback) {
    // TODO implement
    let stationname = "";
    let productsParam = "";
    if (event.queryStringParameters !== null && event.queryStringParameters !== undefined) {
        if (event.queryStringParameters.stationname !== undefined &&
            event.queryStringParameters.stationname !== null &&
            event.queryStringParameters.stationname !== "") {
            console.log("Received query: " + event.queryStringParameters.stationname);
            stationname = event.queryStringParameters.stationname;
        }
    }

    if (event.queryStringParameters !== null && event.queryStringParameters !== undefined) {
        if (event.queryStringParameters.products !== undefined &&
            event.queryStringParameters.products !== null &&
            event.queryStringParameters.products !== "") {
            console.log("Received query: " + event.queryStringParameters.products);
            productsParam = event.queryStringParameters.products;
        }
    }
    console.log("pt obj:" + pt);
    var p = pt.departures({ type: "dbahn", station: stationname, products: productsParam });
    console.log("Searching for: " + stationname + ", " + productsParam);
    p.then(function(value) {
            console.log("Closest Match: " + value.station.name);
            var summary = [];
            var detail = [];
            value.departures.entries.forEach(function(val, idx) {
                detail.push(val.$);
                summary.push(val.$.prod.split('#')[0].split('   ').join(' ') + " | " + val.$.targetLoc + " | " + "Platform: " +
                    ((val.$.platform) ? (val.$.platform) : "-") + " | " + val.$.fpTime + ((val.$.e_delay) ? ("(+" + (val.$.e_delay) + val.$.delayReason + ")") : ""));
            });

            var respBody = {
                stationName: value.station.name,
                departures: {
                    detail: detail,
                    summary: summary
                }
            };
            var response = {
                statusCode: 200,
                body: JSON.stringify(respBody)
            };
            callback(null, response);
        })
        .catch(function(e) {
            console.log("ERROR: " + e);
        });
};
