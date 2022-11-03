<template>

  <b-toast id='toast-message'
    header-class='bg-dark text-white' :body-class='bodyClass'
    :no-close-button='true' :auto-hide-delay='8000'
    @hidden='onHidden' @shown='onShown'>
    <template #toast-title='{ hide }'>
      <strong class='me-auto'>{{ $t('toast-message.header') }}</strong>
      <button type='button' class='ms-1 btn-close opacity-100'
        data-bs-dismiss='toast' style='background: none'
        @click.prevent='hide' :aria-label="$t('toast-message.close')">
        <x-icon size='1x' />
      </button>
    </template>

    <div v-html='toastMessage'></div>
  </b-toast>

</template>

<script>
  export default {
    props: {
      bodyClass: {
        type: String,
        default: 'bg-light-info',
      },
    },
    components: {
      'x-icon': vueFeatherIcons.XIcon,
    },
    methods: {
      ...Vuex.mapActions({
        setToastMessage: 'appStore/setToastMessage',
      }),
      onHidden() {
        this.setToastMessage('');
      },
      onShown(ev) {
      },
    },
    computed: {
      ...Vuex.mapGetters({
        toastMessage: 'appStore/getToastMessage',
      }),
    },
    watch: {
      toastMessage(val) {
        if (val)
          this.$bvToast.show('toast-message');
      },
    },
  };
</script>
