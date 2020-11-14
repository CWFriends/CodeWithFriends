const functions = require('firebase-functions')
const { GoogleSpreadsheet } = require('google-spreadsheet')
const admin = require('firebase-admin')

const devEnv = functions.firebaseConfig().projectId === 'code-with-friends-dev'
const algoliaSearch = require('algoliasearch')

const credentials = devEnv
  ? require('./service-account-dev.json')
  : require('./service-account.json')

const ALGOLIA_ID = functions.config().algolia.app_id
const ALGOLIA_ADMIN_KEY = functions.config().algolia.admin_key

const algolia = algoliaSearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY)
const googleSheetId = devEnv
  ? '1izFPAvb4jcAPxA24v4VbGzJAWIOebQ5R6SwBpSqF6ZM'
  : '1CI5I1JblyENn1dgDFaLRphD4rwmHzW8oJw8rPhicbpo'

admin.initializeApp()

exports.addSignup = functions.firestore
  .document('signups/{signup}')
  .onCreate(async (snap) => {
    const signupData = snap.data()
    signupData.technologies = signupData.technologies.join(', ')
    signupData.languages = signupData.languages.join(', ')
    signupData.preferredGroup = signupData.preferredGroup.join(', ')
    signupData.timestamp = `=${signupData.timestamp.seconds}/86400+date(1970,1,1)`

    const doc = new GoogleSpreadsheet(googleSheetId)
    await doc.useServiceAccountAuth(credentials)

    await doc.loadInfo()
    const sheet = doc.sheetsByIndex[0]

    await sheet.addRows([signupData])
  })

exports.addSubmission = functions.firestore
  .document('submissions/{submission}')
  .onCreate(async (snap) => {
    const submissionData = snap.data()

    submissionData.technologies = submissionData.technologies.join(', ')
    submissionData.teamMembers = submissionData.teamMembers.join(', ')
    submissionData.timestamp = `=${submissionData.timestamp.seconds}/86400+date(1970,1,1)`

    const doc = new GoogleSpreadsheet(googleSheetId)
    await doc.useServiceAccountAuth(credentials)

    await doc.loadInfo()
    const sheet = doc.sheetsByIndex[1]

    await sheet.addRows([submissionData])
  })

if (!devEnv) {
  exports.updateAlgolia = functions.firestore
    .document('users/{user}')
    .onCreate((snap) => {
      const userData = snap.data()
      userData.objectID = snap.id

      const index = algolia.initIndex('CWF')
      return index.saveObject(userData)
    })
}
