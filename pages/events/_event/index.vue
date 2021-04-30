<template>
  <div class="page">
    <HeroImage
      :page="page"
      :date="page['start-date']"
      :end-date="page['end-date']"
    >
      <div v-if="user.loggedIn && new Date(page['end-date']) > Date.now()">
        <v-btn
          v-if="!signedUp"
          color="accent"
          x-large
          :disabled="new Date(page['signup-date']) > Date.now()"
          @click="signUpModal = true"
        >
          <template v-if="new Date(page['signup-date']) > Date.now()">
            Signups Open on {{ getDate(page['signup-date'], 'long') }}!
          </template>
          <template v-else> Sign Up <v-icon right>mdi-send</v-icon> </template>
        </v-btn>

        <v-btn
          v-if="signedUp && !submitted"
          color="accent"
          x-large
          :disabled="submissionsClosed"
          @click="submissionModal = true"
        >
          Submit a Project
          {{
            submissionsClosed
              ? `(Closed until ${getDate(
                  page['submissions-date'],
                  'short',
                  false
                )})`
              : ''
          }}
        </v-btn>
      </div>

      <SignInButton v-if="!user.loggedIn"></SignInButton>
    </HeroImage>
    <AppOverlay :overlay="signUpModal" @close="signUpModal = false">
      <TheSignUpForm
        :page="page"
        @close="signUpModal = false"
        @signed-up="signUpAlert = true"
      ></TheSignUpForm>
    </AppOverlay>

    <AppOverlay :overlay="submissionModal" @close="submissionModal = false">
      <TheSubmissionForm
        :page="page"
        @close="submissionModal = false"
        @submitted="submissionAlert = true"
      ></TheSubmissionForm>
    </AppOverlay>
    <v-container>
      <v-row>
        <v-col>
          <v-tabs v-model="tabs">
            <v-tab>Details</v-tab>
            <v-tab v-if="hasEvents">Schedule</v-tab>
            <v-tab v-if="hasLabs">Lab Hours</v-tab>
          </v-tabs></v-col
        >
      </v-row>
      <v-tabs-items v-model="tabs">
        <v-tab-item>
          <v-row>
            <v-col md="7" cols="12">
              <v-alert
                v-model="signUpAlert"
                border="left"
                close-text="Close Alert"
                color="light-green"
                dark
                dismissible
                icon="mdi-check"
              >
                Thank you for signing up! Be sure to join our
                <a
                  :href="discordUrl"
                  target="_blank"
                  title="Discord"
                  rel="noopener noreferrer"
                  >Discord channel</a
                >
                to stay connected with the community, and you will receive a
                notification from us if you opted into a check-in group.
              </v-alert>

              <v-alert
                v-model="submissionAlert"
                border="left"
                close-text="Close Alert"
                color="light-green"
                dark
                dismissible
                icon="mdi-check"
              >
                Thank you for submitting your project and participating in Code
                with Friends! You can find a list of all the submissions on the
                <nuxt-link
                  :to="page.path + '/submissions'"
                  :title="page.title + ' Submissions'"
                  >submissions page</nuxt-link
                >.
                <template v-if="page.feedback">
                  <br /><br />
                  <strong>We would love to hear your feedback!</strong> Please
                  fill out our
                  <a
                    ref="noreferrer noopener"
                    :href="page.feedback"
                    target="_blank"
                    >feedback form</a
                  >
                  after you have completed your submission, we would appreciate
                  it!
                </template>
              </v-alert>

              <nuxt-content :document="page"></nuxt-content>
            </v-col>
            <v-col md="5" cols="12">
              <h2 class="text-md-h4 text-h5 mb-4">
                Participants ({{ numberFormat(signupsCount) }})
              </h2>

              <div v-if="usersData" class="avatar-list">
                <UserAvatar
                  v-for="participant in usersData"
                  :key="participant.uid"
                  :user="participant"
                ></UserAvatar>
              </div>
              <v-divider class="my-6"></v-divider>
              <h2 class="text-md-h4 text-h5 mb-4">
                Submissions ({{ numberFormat(submissionsCount) }})
              </h2>

              <v-row>
                <v-col
                  v-for="project in event.submissionsPreview"
                  :key="project.uid"
                  cols="12"
                >
                  <SubmissionCard :project="project"></SubmissionCard>
                </v-col>
              </v-row>
              <div v-if="submissionsCount > 3" class="text-right">
                <v-btn
                  text
                  :to="'/events/' + page.slug + '/submissions'"
                  :title="page.title + ' Submissions'"
                  color="primary"
                >
                  View All Submissions <v-icon right>mdi-chevron-right</v-icon>
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-tab-item>
        <v-tab-item v-if="hasEvents">
          <EventSchedule :page="page"></EventSchedule>
        </v-tab-item>
        <v-tab-item v-if="hasLabs">
          <EventLabs :page="page"></EventLabs>
        </v-tab-item>
      </v-tabs-items>
    </v-container>
  </div>
