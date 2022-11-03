/*jshint esversion: 9 */

const debounce = Vue.prototype.$debounce;

export default {
  components: {
    'codesandbox-icon': vueFeatherIcons.CodesandboxIcon,
    'home-icon': vueFeatherIcons.HomeIcon,
    'log-out-icon': vueFeatherIcons.LogOutIcon,
    'hash-icon': vueFeatherIcons.HashIcon,
    'tag-icon': vueFeatherIcons.TagIcon,
  },
  data() {
    return {
      search: '',
    };
  },
  methods: {
    ...Vuex.mapActions({
      setAccessToken: 'appStore/setAccessToken',
      setRefreshToken: 'appStore/setRefreshToken',
      setSearchKeyword: 'noteStore/setSearchKeyword',
    }),
    onSubmit() {
      if (this.$route.name !== 'notes')
        this.$router.push({ name: 'notes', query: { keyword: this.search } });
    },
    logout() {
      this.setAccessToken('');
      this.setRefreshToken('');
      this.$router.push({ name: 'login', query: { returnTo: this.$route.fullPath } }); 
    },
  },
  computed: {
    ...Vuex.mapGetters({
      loadingNotes: 'noteStore/getLoadingNotes',
      links: 'appStore/getNavigations',
    }),
  },
  mounted() {
    this.search = this.$route.query.keyword || '';
    this.setSearchKeyword(this.search);
  },
  watch: {
    search: debounce(function (newVal) {
      this.setSearchKeyword(newVal);
      if (this.$route.name === 'notes')
        this.$router.history.push({ name: 'notes', query: { keyword: this.search } });
    }, 500),
  },
};
