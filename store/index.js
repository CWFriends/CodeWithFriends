export const state = () => ({
  url: 'https://codewithfriends.io/',
  events: [],
  menus: {},
  defaults: {},
  socialMedia: [],
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
  },
}
