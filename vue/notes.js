/*jshint esversion: 9 */

import NoteItem from './note-item.vue';

export default {
  components: {
    'note-item': NoteItem,
    'v-select': VueSelect.VueSelect,
    'plus-square-icon': vueFeatherIcons.PlusSquareIcon,
    'alert-circle-icon': vueFeatherIcons.AlertCircleIcon,
    'refresh-cw-icon': vueFeatherIcons.RefreshCwIcon,
    'server-icon': vueFeatherIcons.ServerIcon,
    'plus-icon': vueFeatherIcons.PlusIcon,
    'briefcase-icon': vueFeatherIcons.BriefcaseIcon,
    'layers-icon': vueFeatherIcons.LayersIcon,
  },
  data() {
    return {
      currentPage: 1,
      perPage: 0,
      sortBy: '',
      sortDirection: '',
      loaded: false,
      filterTag: []
    };
  },
  computed: {
    ...Vuex.mapGetters({
      notes: 'noteStore/getNotes',
      searchKeyword: 'noteStore/getSearchKeyword',
      errorLoadNotes: 'noteStore/getErrorLoadNotes',
      modalData: 'noteStore/getModalData',
      refreshList: 'noteStore/getRefreshList',
      totalRows: 'noteStore/getTotalNotes',
      needLogin: 'noteStore/getNeedLogin',
      loadingNotes: 'noteStore/getLoadingNotes',

      defaultNotesPageSize: 'appStore/getNotesPageSize',
      defaultNotesSortDirection: 'appStore/getNotesSortDirection',
      defaultNotesSortBy: 'appStore/getNotesSortBy',
      notesPageOptions: 'appStore/getNotesPageOptions',
      notesSortOptions: 'appStore/getNotesSortOptions',
      directionOptions: 'appStore/getDirectionOptions',

      getCachedTags: 'tagStore/getCachedTags',
      loadingTags: 'tagStore/getLoadingTags',
      errorLoadTags: 'tagStore/getErrorLoadTags',
    }),
    errorAction() {
      if (!this.modalData && this.needLogin)
        return this.$sessionTimeout();
      return this.errorLoadNotes || '';
    },
    hasData() {
      return Array.isArray(this.notes) && this.notes.length > 0;
    },
    hasTags() {
      return Array.isArray(this.tags) && this.tags.length > 0;
    },
    tags() {
      return this.getCachedTags(true) || [];
    },
    hasSearchCriteria() {
      return (this.searchKeyword && this.searchKeyword.length > 1) || this.filterTag.length > 0;
    },
  },
  mounted() {
    this.setDefault();
    this.filterTag = (this.$route.query.tags || '').split(',').filter(t => t);
    this.$nextTick(() => {
      if (!this.hasTags)
        this.loadTags();
      this.loaded = true;
      this.processSearch();
    });
  },
  watch: {
    refreshList(val) {
      if (val)
        this.processSearch();
    },
    perPage(val) {
      this.currentPage = 1;
      this.processSearch();
    },
    filterTag(val) {
      this.currentPage = 1;
      if (this.$route.name === 'notes')
        this.$router.history.push({
          name: 'notes',
          query: {
            keyword: this.searchKeyword,
            tags: val.filter(t => t).join(',')
          }
        });
      this.processSearch();
    },
    sortBy(val) {
      this.currentPage = 1;
      this.processSearch();
    },
    sortDirection(val) {
      this.currentPage = 1;
      this.processSearch();
    },
    searchKeyword(val) {
      this.currentPage = 1;
      this.processSearch();
    },
  },
  methods: {
    ...Vuex.mapActions({

      loadTags: 'tagStore/loadTags',
      setCurrentLoadNoteId: 'noteStore/setCurrentLoadNoteId',
      loadNotes: 'noteStore/loadNotes',
      downloadNotes: 'noteStore/downloadNotes',
      setShowModalImport: 'noteStore/setShowModalImport',
    }),
    setDefault() {
      this.perPage = this.defaultNotesPageSize;
      this.sortBy = this.defaultNotesSortBy;
      this.sortDirection = this.defaultNotesSortDirection;
    },
    addNew() {
      this.setCurrentLoadNoteId(null);
      this.$bvModal.show('modal-note-form');
    },
    onPageIndexChanged(pageIndex) {
      this.currentPage = pageIndex;
      this.processSearch();
    },
    processSearch() {
      if (!this.loaded)
        return;

      this.loadNotes({
        search: this.searchKeyword || '',
        current_page: this.currentPage,
        limit: this.perPage,
        sort_field: this.sortBy,
        sort_direction: this.sortDirection,
        tags: this.filterTag.filter(t => t).join(','),
      });
    },
    download(type) {
      this.downloadNotes(type).then(result => {
        const [fileName, blob] = result;
        if (!blob) {
          this.setToastMessage(this.$root.$t('notes.error_download', { type }));
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
