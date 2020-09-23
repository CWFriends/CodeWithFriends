export const state = () => ({
  url: 'https://codewithfriends.io/',
  events: [],
  menus: {},
  defaults: {},
  socialMedia: [],
  users: [],
})

export const mutations = {
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
  setUsers(state, users) {
    state.users = users
  },
}

export const actions = {
  async nuxtServerInit({ commit, dispatch }, { $content, $fireStore }) {
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

    await $fireStore
      .collection('users')
      .get()
      .then((docs) => {
        const userList = []

        docs.forEach((doc) => {
          userList.push({ ...doc.data(), uid: doc.id })
        })

        commit('setUsers', userList)
      })
  },
}
