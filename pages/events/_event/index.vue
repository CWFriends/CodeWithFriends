<template>
  <div class="page">
    <HeroImage
      :page="page"
      :date="page['start-date']"
      :end-date="page['end-date']"
    >
      <v-btn
        v-if="$store.state.user.loggedIn"
        color="primary"
        x-large
        @click="signUp"
      >
        Sign Up <v-icon right>mdi-send</v-icon>
      </v-btn>

      <SignInButton v-else></SignInButton>
    </HeroImage>
    <v-container>
      <v-row>
        <v-col sm="8" cols="12">
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
          <p>No participants yet!</p>
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
import moment from 'moment'

export default {
  components: {
    HeroImage,
    SignInButton,
  },
  async asyncData({ $content, params }) {
    const page = await $content('events', params.event).fetch()
    return {
      page,
    }
  },
  methods: {
    getDate(date) {
      const hours = moment(date).format('HH')
      const includeTime = parseInt(hours) > 0
      const dateString = 'MMM Do, YYYY' + (includeTime ? ' HH:mma' : '')
      return moment(date).format(dateString)
    },
    signUp() {},
  },
  head() {
    return {
      title: this.page.title,
      titleTemplate: '%s | ' + this.$store.state.defaults.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            this.page.description || this.$store.state.defaults.description,
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content:
            this.page.description || this.$store.state.defaults.description,
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: this.$store.state.url + 'events/' + this.page.slug,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content:
            this.$store.state.url +
            (this.page['meta-img'] || this.$store.state.defaults['meta-image']),
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.page.title,
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
