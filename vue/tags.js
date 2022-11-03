/*jshint esversion: 9 */

import TagItem from './tag-item.vue';
const debounce = Vue.prototype.$debounce;

export default {
  data() {
    return {
      debounceSearch: '',
      search: '',
      status: null,
    };
  },
  components: {
    'plus-icon': vueFeatherIcons.PlusIcon,
    'refresh-cw-icon': vueFeatherIcons.RefreshCwIcon,
    'server-icon': vueFeatherIcons.ServerIcon,
    'v-select': VueSelect.VueSelect,
    'tag-item': TagItem
  },
  mounted() {
    this.loadTags();
  },
  computed: {
    ...Vuex.mapGetters({
      getCachedTags: 'tagStore/getCachedTags',
      loadingTags: 'tagStore/getLoadingTags',
      errorLoadTags: 'tagStore/getErrorLoadTags',

      savingTag: 'tagStore/getSavingTag',
      errorSaveTag: 'tagStore/getErrorSaveTag',

      needLogin: 'tagStore/getNeedLogin',
      selectedTag: 'tagStore/getSelectedTag',

      deleteTagResult: 'tagStore/getDeleteTagResult',
      deletingTag: 'tagStore/getDeletingTag',
      errorDeleteTag: 'tagStore/getErrorDeleteTag',

      addAction: 'tagStore/getAddAction',
      refreshList: 'tagStore/getRefreshList',
    }),
    tags() {
      return this.getCachedTags();
    },
    errorAction() {
      if (this.needLogin)
        return this.$sessionTimeout();
      return this.errorLoadTags || this.errorDeleteTag || '';
    },
    hasData() {
      return this.tags.length > 0;
    },
    countTemporatory() {
      const isTemporatory = this.$isTemporatory;
      return this.tags.filter(t => isTemporatory(t)).length;
    },
    confirmDeletedMessage() {
      const selectedTag = this.selectedTag;
      if (!selectedTag)
        return;
      return (selectedTag.id.indexOf('t-') === 0) ? this.$root.$t('tags.not_saved') : selectedTag.id;
    },
    statusOptions() {
      if (!Array.isArray(this.tags))
        return [];

      const isTemporatory = this.$isTemporatory;
      const countActive = this.tags.filter(b => b.enabled && !isTemporatory(b)).length;
      const countTemporatory = this.countTemporatory;

      return [
        { value: null, text: this.$root.$t('tags.all') },
        { value: true, text: `${this.$root.$t('tags.status_active')} [${countActive}]` },
        { value: -1, text: `${this.$root.$t('tags.not_saved')} [${countTemporatory}]` },
        { value: false, text: `${this.$root.$t('tags.status_inactive')} [${this.tags.length - countTemporatory - countActive}]` }
      ];
    },
  },
  watch: {
    refreshList(val) {
      if (val)
        this.loadTags();
    },
    addAction(newVal) {
      this.$nextTick(function () {
        if (!newVal)
          return;

        let inputId = '';
        if (newVal == 'push')
          inputId = this.tags.length - 1;
        else if (newVal == 'unshift')
          inputId = 0;

        if (typeof (inputId) === 'number') {
          this.setAddAction('');
          document.getElementById(`txt-tag-${inputId}`).focus();
        }
      });
    },
    search: debounce(function (newVal) {
      this.debounceSearch = (newVal || '').toLowerCase();
    }, 500),
    deleteTagResult(data) {
      if (!data)
        return;

      this.$bvModal.hide('confirm-delete-tag');

      if (data.id)
        this.setToastMessage(this.$root.$t('tags.deleted', data));
      else
        this.setToastMessage(this.$root.$t('tags.deleted_not_saved'));
    },
    needLogin(val) {
      if (val) {
        console.log('You need to login before action.');
        // this.$router.push({ name: 'login', query: { returnTo: this.$route.fullPath } });
        this.setToastMessage(this.$sessionTimeout());
      }
    },
  },
  methods: {
    ...Vuex.mapActions({
      setToastMessage: 'appStore/setToastMessage',

      setNeedLogin: 'tagStore/setNeedLogin',
      loadTags: 'tagStore/loadTags',
      deleteTag: 'tagStore/deleteTag',
      setShowModalImport: 'tagStore/setShowModalImport',
      mainSaveTag: 'tagStore/saveTag',
      addTemporatoryTag: 'tagStore/addTemporatoryTag',
      downloadTags: 'tagStore/downloadTags',
      setAddAction: 'tagStore/setAddAction',
    }),
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();

      if (this.selectedTag)
        this.deleteTag();
      else {
        this.$nextTick(() => {
          this.$bvModal.hide('confirm-delete-tag');
        });
      }
    },
    showItem(item) {
      if (!item)
        return false;

      const { name, enabled } = item;
      let show = true;
      if (this.debounceSearch && this.debounceSearch.length > 1)
        show = name.toLowerCase().includes(this.debounceSearch);

      if (show && this.status !== null) {
        if (this.$isTemporatory(item))
          show = this.status === -1;
        else
          show = enabled === this.status;
      }
      return show;
    },
    download(type) {
      this.downloadTags(type).then(result => {
        const [fileName, blob] = result;
        if (!blob) {
          this.setToastMessage(this.$root.$t('tags.error_download', { type }));
          return;
        }

        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName || `export-${(new Date()).valueOf()}.${type}`;
        link.click();
        window.URL.revokeObjectURL(link.href);
      });
    },
  },
};
