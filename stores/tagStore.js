/*jshint esversion: 9 */

(function () {

  const handleErrors = window.handleErrors;
  // const sleep = window.sleep;

  const state = {
    refreshList: null,
    tags: [],
    selectedTagId: null,
    addAction: null,

    errorLoadTags: null,
    loadingTags: false,
    needLogin: false,

    errorSaveTag: null,
    savingTag: false,
    saveTagResult: null,

    deleteTagResult: null,
    errorDeleteTag: null,
    deletingTag: false,

    importTagsResult: null,
    showModalImport: null,
    errorImportTags: null,
    importingTags: false,

  };

  const mutations = {
    SET_NEED_LOGIN(state, payload) {
      state.needLogin = payload;
    },
    SET_SELECTED_TAG_ID(state, payload) {
      state.selectedTagId = payload;
    },


    SET_ERROR_LOAD_TAGS(state, payload) {
      state.errorLoadTags = payload && payload.error ? payload.error : payload;
    },
    SET_LOADING_TAGS(state, payload) {
      state.loadingTags = payload;
    },
    SET_TAGS(state, payload) {
      state.tags = payload;
    },

    SET_SAVE_TAG_RESULT(state, payload) {
      state.saveTagResult = payload;
    },
    SET_ERROR_SAVE_TAG(state, payload) {
      state.errorSaveTag = payload && payload.error ? payload.error : payload;
    },
    SET_SAVING_TAG(state, payload) {
      state.savingTag = payload;
    },


    SET_ERROR_DELETE_TAG(state, payload) {
      state.errorDeleteTag = payload && payload.error ? payload.error : payload;
    },
    SET_DELETING_TAG(state, payload) {
      state.deletingTag = payload;
    },
    SET_DELETE_TAG_RESULT(state, payload) {
      state.deleteTagResult = payload;
    },
    REMOVE_SELECTED_TAG(state) {
      if (!state.selectedTagId)
        return;

      const indx = state.tags.findIndex(t => t.id.toString() === state.selectedTagId.toString());
      if (indx < 0)
        return;

      state.tags.splice(indx, 1);
      state.selectedTagId = '';
    },

    ADD_TEMPORATORY_TAG(state, action) {
      state.tags[action]({
        id: `t-${(new Date()).valueOf()}`,
        name: ''
      });
    },
    ADD_ACTION(state, action) {
      state.addAction = action;
    },


    INTERNAL_UPDATE_DATA(state, payload) {
      const tags = state.tags;
      let id = null;
      if (payload.tempId) {
        id = payload.tempId;
        delete payload.tempId;
      } else
        id = payload.id.toString();
      const indx = tags.findIndex(n => n.id.toLowerCase() === id);
      if (indx !== -1) {
        tags[indx] = { ...tags[indx], ...payload };
        state.tags = [...tags];
      }
    },


    SET_SHOW_MODAL_IMPORT(state, payload) {
      state.showModalImport = payload;
    },
    SET_ERROR_IMPORT_TAGS(state, payload) {
      state.errorImportTags = payload;
    },
    SET_IMPORTING_TAGS(state, payload) {
      state.importingTags = payload;
    },
    SET_IMPORT_TAGS_RESULT(state, payload) {
      state.importTagsResult = payload;
    },
    SET_REFRESH_LIST(state, payload) {
      state.refreshList = payload;
    },
  };

  const actions = {
    setNeedLogin(context, payload) {
      const { commit } = context;
      commit('SET_NEED_LOGIN', payload);
    },
    setRefreshList(context, payload) {
      const { commit } = context;
      commit('SET_REFRESH_LIST', payload);
    },
    loadTags(context, payload) {
      const { commit, dispatch, rootGetters } = context;
      const endpoint = rootGetters['appStore/getEndpoint'];

      return new Promise(async resolve => {
        commit('SET_LOADING_TAGS', true);
        commit('SET_ERROR_LOAD_TAGS', null);
        commit('SET_NEED_LOGIN', null);
        commit('SET_TAGS', []);
        const accessToken = await dispatch('appStore/getAccessToken', null, { root: true });

        fetch(`${endpoint}/api/tags`, {
          method: 'get', redirect: 'manual',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }).then(handleErrors)
          .then(result => {
            commit('SET_LOADING_TAGS', false);

            if (typeof (result) === 'object' && result.error_token)
              commit('SET_NEED_LOGIN', true);
            else {
              if (typeof (result) === 'object' && result.error)
                commit('SET_ERROR_LOAD_TAGS', result.error);
              else {
                commit('SET_TAGS', result);
              }
            }

            resolve();
          }).catch(err => {
            console.log('Error load tags', err);
            commit('SET_LOADING_TAGS', false);
            commit('SET_ERROR_LOAD_TAGS', err);

            resolve();
          });
      });
    },
    setErrorSaveTag(context, payload) {
      const { commit } = context;
      commit('SET_ERROR_SAVE_TAG', payload);
    },
    addTemporatoryTag(context, action) {
      const { commit } = context;
      commit('ADD_TEMPORATORY_TAG', action);
      commit('ADD_ACTION', action);
    },
    setAddAction(context, payload) {
      const { commit } = context;
      commit('ADD_ACTION', payload);
    },
    setSelectedTagId(context, payload) {
      const { commit } = context;
      commit('SET_SELECTED_TAG_ID', payload);
    },
    setDeletingTag(context, payload) {
      const { commit } = context;
      commit('SET_DELETING_TAG', payload);
    },
    saveTag(context, payload) {
      const { commit, dispatch, rootGetters } = context;
      const endpoint = rootGetters['appStore/getEndpoint'];
      let { name, enabled = false, id, tempId = '' } = payload;
      const isTemporatory = id.indexOf('t-') === 0;
      if (isTemporatory) {
        tempId = id;
        id = null;
      }

      return new Promise(async resolve => {
        commit('SET_SAVING_TAG', true);
        commit('SET_ERROR_SAVE_TAG', null);
        commit('SET_NEED_LOGIN', null);
        commit('SET_SAVE_TAG_RESULT', null);
        const accessToken = await dispatch('appStore/getAccessToken', null, { root: true });

        fetch(`${endpoint}/api/tags`, {
          method: 'post', redirect: 'manual',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({ name, enabled, id })
        }).then(handleErrors)
          .then(result => {
            commit('SET_SAVING_TAG', false);

            if (typeof (result) === 'object' && !result.error_token) {
              if (result.error)
                commit('SET_ERROR_SAVE_TAG', result.error);
              else {
                if (isTemporatory)
                  result.tempId = tempId;
                commit('SET_SAVE_TAG_RESULT', result);
                commit('INTERNAL_UPDATE_DATA', result);
              }
            }
            resolve(result);
          }).catch(err => {
            console.log('Error save tag', err);
            commit('SET_SAVING_TAG', false);
            commit('SET_ERROR_SAVE_TAG', err);

            resolve({ error: err.message });
          });
      });
    },
    deleteTag(context) {
      const { commit, getters, dispatch, rootGetters } = context;
      const endpoint = rootGetters['appStore/getEndpoint'];
      const tag = getters.getSelectedTag;
      const isTemporatory = tag.id.indexOf('t-') === 0;

      if (!tag.id) {
        commit('SET_DELETE_TAG_RESULT', {});
        return;
      } else if (isTemporatory) {
        commit('SET_DELETE_TAG_RESULT', true);
        commit('REMOVE_SELECTED_TAG');
        return;
      }

      return new Promise(async resolve => {
        commit('SET_DELETING_TAG', true);
        commit('SET_ERROR_DELETE_TAG', null);
        commit('SET_NEED_LOGIN', null);
        commit('SET_DELETE_TAG_RESULT', null);
        const accessToken = await dispatch('appStore/getAccessToken', null, { root: true });

        fetch(`${endpoint}/api/tags/${tag.id}`, {
          method: 'delete', redirect: 'manual',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }).then(handleErrors)
          .then(result => {
            commit('SET_DELETING_TAG', false);

            if (typeof (result) === 'object' && result.error_token)
              commit('SET_NEED_LOGIN', true);
            else {
              if (typeof (result) === 'object' && result.error)
                commit('SET_ERROR_DELETE_TAG', result.error);
              else {
                commit('SET_DELETE_TAG_RESULT', { id: !isTemporatory && tag.id });
                commit('REMOVE_SELECTED_TAG');
              }
            }

            resolve();
          }).catch(err => {
            console.log('Error delete tag', err);
            commit('SET_DELETING_TAG', false);
            commit('SET_ERROR_DELETE_TAG', err);

            resolve();
          });
      });
    },


    importTags(context, payload) {
      const { commit, dispatch, rootGetters } = context;
      const endpoint = rootGetters['appStore/getEndpoint'];

      return new Promise(async resolve => {
        commit('SET_IMPORTING_TAGS', true);
        commit('SET_ERROR_IMPORT_TAGS', null);
        commit('SET_NEED_LOGIN', null);
        commit('SET_IMPORT_TAGS_RESULT', null);
        const accessToken = await dispatch('appStore/getAccessToken', null, { root: true });

        fetch(`${endpoint}/api/tags/import`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(payload)
        }).then(handleErrors)
          .then(result => {
            commit('SET_IMPORTING_TAGS', false);

            if (typeof (result) === 'object' && result.status === 411)
              result.message = 0;
            if (typeof (result) === 'object' && result.error_token)
              commit('SET_NEED_LOGIN', true);
            else {
              if (typeof (result) === 'object' && result.error)
                commit('SET_ERROR_IMPORT_TAGS', result.error);
              else
                commit('SET_IMPORT_TAGS_RESULT', result);
            }

            resolve();
          }).catch(err => {
            console.log('Error import tags', err);
            commit('SET_IMPORTING_TAGS', false);
            commit('SET_ERROR_IMPORT_TAGS', err);

            resolve();
          });
      });
    },
    setErrorImportTags(context, payload) {
      const { commit } = context;
      commit('SET_ERROR_IMPORT_TAGS', payload);
    },
    setShowModalImport(context, payload) {
      const { commit } = context;
      commit('SET_SHOW_MODAL_IMPORT', payload);
    },
    downloadTags(context, type) {
      const { dispatch, rootGetters } = context;
      const endpoint = rootGetters['appStore/getEndpoint'];

      return new Promise(async resolve => {
        const accessToken = await dispatch('appStore/getAccessToken', null, { root: true });
        fetch(`${endpoint}/api/tags/export?format=${type}`, {
          redirect: 'manual', headers: {
            Authorization: `Bearer ${accessToken}`
          },
        }).then(async res => {
          const disposition = res.headers.get('Content-Disposition');
          let fileName = disposition.split(/;(.+)/)[1].split(/=(.+)/)[1];
          if (fileName.toLowerCase().startsWith("utf-8''"))
            fileName = decodeURIComponent(fileName.replace("utf-8''", ''));
          else
            fileName = fileName.replace(/['"]/g, '');

          resolve([fileName, await res.blob()]);
        }).catch((ex) => {
          console.log('Error download', ex);
          resolve([]);
        });
      });
    },
  };

  const getters = {
    getNeedLogin: (state) => state.needLogin,
    getAddAction: (state) => state.addAction,

    getSelectedTag: (state) => {
      if (!state.selectedTagId || !Array.isArray(state.tags) || state.tags.length === 0)
        return;

      return state.tags.find(w => w.id.toString() === state.selectedTagId.toString());
    },

    getCachedTags: (state) => (onlyHasId = false) => {
      if (!Array.isArray(state.tags))
        return [];

      if (onlyHasId)
        return state.tags.filter(t => t.id.toString().toLowerCase().indexOf('t-') === -1);
      else
        return state.tags;
    },
    getErrorLoadTags: (state) => state.errorLoadTags,
    getLoadingTags: (state) => state.loadingTags,

    getErrorSaveTag: (state) => state.errorSaveTag,
    getSavingTag: (state) => state.savingTag,
    getSaveTagResult: (state) => state.saveTagResult,

    getDeleteTagResult: (state) => state.deleteTagResult,
    getDeletingTag: (state) => state.deletingTag,
    getErrorDeleteTag: (state) => state.errorDeleteTag,

    getImportTagsResult: (state) => state.importTagsResult,
    getImportingTags: (state) => state.importingTags,
    getShowModalImport: (state) => state.showModalImport,
    getErrorImportTags: (state) => state.errorImportTags,
    getRefreshList: (state) => state.refreshList,
  };

  if (!window.store)
    window.store = {};
  window.store.tagStore = {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
  };

})();
