export const state = () => ({
  user: {
    loggedIn: false,
    data: null,
  },
  menus: {},
  defaults: {},
  socialMedia: {},
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
}

export const actions = {
  async getUserData({ commit, dispatch }, user) {
    const userData = await this.$fireStore
      .collection('users')
      .doc(user.uid)
      .get()
    commit('setUser', userData.data())
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

    // Fetch the site default settings
    const defaults = await $content('settings', 'default-content').fetch()
    commit('setDefaults', defaults)
  },
  logIn({ commit, dispatch }, { user, token }) {
    this.$axios
      .get('https://api.github.com/user', {
        headers: {
          Authorization: 'token ' + token,
        },
      })
      .then((res) => {
        commit('setUser', res.data)
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
}
