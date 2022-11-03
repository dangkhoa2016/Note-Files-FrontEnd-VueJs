/*jshint esversion: 9 */

import ToastMessage from './toast-message.vue';

export default {
  components: {
    ToastMessage,
    'eye-icon': vueFeatherIcons.EyeIcon
  },
  methods: {
    ...Vuex.mapActions({
      setToastMessage: 'appStore/setToastMessage',
      setAccessToken: 'appStore/setAccessToken',
      setRefreshToken: 'appStore/setRefreshToken',
    }),
    async onSubmit() {
      if (!this.$refs['login-form'].flags.valid)
        return;

      this.submitting = true;
      fetch(`${this.endpoint}/api/login`, {
        method: 'post', redirect: 'manual',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.form)
      }).then(this.$handleErrors)
        .then(json => {
          this.submitting = false;
          if (json.accessToken) {
            this.setAccessToken({ accessToken: json.accessToken, expiresIn: json.accessTokenExpiresIn });
            if (json.refreshToken)
              this.setRefreshToken({ refreshToken: json.refreshToken, expiresIn: json.refreshTokenExpiresIn });
            document.getElementsByTagName('body')[0].classList.remove('blank-page');
            this.$router.push({ path: this.returnTo });
          } else {
            if (json.status === 426)
              this.setToastMessage(`${this.$root.$t('login.failed.many_failed_message')}<br/>${this.$retryReadable(json['retry-after'])}`);
            else
              this.setToastMessage(this.$root.$t('login.failed.invalid'));
          }
        }).catch(ex => {
          console.log('Error login', ex);
          this.submitting = false;
          this.setToastMessage(this.$root.$t('login.failed.invalid'));
        });
    },
  },
  data() {
    return {
      submitting: false,
      is_password_type_mode: true,
      form: {
        username: '',
        pass: ''
      },
    };
  },
  computed: {
    ...Vuex.mapGetters({
      endpoint: 'appStore/getEndpoint',
    }),
    returnTo() {
      return this.$route.query.returnTo || '/';
    },
    passwordTypeMode() {
      return this.is_password_type_mode ? 'password' : 'text';
    },
  },
  mounted() {
    document.getElementsByTagName('body')[0].classList.add('blank-page');
    document.getElementById('login-username').focus();
    if (this.$getLocalStorageItem('refresh_token')) {
      this.setRefreshToken('');
      this.setToastMessage(this.$sessionTimeout());
    }
  },
};
