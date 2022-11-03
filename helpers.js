/*jshint esversion: 9 */

(() => {

  window.sleep = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  const handleErrors = function (response) {
    return new Promise(async (resolve) => {
      const contentType = response.headers.get('content-type') || '';

      if (!response.ok) {
        if (!contentType && response.status === 0 || response.status === 400 || response.status === 503)
          return resolve({ error_token: true });

        if (response.status === 426 || response.status === 428) {
          const time = response.headers.get('retry-after');
          resolve({ status: response.status, 'retry-after': time });
        } else if (response.status === 422)
          resolve({ status: response.status, error: 'Thiếu dữ liệu cần thiết để xử lý.' });

        if (!contentType || contentType.includes('text/html') || contentType.includes('text/plain'))
          resolve({ status: response.status, ...(await response.text()) });
        else
          resolve({ status: response.status, ...(await response.json()) });
        return;
      }

      if (contentType.indexOf('image/') !== -1)
        resolve({ url: response.url });
      else if (contentType.includes('text/plain'))
        resolve(await response.text());
      else
        resolve(await response.json() || {});
    });
  };

  window.handleErrors = handleErrors;

  Vue.prototype.$handleErrors = handleErrors;

  window.isValidURL = function (str) {
    if (!str || typeof (str) !== 'string')
      return false;

    var res = str.match(/((http(s)?:\/\/.)|(www\.))[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&/=]*)/);
    return (res !== null);
  };

  const monthsText = {
    strArray_en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    strArray_vi: ['Th 1', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7', 'Th 8', 'Th 9', 'Th 10', 'Th 11', 'Th 12']
  };

  Vue.filter('date', function (ori_date) {
    let date = null;
    if (typeof (ori_date) === 'string') {
      if (ori_date.length < 5)
        return ori_date;

      date = Date.parse(ori_date);
    } else if (typeof (ori_date) === 'number') {
      if (ori_date < 10000)
        return ori_date;

      date = new Date(ori_date);
    } else if (ori_date && typeof ori_date.getFullYear === 'function')
      date = ori_date;

    if (date) {
      if (typeof date.getDate !== 'function')
        date = new Date(date);
      const d = date.getDate();
      const m = monthsText[`strArray_${i18n.locale}`][date.getMonth()];
      const y = date.getFullYear();
      const mm = date.getMinutes();
      const hh = date.getHours();
      return `${d <= 9 ? '0' + d : d} ${m} ${y} ${hh <= 9 ? '0' + hh : hh}:${mm <= 9 ? '0' + mm : mm}`;
    }

    return ori_date;
  });

  Vue.prototype.$debounce = function (fn, delay) {
    let timeoutID = null;
    return function () {
      clearTimeout(timeoutID);
      const args = arguments;
      const that = this;
      timeoutID = setTimeout(function () {
        fn.apply(that, args);
      }, delay);
    };
  };

  const i18n = window.i18n;

  Vue.prototype.$retryReadable = (secs) => {
    const obj = secondsToTime(secs);
    const date = new Date();
    date.setSeconds(date.getSeconds() + secs);
    return [`${i18n.t('retry_readable.please_retry_after', obj)}`,
    `- [${Vue.options.filters.date(date)}]`].join(' ');
  };

  Vue.prototype.$formatDuration = (msecs) => {
    if (msecs < 0) msecs = -msecs;
    const time = {
      day: Math.floor(msecs / 86400000),
      hour: Math.floor(msecs / 3600000) % 24,
      minute: Math.floor(msecs / 60000) % 60,
      second: Math.floor(msecs / 1000) % 60,
      // millisecond: Math.floor(msecs) % 1000
    };
    return Object.entries(time)
      .filter(val => val[1] !== 0)
      .map(val => val[1] + ' ' + (val[1] !== 1 ? val[0] + 's' : val[0]))
      .join(', ');
  };

  function secondsToTime(secs) {
    secs = Math.round(secs);
    const hours = Math.floor(secs / (60 * 60));

    const divisor_for_minutes = secs % (60 * 60);
    const minutes = Math.floor(divisor_for_minutes / 60);

    const divisor_for_seconds = divisor_for_minutes % 60;
    const seconds = Math.ceil(divisor_for_seconds);

    return {
      hours,
      minutes,
      seconds
    };
  }

  Vue.prototype.$secondsToTime = secondsToTime;
  Vue.prototype.$sessionTimeout = function () {
    return i18n.t('session_timeout');
  };

  Vue.prototype.$isTemporatory = function (obj) {
    if (!obj || typeof (obj) !== 'object' || !obj.id)
      return false;

    return obj.id.toString().toLowerCase().indexOf('t-') === 0;
  };
})();