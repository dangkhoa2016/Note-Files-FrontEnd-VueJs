/*jshint esversion: 9 */

export default {
  components: {
    'grid-icon': vueFeatherIcons.GridIcon,
    'check-square-icon': vueFeatherIcons.CheckSquareIcon,
    'message-square-icon': vueFeatherIcons.MessageSquareIcon,
    'mail-icon': vueFeatherIcons.MailIcon,
    'calendar-icon': vueFeatherIcons.CalendarIcon,
    'hash-icon': vueFeatherIcons.HashIcon,
    'tag-icon': vueFeatherIcons.TagIcon,
  },
  data() {
    return {
      colors: ['warning', 'info', 'danger', 'success', 'secondary', 'primary'],
      noNeeds: ['home', 'settings'],
      actions: { col1: ['add', 'edit', 'delete'], col2: ['search', 'import'] },
    };
  },
  computed: {
    ...Vuex.mapGetters({
      getNavigations: 'appStore/getNavigations',
    }),
    navigations() {
      const navigations = this.getNavigations;
      const noNeeds = this.noNeeds;
      return navigations.filter(n => !noNeeds.includes(n.to.name));
    }
  },
  mounted() {
    document.getElementsByTagName('body')[0].classList.remove('blank-page');
  },
  methods: {
    getColor(indx) {
      indx = indx % this.colors.length;
      return this.colors[indx];
    },
  },
};
