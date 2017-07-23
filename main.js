/**
 * Created by mirif on 18/07/2017.
 */

//TODO - create app model object - what is the view made of (mvc)

(function () {
  'use strict';

  // define closest for unsupported browsers
  if (window.Element && !Element.prototype.closest) {
    Element.prototype.closest =
      function(s) {
        var matches = (this.document || this.ownerDocument).querySelectorAll(s),
          i,
          el = this;
        do {
          i = matches.length;
          while (--i >= 0 && matches.item(i) !== el) {};
        } while ((i < 0) && (el = el.parentElement));
        return el;
      };
  }

  let stocksOrder = [
    "WIX",
    "MSFT",
    "YHOO"
  ];

  let Stocks = [
    {
      "Symbol": "WIX",
      "Name": "Wix.com Ltd.",
      "Change": "0.750000",
      "PercentChange": "+1.51%",
      "LastTradePriceOnly": "76.099998"
    },
    {
      "Symbol": "MSFT",
      "Name": "Microsoft Corporation",
      "PercentChange": "-2.09%",
      "Change": "-0.850006",
      "LastTradePriceOnly": "69.620003"
    },
    {
      "Symbol": "YHOO",
      "Name": "Yahoo! Inc.",
      "Change": "0.279999",
      "PercentChange": "+1.11%",
      "LastTradePriceOnly": "50.599998"
    }
  ];


  const STOCKS_VIEW_STATES = {
    DAILY_CHANGE : 'DAILY_CHANGE',
    MARKET_CAPITAL : 'MARKET_CAPITAL'
  };

  let stocksViewState;

  function init() {
    stocksViewState = STOCKS_VIEW_STATES.DAILY_CHANGE;
    initStockContainer();
    const header = document.querySelector('header');
    header.addEventListener('click', headerClickHandler);
  }

  function headerClickHandler(e) {
    const target = e.target;
    if (target.dataset.id === 'filter-btn'){
      const filterSection = document.querySelector('.filter-section');
      const upDownWrapperAll = document.querySelectorAll('.up-down-wrapper');
      filterSection.style.display = filterSection.style.display === 'none' ? 'block' : 'none';
      if (filterSection.style.display === 'block') {
        document.querySelector('.filter-btn').style.color='#41bf15';
        [].forEach.call(upDownWrapperAll, function (upDownWrapper) {
          upDownWrapper.style.display = 'none';
        });
      } else {
        document.querySelector('.filter-btn').style.color='#ababab';
        [].forEach.call(upDownWrapperAll, function (upDownWrapper) {
          upDownWrapper.style.display = 'flex';
        });
        initStocksList();
      }
    }
  }

  function stockListContainerClickHandler(e) {
    const target = e.target;

    if (target.dataset.id === 'stock-data-btn') {
      stocksViewState = stocksViewState === STOCKS_VIEW_STATES.DAILY_CHANGE ? STOCKS_VIEW_STATES.MARKET_CAPITAL : STOCKS_VIEW_STATES.DAILY_CHANGE;
      initStocksList();
    }

    if (target.dataset.id === 'nav-btn') {
      const currLocation = stocksOrder.indexOf(target.closest('li').dataset.symbol);
      const shouldStockMoveUp = target.dataset.direction === 'up';
      const newLocation = shouldStockMoveUp ? currLocation - 1 : currLocation + 1;
      swapStocksOrder(currLocation, newLocation);
      initStocksList();
    }
  }

  function swapStocksOrder(currLoc, newLoc) {
    if (newLoc >= 0 && newLoc < stocksOrder.length) {
      const temp = stocksOrder[newLoc];
      stocksOrder[newLoc] = stocksOrder[currLoc];
      stocksOrder[currLoc] = temp;
    }
  }

  function addStocksByOrder() {
    let stockListHtml = '';
    stocksOrder.forEach((stockSymbol) => {
      let currStock = Stocks.find((stock) => {
        return stock.Symbol === stockSymbol;
      });
      stockListHtml += renderStock(currStock);
    });
    return stockListHtml;
  }

  function initStockContainer() {
    const stocksListWrapperDiv = document.querySelector('.stocks-list-wrapper');
    stocksListWrapperDiv.addEventListener('click', stockListContainerClickHandler);
    initStocksList();
  }

  function initStocksList() {
    const stocksListWrapperDiv = document.querySelector('.stocks-list-wrapper');
    stocksListWrapperDiv.innerHTML = '<ul class="stocks-list">' + addStocksByOrder() + '</ul>';
    disableButtons();
  }

  function disableButtons() {
    document.querySelector('.stock:first-child .btn-up').disabled = true;
    document.querySelector('.stock:last-child .btn-down').disabled = true;
  }

  function renderStock(stock) {
    let btnClass = parseFloat(stock.PercentChange) > 0 ? 'btn-green' : 'btn-red';
    let btnData = stocksViewState === STOCKS_VIEW_STATES.DAILY_CHANGE ? stock.PercentChange : parseFloat(stock.Change).toFixed(2);
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

  init();

})();




