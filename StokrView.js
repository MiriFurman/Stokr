/**
 * Created by mirif on 23/07/2017.
 */

(function () {
  'use strict';
  window.Stokr = window.Stokr || {};

  const STOCKS_VIEW_STATES = {
    DAILY_CHANGE: 'DAILY_CHANGE',
    MARKET_CAPITAL: 'MARKET_CAPITAL'
  };

  function addStocksByOrder(stocksData) {
    let stockListHtml = '';
    stocksData.stocksOrder.forEach((stockSymbol) => {
      let currStock = stocksData.stocks.find((stock) => {
        return stock.Symbol === stockSymbol;
      });
      stockListHtml += renderStock(currStock);
    });
    return stockListHtml;
  }

  function disableButtons() {
    document.querySelector('.stock:first-child .btn-up').disabled = true;
    document.querySelector('.stock:last-child .btn-down').disabled = true;
  }

  function initStocksList(stocksData) {
    const stocksListWrapperDiv = document.querySelector('.stocks-list-wrapper');
    stocksListWrapperDiv.innerHTML = '<ul class="stocks-list">' + addStocksByOrder(stocksData) + '</ul>';
    disableButtons();
  }

  function renderStock(stock) {
    let btnClass = parseFloat(stock.PercentChange) > 0 ? 'btn-green' : 'btn-red';
    let btnData = window.Stokr.View.stocksViewState === STOCKS_VIEW_STATES.DAILY_CHANGE ? stock.PercentChange : parseFloat(stock.Change).toFixed(2);
    return `<li class="stock" data-symbol="${stock.Symbol}">
            <span class="stock-name">${stock.Symbol} (${stock.Name})</span>
            <div class="stock-data">
              <span>${parseFloat(stock.LastTradePriceOnly).toFixed(2)}</span>
              <button class="stock-data-btn ${btnClass}" data-id="stock-data-btn">${btnData}</button>
              <div class="up-down-wrapper">
                <button class="nav-btn btn-up icon-arrow" data-direction="up" data-id="nav-btn"></button>
                <button class="nav-btn btn-down icon-arrow" data-direction="down" data-id="nav-btn"></button>
              </div>
            </div>
          </li>`
  }

  function addViewEventListener(elem,eventType,callback) {
    elem.addEventListener(eventType, callback);
  }

  window.Stokr.View = {
    stocksViewState: STOCKS_VIEW_STATES.DAILY_CHANGE,
    initStocksList,
    addViewEventListener,
    toggleStocksState : function () {
      this.stocksViewState = this.stocksViewState === STOCKS_VIEW_STATES.DAILY_CHANGE ? STOCKS_VIEW_STATES.MARKET_CAPITAL : STOCKS_VIEW_STATES.DAILY_CHANGE;
    }
  }

})();
