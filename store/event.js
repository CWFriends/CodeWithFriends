export const state = () => ({
  event: '',
  data: {},
  submissionsPreview: [],
  submissions: [],
})

export const mutations = {
  setEvent(state, event) {
    state.event = event
  },
  setData(state, data) {
    state.data = data
  },
  setSubmissionPreview(state, submissions) {
    state.submissionsPreview = submissions
  },
  setSubmissions(state, submissions) {
    state.submissions = submissions
  },
}

export const actions = {
  async getEventData({ commit, dispatch, state }, { event, submissions }) {
    if (event === state.event) return
    commit('setEvent', event)
    commit('setData', {})
    commit('setSubmissionPreview', [])

    await dispatch('getEventDetails')
    await dispatch('getSubmissionsPreview')

    if (submissions) {
      await dispatch('getSubmissions')
    }
  },
  async submitSignup({ rootState }, data) {
    const eventRef = this.$fireStore.collection('events').doc(data.event)

    await this.$fireStore.runTransaction(async (t) => {
      const event = (await t.get(eventRef)).data()

      const users = event?.users || []
      const usersData = event?.usersData || []

      await t.set(
        eventRef,
        {
          signupsCount: users.length + 1,
          users: [...users, data.user],
          usersData: [
            ...usersData,
            {
              uid: data.user,
              avatar_url: rootState.user.data.avatar_url,
              name: rootState.user.data.name,
              html_url: rootState.user.data.html_url,
            },
          ],
        },
        {
          merge: true,
        }
      )
    })

    const signup = await this.$fireStore.collection('signups').add(data)
    return this.$fireFunc.httpsCallable('addSignup')({
      id: signup.id,
    })
  },
  async submitProject({ state, commit }, data) {
    if (data.image) {
      await this.$fireStorage
        .ref()
        .child(data.event + '/' + data.repoId + data.user + data.image.name)
        .put(data.image)
        .then((snapshot) => snapshot.ref.getDownloadURL())
        .then((downloadURL) => {
          data.image = downloadURL
        })
    } else {
      data.image = ''
    }

    const submissionRef = await this.$fireStore
      .collection('events')
      .doc(data.event)

    await this.$fireStore.runTransaction(async (t) => {
      const submission = (await t.get(submissionRef)).data()

      await t.set(
        submissionRef,
        {
          submissionsCount: (submission.submissionsCount || 0) + 1,
        },
        {
          merge: true,
        }
      )
    })

    const submission = await this.$fireStore.collection('submissions').add(data)

    return this.$fireFunc.httpsCallable('addSubmission')({
      id: submission.id,
    })
  },

  async getEventDetails({ state, commit }) {
    await this.$fireStore
      .collection('events')
      .doc(state.event)
      .onSnapshot((doc) => {
        commit('setData', doc.data())
      })
  },
  async getSubmissionsPreview({ state, commit }) {
    await this.$fireStore
      .collection('submissions')
      .where('event', '==', state.event)
      .limit(3)
      .onSnapshot((submissions) => {
        const submissionsList = []

        submissions.forEach((doc) => {
          submissionsList.push({ ...doc.data(), uid: doc.id })
        })

        commit('setSubmissionPreview', submissionsList)
      })
  },
  async getSubmissions({ state, commit }) {
    await this.$fireStore
      .collection('submissions')
      .where('event', '==', state.event)
      .onSnapshot((submissions) => {
        const submissionsList = []

        submissions.forEach((doc) => {
          submissionsList.push({ ...doc.data(), uid: doc.id })
        })

        commit('setSubmissions', submissionsList)
      })
  },
  async updateEventUsers(ctx) {
    const eventData = await this.$fireStore
      .collection('events')
      .where('users', 'array-contains', ctx.rootState.user.data.uid)
      .get()

    eventData.forEach((doc) => {
      const usersData = doc.data().usersData
      const userIndex = usersData.findIndex(
        ({ uid }) => uid === ctx.rootState.user.data.uid
      )
      usersData[userIndex] = {
        uid: ctx.rootState.user.data.uid,
        avatar_url: ctx.rootState.user.data.avatar_url,
        name: ctx.rootState.user.data.name,
        login: ctx.rootState.user.data.login,
        html_url: ctx.rootState.user.data.html_url,
      }

      this.$fireStore.collection('events').doc(doc.id).update({
        usersData,
      })
    })
  },
}
