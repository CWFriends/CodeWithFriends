export const state = () => ({
  event: '',
  users: [],
  signups: [],
  submissions: [],
})

export const mutations = {
  setEvent(state, event) {
    state.event = event
  },
  setUsers(state, users) {
    state.users = users
  },
  setSignups(state, signups) {
    state.signups = signups
  },
  setSubmissions(state, submissions) {
    state.submissions = submissions
  },
}

export const actions = {
  async getEventData({ commit, dispatch }, event) {
    commit('setEvent', event)
    commit('setUsers', [])
    commit('setSignups', [])
    commit('setSubmissions', [])
    await dispatch('getSignups')
    await dispatch('getSubmissions')
  },
  async submitSignup(ctx, data) {
    const doc = await this.$fireStore.collection('signups').add(data)
    return this.$fireFunc.httpsCallable('addSignup')({
      id: doc.id,
    })
  },
  async submitProject({ state }, data) {
    if (data.image) {
      await this.$fireStorage
        .ref()
        .child(data.event + '/' + data.repoId + data.image.name)
        .put(data.image)
        .then((snapshot) => snapshot.ref.getDownloadURL())
        .then((downloadURL) => {
          data.image = downloadURL
        })
    } else {
      data.image = ''
    }

    const doc = await this.$fireStore.collection('submissions').add(data)
    return this.$fireFunc.httpsCallable('addSubmission')({
      id: doc.id,
    })
  },
  async getUsers({ commit }, signupList) {
    if (signupList.length === 0) return

    await this.$fireStore
      .collection('users')
      .where(this.$fireStoreObj.FieldPath.documentId(), 'in', signupList)
      .get()
      .then((docs) => {
        const userList = []

        docs.forEach((doc) => {
          userList.push({ ...doc.data(), uid: doc.id })
        })
        commit('setUsers', userList)
      })
  },
  async getSignups({ state, dispatch, commit }) {
    await this.$fireStore
      .collection('signups')
      .where('event', '==', state.event)
      .onSnapshot((docSnapshot) => {
        const userList = []
        const signupList = []

        docSnapshot.forEach((doc) => {
          userList.push(doc.data().user)
          signupList.push(doc.data())
        })
        commit('setSignups', signupList)
        dispatch('getUsers', userList)
      })
  },
  async getSubmissions({ state, commit }) {
    await this.$fireStore
      .collection('submissions')
      .where('event', '==', state.event)
      .onSnapshot((docSnapshot) => {
        const submissionsList = []

        docSnapshot.forEach((doc) => {
          submissionsList.push({ ...doc.data(), uid: doc.id })
        })
        commit('setSubmissions', submissionsList)
      })
  },
}
