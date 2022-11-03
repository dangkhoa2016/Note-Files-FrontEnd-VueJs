/*jshint esversion: 9 */

export default {
  props: {
    note: {
      type: Object,
      default: () => { return {}; }
    }
  },
  components: {
    'edit-icon': vueFeatherIcons.EditIcon,
    'cpu-icon': vueFeatherIcons.CpuIcon,
    'trash-icon': vueFeatherIcons.TrashIcon,
    'tool-icon': vueFeatherIcons.ToolIcon,
  },
  data() {
    return {
      detailFields: [
        { label: 'ID', field: 'id' },
        { label: 'created_at', field: 'created_at' },
        { label: 'updated_at', field: 'updated_at' },
      ],
      badgeColors: ['warning', 'info', 'danger', 'success', 'secondary', 'primary']
    };
  },
  computed: {
    ...Vuex.mapGetters({
      getCachedTags: 'tagStore/getCachedTags',
      modalConfigPreview: 'noteStore/getModalConfigPreview',
    }),
    tags() {
      return this.getCachedTags();
    },
    cardClass() {
      return this.getClass('whole');
    },
    headerClass() {
      return this.getClass('header');
    },
    bodyClass() {
      return this.getClass('body');
    },
    getConfig() {
      let { id, config } = this.modalConfigPreview || {};
      const current = id && this.note && this.note.id.toString() === id.toString();
      if (!current)
        config = (this.note && this.note.config) || {};
      return config || {};
    },
    hasTags() {
      return Array.isArray(this.tags) && this.tags.length > 0;
    },
    hasConfigTags() {
      return Array.isArray(this.configTags) && this.configTags.length > 0;
    },
    configTags() {
      if (this.note && this.note.config && Array.isArray(this.note.config.tags))
        return this.note.config.tags;
      else
        return [];
    },
    tagList() {
      const arr = [];
      const configTags = this.configTags;
      if (this.hasTags && configTags.length > 0) {
        configTags.forEach(id => {
          const tag = this.tags.find(t => t.id === id);
          if (tag)
            arr.push(tag.name);
        });
      }
      return arr;
    },
  },
  methods: {
    ...Vuex.mapActions({
      setModalConfigPreview: 'noteStore/setModalConfigPreview',
      loadNote: 'noteStore/loadNote',
      setConfirmDeleteNoteId: 'noteStore/setConfirmDeleteNoteId',
      setRenameNoteId: 'noteStore/setRenameNoteId',
    }),
    renameNote() {
      this.setRenameNoteId(this.note.id);
    },
    editNoteConfig(tabIndex) {
      const { id, config } = this.note;
      this.setModalConfigPreview({ id, config, tabIndex });
    },
    editNote() {
      this.$bvModal.show('modal-note-form');
      this.loadNote(this.note.id);
    },
    getClass(type) {
      const config = this.getConfig;
      const { borderColor = '', bgColor = '', textColor = '', } = (config && config[type]) || {};
      return [borderColor, bgColor, textColor].filter(f => f).join(' ');
    },
    getBadgeColor(indx) {
      indx = indx % this.badgeColors.length;
      return this.badgeColors[indx];
    },
  }
};
