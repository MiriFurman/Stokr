/**
 * Created by mirif on 23/07/2017.
 */

(function () {
  'use strict';
  window.Stokr = window.Stokr || {};

  const consts = window.Stokr.Constants;

  function render(state) {
    renderHeader(state.uiState);
    renderStockList(state);
  }

  function renderHeader(uiState) {
    renderFilter(uiState);
    renderSettings(uiState);
    renderSearch(uiState);
  }

  function renderFilter(uiState) {
    const filterSection = document.querySelector('.filter-section');
    if (uiState.isFilterEnabled) {
      filterSection.style.display = 'block';
      document.querySelector('.filter-btn').style.color='#41bf15';
    } else {
      filterSection.style.display = 'none';
      document.querySelector('.filter-btn').style.color='#ababab';
    }
  }

  function renderSettings(uiState) {}

  function renderSearch(uiState) {}

  function renderStockList(state) {
    const stocksListWrapperDiv = document.querySelector('.stocks-list-wrapper');
    stocksListWrapperDiv.innerHTML = '<ul class="stocks-list">' + addStocksByOrder(state) + '</ul>';
    disableButtons();
  }

  function addStocksByOrder(state) {
    let stockListHtml = '';
    state.stocksOrder.forEach((stockSymbol) => {
      let currStock = state.stocks.find((stock) => {
        return stock.Symbol === stockSymbol;
      });
      stockListHtml += renderStock(currStock, state.uiState);
    });
    return stockListHtml;
  }

  function disableButtons() {
    document.querySelector('.stock:first-child .btn-up').disabled = true;
    document.querySelector('.stock:last-child .btn-down').disabled = true;
  }

  function renderStock(stock, uiState) {
    let btnClass = parseFloat(stock.PercentChange) > 0 ? 'btn-green' : 'btn-red';
    let btnData = stock[consts.STOCK_VIEW_STATES[uiState.stocksViewState]];
    btnData = consts.STOCK_VIEW_STATES[uiState.stocksViewState] === 'Change' ? parseFloat(btnData).toFixed(2) : btnData;
    let upDownDisplay = uiState.isFilterEnabled ? 'none' : 'flex';
    return `<li class="stock" data-symbol="${stock.Symbol}">
            <span class="stock-name">${stock.Symbol} (${stock.Name})</span>
            <div class="stock-data">
              <span>${parseFloat(stock.LastTradePriceOnly).toFixed(2)}</span>
              <button class="stock-data-btn ${btnClass}" data-id="stock-data-btn">${btnData}</button>
              <div class="up-down-wrapper" style="display: ${upDownDisplay}">
                <button class="nav-btn btn-up icon-arrow" data-direction="up" data-id="nav-btn"></button>
                <button class="nav-btn btn-down icon-arrow" data-direction="down" data-id="nav-btn"></button>
              </div>
            </div>
          </li>`
  }

  function setupEventListeners() {
    const header = document.querySelector('header');
    header.addEventListener('click', headerClickHandler);
    const filterApply = document.querySelector('.filter-section form button');
    filterApply.addEventListener('click', applyFilters);
    const stocksListWrapperDiv = document.querySelector('.stocks-list-wrapper');
    stocksListWrapperDiv.addEventListener('click', stockListContainerClickHandler);
  }

  function headerClickHandler(e) {
    const target = e.target;
    const Ctrl = window.Stokr.Controller;
    if (target.dataset.id === 'filter-btn') {
      Ctrl.toggleFilterAndRender();
    }
  }

  function stockListContainerClickHandler(e) {
    const target = e.target;
    const Ctrl = window.Stokr.Controller;
    if (target.dataset.id === 'stock-data-btn') {
      Ctrl.toggleStocksStateAndRender();
    }
    if (target.dataset.id === 'nav-btn') {
      const currStockSymbol = target.closest('li').dataset.symbol;
      const shouldMoveUp = target.dataset.direction === 'up';
      Ctrl.swapStocksOrder(currStockSymbol, shouldMoveUp);
    }
  }

  function applyFilters(e) {
    const target = e.target;
    const Ctrl = window.Stokr.Controller;
  }

  window.Stokr.View = {
    render,
    setupEventListeners
  }

})();
