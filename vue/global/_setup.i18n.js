/*jshint esversion: 9 */

(async () => {
  const defaultLang = 'vi';
  const setLocalStorageItem = window.setLocalStorageItem;
  const getLocalStorageItem = window.getLocalStorageItem;
  const userLang = getLocalStorageItem('locale') || '';
  let currentLang = userLang || defaultLang;
  const langPath = `/vue/global/_lang.${currentLang}.json`;
  const loadedLanguages = [currentLang]; // our default language that is preloaded

  Vue.use(VueI18n);

  const loadJson = function (file) {
    return new Promise((resolve, reject) => {
      fetch(file)
        .then(res => {
          if (res.status !== 200)
            throw new Error(`File [${file}] does not exists.`);
          return res.text();
        }).then(content => {
          resolve(JSON.parse(content));
        }).catch(ex => {
          console.log(`Error load json: ${file}`, ex);
          reject(ex);
        });
    });
  };

  let lang = await loadJson(langPath);
  const i18n = new VueI18n({
    locale: currentLang, // set locale
    fallbackLocale: defaultLang,
    messages: { [currentLang]: lang } // set locale messages
  });

  window.i18n = i18n;

  function setI18nLanguage(lang) {
    if (i18n.locale !== lang)
      i18n.locale = lang;
    document.querySelector('html').setAttribute('lang', lang);
    VeeValidate.localeChanged();
    setLocalStorageItem('locale', lang);
    return lang;
  }

  Vue.prototype.$loadLanguage = (lang) => {
    return new Promise(resolve => {
      // If the same language
      if (i18n.locale === lang) {
        return resolve(setI18nLanguage(lang));
      }

      // If the language was already loaded
      if (loadedLanguages.includes(lang)) {
        return resolve(setI18nLanguage(lang));
      }

      // If the language hasn't been loaded yet
      loadJson(`/vue/global/_lang.${lang}.json`).then(messages => {
        i18n.setLocaleMessage(lang, messages);
        loadedLanguages.push(lang);
        resolve(setI18nLanguage(lang));
      }).catch(ex => {
        console.log(`Error load lang: ${lang}`, ex);
        resolve();
      });
    });
  };

})();