/**
 * Created by mirif on 23/07/2017.
 */

(function () {
  'use strict';
  window.Stokr = window.Stokr || {};

  const consts = window.Stokr.Constants;

  window.Stokr.Model = {

    state: {

      uiState: {
        stocksViewState: 0,
        isFilterEnabled: false,
        filters: {},
        isSettingsEnabled: false
      },

      stocksOrder: [
        "WIX",
        "MSFT",
        "YHOO"
      ],

      stocks: {}

    },


    getState: function () {
      return this.state;
    },

    setState: function (state) {
      this.state = state;
    },

    getUiState: function () {
      return this.state.uiState;
    },

    setUiState: function (uiState) {
      this.state.uiState = uiState;
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

    getSettingsEnabled: function () {
      return this.state.uiState.isSettingsEnabled;
    },

    setSettingsEnabled: function (isEnabled) {
      this.state.uiState.isSettingsEnabled = isEnabled;
    },

    getFilters: function () {
      return this.state.uiState.filters;
    },

    setfilters: function (filters) {
      this.state.uiState.filters = filters;
    },

    getStocksOrder: function () {
      return this.state.stocksOrder;
    },

    setStocksOrder: function (stocksOrder) {
      this.state.stocksOrder = stocksOrder;
    },

    getStocks: function () {
      return this.state.stocks;
    },

    setStocks: function(stocks) {
      this.state.stocks = stocks;
    }


  }

})();

