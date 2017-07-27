/**
 * Created by mirif on 24/07/2017.
 */

(function () {
  'use strict';
  window.Stokr = window.Stokr || {};

  const STOCK_VIEW_STATES = ['realtime_chg_percent', 'MarketCapitalization'];

  const mainTemplate = `<header class="transition-fadein">
            <h1>Stokr</h1>
            <div class="header-btns">
              <a href="#search" class="search-btn header-btn icon-search" data-id="search-btn"></a>
              <button class="refresh-btn header-btn icon-refresh" data-id="refresh-btn"></button>
              <button class="filter-btn header-btn icon-filter" data-id="filter-btn"></button>
              <button class="settings-btn header-btn icon-settings" data-id="settings-btn"></button>
            </div>
          </header>
          <section class="filter-section transition-fadein-down">
            <form id="filter-form">
              <div class="filter-form-column first-filter-form-column">
                <div>
                  <label for="stockName">By Name</label>
                  <input type="text" id="stockName" name="stockName">
                </div>
                <div>
                  <label for="stockGain">By Gain</label>
                  <select id="stockGain" name="stockGain">
                    <option value="All">All</option>
                    <option value="Losing">Losing</option>
                    <option value="Gaining">Gaining</option>
                  </select>
                </div>
              </div>
              <div class="filter-form-column second-filter-form-column">
                <div>
                  <label for="rangeFrom">By Range: From</label>
                  <input type="number" step="0.01" id="rangeFrom" name="rangeFrom">
                </div>
                <div>
                  <label for="rangeTo">By Range: To</label>
                  <input type="number" step="0.01" id="rangeTo" name="rangeTo">
                </div>
              </div>
              <button type="submit" class="round-green-btn" data-id="apply-filter">Apply</button>
            </form>
          </section>
          <div class="stocks-list-wrapper"></div>`;

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
    mainTemplate,
    searchTemplate
  }


})();
