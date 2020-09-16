export const state = () => ({
  url: 'https://codewithfriends.io/',
  user: {
    loading: true,
    loggedIn: false,
    data: null,
  },
  menus: {},
  defaults: {},
  socialMedia: [],
  events: [],
  userList: [],
  signups: [],
})

export const mutations = {
  setUser(state, user) {
    state.user.loggedIn = true
    state.user.data = user
  },
  removeUser(state) {
    state.user.loggedIn = false
    state.user.data = null
  },
  setMenus(state, menus) {
    state.menus = menus
  },
  setDefaults(state, defaults) {
    state.defaults = defaults
  },
  setSocialMedia(state, socialMedia) {
    state.socialMedia = socialMedia
  },
  setEvents(state, events) {
    state.events = events
  },
  setUserList(state, list) {
    state.userList = list
  },
  stopUserLoading(state) {
    state.user.loading = false
  },
  setSignups(state, list) {
    state.signups = list
  },
}

export const actions = {
  stopUserLoading({ commit }) {
    commit('stopUserLoading')
  },
  async getUserData({ commit, dispatch }, user) {
    const userData = await this.$fireStore
      .collection('users')
      .doc(user.uid)
      .get()
    commit('setUser', { uid: user.uid, ...userData.data() })
    dispatch('getUsers')
  },
  async nuxtServerInit({ commit }, { $content }) {
    // Fetch the header and footer menus
    const menus = await $content('settings', 'menus').fetch()

    const footerMenuSlugs = menus['footer-menu'].map(({ page }) => page)
    const headerMenuSlugs = menus['header-menu'].map(({ page }) => page)

    const footerPages = await $content('static-page')
      .where({
        slug: { $in: footerMenuSlugs },
      })
      .fetch()

    const headerPages = await $content('static-page')
      .where({
        slug: { $in: headerMenuSlugs },
      })
      .fetch()

    commit('setMenus', {
      footer: footerPages,
      header: headerPages,
    })

    // Fetch the site default settings and events
    const defaults = await $content('settings', 'default-content').fetch()
    commit('setDefaults', defaults)

    const socialMedia = await $content('settings', 'social-media').fetch()
    commit('setSocialMedia', socialMedia['social-media-items'])

    const events = await $content('events').sortBy('start-date').fetch()
    commit('setEvents', events)
  },
  async getUsers({ commit }) {
    const userList = []
    const users = await this.$fireStore.collection('users').get()

    users.forEach((doc) => {
      userList.push({ ...doc.data(), uid: doc.id })
    })
    commit('setUserList', userList)
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
        dispatch('getUsers')

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
  async submitForm({ state }, data) {
    const signupInfo = {
      ...data,
      user: state.user.data.uid,
    }

    return await this.$fireStore.collection('signups').add(signupInfo)
  },
  getSignups({ commit }) {
    this.$fireStore.collection('signups').onSnapshot((docSnapshot) => {
      const signupList = []

      docSnapshot.forEach((doc) => {
        signupList.push({ ...doc.data(), uid: doc.id })
      })
      commit('setSignups', signupList)
    })
  },
}
