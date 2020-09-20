export const state = () => ({
  loading: true,
  loggedIn: false,
  data: null,
  repos: [],
})

export const mutations = {
  setUser(state, user) {
    state.loggedIn = true
    state.data = user
  },
  removeUser(state) {
    state.loggedIn = false
    state.data = null
  },
  stopUserLoading(state) {
    state.loading = false
  },
  setRepos(state, repos) {
    state.repos = repos
  },
}

export const actions = {
  async getUserData({ commit, dispatch }, user) {
    const userData = await this.$fireStore
      .collection('users')
      .doc(user.uid)
      .get()
    commit('setUser', { uid: user.uid, ...userData.data() })
    dispatch('getRepos')
  },
  stopUserLoading({ commit }) {
    commit('stopUserLoading')
  },
  logIn({ commit, dispatch }, { user, token }) {
    this.$axios
      .get('https://api.github.com/user', {
        headers: {
          Authorization: 'token ' + token,
        },
      })
      .then((res) => {
        commit('setUser', { uid: user.uid, ...res.data })
        dispatch('getRepos')

        this.$fireStore
          .collection('users')
          .doc(user.uid)
          .set(res.data)
          .catch(() => {
            dispatch('logOut')
          })
      })
  },
  logOut({ commit }) {
    this.$fireAuth.signOut().then(() => commit('removeUser'))
  },
  getRepos({ state, commit }) {
    this.$axios.get(state.data.repos_url).then((res) => {
      commit('setRepos', res.data)
    })
  },
}
