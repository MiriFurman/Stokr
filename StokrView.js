/**
 * Created by mirif on 23/07/2017.
 */

(function () {
  'use strict';
  window.Stokr = window.Stokr || {};

  const consts = window.Stokr.Constants;

  function render(uiState, stocks) {
    if (window.location.hash === "" || window.location.hash === "#") {
      renderMain();
      renderHeader(uiState);
      renderStockList(uiState,stocks);
    } else if (window.location.hash === "#search"){
      renderSearch();
    }

  }

  function renderMain() {
    const main = document.querySelector('main');
    main.innerHTML = consts.mainTemplate;
  }

  function renderHeader(uiState) {
    renderFilter(uiState);
    renderSettings(uiState);
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

  function renderSettings(uiState) {
    if (uiState.isSettingsEnabled) {
      document.querySelector('.settings-btn').style.color='#41bf15';
    } else {
      document.querySelector('.settings-btn').style.color='#ababab';
    }
  }

  function renderSearch() {
    const main = document.querySelector('main');
    main.innerHTML = consts.searchTemplate;
  }

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
    let btnClass = parseFloat(stock.realtime_chg_percent) >= 0 ? 'btn-green' : 'btn-red';
    let btnData = parseFloat(stock[consts.STOCK_VIEW_STATES[uiState.stocksViewState]]).toFixed(2);
    btnData = consts.STOCK_VIEW_STATES[uiState.stocksViewState] === 'realtime_chg_percent' ? btnData + '%' : btnData + 'B';
    let upDownDisplay = uiState.isFilterEnabled ? 'none' : 'flex';
    let removebtnDisplay = uiState.isSettingsEnabled ? 'flex' : 'none';
    return `<li class="stock" data-symbol="${stock.Symbol}">
            <div class="stock-data">
              <div class="icon-remove" data-id="remove-btn" style="display: ${removebtnDisplay}">
                <div class="icon-remove-inner" data-id="remove-btn"></div>
              </div>
              <span class="stock-name">${stock.Symbol} (${stock.Name})</span>
            </div>
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

  function renderSearchResult(searchRes, stocksOrder) {
    const searchContainer = document.querySelector('.search-placeholder-container');
    if (searchRes.length === 0) {
      searchContainer.innerHTML =
        `<div class="search-placeholder-img icon-search-place-holder"></div>
         <div class="search-placeholder-text">Not Found</div>`;
      searchContainer.style.display = 'flex';
    } else {
      searchRes = searchRes.filter((stock) => {
        return stocksOrder.indexOf(stock.symbol) === -1;
      });
      searchContainer.innerHTML = '<ul class="stocks-list">' + searchRes.map((stock) => renderSearchStock(stock)).join('') + '</ul>';
      searchContainer.addEventListener('click', searchClickHandler);
      searchContainer.style.display = 'block';
    }
  }

  function renderSearchStock(stock) {
    return `<li class="stock" data-symbol="${stock.symbol}">
              <div class="stock-data">
               <span class="search-stock-syombol">${stock.symbol}</span>
               <span class="search-stock-exch">(${stock.exchDisp})</span>
              </div>
              <div class="stock-data">
                <button class="add-stock-btn" data-id="add-stock-btn">+</button>
              </div>
            </li>`
  }

  /**
   * Events
   */

  function setupEventListeners() {
    const main = document.querySelector('main');
    main.addEventListener('click', mainClickHandler);
    const filterForm = document.querySelector('#filter-form');
    if (filterForm) {
      filterForm.addEventListener('submit', filterSubmitHandler);
    }
    const searchForm = document.querySelector('#search-form');
    if (searchForm) {
      searchForm.addEventListener('submit', searchSubmitHandler);
    }
    window.addEventListener('hashchange', hashChangeHandler);
  }

  function mainClickHandler(e) {
    const target = e.target;
    const Ctrl = window.Stokr.Controller;

    if (target.dataset.id === 'filter-btn') {
      Ctrl.toggleFilterAndRender();
    }

    if (target.dataset.id === 'refresh-btn') {
      Ctrl.init();
    }

    if (target.dataset.id === 'settings-btn') {
      Ctrl.toggleSettingsAndRender();
    }

    if (target.dataset.id === 'stock-data-btn') {
      Ctrl.toggleStocksStateAndRender();
    }

    if (target.dataset.id === 'nav-btn') {
      const currStockSymbol = target.closest('li').dataset.symbol;
      const shouldMoveUp = target.dataset.direction === 'up';
      Ctrl.swapStocksOrder(currStockSymbol, shouldMoveUp);
    }

    if (target.dataset.id === 'remove-btn') {
      const currStockSymbol = target.closest('li').dataset.symbol;
      Ctrl.removeStock(currStockSymbol);
    }

  }

  function filterSubmitHandler(e) {
    e.preventDefault();
    const Ctrl = window.Stokr.Controller;
    const formInputs = e.target.elements;

    const filter = {
      name: formInputs.stockName.value,
      gain: formInputs.stockGain.options[formInputs.stockGain.selectedIndex].value,
      range_from: formInputs.rangeFrom.value,
      range_to: formInputs.rangeTo.value
    };

    Ctrl.setFilterAndRender(filter);
  }

  function searchSubmitHandler(e) {
    e.preventDefault();
    const Ctrl = window.Stokr.Controller;
    const formInputs = e.target.elements;
    Ctrl.searchAndRender(formInputs.searchStock.value);
  }

  function hashChangeHandler(e) {
    const Ctrl = window.Stokr.Controller;
    Ctrl.renderView();
  }

  function searchClickHandler(e) {
    const Ctrl = window.Stokr.Controller;
    const target = e.target;
    if (target.dataset.id === 'add-stock-btn') {
      const currStock= target.closest('li');
      const currStockSymbol = currStock.dataset.symbol;
      currStock.parentNode.removeChild(currStock);
      Ctrl.addNewStock(currStockSymbol);
    }
  }

  window.Stokr.View = {
    render,
    setupEventListeners,
    renderSearchResult
  }

})();
