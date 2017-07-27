/**
 * Created by mirif on 27/07/2017.
 */

(function () {
  'use strict';
  window.Stokr = window.Stokr || {};

  function fetchJson(myRequest) {
    return fetch(myRequest)
      .then((response) => {
        const contentType = response.headers.get("content-type");
        if(contentType && contentType.includes("application/json")) {
          return response.json();
        } else {
          throw new TypeError("OH SNAP, we haven't got a JSON!");
        }
      });
  }

  function fetchStocks(stocksToFetch) {
    return fetchJson(`http://localhost:7000/quotes?q=${stocksToFetch}`)
      .then(res => res.query.results.quote);
  }

  function searchStocks(stockToSearch) {
    return fetchJson(`http://localhost:7000/search?q=${stockToSearch}`)
      .then(res => res.ResultSet.Result);
  }

  window.Stokr.ApiService = {
    fetchStocks,
    searchStocks
  }


})();

