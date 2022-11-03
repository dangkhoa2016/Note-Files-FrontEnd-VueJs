/*jshint esversion: 9 */

export default {
  components: {
    'v-select': VueSelect.VueSelect,
  },
  methods: {
    ...Vuex.mapActions({
      setEndpoint: 'appStore/setEndpoint',
      setToastMessage: 'appStore/setToastMessage',

      setNotesPageSize: 'appStore/setNotesPageSize',
      setNotesSortBy: 'appStore/setNotesSortBy',
      setNotesSortDirection: 'appStore/setNotesSortDirection',
    }),
    reset() {
      this.form.endpoint = this.defaultEndpoint;
      this.form.notesPageSize = this.defaultNotesPageSize;
      this.form.notesSortBy = this.defaultNotesSortBy;
      this.form.notesSortDirection = this.defaultNotesSortDirection;
    },
    save() {
      this.setEndpoint(this.form.endpoint);

      this.setNotesPageSize(this.form.notesPageSize);
      this.setNotesSortBy(this.form.notesSortBy);
      this.setNotesSortDirection(this.form.notesSortDirection);

      this.setToastMessage(this.$root.$t('settings.saved'));
    },
  },
  data() {
    return {
      form: {
        endpoint: '',

        //notes page
        notesPageSize: 0,
        notesSortBy: '',
        notesSortDirection: true,
      },
    };
  },
  computed: {
    ...Vuex.mapGetters({
      defaultEndpoint: 'appStore/getEndpoint',
      notesPageOptions: 'appStore/getNotesPageOptions',
      notesSortOptions: 'appStore/getNotesSortOptions',
      defaultNotesPageSize: 'appStore/getNotesPageSize',
      defaultNotesSortDirection: 'appStore/getNotesSortDirection',
      directionOptions: 'appStore/getDirectionOptions',
      defaultNotesSortBy: 'appStore/getNotesSortBy',

    }),
  },
  mounted() {
    this.reset();
  },
};
