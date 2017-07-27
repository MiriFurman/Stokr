/**
 * Created by mirif on 23/07/2017.
 */

(function () {
  'use strict';
  window.Stokr = window.Stokr || {};

  const consts = window.Stokr.Constants;
  const model = window.Stokr.Model;
  const view = window.Stokr.View;
  const apiService = window.Stokr.ApiService;

  function init() {
    if (localStorage.getItem('stokr-state')) {
      model.setUiState(JSON.parse(localStorage.getItem('stokr-state')));
    }
    const stocksToFetch = model.getStocksOrder().join();
    apiService.fetchStocks(stocksToFetch)
      .then((stocks) => model.setStocks(stocks))
      .then(renderView);
  }

  function checkStockByFilter(stock) {
    return checkNameFilter(stock) && checkGainFilter(stock) && checkRangeFromFilter(stock) && checkRangeToFilter(stock);
  }

  function checkNameFilter(stock) {
    const filter = model.getFilters();
    return !filter.name || stock.Name.toLowerCase().includes(filter.name.toLowerCase());
  }

  function checkGainFilter(stock) {
    const filter = model.getFilters();
    return !filter.gain || filter.gain === "All" ||
      (filter.gain === "Losing" && parseFloat(stock.realtime_chg_percent) < 0) ||
      (filter.gain === "Gaining" && parseFloat(stock.realtime_chg_percent) >= 0);
  }

  function checkRangeFromFilter(stock) {
    const filter = model.getFilters();
    return !filter.range_from || parseFloat(stock.realtime_chg_percent) >= filter.range_from;
  }

  function checkRangeToFilter(stock) {
    const filter = model.getFilters();
    return !filter.range_to || parseFloat(stock.realtime_chg_percent) <= filter.range_to;
  }

  function renderView() {
    let stocks = model.getStocks();
    if (model.getFilterEnabled()) {
      stocks = stocks.filter((stock) => checkStockByFilter(stock));
    }

    view.render(model.getUiState(), stocks);
    view.setupEventListeners();
  }

  function saveUiStateToLocalStorage() {
    localStorage.setItem('stokr-state', JSON.stringify(model.getUiState()));
  }

  function toggleStocksStateAndRender() {
    model.setStocksViewState(model.getStocksViewState() === consts.STOCK_VIEW_STATES.length -1 ? 0 : model.getStocksViewState() + 1);
    saveUiStateToLocalStorage();
    renderView();
  }

  function toggleFilterAndRender() {
    model.setFilterEnabled(!model.getFilterEnabled());
    if (model.getFilterEnabled() && model.getSettingsEnabled())  {
      model.setSettingsEnabled(false);
    }
    saveUiStateToLocalStorage();
    renderView();
  }

  function toggleSettingsAndRender() {
    model.setSettingsEnabled(!model.getSettingsEnabled());
    if (model.getFilterEnabled() && model.getSettingsEnabled())  {
      model.setFilterEnabled(false);
    }
    saveUiStateToLocalStorage();
    renderView();
  }

  function arraySwap(array,firstIndex, secondIndex) {
    const temp = array[secondIndex];
    array[secondIndex] = array[firstIndex];
    array[firstIndex] = temp;
    return array;
  }

  function swapStocksOrder(currStockSymbol, shouldMoveUp) {
    const stocksOrder = model.getStocksOrder();
    const stocks = model.getStocks();
    const currLocation = stocksOrder.indexOf(currStockSymbol);
    const newLocation = shouldMoveUp ? currLocation - 1 : currLocation + 1;
    if (newLocation >= 0 && newLocation < stocksOrder.length) {
      model.setStocksOrder(arraySwap(stocksOrder, currLocation, newLocation));
      model.setStocks(arraySwap(stocks, currLocation, newLocation));
    }

    saveUiStateToLocalStorage();
    renderView();
  }

  function removeStock(stockSymbol) {
    const stockOrder = model.getStocksOrder();
    const stocks = model.getStocks();
    const index = stockOrder.indexOf(stockSymbol);
    stockOrder.splice(index, 1);
    stocks.splice(index, 1);
    model.setStocksOrder(stockOrder);
    saveUiStateToLocalStorage();
    init();
  }

  function setFilterAndRender(filter) {
    model.setfilters(filter);
    saveUiStateToLocalStorage();
    renderView();
  }

  function searchAndRender(stockToSearch) {
    apiService.searchStocks(stockToSearch)
      .then((res) => view.renderSearchResult(res, model.getStocksOrder()));
  }

  function addNewStock(symbol) {
    const stockOrder = model.getStocksOrder();
    stockOrder.push(symbol);
    model.setStocksOrder(stockOrder);
    apiService.fetchStocks((model.getStocksOrder()))
      .then((stocks) => model.setStocks(stocks));
  }

  window.Stokr.Controller = {
    init,
    swapStocksOrder,
    toggleStocksStateAndRender,
    toggleFilterAndRender,
    toggleSettingsAndRender,
    setFilterAndRender,
    removeStock,
    searchAndRender,
    addNewStock,
    renderView
  };


  window.Stokr.Controller.init();
})();

