/**
 * Created by mirif on 23/07/2017.
 */

(function () {
  'use strict';
  window.Stokr = window.Stokr || {};

  window.Stokr.Model = {

    data: {

      stocksOrder: [
        "WIX",
        "MSFT",
        "YHOO"
      ],

      stocks: [
        {
          "Symbol": "WIX",
          "Name": "Wix.com Ltd.",
          "Change": "0.750000",
          "PercentChange": "+1.51%",
          "LastTradePriceOnly": "76.099998"
        },
        {
          "Symbol": "MSFT",
          "Name": "Microsoft Corporation",
          "PercentChange": "-2.09%",
          "Change": "-0.850006",
          "LastTradePriceOnly": "69.620003"
        },
        {
          "Symbol": "YHOO",
          "Name": "Yahoo! Inc.",
          "Change": "0.279999",
          "PercentChange": "+1.11%",
          "LastTradePriceOnly": "50.599998"
        }
      ]

    },

    gatStocksData: function () {
      return this.data;
    },

    getStockOrder: function () {
      return this.data.stocksOrder;
    },

    getStocks: function () {
      return this.data.stocks;
    },

    // swapStocksOrder: function (currLoc, newLoc) {
    //   if (newLoc >= 0 && newLoc < this.data.stocksOrder.length) {
    //     const temp = this.data.stocksOrder[newLoc];
    //     this.data.stocksOrder[newLoc] = this.data.stocksOrder[currLoc];
    //     this.data.stocksOrder[currLoc] = temp;
    //   }
    //
    // }
  }

})();

