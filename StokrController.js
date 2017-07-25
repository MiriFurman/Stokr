/**
 * Created by mirif on 23/07/2017.
 */

(function () {
  'use strict';
  window.Stokr = window.Stokr || {};

  const consts = window.Stokr.Constants;
  const model = window.Stokr.Model;
  const view = window.Stokr.View;

  function renderView() {
    let stocks = model.getStocks();

    if (model.getFilterEnabled()) {
      const filter = model.getFilters();
      const checkName = stock => (!filter.name || stock.Name.toLowerCase().includes(filter.name.toLowerCase()));
      const checkGain = stock => (!filter.gain || filter.gain === "All" ||
      (filter.gain === "Losing" && parseFloat(stock.PercentChange) < 0) ||
      (filter.gain === "Gaining" && parseFloat(stock.PercentChange) >= 0));
      const checkRangeFrom = stock => (!filter.range_from || parseFloat(stock.PercentChange) >= filter.range_from);
      const checkRangeTo = stock => (!filter.range_to || parseFloat(stock.PercentChange) <= filter.range_to);
      stocks = stocks.filter((stock) => {
        return checkName(stock) && checkGain(stock) && checkRangeFrom(stock) && checkRangeTo(stock)
      });
    }

    view.render(model.getUiState(), stocks)
  }

  function init() {
    fetchStocks('mocks/stocks.json')
      .then((stocks) => { model.setStocks(stocks) })
      .then(renderView)
      .then(view.setupEventListeners());
  }

  function toggleStocksStateAndRender() {
    model.setStocksViewState(model.getStocksViewState() === consts.STOCK_VIEW_STATES.length -1 ? 0 : model.getStocksViewState() + 1);
    renderView();
  }

  function toggleFilterAndRender() {
    model.setFilterEnabled(!model.getFilterEnabled());
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
    renderView();
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
       });
  }

  function setFilterAndRender(filter) {
    model.setfilters(filter);
    renderView();
  }

  window.Stokr.Controller = {
    init,
    swapStocksOrder,
    toggleStocksStateAndRender,
    toggleFilterAndRender,
    setFilterAndRender,
    renderView
  };


  window.Stokr.Controller.init();
})();

