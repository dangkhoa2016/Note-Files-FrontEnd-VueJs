/*jshint esversion: 9 */

const { loadModule, vueVersion } = window['vue2-sfc-loader'];

window.options = {
  moduleCache: {},
  async getFile(url) {
    const res = await fetch(url);
    if (!res.ok)
      throw Object.assign(new Error(url + ' ' + res.statusText), { res });
    return await res.text();
  },

  addStyle(textContent) {
    const style = Object.assign(document.createElement('style'), { textContent });
    const ref = document.head.getElementsByTagName('style')[0] || null;
    document.head.insertBefore(style, ref);
  },

  log(type, ...args) {
    console[type](...args);
  },
};

(async () => {

  const loadStore = function (file) {
    return loadJs(`/stores/${file}.js`);
  };

  const loadJs = function (file) {
    return new Promise((resolve) => {
      fetch(file)
        .then(res => {
          if (res.status !== 200)
            throw new Error(`File [${file}] does not exists.`);
          return res.text();
        }).then(js => {
          eval(js);
          resolve();
        }).catch(ex => {
          console.log(`Error load js: ${file}`, ex);
          resolve();
        });
    });
  };

  const arrLibraries = [
    // 'npm/bootstrap-vue@2.21.2/dist/bootstrap-vue-icons.min.js',
    'npm/vue-i18n@8.27.2/dist/vue-i18n.min.js',
    'npm/vee-validate@3.4.14/dist/vee-validate.min.js',
    'npm/vee-validate@3.4.14/dist/rules.umd.min.js',
    'npm/vue-select@3.20.0/dist/vue-select.min.js',
    // 'npm/lodash-core@4.17.19/distrib/lodash-core.min.js'
  ];

  new Vue({
    el: '#loader',
    data: {
      variants: {
        'secondary': { action: 'initApp', status: 0, title: 'Khởi tạo' },
        'info': { action: 'loadStore', status: 0, title: 'Tải vuex store' },
        'success': { action: 'loadVueComponent', status: 0, title: 'Tải vue components' },
        'danger': { action: 'startApp', status: 0, title: 'Bắt đầu chạy app' },
        'warning': { action: '', status: 0, title: 'Tất cả đã xong, chạy nào' }
      },
      current: '',
      completed: false
    },
    computed: {
      currentAction() {
        if (!this.current)
          return 'Done';
        return this.current === 'start' ? 'App loading...' : this.variants[this.current].title;
      },
    },
    methods: {
      async setCompleted() {
        this.completed = true;

        await this.sleep(1000);
        this.$destroy();
        this.$el.parentNode.removeChild(this.$el);
        window.app.setCompleted();
      },
      sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      },
      async initApp() {
        await loadJs('https://cdn.jsdelivr.net/combine/' + arrLibraries.join(','));
        await loadJs('/vue/global/_setup.local-storage.js');
        await loadJs('/vue/global/_setup.i18n.js');

        const max_wait_i18n = 5;
        let current_wait = 0;
        while (!window.i18n && current_wait < max_wait_i18n) {
          await this.sleep(200);
          current_wait += 1;
        }
        await loadJs('/vue/global/_setup.validate.js');
        await loadJs('/helpers.js');
      },
      async loadStore() {
        await Promise.all([
          loadStore('appStore'),
          loadStore('noteStore'),
          loadStore('tagStore'),
        ]);
      },
      async loadVueComponent() {
        const components = ['loading', 'error', 'locale-changer'];
        await Promise.all(components.map(async (name) => {
          Vue.component(name, await loadModule(`/vue/global/${name}.vue`, options));
        }));

        Vue.component('validation-provider', window.VeeValidate.ValidationProvider);
        Vue.component('validation-observer', window.VeeValidate.ValidationObserver);
      },
      startApp() {
        return new Promise(async (resolve) => {
          await loadJs('/script.js');
          const intervalId = setInterval(() => {
            if (typeof (window.app.setCompleted) === 'function') {
              clearInterval(intervalId);
              resolve();
            }
          }, 500);
        });
      },
    },
    async created() {
      this.current = 'start';

      for (var key in this.variants) {
        this.current = key;
        if (this.variants[key].action) {
          await this[this.variants[key].action]();
          // await this.sleep(2000);
          this.variants[key].status = 20;
          this.current = '';
        }
        else {
          await this.sleep(500);
          this.variants[key].status = 20;
          await this.sleep(1500);

          // console.log('Loader all done');
        }
      }

      await this.setCompleted();
    }
  });

})();
