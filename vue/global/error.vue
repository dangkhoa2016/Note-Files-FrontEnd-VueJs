<template>

  <div :class="`alert alert-${type} p-1`">
    <div class='d-flex'>
      <span class='me-1'>
        <alert-circle-icon v-if="type === 'danger'" />
        <maximize-icon v-else />
      </span>
      <div>
        <h4 :class="`mb-1 text-${danger}`">{{ displayTitle }}</h4>
        <slot>{{ $t('error.default_text') }}</slot>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  components: {
    'alert-circle-icon': vueFeatherIcons.AlertCircleIcon,
    'maximize-icon': vueFeatherIcons.MaximizeIcon,
  },
  props: {
    title: {
      type: String,
    },
    type: {
      type: String,
      default: 'danger',
    },
  },
  computed: {
    displayTitle() {
      if (this.title) return this.title;

      return this.$root.$t(`error.${this.type === 'danger' ? 'has_error' : 'notice'}`);
    },
  },
};
</script>
