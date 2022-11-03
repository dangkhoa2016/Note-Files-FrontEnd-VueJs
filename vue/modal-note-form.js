/*jshint esversion: 9 */

export default {
  data() {
    return {
      form: {
        name: null,
        content: null,
      },
      isEdit: false,
      forceClose: false,
    };
  },
  components: {
    'eye-icon': vueFeatherIcons.EyeIcon,
    'v-select': VueSelect.VueSelect,
  },
  computed: {
    ...Vuex.mapGetters({
      modalData: 'noteStore/getModalData',
      getLoadingNote: 'noteStore/getLoadingNote',
      saveNoteResult: 'noteStore/getSaveNoteResult',
      savingNote: 'noteStore/getSavingNote',
      errorSaveNote: 'noteStore/getErrorSaveNote',
      needLogin: 'noteStore/getNeedLogin',
      currentLoadNoteId: 'noteStore/getCurrentLoadNoteId',
      getErrorLoadNote: 'noteStore/getErrorLoadNote',
    }),
    errorAction() {
      if (this.needLogin)
        return this.$sessionTimeout();
      if (this.errorLoadNote === 404 || this.errorSaveNote === 404)
        return this.$root.$t('modal-note-form.not_found', { id: this.currentLoadNoteId });
      return (this.errorSaveNote || this.errorLoadNote) || false;
    },
    formValid() {
      const modalForm = this.$refs['modal-form'];
      return this.form.name && modalForm && modalForm.flags.valid;
    },
    errorLoadNote() {
      return this.getErrorLoadNote() || false;
    },
    loadingNote() {
      return this.getLoadingNote() || false;
    },
  },
  watch: {
    modalData(data) {
      if (data) {
        this.isEdit = true;
        this.form = data;
        this.$bvModal.show('modal-note-form');
      }
    },
    needLogin(val) {
      if (val && this.currentLoadNoteId) {
        console.log('You need to login before action.');
        // this.$router.push({ name: 'login', query: { returnTo: this.$route.fullPath } });
        this.setToastMessage(this.$sessionTimeout());
      }
    },
    saveNoteResult(data) {
      if (!data)
        return;

      this.$bvModal.hide('modal-note-form');

      if (this.isEdit)
        this.setToastMessage(this.$root.$t('modal-note-form.updated', { name: this.form.name }));
      else {
        this.setToastMessage(this.$root.$t('modal-note-form.created', data));
        this.setRefreshList(true);
      }
    },
  },
  methods: {
    ...Vuex.mapActions({
      updateNote: 'noteStore/updateNote',
      createNote: 'noteStore/createNote',
      setToastMessage: 'appStore/setToastMessage',
      setErrorSaveNote: 'noteStore/setErrorSaveNote',
      setRefreshList: 'noteStore/setRefreshList',
      setModalData: 'noteStore/setModalData',
      setLoadingNote: 'noteStore/setLoadingNote',
      setForceCloseModal: 'noteStore/setForceCloseModal',
      setNeedLogin: 'noteStore/setNeedLogin',
      setErrorLoadNote: 'noteStore/setErrorLoadNote',
    }),
    resetForm() {
      this.form = {
        name: null,
        content: null,
        id: null,
      };
      this.setErrorSaveNote(null);
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();

      this.$refs['modal-form'].validate().then(success => {
        if (!success) {
          return;
        }

        if (this.isEdit)
          this.updateNote(this.form);
        else
          this.createNote(this.form);
      });
    },
    onHidden() {
      this.setRefreshList(false);
      if (this.isEdit)
        this.setModalData(null);
      //reset validate
      this.$refs['modal-form'].reset();
      //reset form
      this.resetForm();
      this.isEdit = false;
    },
    onShown() {
      document.getElementById('txt-name').focus();
    },
    onHide() {
      this.setNeedLogin(false);
      this.setForceCloseModal();
    }
  }
};
