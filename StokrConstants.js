/**
 * Created by mirif on 24/07/2017.
 */

(function () {
  'use strict';
  window.Stokr = window.Stokr || {};

  const STOCK_VIEW_STATES = ['realtime_chg_percent', 'MarketCapitalization'];

  const searchTemplate = `<section class="search-section transition-fadein-up">
                        <form id="search-form">
                          <div class="search-input">
                            <input type="text" name="searchStock">
                            <a class="search-cancel" href="#">Cancel</a>
                          </div>
                        </form>
                        <div class="search-placeholder-container">
                          <div class="search-placeholder-img icon-search-place-holder"></div>
                          <div class="search-placeholder-text">Search</div>
                        </div>
                      </section>`;


  window.Stokr.Constants = {
    STOCK_VIEW_STATES,
    searchTemplate
  }


})();
