/*jshint esversion: 9 */

(function () {

  const setLocalStorageItem = window.setLocalStorageItem;
  const getLocalStorageItem = window.getLocalStorageItem;
  const handleErrors = window.handleErrors;

  const state = {
    appLoaded: false,
    endpoint: 'https://note-server.tinycharge.xyz',
    // endpoint: 'https://bountifulpresentlogin.glennmanley.repl.co',
    directionOptions: [{ value: 'asc', text: 'sort_asc' }, { value: 'desc', text: 'sort_desc' }],

    //notes page
    notesPageOptions: [{ value: 8, text: '8' }, { value: 12, text: '12' },
    { value: 15, text: '15' }, { value: 30, text: '30' }, { value: 16, text: '16' },
    { value: 24, text: '24' }, { value: 120, text: 'per_page_many' }],
    notesSortOptions: [{ value: 'id', text: 'Id' }, { value: 'name', text: 'name' },
    { value: 'created_at', text: 'created_at' }, { value: 'updated_at', text: 'updated_at' }],
    notesPageSize: 15,
    notesSortBy: 'id',
    notesSortDirection: 'desc',

    toastMessage: '',
    navigations: [
      {
        to: { name: 'home' },
        text: 'home',
        exact: true,
        icon: 'home-icon'
      },
      {
        to: { name: 'notes' },
        text: 'notes',
        icon: 'hash-icon'
      },
      {
        to: { name: 'tags' },
        text: 'tags',
        icon: 'tag-icon'
      },
      {
        to: { name: 'settings' },
        text: 'settings',
        icon: 'codesandbox-icon'
      },
    ],
  };

  const mutations = {
    SET_ENDPOINT(state, payload) {
      state.endpoint = payload;
    },
    SET_REFRESH_TOKEN(state, payload) {
      const { expiresIn, refreshToken } = payload;
      setLocalStorageItem('refresh_token', refreshToken, expiresIn);
    },
    SET_ACCESS_TOKEN(state, payload) {
      const { expiresIn, accessToken } = payload;
      setLocalStorageItem('access_token', accessToken, expiresIn - 60);
    },
    SET_APP_LOADED(state, payload) {
      state.appLoaded = payload;
    },


    SET_NOTES_PAGE_SIZE(state, payload) {
      state.notesPageSize = payload;
    },
    SET_NOTES_SORT_BY(state, payload) {
      state.notesSortBy = payload;
    },
    SET_NOTES_SORT_ASC(state, payload) {
      state.notesSortDirection = payload;
    },


    SET_TOAST_MESSAGE(state, payload) {
      state.toastMessage = payload;
    },

  };

  const actions = {
    setEndpoint(context, payload) {
      const { commit } = context;
      commit('SET_ENDPOINT', payload);
    },
    setAppLoaded(context, payload) {
      const { commit } = context;
      commit('SET_APP_LOADED', payload);
    },
    setAccessToken(context, payload) {
      const { commit } = context;
      commit('SET_ACCESS_TOKEN', payload);
    },
    setRefreshToken(context, payload) {
      const { commit } = context;
      commit('SET_REFRESH_TOKEN', payload);
    },


    setNotesPageSize(context, payload) {
      const { commit } = context;
      commit('SET_NOTES_PAGE_SIZE', payload);
    },
    setNotesSortBy(context, payload) {
      const { commit } = context;
      commit('SET_NOTES_SORT_BY', payload);
    },
    setNotesSortDirection(context, payload) {
      const { commit } = context;
      commit('SET_NOTES_SORT_ASC', payload);
    },


    setToastMessage({ commit }, payload) {
      commit('SET_TOAST_MESSAGE', payload);
    },


    getAccessToken(context) {
      return new Promise(async resolve => {
        const { dispatch } = context;
        let accessToken = getLocalStorageItem('access_token');
        if (accessToken)
          resolve(accessToken);
        else
          resolve(await dispatch('refreshToken'));
      });
    },

    refreshToken(context) {
      const { commit, rootGetters } = context;
      const endpoint = rootGetters['appStore/getEndpoint'];
      const refreshToken = getLocalStorageItem('refresh_token');
      if (!refreshToken)
        return;

      return new Promise(resolve => {
        fetch(`${endpoint}/api/refresh_token`, {
          method: 'post', redirect: 'manual',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh_token: refreshToken })
        }).then(handleErrors)
          .then(json => {
            if (json && json.accessToken) {
              commit('SET_ACCESS_TOKEN', { accessToken: json.accessToken, expiresIn: json.accessTokenExpiresIn });
              if (json.refreshToken)
                commit('SET_REFRESH_TOKEN', { refreshToken: json.refreshToken, expiresIn: json.refreshTokenExpiresIn });
            }
            resolve(json && json.accessToken);
          }).catch(err => {
            console.log('Error refreshToken', err);
            resolve();
          });
      });
    },
  };

  const getters = {
    getEndpoint: (state) => {
      let endpoint = state.endpoint;
      if ((endpoint || '').length < 4)
        endpoint = '';

      return endpoint;
    },
    getAppLoaded: (state) => state.appLoaded,
    getDirectionOptions: (state) => state.directionOptions,

    getNotesPageSize: (state) => state.notesPageSize,
    getNotesPageOptions: (state) => state.notesPageOptions,
    getNotesSortOptions: (state) => state.notesSortOptions,
    getNotesSortDirection: (state) => state.notesSortDirection,
    getNotesSortBy: (state) => state.notesSortBy,

    getToastMessage: (state) => state.toastMessage,
    getNavigations: (state) => state.navigations,
  };

  if (!window.store)
    window.store = {};
  window.store.appStore = {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
  };

})();
