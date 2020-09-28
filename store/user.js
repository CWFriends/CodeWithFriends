export const state = () => ({
  loading: true,
  loggedIn: false,
  data: null,
  repos: [],
  submissions: [],
  signups: [],
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
  setSubmissions(state, submissions) {
    state.submissions = submissions
  },
  setSignups(state, signups) {
    state.signups = signups
  },
}

export const actions = {
  async getUserData({ commit, dispatch }, user) {
    const userCache = localStorage.getItem('user')

    if (userCache) {
      const userData = JSON.parse(userCache)
      commit('setUser', { uid: user.uid, ...userData })
    } else {
      const userData = await this.$fireStore
        .collection('users')
        .doc(user.uid)
        .get()
      commit('setUser', { uid: user.uid, ...userData.data() })
      localStorage.setItem('user', JSON.stringify(userData.data()))
    }

    dispatch('getRepos')
    dispatch('getSubmissions')
    dispatch('getSignups')
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
        localStorage.setItem('user', JSON.stringify(res.data))
        commit('setUser', { uid: user.uid, ...res.data })
        dispatch('event/updateEventUsers', null, { root: true })
        dispatch('getRepos')
        dispatch('getSubmissions')
        dispatch('getSignups')

        this.$fireStore
          .collection('users')
          .doc(user.uid)
          .set(res.data)
          .catch(() => {
            dispatch('logOut')
          })
      })
  },
  async getSubmissions({ commit, state }) {
    await this.$fireStore
      .collection('submissions')
      .where('user', '==', state.data.uid)
      .onSnapshot((doc) => {
        const submissionsList = []

        doc.forEach((submission) => {
          submissionsList.push(submission.data())
        })

        commit('setSubmissions', submissionsList)
      })
  },
  async getSignups({ commit, state }) {
    await this.$fireStore
      .collection('signups')
      .where('user', '==', state.data.uid)
      .onSnapshot((doc) => {
        const signupsList = []

        doc.forEach((signup) => {
          signupsList.push(signup.data())
        })

        commit('setSignups', signupsList)
      })
  },
  logOut({ commit }) {
    this.$fireAuth.signOut().then(() => commit('removeUser'))
  },
  getRepos({ state, commit }) {
    this.$axios
      .get(state.data.repos_url)
      .then((res) => {
        commit('setRepos', res.data)
      })
      .catch((err) => {
        throw err
      })
  },
}
