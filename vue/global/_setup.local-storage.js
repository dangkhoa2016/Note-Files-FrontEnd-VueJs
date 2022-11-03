/*jshint esversion: 9 */

(() => {

  window.setLocalStorageItem = function (key, value, ttl) {
    if (!value) {
      localStorage.removeItem(key);
      return;
    }

    // `item` is an object which contains the original value
    // as well as the time when it's supposed to expire
    let item = {
      value: value,
      expiry: ttl ? (Date.now() + ttl) : null
    };

    localStorage.setItem(key, JSON.stringify(item));
  };

  const getLocalStorageItem = function (key) {
    let item = localStorage.getItem(key);
    // if the item doesn't exist, return null
    if (!item) return null;
    try {
      item = JSON.parse(item);
    } catch (ex) {
      console.log('Error parse', ex);
    }

    // compare the expiry time of the item with the current time
    if (item.expiry && (Date.now() > item.expiry)) {
      // If the item is expired, delete the item from storage and return null
      localStorage.removeItem(key);
      return null;
    }

    return item.value;
  };

  window.getLocalStorageItem = getLocalStorageItem;

  Vue.prototype.$getLocalStorageItem = getLocalStorageItem;

})();