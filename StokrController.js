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
    const stocksToFetch = model.getStocksOrder().join();
    fetchStocks('http://localhost:7000/quotes?q=' + stocksToFetch)
      .then((stocks) => model.setStocks(stocks))
      .then(renderView)
  }

  function fetchStocks(myRequest) { // TODO - 27/07/2017 -  move to api service + fetchJson
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

  function searchStocks(myRequest) {
    return fetch(myRequest)
      .then((response) => {
        const contentType = response.headers.get("content-type");
        if(contentType && contentType.includes("application/json")) {
          return response.json();
        } else {
          throw new TypeError("OH SNAP, we haven't got a JSON!");
        }
      })
      .then(res => res.ResultSet.Result);
  }

  function renderView() { // TODO - 27/07/2017 -  filter logic to other function
    let stocks = model.getStocks();
    if (model.getFilterEnabled()) {
      const filter = model.getFilters();
      const checkName = stock => (!filter.name || stock.Name.toLowerCase().includes(filter.name.toLowerCase()));
      const checkGain = stock => (!filter.gain || filter.gain === "All" ||
      (filter.gain === "Losing" && parseFloat(stock.realtime_chg_percent) < 0) ||
      (filter.gain === "Gaining" && parseFloat(stock.realtime_chg_percent) >= 0));
      const checkRangeFrom = stock => (!filter.range_from || parseFloat(stock.realtime_chg_percent) >= filter.range_from);
      const checkRangeTo = stock => (!filter.range_to || parseFloat(stock.realtime_chg_percent) <= filter.range_to);
      stocks = stocks.filter((stock) => { // TODO - 27/07/2017 -  checkStock func
        return checkName(stock) && checkGain(stock) && checkRangeFrom(stock) && checkRangeTo(stock)
      });
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
    saveUiStateToLocalStorage();
    renderView();
  }

  function toggleSettingsAndRender() { // TODO - 27/07/2017 -  settings or filter
    model.setSettingsEnabled(!model.getSettingsEnabled());
    saveUiStateToLocalStorage();
    renderView();
  }

  function swapStocksOrder(currStockSymbol, shouldMoveUp) {
    const stocksOrder = model.getStocksOrder();
    const stocks = model.getStocks();
    const currLocation = stocksOrder.indexOf(currStockSymbol);
    const newLocation = shouldMoveUp ? currLocation - 1 : currLocation + 1;
    if (newLocation >= 0 && newLocation < stocksOrder.length) { // TODO - 27/07/2017 -  inner swap
      let temp = stocksOrder[newLocation];
      stocksOrder[newLocation] = stocksOrder[currLocation];
      stocksOrder[currLocation] = temp;
      temp = stocks[newLocation];
      stocks[newLocation] = stocks[currLocation];
      stocks[currLocation] = temp;
    }
    model.setStocksOrder(stocksOrder);
    model.setStocks(stocks);
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

  function searchAndRender(stockToSearch) { // TODO - 27/07/2017 -  move to api service
    searchStocks(`http://localhost:7000/search?q=${stockToSearch}`) // TODO - 27/07/2017 -  es6 template strings
      .then((res) => view.renderSearchResult(res, model.getStocksOrder()));
  }

  function addNewStock(symbol) {
    const stockOrder = model.getStocksOrder();
    stockOrder.push(symbol);
    model.setStocksOrder(stockOrder);
    fetchStocks('http://localhost:7000/quotes?q=' + model.getStocksOrder())
      .then((stocks) => { model.setStocks(stocks) });
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

