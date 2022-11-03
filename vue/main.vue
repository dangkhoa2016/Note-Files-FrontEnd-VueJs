
<script>
import TopHeader from './top-header.vue';
import ModalNoteConfig from './modal-note-config.vue';
import ModalNoteForm from './modal-note-form.vue';
import ToastMessage from './toast-message.vue';
import ModalImport from './modal-import.vue';
import ModalConfirm from './modal-confirm.vue';
import PageNotFound from './page-not-found.vue';
import ModalRenameNote from './modal-rename-note.vue';
import ErrorLoadRoute from './error-load-route.vue';
const folderPath = '/vue';

Vue.use(VueRouter);

const excludeCheckAuthenticates = ['login', 'not-found'];

async function loadRouteComponent(path) {
  return new Promise(async (resolve) => {
    app.setErrorLoadRouteComponent(false);
    app.setLoadingRouteComponent(true);

    try {
      path = `${folderPath}/${path}`;
      await fetch(path, { method: 'HEAD' });
      const component = await import(path);
      app.setLoadingRouteComponent(false);
      resolve(component);
    } catch (ex) {
      console.log(ex);
      app.setErrorLoadRouteComponent(true);
      app.setLoadingRouteComponent(false);

      resolve();
    }
  });
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: async () => await loadRouteComponent('home.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: async () => await loadRouteComponent('login.vue'),
  },
  {
    path: '/settings',
    name: 'settings',
    component: async () => await loadRouteComponent('settings.vue'),
  },
  {
    path: '/tags',
    name: 'tags',
    component: async () => await loadRouteComponent('tags.vue'),
  },
  {
    path: '/notes',
    name: 'notes',
    component: async () => await loadRouteComponent('notes.vue'),
  },
  { path: '*', name: 'not-found', component: PageNotFound },
];

const router = new VueRouter({
  routes, // short for `routes: routes`
});

const store = new Vuex.Store({
  modules: {
    appStore: window['store'].appStore,
    noteStore: window['store'].noteStore,
    tagStore: window['store'].tagStore,
  },
});

const checkAuth = async () => {
  const accessToken = await store.dispatch('appStore/getAccessToken',
   null, { root: true, });
  if (accessToken) return true;
  else return false;
};

router.beforeEach(async (to, from, next) => {
  if (
    !excludeCheckAuthenticates.includes(to.name.toLowerCase()) &&
    !(await checkAuth())
  ) {
    const returnTo = from.query.returnTo || to.fullPath;
    next({ name: 'login', query: { returnTo } });
  } else {
    app.setErrorLoadRouteComponent(false);

    next();
  }
});

const app = new Vue({
  components: {
    TopHeader,
    ModalNoteForm,
    ModalNoteConfig,
    ToastMessage,
    ModalImport,
    ModalConfirm,
    ErrorLoadRoute,
    'arrow-up-circle-icon': vueFeatherIcons.ArrowUpCircleIcon,
    ModalRenameNote,
  },
  el: '#app',
  template: window.app.html,
  store,
  i18n: window.i18n,
  router,
  computed: {
    ...Vuex.mapGetters({
      appLoaded: 'appStore/getAppLoaded',
    }),
    isLoginPage() {
      return this.$route.name === 'login';
    },
    isNotFoundPage() {
      return this.$route.name === 'not-found';
    },
    bodyEl() {
      return document.getElementsByTagName('body')[0];
    },
  },
  data() {
    return {
      showGoToTop: false,
      loadingRouteComponent: null,
      errorLoadRouteComponent: null,
    };
  },
  methods: {
    ...Vuex.mapActions({
      setAppLoaded: 'appStore/setAppLoaded',
      setToastMessage: 'appStore/setToastMessage',
    }),
    async setCompleted() {
      // console.log('setCompleted', this);
      delete window['store'];
      delete window['options'];
      delete window.handleErrors;
      delete window.sleep;
      delete window.setLocalStorageItem;
      delete window.getLocalStorageItem;
      delete window.isValidURL;
      delete window.i18n;
      // await this.sleep(1000);
      this.setAppLoaded(true);
    },
    handleScroll(ev) {
      this.showGoToTop = window.scrollY > 300;
    },
    goToTop() {
      window.scrollTo(0, 0);
    },
    setLoadingRouteComponent(value) {
      this.loadingRouteComponent = value;
    },
    setErrorLoadRouteComponent(value) {
      this.errorLoadRouteComponent = value;
      if (value)
        this.$bvModal.show('modal-error-load-route');
    },
    async reloadRoute() {
      this.setErrorLoadRouteComponent(false);
      router.push({ name: router.history.pending.name });
    },
  },
  created() {
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
});

export default app;
</script>
