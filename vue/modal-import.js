/*jshint esversion: 9 */

const emptyForm = {
  url: null,
  auth_token: null,
};

export default {
  data() {
    return {
      form: { ...emptyForm },
      importType: ''
    };
  },
  computed: {
    ...Vuex.mapGetters({
      importNotesResult: 'noteStore/getImportNotesResult',
      importingNotes: 'noteStore/getImportingNotes',
      errorImportNotes: 'noteStore/getErrorImportNotes',
      needLoginNote: 'noteStore/getNeedLogin',
      showModalImportNotes: 'noteStore/getShowModalImport',

      importTagsResult: 'tagStore/getImportTagsResult',
      importingTags: 'tagStore/getImportingTags',
      errorImportTags: 'tagStore/getErrorImportTags',
      needLoginTag: 'tagStore/getNeedLogin',
      showModalImportTags: 'tagStore/getShowModalImport',
    }),
    getNeedLogin() {
      if (this.importType)
        return this[`needLogin${this.importType}`];
    },
    errorAction() {
      if (this.getNeedLogin)
        return this.$sessionTimeout();
      return this[`errorImport${this.importType}s`] || '';
    },
    formValid() {
      const modalForm = this.$refs['modal-form'];
      return this.form.url && modalForm && modalForm.flags.valid;
    },
    headerName() {
      switch (this.importType) {
        case 'Note':
          return this.$root.$t('modal-import.notes');
        case 'Tag':
          return this.$root.$t('modal-import.tags');
      }
    },
    importing() {
      if (this.importType)
        return this[`importing${this.importType}s`];
    },
  },
  watch: {
    showModalImportNotes(data) {
      if (data)
        this.showModalImport('Note');
    },
    showModalImportTags(data) {
      if (data)
        this.showModalImport('Tag');
    },

    needLoginNote(val) {
      this.needLogin(val);
    },
    needLoginTag(val) {
      this.needLogin(val);
    },

    importNotesResult(data) {
      this.importResult(data);
    },
    importTagsResult(data) {
      this.importResult(data);
    },
  },
  methods: {
    ...Vuex.mapActions({
      setToastMessage: 'appStore/setToastMessage',

      setErrorImportNotes: 'noteStore/setErrorImportNotes',
      setNoteRefreshList: 'noteStore/setRefreshList',
      importNotes: 'noteStore/importNotes',
      setShowModalImportNotes: 'noteStore/setShowModalImport',
      setNeedLoginNote: 'noteStore/setNeedLogin',

      setErrorImportTags: 'tagStore/setErrorImportTags',
      loadTags: 'tagStore/loadTags',
      importTags: 'tagStore/importTags',
      setShowModalImportTags: 'tagStore/setShowModalImport',
      setTagRefreshList: 'tagStore/setRefreshList',
      setNeedLoginTag: 'tagStore/setNeedLogin',
    }),
    importResult(data) {
      if (!data)
        return;

      this.$bvModal.hide('modal-import');

      this[`set${this.importType}RefreshList`](true);
      this.setToastMessage(this.$root.$t('modal-import.imported', { message: data.message, header_name: this.headerName }));
    },
    showModalImport(type) {
      this.importType = type;
      this.$bvModal.show('modal-import');
    },
    resetForm() {
      this.form = { ...emptyForm };
      this[`setErrorImport${this.importType}s`](null);
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();

      this.$refs['modal-form'].validate().then(success => {
        if (!success)
          return;

        this[`import${this.importType}s`](this.form);
      });
    },
    onHidden() {
      this[`set${this.importType}RefreshList`](false);
      this[`setShowModalImport${this.importType}s`](null);

      //reset form
      this.resetForm();
    },
    onShown() {
      document.getElementById('txt-url').focus();
    },
    onHide(bvModalEvt) {
      if (this.importing) {
        // Prevent modal from closing
        bvModalEvt.preventDefault();
        return;
      }
      this[`setNeedLogin${this.importType}`](false);
    },
    needLogin(val) {
      if (val && this.importType) {
        console.log('You need to login before action.');
        // this.$router.push({ name: 'login', query: { returnTo: this.$route.fullPath } });
        this.setToastMessage(this.$sessionTimeout());
      }
    },
  }
};
