/**
 * Created by mirif on 23/07/2017.
 */

(function () {
  'use strict';
  window.Stokr = window.Stokr || {};

  const consts = window.Stokr.Constants;

  window.Stokr.Model = {

    state: {},

    // state: {
    //
    //   uiState: {
    //     stocksViewState: 0,
    //     isFilterEnabled: false,
    //     filters: {}
    //   },
    //
    //   stocksOrder: [
    //     "WIX",
    //     "MSFT",
    //     "YHOO"
    //   ],
    //
    //   stocks: [
    //     {
    //       "Symbol": "WIX",
    //       "Name": "Wix.com Ltd.",
    //       "Change": "0.750000",
    //       "PercentChange": "+1.51%",
    //       "LastTradePriceOnly": "76.099998"
    //     },
    //     {
    //       "Symbol": "MSFT",
    //       "Name": "Microsoft Corporation",
    //       "PercentChange": "-2.09%",
    //       "Change": "-0.850006",
    //       "LastTradePriceOnly": "69.620003"
    //     },
    //     {
    //       "Symbol": "YHOO",
    //       "Name": "Yahoo! Inc.",
    //       "Change": "0.279999",
    //       "PercentChange": "+1.11%",
    //       "LastTradePriceOnly": "50.599998"
    //     }
    //   ]
    //
    // },

    getState: function () {
      return this.state;
    },

    setState: function (state) {
      this.state = state;
    },

    getStocksViewState: function () {
      return this.state.uiState.stocksViewState;
    },

    setStocksViewState: function (state) {
      this.state.uiState.stocksViewState = state;
    },

    getFilterEnabled: function () {
      return this.state.uiState.isFilterEnabled;
    },

    setFilterEnabled: function (isEnabled) {
      this.state.uiState.isFilterEnabled = isEnabled;
    },

    getStocksOrder: function () {
      return this.state.stocksOrder;
    },

    setStocksOrder: function (stocksOrder) {
      this.state.stocksOrder = stocksOrder;
    }


  }

})();

