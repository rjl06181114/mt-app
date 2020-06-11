  const state = () => ({
      menu: [],
      hotPlace: [],

  })
  const mutations = {
      setMenu(state, val) {
          state.menu = val
      },
      setHotSpace(state, val) {
          state.hotPlace = val
      }
  }
  const actions = {
      setMenu: ({ commit }, menu) => {
          commit('setMenu', menu)
      },
      setHotSpace: ({ commit }, hotPlace) => {
          commit('  setHotSpace', hotPlace)
      }
  }
  export default {
      namespaced: true,
      state,
      mutations,
      actions
  }