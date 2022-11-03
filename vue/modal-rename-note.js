/*jshint esversion: 9 */

export default {
  data() {
    return {
      form: {
        new_name: null,
      },
    };
  },
  computed: {
    ...Vuex.mapGetters({
      renameNoteResult: 'noteStore/getRenameNoteResult',
      renamingNote: 'noteStore/getRenamingNote',
      errorRenameNote: 'noteStore/getErrorRenameNote',
      getCacheNoteInfo: 'noteStore/getCacheNoteInfo',
      needLogin: 'noteStore/getNeedLogin',
      renameNoteId: 'noteStore/getRenameNoteId',
    }),
    errorAction() {
      if (this.needLogin)
        return this.$sessionTimeout();
      return this.errorRenameNote || '';
    },
    formValid() {
      const modalForm = this.$refs['modal-form'];
      return this.form.new_name && modalForm && modalForm.flags.valid;
    },
    noteInfo() {
      return this.getCacheNoteInfo(this.renameNoteId) || {};
    },
  },
  watch: {
    renameNoteId(id) {
      if (id) {
        const { name } = this.noteInfo;
        this.form.old_name = name;
        this.form.new_name = name;
        this.$bvModal.show('modal-rename-note');
      }
    },
    needLogin(val) {
      if (val && this.renameNoteId) {
        console.log('You need to login before action.');
        // this.$router.push({ name: 'login', query: { returnTo: this.$route.fullPath } });
        this.setToastMessage(this.$sessionTimeout());
      }
    },
    renameNoteResult(data) {
      if (!data)
        return;

      this.$bvModal.hide('modal-rename-note');
      this.setToastMessage(this.$root.$t('modal-rename-note.renamed', this.form));
    },
  },
  methods: {
    ...Vuex.mapActions({
      renameNote: 'noteStore/renameNote',
      setToastMessage: 'appStore/setToastMessage',
      setNeedLogin: 'noteStore/setNeedLogin',
      setRenameNoteId: 'noteStore/setRenameNoteId',
    }),
    resetForm() {
      this.form = {
        old_name: null,
        new_name: null,
      };
      this.setRenameNoteId(null);
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();

      this.$refs['modal-form'].validate().then(success => {
        if (!success) {
          return;
        }

        this.renameNote(this.form);
      });
    },
    onHidden() {
      //reset form
      this.resetForm();
    },
    onShown() {
      document.getElementById('txt-newName').focus();
    },
    onHide() {
      this.setNeedLogin(false);
    },
  }
};
