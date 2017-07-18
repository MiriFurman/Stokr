/**
 * Created by mirif on 18/07/2017.
 */


const Stocks = [
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


const states = {
  DAILY_CHANGE : true,
  MARKET_CAPITAL : false
};

let currState = states.DAILY_CHANGE;

function init() {
  currState = states.DAILY_CHANGE;
  initStocksList();
}

function handleClick(e) {
  if (e.target.className.includes('stock-data-btn')) {
    currState = !currState;
    initStocksList();
  }
}

function initStocksList() {
  const stocksListWrapperDiv = document.querySelector('.stocks-list-wrapper');
  stocksListWrapperDiv.innerHTML = '<ul class="stocks-list">' + Stocks.map(renderStock).join('') + '</ul>';
  stocksListWrapperDiv.removeEventListener('click', handleClick);
  stocksListWrapperDiv.addEventListener('click', handleClick);
}

function renderStock(stock) {
  let btnClass = parseFloat(stock.PercentChange) > 0 ? 'btn-green' : 'btn-red';
  let btnData = currState === states.DAILY_CHANGE ? stock.PercentChange : parseFloat(stock.Change).toFixed(2);
  return `<li class="stock" data-id="${stock.Symbol}">
    <span class="stock-name">${stock.Symbol} (${stock.Name})</span>
    <div class="stock-data">
      <span>${parseFloat(stock.LastTradePriceOnly).toFixed(2)}</span>
      <button class="main-btn stock-data-btn ${btnClass}">${btnData}</button>
      <div class="up-down-wrapper">
        <button class="nav-btn btn-up"></button>
        <button class="nav-btn btn-down"></button>
      </div>
    </div>
  </li>`
}

init();



