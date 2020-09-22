const functions = require('firebase-functions')
const { GoogleSpreadsheet } = require('google-spreadsheet')
const admin = require('firebase-admin')
const creds = require('./service-account.json')

admin.initializeApp()

exports.addSignup = functions.https.onCall(async (data) => {
  const id = data.id

  const signupRef = await admin.firestore().collection('signups').doc(id).get()

  const signupData = signupRef.data()
  signupData.technologies = signupData.technologies.join(', ')
  signupData.languages = signupData.languages.join(', ')
  signupData.preferredGroup = signupData.preferredGroup.join(', ')
  signupData.timestamp = `=${signupData.timestamp.seconds}/86400+date(1970,1,1)`

  const doc = new GoogleSpreadsheet(
    '1CI5I1JblyENn1dgDFaLRphD4rwmHzW8oJw8rPhicbpo'
  )
  await doc.useServiceAccountAuth(creds)

  await doc.loadInfo()
  const sheet = doc.sheetsByIndex[0]

  await sheet.addRows([signupData])
})

exports.addSubmission = functions.https.onCall(async (data) => {
  const id = data.id

  const submissionRef = await admin
    .firestore()
    .collection('submissions')
    .doc(id)
    .get()

  const submissionData = submissionRef.data()
  submissionData.technologies = submissionData.technologies.join(', ')
  submissionData.teamMembers = submissionData.teamMembers.join(', ')
  submissionData.timestamp = `=${submissionData.timestamp.seconds}/86400+date(1970,1,1)`

  const doc = new GoogleSpreadsheet(
    '1CI5I1JblyENn1dgDFaLRphD4rwmHzW8oJw8rPhicbpo'
  )
  await doc.useServiceAccountAuth(creds)

  await doc.loadInfo()
  const sheet = doc.sheetsByIndex[1]

  await sheet.addRows([submissionData])
})
