<template>

  <div>
    <b-button v-b-toggle.locale-changer
      :title="$t('locale-changer.title')"
      class='btn-change-language btn-icon'>
      <wind-icon size='1x' />
    </b-button>
    <b-sidebar id='locale-changer'
      backdrop-variant='dark' backdrop shadow
    >
      <template #header='{ hide }'>
        <strong>{{ $t('locale-changer.title') }}</strong>
        <b-button @click='hide' variant='' class='btn btn-close close btn-sm'></b-button>
      </template>
      <div class=''>
        <b-button v-for='lang of languages' class='d-block mt-2 width-90-per px-75 py-25 mx-auto'
          @click="$root.$loadLanguage(lang)"
          :key='lang' :variant="cssClass(lang)">
          <img :src='languageIcon(lang)' />
          {{ $t(`locale-changer.locale.${lang}`) }}
        </b-button>
      </div>
    </b-sidebar>
  </div>
  
</template>

<script>
export default {
  components: {
    'wind-icon': vueFeatherIcons.WindIcon,
  },
  data() {
    return {
      languages: ['vi', 'en']
    };
  },
  methods: {
    languageIcon(lang) {
      if (lang === 'vi')
        return 'https://cdn-icons-png.flaticon.com/32/330/330465.png';
      else
        return 'https://cdn-icons-png.flaticon.com/32/330/330425.png';
    },
    cssClass(lang) {
      return this.$root.$i18n.locale === lang ? 'relief-primary' : 'relief-secondary';
    },
  },
};
</script>
