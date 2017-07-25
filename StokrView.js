/**
 * Created by mirif on 23/07/2017.
 */

(function () {
  'use strict';
  window.Stokr = window.Stokr || {};

  const consts = window.Stokr.Constants;

  function render(uiState, stocks) {
    renderHeader(uiState);
    renderStockList(uiState,stocks);
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

  function renderStockList(uiState, stocks) {
    const stocksListWrapperDiv = document.querySelector('.stocks-list-wrapper');
    stocksListWrapperDiv.innerHTML = '<ul class="stocks-list">' + stocks.map((stock) => renderStock(stock,uiState)).join('') + '</ul>';
    disableButtons();
  }


  function disableButtons() {
    if (document.querySelector('.stock:first-child .btn-up')) {
      document.querySelector('.stock:first-child .btn-up').disabled = true;
    }
    if (document.querySelector('.stock:last-child .btn-down')) {
      document.querySelector('.stock:last-child .btn-down').disabled = true;
    }
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
    const filterForm = document.querySelector('#filter-form');
    filterForm.addEventListener('submit', filterSubmitHandler);
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

  function filterSubmitHandler(e) {
    e.preventDefault();

    const Ctrl = window.Stokr.Controller;
    const formInputs = e.target.elements;

    const filter = {
      name: formInputs.stockName.value,
      gain: formInputs.stockGain.value,
      range_from: formInputs.rangeFrom.value,
      range_to: formInputs.rangeTo.value
    };

    Ctrl.setFilterAndRender(filter);
  }

  window.Stokr.View = {
    render,
    setupEventListeners
  }

})();
