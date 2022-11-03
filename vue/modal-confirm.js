/*jshint esversion: 9 */

export default {
  data() {
    return {
    };
  },
  computed: {
    ...Vuex.mapGetters({
      deleteNoteResult: 'noteStore/getDeleteNoteResult',
      deletingNote: 'noteStore/getDeletingNote',
      errorDeleteNote: 'noteStore/getErrorDeleteNote',
      getCacheNoteInfo: 'noteStore/getCacheNoteInfo',
      needLogin: 'noteStore/getNeedLogin',
      confirmDeleteNoteId: 'noteStore/getConfirmDeleteNoteId',
    }),
    noteInfo() {
      const note = this.getCacheNoteInfo(this.confirmDeleteNoteId);
      if (note)
        return `[${note.id}] [${note.name}]`;
    },
    errorAction() {
      if (this.needLogin)
        return this.$sessionTimeout();
      return this.errorDeleteNote || '';
    },
  },
  watch: {
    confirmDeleteNoteId(id) {
      if (id)
        this.$bvModal.show('modal-delete-note');
    },
    needLogin(val) {
      if (val && this.confirmDeleteNoteId) {
        console.log('You need to login before action.');
        // this.$router.push({ name: 'login', query: { returnTo: this.$route.fullPath } });
        this.setToastMessage(this.$sessionTimeout());
      }
    },
    deleteNoteResult(data) {
      if (!data || this.needLogin)
        return;

      this.$bvModal.hide('modal-delete-note');

      this.setRefreshList(true);
      this.setToastMessage(this.$root.$t('modal-confirm.deleted', data.id));
    },
  },
  methods: {
    ...Vuex.mapActions({
      setToastMessage: 'appStore/setToastMessage',
      setErrorDeleteNote: 'noteStore/setErrorDeleteNote',
      setRefreshList: 'noteStore/setRefreshList',
      setConfirmDeleteNoteId: 'noteStore/setConfirmDeleteNoteId',
      setNeedLogin: 'noteStore/setNeedLogin',
      deleteNote: 'noteStore/deleteNote',
    }),
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();

      this.deleteNote();
    },
    onHidden() {
      this.setRefreshList(false);
      //reset validate
      this.setConfirmDeleteNoteId(null);
    },
  }
};
