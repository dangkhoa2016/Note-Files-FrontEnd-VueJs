/*jshint esversion: 9 */

const defaultConfig = {
  whole: {
    borderColor: '',
    bgColor: '',
    textColor: '',
  },
  header: {
    borderColor: '',
    bgColor: '',
    textColor: '',
  },
  body: {
    borderColor: '',
    bgColor: '',
    textColor: '',
  },
  tags: []
};

const { ValidationProvider, ValidationObserver, } = window.VeeValidate;

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    'v-select': VueSelect.VueSelect,
    'sunset-icon': vueFeatherIcons.SunsetIcon,
    'chrome-icon': vueFeatherIcons.ChromeIcon,
    'tag-icon': vueFeatherIcons.TagIcon,
    'alert-circle-icon': vueFeatherIcons.AlertCircleIcon,
  },
  data() {
    return {
      activeTab: 0,
      configForm: JSON.parse(JSON.stringify(defaultConfig)),
      textColors: ['danger', 'warning', 'success', 'info', 'dark', 'black', 'white', 'body',
        'black-50', 'white-50', 'reset', 'opacity-25', 'opacity-50', 'opacity-75', 'opacity-100',
        'light', 'primary', 'secondary', 'muted'].map(c => `text-${c}`),
      bgColors: ['danger', 'warning', 'success', 'info', 'primary', 'secondary', 'dark',
        'light-danger', 'light-warning', 'light-success', 'light-info', 'light-primary', 'light-secondary',
        'black-50', 'white-50', 'transparent', 'opacity-10', 'opacity-25', 'opacity-50', 'opacity-75', 'opacity-100',
        'light', 'gradient', 'black', 'white', 'body'].map(c => `bg-${c}`),
      borderColors: ['top-danger', 'bottom-danger', 'start-danger', 'end-danger', 'danger',
        'top-warning', 'bottom-warning', 'start-warning', 'end-warning', 'warning',
        'top-info', 'bottom-info', 'start-info', 'end-info', 'info',
        'top-success', 'bottom-success', 'start-success', 'end-success', 'success',
        'top-primary', 'bottom-primary', 'start-primary', 'end-primary', 'primary',
        'top-secondary', 'bottom-secondary', 'start-secondary', 'end-secondary', 'secondary',
        'top-dark', 'bottom-dark', 'start-dark', 'end-dark', 'dark',
        'top-light', 'bottom-light', 'start-light', 'end-light', 'light',
        'top-black', 'bottom-black', 'start-black', 'end-black', 'black',
      ].map(c => `border-${c}`),
      currentNoteId: '',
    };
  },
  computed: {
    ...Vuex.mapGetters({
      currentModalConfigPreview: 'noteStore/getModalConfigPreview',
      errorSaveNote: 'noteStore/getErrorSaveNote',
      updatingNoteConfig: 'noteStore/getUpdatingNoteConfig',
      errorUpdateNoteConfig: 'noteStore/getErrorUpdateNoteConfig',
      updateNoteConfigResult: 'noteStore/getUpdateNoteConfigResult',
      getCachedTags: 'tagStore/getCachedTags',
      needLogin: 'noteStore/getNeedLogin',
      loadingTags: 'tagStore/getLoadingTags',
      errorLoadTags: 'tagStore/getErrorLoadTags',
    }),
    tags() {
      return this.getCachedTags(true);
    },
    formValid() {
      // const modalForm = this.$refs['modal-form'];
      // return this.configForm && modalForm && modalForm.flags.valid;
      return true;
    },
    errorAction() {
      if (this.needLogin)
        return this.$sessionTimeout();
      return this.errorUpdateNoteConfig || '';
    },
    hasTags() {
      return Array.isArray(this.tags) && this.tags.length > 0;
    },
  },
  watch: {
    needLogin(val) {
      if (val && this.currentNoteId) {
        console.log('You need to login before action.');
        // this.$router.push({ name: 'login', query: { returnTo: this.$route.fullPath } });
        this.setToastMessage(this.$sessionTimeout());
      }
    },
    currentModalConfigPreview(val) {
      if (val && !this.currentNoteId) {
        if (!this.hasTags)
          this.loadTags();
        let { id, config, tabIndex = 0 } = val;
        if (!config.tags || !Array.isArray(config.tags))
          config.tags = [];
        else
          config.tags = config.tags.filter(f => f);
        this.activeTab = tabIndex;
        this.configForm = { ...this.configForm, ...JSON.parse(JSON.stringify(config)) };
        this.$bvModal.show('modal-note-config');
        this.$nextTick(() => { this.currentNoteId = id; });
      }
    },
    configForm: {
      handler: function (val) {
        if (val && this.currentNoteId)
          this.setPreview({ id: this.currentNoteId, config: val });
      },
      deep: true
    },
    updateNoteConfigResult(data) {
      if (!data)
        return;

      this.$bvModal.hide('modal-note-config');
      this.setToastMessage(this.$root.$t('modal-note-config.imported', { data: data.name }));
    },
  },
  methods: {
    ...Vuex.mapActions({
      setPreview: 'noteStore/setModalConfigPreview',
      setToastMessage: 'appStore/setToastMessage',
      loadTags: 'tagStore/loadTags',
      updateNoteConfig: 'noteStore/updateNoteConfig',
      setNeedLogin: 'noteStore/setNeedLogin',
    }),
    async saveConfig(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();

      //remove null tag
      if (!this.configForm.tags || !Array.isArray(this.configForm.tags))
        this.configForm.tags = [];
      else
        this.configForm.tags = this.configForm.tags.filter(f => f);
      this.updateNoteConfig(this.configForm);
    },
    resetForm() {
      this.configForm = JSON.parse(JSON.stringify(defaultConfig));
    },
    onHide(e) {
      if (e.defaultPrevented)
        return;

      //reset validate
      this.$refs['modal-form'].reset();
      //reset form
      this.resetForm();
      this.currentNoteId = '';
      this.setPreview(null);
      this.setNeedLogin(false);
    },
  },
};
