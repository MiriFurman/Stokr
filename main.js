/**
 * Created by mirif on 18/07/2017.
 */

//TODO - create app model object - what is the view made of
  // TODO - 19/07/2017 -  data-symbol, data-direction instead of className

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


const VIEW_STATES = {
  DAILY_CHANGE : 'DAILY_CHANGE',
  MARKET_CAPITAL : 'MARKET_CAPITAL'
};

let stocksViewState;

function init() {
  stocksViewState = VIEW_STATES.DAILY_CHANGE;
  initStockContainer();
}

function handleClickOnStockListContainer(e) {

  if (e.target.className.includes('stock-data-btn')) {
    stocksViewState = stocksViewState === VIEW_STATES.DAILY_CHANGE ? VIEW_STATES.MARKET_CAPITAL : VIEW_STATES.DAILY_CHANGE;
    initStocksList();
  }

  if (e.target.className.includes('nav-btn')) {
    const currLocation = stocksOrder.indexOf(e.target.parentNode.dataset.id);
    const shouldStockMoveUp = e.target.className.includes('btn-up');
    const newLocation = shouldStockMoveUp ? currLocation - 1 : currLocation + 1;
    stocksOrderChange(currLocation, newLocation);
    initStocksList();
  }

}

function stocksOrderChange(currLoc, newLoc) {
  if (newLoc > 0 && newLoc < stocksOrder.length) {
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
  stocksListWrapperDiv.addEventListener('click', handleClickOnStockListContainer);
  initStocksList();
}
function initStocksList() {
  const stocksListWrapperDiv = document.querySelector('.stocks-list-wrapper');
  // stocksListWrapperDiv.innerHTML = '<ul class="stocks-list">' + Stocks.map(renderStock).join('') + '</ul>';
  stocksListWrapperDiv.innerHTML = '<ul class="stocks-list">' + addStocksByOrder() + '</ul>';
  disableButtons();
}

function renderStock(stock) {
  let btnClass = parseFloat(stock.PercentChange) > 0 ? 'btn-green' : 'btn-red';
  let btnData = stocksViewState === VIEW_STATES.DAILY_CHANGE ? stock.PercentChange : parseFloat(stock.Change).toFixed(2);
  return `<li class="stock" data-id="${stock.Symbol}">
    <span class="stock-name">${stock.Symbol} (${stock.Name})</span>
    <div class="stock-data">
      <span>${parseFloat(stock.LastTradePriceOnly).toFixed(2)}</span>
      <button class="main-btn stock-data-btn ${btnClass}">${btnData}</button>
      <div class="up-down-wrapper" data-id="${stock.Symbol}">
        <button class="nav-btn btn-up"></button>
        <button class="nav-btn btn-down"></button>
      </div>
    </div>
  </li>`
}

function disableButtons() {
  document.querySelector('.stock:first-child .btn-up').disabled = true;
  document.querySelector('.stock:last-child .btn-down').disabled = true;
}

init();



