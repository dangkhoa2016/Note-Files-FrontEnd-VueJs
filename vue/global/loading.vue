<template>

  <div class='text-center'>
    <div class='spinner-border text-info' role='status'>
      <span class='visually-hidden'>{{ loading_text }}</span>
    </div>
    <div class='spinner-border text-danger' role='status'>
      <span class='visually-hidden'>{{ loading_text }}</span>
    </div>
    <div class='spinner-border text-success' role='status'>
      <span class='visually-hidden'>{{ loading_text }}</span>
    </div>
  </div>

</template>

<script>
export default {
  data() {
    return {
    };
  },
  computed: {
    loading_text() {
      return this.$root.$t('loading.text');
    },
  },
};
</script>
