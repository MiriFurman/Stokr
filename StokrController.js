/**
 * Created by mirif on 23/07/2017.
 */

(function () {
  'use strict';
  window.Stokr = window.Stokr || {};

  const consts = window.Stokr.Constants;
  const model = window.Stokr.Model;
  const view = window.Stokr.View;

  function init() {
    if (localStorage.getItem('stokr-state')) {
      model.setUiState(JSON.parse(localStorage.getItem('stokr-state')));
    }
    let stocksToFetch = model.getStocksOrder().join();
    fetchStocks('http://localhost:7000/quotes?q=' + stocksToFetch)
      .then((stocks) => { model.setStocks(stocks) })
      .then(renderView)
  }

  function fetchStocks(myRequest) {
    return fetch(myRequest)
      .then((response) => {
        const contentType = response.headers.get("content-type");
        if(contentType && contentType.includes("application/json")) {
          return response.json();
        } else {
          throw new TypeError("OH SNAP, we haven't got a JSON!");
        }
      })
      .then(res => res.query.results.quote);
  }

  function renderView() {
    let stocks = model.getStocks();
    if (model.getFilterEnabled()) {
      const filter = model.getFilters();
      const checkName = stock => (!filter.name || stock.Name.toLowerCase().includes(filter.name.toLowerCase()));
      const checkGain = stock => (!filter.gain || filter.gain === "All" ||
      (filter.gain === "Losing" && parseFloat(stock.realtime_chg_percent) < 0) ||
      (filter.gain === "Gaining" && parseFloat(stock.realtime_chg_percent) >= 0));
      const checkRangeFrom = stock => (!filter.range_from || parseFloat(stock.realtime_chg_percent) >= filter.range_from);
      const checkRangeTo = stock => (!filter.range_to || parseFloat(stock.realtime_chg_percent) <= filter.range_to);
      stocks = stocks.filter((stock) => {
        return checkName(stock) && checkGain(stock) && checkRangeFrom(stock) && checkRangeTo(stock)
      });
    }

    view.render(model.getUiState(), stocks);
    view.setupEventListeners();
  }

  function toggleStocksStateAndRender() {
    model.setStocksViewState(model.getStocksViewState() === consts.STOCK_VIEW_STATES.length -1 ? 0 : model.getStocksViewState() + 1);
    localStorage.setItem('stokr-state', JSON.stringify(model.getUiState()));
    renderView();
  }

  function toggleFilterAndRender() {
    model.setFilterEnabled(!model.getFilterEnabled());
    console.log(JSON.stringify(model.getUiState()));
    localStorage.setItem('stokr-state', JSON.stringify(model.getUiState()));
    renderView();
  }

  function toggleSettingsAndRender() {
    model.setSettingsEnabled(!model.getSettingsEnabled());
    localStorage.setItem('stokr-state', JSON.stringify(model.getUiState()));
    renderView();
  }

  function swapStocksOrder(currStockSymbol, shouldMoveUp) {
    const stocksOrder = model.getStocksOrder();
    const stocks = model.getStocks();
    const currLocation = stocksOrder.indexOf(currStockSymbol);
    const newLocation = shouldMoveUp ? currLocation - 1 : currLocation + 1;
    if (newLocation >= 0 && newLocation < stocksOrder.length) {
      let temp = stocksOrder[newLocation];
      stocksOrder[newLocation] = stocksOrder[currLocation];
      stocksOrder[currLocation] = temp;
      temp = stocks[newLocation];
      stocks[newLocation] = stocks[currLocation];
      stocks[currLocation] = temp;
    }
    model.setStocksOrder(stocksOrder);
    model.setStocks(stocks);
    localStorage.setItem('stokr-state', JSON.stringify(model.getUiState()));
    renderView();
  }

  function removeStock(stockSymbol) {
    const stockOrder = model.getStocksOrder();
    const stocks = model.getStocks();
    const index = stockOrder.indexOf(stockSymbol);
    stockOrder.splice(index, 1);
    stocks.splice(index, 1);
    model.setStocksOrder(stockOrder);
    localStorage.setItem('stokr-state', JSON.stringify(model.getUiState()));
    init();
  }

  function setFilterAndRender(filter) {
    model.setfilters(filter);
    localStorage.setItem('stokr-state', JSON.stringify(model.getUiState()));
    renderView();
  }

  window.Stokr.Controller = {
    init,
    swapStocksOrder,
    toggleStocksStateAndRender,
    toggleFilterAndRender,
    toggleSettingsAndRender,
    setFilterAndRender,
    removeStock,
    renderView
  };


  window.Stokr.Controller.init();
})();