</template>

<script>
import HeroImage from '@/components/HeroImage'
import SignInButton from '@/components/SignInButton'
import AppOverlay from '@/components/AppOverlay'
import TheSignUpForm from '@/components/forms/TheSignUpForm'
import TheSubmissionForm from '@/components/forms/TheSubmissionForm'
import SubmissionCard from '@/components/SubmissionCard'
import UserAvatar from '@/components/UserAvatar'
import EventSchedule from '@/components/events/EventSchedule'
import EventLabs from '@/components/events/EventLabs'
import { mapState } from 'vuex'

export default {
  components: {
    AppOverlay,
    HeroImage,
    SignInButton,
    TheSignUpForm,
    TheSubmissionForm,
    UserAvatar,
    SubmissionCard,
    EventSchedule,
    EventLabs,
  },
  async asyncData({ $content, params }) {
    const page = await $content('events', params.event).fetch()
    return {
      page,
    }
  },
  data: () => ({
    tabs: null,
    signUpModal: false,
    signUpAlert: false,
    submissionModal: false,
    submissionAlert: false,
  }),
  computed: {
    ...mapState(['socialMedia', 'user', 'event']),
    submissionsCount() {
      return this.event.data?.submissionsCount || 0
    },
    signupsCount() {
      return this.event.data?.usersData?.length || 0
    },
    discordUrl() {
      return this.socialMedia.find((item) => item.name === 'Discord').url
    },
    signedUp() {
      return this.usersData?.some((user) => user.uid === this.user.data.uid)
    },
    submitted() {
      return this.user.submissions.some(({ event }) => event === this.page.slug)
    },
    submissionsClosed() {
      return new Date(this.page['submissions-date']) > Date.now()
    },
    hasEvents() {
      return this.page.schedule?.length > 0
    },
    hasLabs() {
      return this.page.labs?.length > 0
    },
    usersData() {
      return this.event?.data?.usersData
    },
  },
  mounted() {
    this.$store.dispatch('event/getEventData', {
      event: this.page.slug,
    })
  },
  methods: {
    getDate(date, dateStyle = 'medium', timeStyle = 'short') {
      return new Intl.DateTimeFormat('en-US', {
        dateStyle,
        timeStyle: timeStyle || undefined,
      }).format(new Date(date))
    },
    numberFormat(num) {
      return new Intl.NumberFormat('en-US', {
        maximumSignificantDigits: 3,
      }).format(num)
    },
  },
  head() {
    return {
      title: this.page.title,
      titleTemplate: '%s | ' + this.$store.state.defaults.title,
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          name: 'title',
          content: this.page.title,
        },
        {
          hid: 'description',
          name: 'description',
          content:
            this.page.description || this.$store.state.defaults.description,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          name: 'description',
          content:
            this.page.description || this.$store.state.defaults.description,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          name: 'image',
          content: (
            this.$store.state.url +
            (this.page['meta-image'] ||
              this.$store.state.defaults['meta-image'])
          ).replace('//img', '/img'),
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: this.$store.state.url + 'events/' + this.page.slug,
        },
      ],
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: this.$store.state.url + 'events/' + this.page.slug,
        },
      ],
    }
  },
}
</script>

<style lang="scss">
.avatar-list {
  display: flex;
  flex-wrap: wrap;
  max-height: 480px;
  overflow-y: scroll;
}
</style>
