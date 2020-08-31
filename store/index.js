import { vuexfireMutations /* firestoreAction */ } from 'vuexfire'

import firebase from 'firebase/app'
import 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBe2FugVYTRdOTdcJir_Q0__GHD0su3kcY',
  authDomain: 'code-with-friends.firebaseapp.com',
  databaseURL: 'https://code-with-friends.firebaseio.com',
  projectId: 'code-with-friends',
  storageBucket: 'code-with-friends.appspot.com',
  messagingSenderId: '699377183793',
  appId: '1:699377183793:web:d3cfd25e266f2ecccc3910',
}

// Initialize Firebase
const firebaseApp =
  firebase.apps.length > 0 ? firebase : firebase.initializeApp(firebaseConfig)
const db = firebaseApp.firestore()

export const state = () => ({
  user: {
    loggedIn: false,
    data: null,
  },
})

export const mutations = {
  ...vuexfireMutations,
  setUser(state, user) {
    state.user.loggedIn = true
    state.user.data = user
  },
  removeUser(state) {
    state.user.loggedIn = false
    state.user.data = null
  },
}

export const actions = {
  async getUserData({ commit, dispatch }, user) {
    const userData = await db.collection('users').doc(user.uid).get()
    commit('setUser', userData.data())
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
        db.collection('users')
          .doc(user.uid)
          .set(res.data)
          .catch(() => {
            dispatch('logOut')
          })
      })
  },
  logOut({ commit }) {
    firebaseApp
      .auth()
      .signOut()
      .then(() => commit('removeUser'))
  },
}
