/*jshint esversion: 9 */

(function () {

  const handleErrors = window.handleErrors;
  // const sleep = window.sleep;
  const i18n = window.i18n;

  const state = {
    searchKeyword: null,
    notes: null,
    noteDetails: {},
    refreshList: null,
    totalNotes: 0,
    modalData: null,
    confirmDeleteNoteId: null,
    currentLoadNoteId: null,
    modalConfigPreview: null,

    errorLoadNotes: null,
    loadingNotes: false,
    needLogin: false,

    errorSaveNote: null,
    savingNote: false,
    saveNoteResult: null,

    updateNoteConfigResult: null,
    errorUpdateNoteConfig: null,
    updatingNoteConfig: false,

    deleteNoteResult: null,
    errorDeleteNote: null,
    deletingNote: false,

    importNotesResult: null,
    showModalImport: null,
    errorImportNotes: null,
    importingNotes: false,

    renameNoteResult: null,
    errorRenameNote: null,
    renameNoteId: null,
    renamingNote: false,
  };

  const mutations = {
    SET_SEARCH_KEYWORD(state, payload) {
      state.searchKeyword = payload;
    },
    SET_NEED_LOGIN(state, payload) {
      state.needLogin = payload;
    },
    SET_CURRENT_LOAD_NOTE_ID(state, payload) {
      state.currentLoadNoteId = payload;
    },
    SET_CONFIRM_DELETE_NOTE_ID(state, payload) {
      state.confirmDeleteNoteId = payload;
    },
    SET_RENAME_NOTE_ID(state, payload) {
      state.renameNoteId = payload;
    },
    SET_MODAL_DATA(state, payload) {
      state.modalData = payload;
    },
    SET_MODAL_CONFIG_PREVIEW(state, payload) {
      state.modalConfigPreview = payload ? { ...payload } : null;
    },
    SET_REFRESH_LIST(state, payload) {
      state.refreshList = payload;
    },


    SET_ERROR_LOAD_NOTES(state, payload) {
      state.errorLoadNotes = (payload && payload.message) ? payload.message : payload;
    },
    SET_LOADING_NOTES(state, payload) {
      state.loadingNotes = payload;
    },
    SET_NOTES(state, payload) {
      state.notes = payload;
    },
    SET_TOTAL_NOTES(state, payload) {
      state.totalNotes = payload;
    },


    SET_NOTE_CACHE(state, payload) {
      const id = payload.id;
      if (!state.noteDetails[id])
        state.noteDetails = { ...state.noteDetails, ...{ [id]: { ...payload } } };
      else
        state.noteDetails[id] = { ...state.noteDetails[id], ...payload };
    },
    DELETE_NOTE_CACHE(state, id) {
      delete state.noteDetails[id];
    },

    SET_SAVE_NOTE_RESULT(state, payload) {
      state.saveNoteResult = payload;
    },
    SET_ERROR_SAVE_NOTE(state, payload) {
      state.errorSaveNote = payload;
    },
    SET_SAVING_NOTE(state, payload) {
      state.savingNote = payload;
    },
    INTERNAL_UPDATE_DATA(state, payload) {
      if (!payload.id)
        return;

      const id = payload.id.toString();
      const notes = state.notes;
      const indx = notes.findIndex(n => n.id.toString() === id);
      if (indx !== -1) {
        notes[indx] = { ...notes[indx], ...payload };
        state.notes = [...notes];
      }
    },


    SET_UPDATE_NOTE_CONFIG_RESULT(state, payload) {
      state.updateNoteConfigResult = payload;
    },
    SET_ERROR_UPDATE_NOTE_CONFIG(state, payload) {
      state.errorUpdateNoteConfig = payload;
    },
    SET_UPDATING_NOTE_CONFIG(state, payload) {
      state.updatingNoteConfig = payload;
    },


    SET_ERROR_DELETE_NOTE(state, payload) {
      state.errorDeleteNote = payload;
    },
    SET_DELETING_NOTE(state, payload) {
      state.deletingNote = payload;
    },
    SET_DELETE_NOTE_RESULT(state, payload) {
      state.deleteNoteResult = payload;
    },


    SET_SHOW_MODAL_IMPORT(state, payload) {
      state.showModalImport = payload;
    },
    SET_ERROR_IMPORT_NOTES(state, payload) {
      state.errorImportNotes = payload;
    },
    SET_IMPORTING_NOTES(state, payload) {
      state.importingNotes = payload;
    },
    SET_IMPORT_NOTES_RESULT(state, payload) {
      state.importNotesResult = payload;
    },


    SET_ERROR_RENAME_NOTE(state, payload) {
      state.errorRenameNote = payload;
    },
    SET_RENAMING_NOTE(state, payload) {
      state.renamingNote = payload;
    },
    SET_RENAME_NOTE_RESULT(state, payload) {
      state.renameNoteResult = payload;
    },
  };

  const actions = {
    setModalData(context, payload) {
      const { commit } = context;
      commit('SET_MODAL_DATA', payload);
    },
    setNeedLogin(context, payload) {
      const { commit } = context;
      commit('SET_NEED_LOGIN', payload);
    },
    setSearchKeyword(context, payload) {
      const { commit } = context;
      commit('SET_SEARCH_KEYWORD', payload);
    },
    setConfirmDeleteNoteId(context, payload) {
      const { commit } = context;
      commit('SET_CONFIRM_DELETE_NOTE_ID', payload);
    },
    setModalConfigPreview(context, payload) {
      const { commit } = context;
      commit('SET_MODAL_CONFIG_PREVIEW', payload);
    },

    setRefreshList(context, payload) {
      const { commit } = context;
      commit('SET_REFRESH_LIST', payload);
    },
    loadNotes(context, payload) {
      const { commit, dispatch, rootGetters } = context;
      const endpoint = rootGetters['appStore/getEndpoint'];

      return new Promise(async resolve => {
        commit('SET_LOADING_NOTES', true);
        commit('SET_ERROR_LOAD_NOTES', null);
        commit('SET_NEED_LOGIN', null);
        commit('SET_NOTES', []);
        const accessToken = await dispatch('appStore/getAccessToken', null, { root: true });
        const { search = '', limit = '', current_page = 1, sort_field = '', tags = '', sort_direction = '' } = payload || {};
        const offset = limit * (current_page - 1);

        fetch(`${endpoint}/api/notes?search=${search}&limit=${limit}&offset=${offset}` +
          `&sort_field=${sort_field}&sort_direction=${sort_direction}&tags=${tags}`, {
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }).then(handleErrors)
          .then(result => {
            commit('SET_LOADING_NOTES', false);

            if (typeof (result) === 'object' && result.error_token)
              commit('SET_NEED_LOGIN', true);
            else {
              if (typeof (result) === 'object' && result.error)
                commit('SET_ERROR_LOAD_NOTES', result.error);
              else {
                const { notes = [], total = 0 } = result || {};
                commit('SET_NOTES', notes);
                commit('SET_TOTAL_NOTES', total);
              }
            }

            resolve();
          }).catch(err => {
            console.log('Error load notes', err);
            commit('SET_LOADING_NOTES', false);
            commit('SET_ERROR_LOAD_NOTES', err);

            resolve();
          });
      });
    },
    setTotalNotes(context, payload) {
      const { commit } = context;
      commit('SET_TOTAL_NOTES', payload);
    },

    createNote(context, payload) {
      const { dispatch } = context;
      delete payload.id;
      dispatch('saveNote', payload);
    },
    updateNote(context, payload) {
      const { dispatch } = context;
      dispatch('saveNote', payload);
    },
    saveNote(context, payload) {
      const { commit, dispatch, rootGetters } = context;
      const endpoint = rootGetters['appStore/getEndpoint'];

      return new Promise(async resolve => {
        commit('SET_SAVING_NOTE', true);
        commit('SET_ERROR_SAVE_NOTE', null);
        commit('SET_NEED_LOGIN', null);
        commit('SET_SAVE_NOTE_RESULT', null);
        const accessToken = await dispatch('appStore/getAccessToken', null, { root: true });
        const data = Object.assign({}, payload);
        const param = data.id;
        delete data.id;

        fetch(`${endpoint}/api/notes${param ? ('/' + param) : ''}`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(data)
        }).then(handleErrors)
          .then(result => {
            commit('SET_SAVING_NOTE', false);

            if (typeof (result) === 'object' && result.status === 404)
              result.error = result.status;
            if (typeof (result) === 'object' && result.error_token)
              commit('SET_NEED_LOGIN', true);
            else {
              if (typeof (result) === 'object' && result.error)
                commit('SET_ERROR_SAVE_NOTE', result.error);
              else {
                commit('INTERNAL_UPDATE_DATA', result);
                //save cache
                commit('SET_NOTE_CACHE', { id: result.id, name: payload.name, content: payload.content });
                commit('SET_SAVE_NOTE_RESULT', result);
              }
            }

            resolve();
          }).catch(err => {
            console.log('Error save note', err);
            commit('SET_SAVING_NOTE', false);
            commit('SET_ERROR_SAVE_NOTE', err);

            resolve();
          });
      });
    },
    setErrorSaveNote(context, payload) {
      const { commit } = context;
      commit('SET_ERROR_SAVE_NOTE', payload);
    },

    updateNoteConfig(context, config) {
      const { commit, getters, dispatch, rootGetters, state: { modalConfigPreview: { id } } } = context;
      const endpoint = rootGetters['appStore/getEndpoint'];
      const { name } = getters.getCacheNoteById(id) || {};

      return new Promise(async resolve => {
        commit('SET_UPDATING_NOTE_CONFIG', true);
        commit('SET_ERROR_UPDATE_NOTE_CONFIG', null);
        commit('SET_NEED_LOGIN', null);
        commit('SET_UPDATE_NOTE_CONFIG_RESULT', null);
        const accessToken = await dispatch('appStore/getAccessToken', null, { root: true });

        fetch(`${endpoint}/api/notes/${id}/config`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({ config })
        }).then(handleErrors)
          .then(result => {
            commit('SET_UPDATING_NOTE_CONFIG', false);

            if (typeof (result) === 'object' && result.error_token)
              commit('SET_NEED_LOGIN', true);
            else {
              if (typeof (result) === 'object' && result.error)
                commit('SET_ERROR_UPDATE_NOTE_CONFIG', result.error);
              else {
                commit('INTERNAL_UPDATE_DATA', { id, config });
                commit('SET_UPDATE_NOTE_CONFIG_RESULT', { name });
              }
            }

            resolve();
          }).catch(err => {
            console.log('Error update note config', err);
            commit('SET_UPDATING_NOTE_CONFIG', false);
            commit('SET_ERROR_UPDATE_NOTE_CONFIG', err);

            resolve();
          });
      });
    },

    deleteNote(context) {
      const { commit, dispatch, rootGetters, state: { confirmDeleteNoteId: id } } = context;
      const endpoint = rootGetters['appStore/getEndpoint'];

      return new Promise(async resolve => {
        commit('SET_DELETING_NOTE', true);
        commit('SET_ERROR_DELETE_NOTE', null);
        commit('SET_NEED_LOGIN', null);
        commit('SET_DELETE_NOTE_RESULT', null);
        const accessToken = await dispatch('appStore/getAccessToken', null, { root: true });

        fetch(`${endpoint}/api/notes/${id}`, {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }).then(handleErrors)
          .then(result => {
            commit('SET_DELETING_NOTE', false);

            if (typeof (result) === 'object' && result.error_token)
              commit('SET_NEED_LOGIN', true);
            else {
              if (typeof (result) === 'object' && result.error)
                commit('SET_ERROR_DELETE_NOTE', result.error);
              else {
                commit('SET_DELETE_NOTE_RESULT', { id });
                commit('DELETE_NOTE_CACHE', id);
              }
            }

            resolve();
          }).catch(err => {
            console.log('Error delete note', err);
            commit('SET_DELETING_NOTE', false);
            commit('SET_ERROR_DELETE_NOTE', err);

            resolve();
          });
      });
    },
    setErrorDeleteNote(context, payload) {
      const { commit } = context;
      commit('SET_ERROR_DELETE_NOTE', payload);
    },

    importNotes(context, payload) {
      const { commit, dispatch, rootGetters } = context;
      const endpoint = rootGetters['appStore/getEndpoint'];

      return new Promise(async resolve => {
        commit('SET_IMPORTING_NOTES', true);
        commit('SET_ERROR_IMPORT_NOTES', null);
        commit('SET_NEED_LOGIN', null);
        commit('SET_IMPORT_NOTES_RESULT', null);
        const accessToken = await dispatch('appStore/getAccessToken', null, { root: true });

        fetch(`${endpoint}/api/notes/import`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(payload)
        }).then(handleErrors)
          .then(result => {
            commit('SET_IMPORTING_NOTES', false);

            if (typeof (result) === 'object' && result.status === 411)
              result.message = 0;
            if (typeof (result) === 'object' && result.error_token)
              commit('SET_NEED_LOGIN', true);
            else {
              if (typeof (result) === 'object' && result.error)
                commit('SET_ERROR_IMPORT_NOTES', result.error);
              else
                commit('SET_IMPORT_NOTES_RESULT', result);
            }

            resolve();
          }).catch(err => {
            console.log('Error import notes', err);
            commit('SET_IMPORTING_NOTES', false);
            commit('SET_ERROR_IMPORT_NOTES', err);

            resolve();
          });
      });
    },
    setErrorImportNotes(context, payload) {
      const { commit } = context;
      commit('SET_ERROR_IMPORT_NOTES', payload);
    },
    setShowModalImport(context, payload) {
      const { commit } = context;
      commit('SET_SHOW_MODAL_IMPORT', payload);
    },

    setRenameNoteId(context, payload) {
      const { commit } = context;
      commit('SET_RENAME_NOTE_ID', payload);
    },
    renameNote(context, payload) {
      const { commit, dispatch, rootGetters, state: { renameNoteId: id } } = context;
      const endpoint = rootGetters['appStore/getEndpoint'];

      return new Promise(async resolve => {
        commit('SET_RENAMING_NOTE', true);
        commit('SET_ERROR_RENAME_NOTE', null);
        commit('SET_NEED_LOGIN', null);
        commit('SET_RENAME_NOTE_RESULT', null);
        const accessToken = await dispatch('appStore/getAccessToken', null, { root: true });

        fetch(`${endpoint}/api/notes/${id}/rename`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({ new_name: payload.new_name })
        }).then(handleErrors)
          .then(result => {
            commit('SET_RENAMING_NOTE', false);

            if (typeof (result) === 'object' && result.error_token)
              commit('SET_NEED_LOGIN', true);
            else {
              if (typeof (result) === 'object' && result.error)
                commit('SET_ERROR_RENAME_NOTE', result.error);
              else {
                commit('INTERNAL_UPDATE_DATA', { id, name: payload.new_name });
                commit('SET_RENAME_NOTE_RESULT', result);
              }
            }

            resolve();
          }).catch(err => {
            console.log('Error rename note', err);
            commit('SET_RENAMING_NOTE', false);
            commit('SET_ERROR_RENAME_NOTE', err);

            resolve();
          });
      });
    },

    setCurrentLoadNoteId(context, payload) {
      const { commit } = context;
      commit('SET_CURRENT_LOAD_NOTE_ID', payload);
    },
    setForceCloseModal(context) {
      const { commit, getters, state: { currentLoadNoteId: id } } = context;
      const isLoadingNote = getters.getLoadingNote(id);
      if (!isLoadingNote)
        return;
      commit('SET_NOTE_CACHE', { id, error: false, forceCloseModal: true });
    },
    setErrorLoadNote(context, id) {
      const { commit, state } = context;
      if (!id)
        id = state.currentLoadNoteId;
      commit('SET_NOTE_CACHE', { id, error: false, forceCloseModal: false });
    },
    loadNote(context, id) {
      const { commit, getters, dispatch, rootGetters } = context;
      const endpoint = rootGetters['appStore/getEndpoint'];
      commit('SET_CURRENT_LOAD_NOTE_ID', id);

      const isLoadingNote = getters.getLoadingNote(id);
      const loadingText = i18n.t('action.loading_detail')
      if (isLoadingNote) {
        commit('SET_MODAL_DATA', { id, name: loadingText, content: loadingText });
        commit('SET_NOTE_CACHE', { id, forceCloseModal: false });
        return;
      }

      let note = getters.getCacheDetailNote(id);
      if (note && note.content) {
        commit('SET_NOTE_CACHE', { id, forceCloseModal: false });
        const { content, name } = note;
        commit('SET_MODAL_DATA', { content, name, id });
        return;
      }
      note = getters.getCacheNoteById(id);

      return new Promise(async resolve => {
        const accessToken = await dispatch('appStore/getAccessToken', null, { root: true });
        commit('SET_NEED_LOGIN', null);
        commit('SET_NOTE_CACHE', { id, loading: true, error: false, forceCloseModal: false });
        commit('SET_MODAL_DATA', { id, name: loadingText, content: loadingText });

        fetch(`${endpoint}/api/notes/${id}`, {
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }).then(handleErrors)
          .then(result => {
            const status = { id, loading: false };
            const isForceCloseModal = getters.getForceCloseModal(id);
            if (typeof (result) === 'string') {
              if (!isForceCloseModal)
                commit('SET_MODAL_DATA', { id, name: note && note.name, content: result });

              //save cache
              commit('SET_NOTE_CACHE', { name: note && note.name, content: result, ...status });
            }
            else {
              if (typeof (result) === 'object') {
                if (result.error_token)
                  commit('SET_NEED_LOGIN', true);
                else if (result.error)
                  status.error = result.error;
                else if (result.status === 404)
                  status.error = 404;
                else if (result.status === 500)
                  status.error = result.error;
              }
              if (!isForceCloseModal)
                commit('SET_MODAL_DATA', { id, name: note && note.name, content: '' });
              commit('SET_NOTE_CACHE', status);
            }

            resolve();
          }).catch(err => {
            console.log('Error load note', err);
            commit('SET_NOTE_CACHE', { id, error: err.message, loading: false });

            resolve();
          });
      });
    },
    downloadNotes(context, type) {
      const { dispatch, rootGetters } = context;
      const endpoint = rootGetters['appStore/getEndpoint'];

      return new Promise(async resolve => {
        const accessToken = await dispatch('appStore/getAccessToken', null, { root: true });
        fetch(`${endpoint}/api/notes/export?format=${type}`, {
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
    getSearchKeyword: (state) => state.searchKeyword,
    getModalData: (state) => state.modalData,
    getModalConfigPreview: (state) => state.modalConfigPreview,
    getConfirmDeleteNoteId: (state) => state.confirmDeleteNoteId,
    getCurrentLoadNoteId: (state) => state.currentLoadNoteId,

    getErrorLoadNotes: (state) => state.errorLoadNotes,
    getLoadingNotes: (state) => state.loadingNotes,
    getNotes: (state) => state.notes,
    getTotalNotes: (state) => state.totalNotes,
    getRefreshList: (state) => state.refreshList,

    getErrorSaveNote: (state) => state.errorSaveNote,
    getSavingNote: (state) => state.savingNote,
    getSaveNoteResult: (state) => state.saveNoteResult,

    getUpdateNoteConfigResult: (state) => state.updateNoteConfigResult,
    getUpdatingNoteConfig: (state) => state.updatingNoteConfig,
    getErrorUpdateNoteConfig: (state) => state.errorUpdateNoteConfig,

    getDeleteNoteResult: (state) => state.deleteNoteResult,
    getDeletingNote: (state) => state.deletingNote,
    getErrorDeleteNote: (state) => state.errorDeleteNote,

    getImportNotesResult: (state) => state.importNotesResult,
    getImportingNotes: (state) => state.importingNotes,
    getShowModalImport: (state) => state.showModalImport,
    getErrorImportNotes: (state) => state.errorImportNotes,

    getRenameNoteResult: (state) => state.renameNoteResult,
    getRenamingNote: (state) => state.renamingNote,
    getErrorRenameNote: (state) => state.errorRenameNote,
    getRenameNoteId: (state) => state.renameNoteId,

    getCacheNoteById: (state) => (id) => {
      if (!Array.isArray(state.notes))
        return;

      if (!id)
        id = state.currentLoadNoteId;
      if (!id)
        return;
      id = id.toString();
      return state.notes.find(n => n.id.toString() == id);
    },
    getErrorLoadNote: (state) => (id) => {
      if (!state.noteDetails)
        return;
      if (!id)
        id = state.currentLoadNoteId;
      if (!id)
        return;
      return state.noteDetails[id] && state.noteDetails[id].error;
    },
    getLoadingNote: (state) => (id) => {
      if (!state.noteDetails)
        return;
      if (!id)
        id = state.currentLoadNoteId;
      if (!id)
        return;
      return state.noteDetails[id] && state.noteDetails[id].loading;
    },
    getForceCloseModal: (state) => (id) => {
      if (!state.noteDetails)
        return;
      if (!id)
        id = state.currentLoadNoteId;
      if (!id)
        return;
      return state.noteDetails[id] && state.noteDetails[id].forceCloseModal;
    },
    getCacheDetailNote: (state) => (id) => {
      if (!state.noteDetails || !id)
        return;

      let note = state.noteDetails[id.toString()];
      if (!note && Array.isArray(state.notes) && state.notes.length > 0)
        note = state.notes.find(n => n.id.toString() === id.toString());

      return note;
    },
    getCacheNoteInfo: (state) => (id) => {
      if (!Array.isArray(state.notes))
        return;

      if (!id)
        id = state.confirmDeleteNoteId;
      if (!id)
        return;

      id = id.toString();
      return state.notes.find(n => n.id.toString() === id);
    },
  };

  if (!window.store)
    window.store = {};
  window.store.noteStore = {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
  };

})();
