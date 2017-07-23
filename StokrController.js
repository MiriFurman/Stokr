/**
 * Created by mirif on 23/07/2017.
 */

(function () {
  'use strict';
  window.Stokr = window.Stokr || {};

  const model = window.Stokr.Model;
  const view = window.Stokr.View;

  function init() {
    initStockContainer();
    const header = document.querySelector('header');
    view.addViewEventListener(header, 'click', headerClickHandler);
  }

  function initStockContainer() {
    const stocksListWrapperDiv = document.querySelector('.stocks-list-wrapper');
    view.addViewEventListener(stocksListWrapperDiv, 'click', stockListContainerClickHandler);
    view.initStocksList(model.gatStocksData());
  }

  function headerClickHandler(e) {
    const target = e.target;
    if (target.dataset.id === 'filter-btn') {
      const filterSection = document.querySelector('.filter-section');
      const upDownWrapperAll = document.querySelectorAll('.up-down-wrapper');
      filterSection.style.display = filterSection.style.display === 'none' ? 'block' : 'none';

      if (filterSection.style.display === 'block') {
        document.querySelector('.filter-btn').style.color = '#41bf15';

        [].forEach.call(upDownWrapperAll, function (upDownWrapper) {
          upDownWrapper.style.display = 'none';
        });
      } else {
        document.querySelector('.filter-btn').style.color = '#ababab';

        [].forEach.call(upDownWrapperAll, function (upDownWrapper) {
          upDownWrapper.style.display = 'flex';
        });
        view.initStocksList(model.gatStocksData());
      }
    }
  }

  function stockListContainerClickHandler(e) {
    const target = e.target;
    if (target.dataset.id === 'stock-data-btn') {
      view.toggleStocksState();
      view.initStocksList(model.gatStocksData());
    }
    if (target.dataset.id === 'nav-btn') {
      const currLocation = model.getStockOrder().indexOf(target.closest('li').dataset.symbol);
      const shouldStockMoveUp = target.dataset.direction === 'up';
      const newLocation = shouldStockMoveUp ? currLocation - 1 : currLocation + 1;
      swapStocksOrder(currLocation, newLocation);
      view.initStocksList(model.gatStocksData());
    }
  }

  function swapStocksOrder(currLoc, newLoc) {
    if (newLoc >= 0 && newLoc < model.stocksOrder.length) {
      const temp = model.stocksOrder[newLoc];
      model.stocksOrder[newLoc] = model.stocksOrder[currLoc];
      model.stocksOrder[currLoc] = temp;
    }

  }

  window.Stokr.Controller = {
    init,
    swapStocksOrder
  };


  window.Stokr.Controller.init();
})();

