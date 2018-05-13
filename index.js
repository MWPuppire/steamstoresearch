#!/usr/bin/env node
var SteamStore = require('steam-store'),
  store = new SteamStore({
    country: "US",
    language: "en"
  }),
  readline = require('readline-sync'),
  htmlToText = require('html-to-text'),
  yn = require('yn'),
  argv = require('minimist')(process.argv.slice(2));

function main() {
    var searchterm = readline.question("Search for what? ");

    store.steam('storeSearch', searchterm).then(function(results) {
        results = results.map(function(result) {
            return result.id;
        });
        store.getProductsDetails(results).then(function(details) {
            for (var i = 0; i < details.length; i++) {
                console.log(details[i].name);
                console.log(htmlToText.fromString(details[i].detailed_description));
                console.log(details[i].website);
                if (details[i].price_overview) {
                    var price = String(details[i].price_overview.final);
                    price = price.substring(0, price.length - 2) + "." + price.substring(price.length - 2);
                    price = details[i].price_overview.currency + " " + price;
                    if (details[i].price_overview.discount_percent != 0) {
                        price = price + "\n" + String(details[i].price_overview.discount_percent) + "% off!";
                    };
                    console.log(price);
                }
                console.log("\n");
            };
            if (yn(readline.question("Would you like to search again? "), {default: false, lenient: true})) {
                main();
            };
        });
    });
}
if (argv._.length == 0) {
    main();
} else {
    var searchterm = argv._.join(" ");
    store.steam('storeSearch', searchterm).then(function(results) {
        results = results.map(function(result) {
            return result.id;
        });
        store.getProductsDetails(results).then(function(details) {
            for (var i = 0; i < details.length; i++) {
                if (!argv.raw) {
                    console.log(details[i].name);
                    console.log(htmlToText.fromString(details[i].detailed_description));
                    console.log(details[i].website);
                    var price = String(details[i].price_overview.final);
                    price = price.substring(0, price.length - 2) + "." + price.substring(price.length - 2);
                    price = details[i].price_overview.currency + " " + price;
                    if (details[i].price_overview.discount_percent != 0) {
                        price = price + "\n" + String(details[i].price_overview.discount_percent);
                    };
                    console.log(price);
                    console.log("\n");
                } else {
                    console.log(details[i]);
                };
            };
        });
    });
};
