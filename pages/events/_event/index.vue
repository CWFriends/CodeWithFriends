<template>
  <div class="page">
    <HeroImage
      :page="page"
      :date="page['start-date']"
      :end-date="page['end-date']"
    >
      <v-btn
        v-if="
          user.loggedIn &&
          new Date(page['end-date']) > Date.now() &&
          !eventSignups.some((entry) => entry.user === user.data.uid)
        "
        color="primary"
        x-large
        @click="signUpModal = true"
      >
        Sign Up <v-icon right>mdi-send</v-icon>
      </v-btn>

      <v-btn
        v-if="eventSignups.some((entry) => entry.user === user.data.uid)"
        dark
        disabled
      >
        Submit a Project
      </v-btn>

      <SignInButton v-if="!user.loggedIn"></SignInButton>
    </HeroImage>
    <AppOverlay :overlay="signUpModal" @close="signUpModal = false">
      <TheSignUpForm
        :page="page"
        @close="signUpModal = false"
        @signed-up="signUpAlert = true"
      ></TheSignUpForm>
    </AppOverlay>
    <v-container>
      <v-row>
        <v-col sm="8" cols="12">
          <v-alert
            v-model="signUpAlert"
            border="left"
            close-text="Close Alert"
            color="green"
            dark
            dismissible
            icon="mdi-check"
          >
            Thank you for signing up! Be sure to join our
            <a :href="discordUrl" target="_blank">Discord channel</a> to stay
            connected with the community, and you will receive a notification
            from us if you opted into a check-in group.
          </v-alert>
          <nuxt-content :document="page"></nuxt-content>
          <v-divider class="my-6"></v-divider>
          <h2>Schedule of Events</h2>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in page.schedule" :key="item.title">
                  <td>
                    <strong>
                      {{ item.title }}
                      <a v-if="item.url" :href="item.url" target="_blank">
                        <v-icon>mdi-open-in-new</v-icon>
                      </a>
                    </strong>
                  </td>
                  <td>
                    {{ getDate(item['start-date'])
                    }}{{
                      item['start-date'] === item['end-date']
                        ? ''
                        : ' - ' + getDate(item['end-date'])
                    }}
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
        <v-col sm="4" cols="12">
          <h2>Latest Submissions</h2>
          <p>No submissions yet!</p>
          <div class="text-right">
            <nuxt-link :to="page.slug + '/submissions'">
              <v-btn text>
                View All Submissions <v-icon right>mdi-chevron-right</v-icon>
              </v-btn>
            </nuxt-link>
          </div>
          <h2>Participants</h2>
          <li v-for="(participant, i) in eventSignups" :key="i">
            {{ participant.name }}
          </li>
          <div class="text-center">
            <v-btn text small>
              Show more <v-icon right>mdi-chevron-down</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import HeroImage from '@/components/HeroImage'
import SignInButton from '@/components/SignInButton'
import AppOverlay from '@/components/AppOverlay'
import TheSignUpForm from '@/components/TheSignUpForm'
import moment from 'moment'
import { mapState } from 'vuex'

export default {
  components: {
    AppOverlay,
    HeroImage,
    SignInButton,
    TheSignUpForm,
  },
  async asyncData({ $content, params }) {
    const page = await $content('events', params.event).fetch()
    return {
      page,
    }
  },
  data: () => ({
    signUpModal: false,
    signUpAlert: false,
  }),
  computed: {
    ...mapState(['signups', 'socialMedia', 'user']),
    discordUrl() {
      return this.socialMedia.find((item) => item.name === 'Discord').url
    },
    eventSignups() {
      return this.signups.filter((signup) => signup.event === this.page.slug)
    },
  },
  methods: {
    getDate(date) {
      const hours = moment(date).format('HH')
      const includeTime = parseInt(hours) > 0
      const dateString = 'MMM Do, YYYY' + (includeTime ? ' HH:mma' : '')
      return moment(date).format(dateString)
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
            (this.page['meta-img'] || this.$store.state.defaults['meta-image'])
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
