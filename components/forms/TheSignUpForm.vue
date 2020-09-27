<template>
  <div>
    <v-card-title>{{ page.title }} Signups</v-card-title>
    <v-card-subtitle
      >Fill out the form below to be included in the event.</v-card-subtitle
    >
    <v-card-text>
      <v-form ref="form" v-model="signUpValid" lazy-validation>
        <v-list-item v-if="user.loggedIn">
          <v-list-item-avatar>
            <img v-if="user.data.avatar_url" :src="user.data.avatar_url" />
            <v-icon v-else large>mdi-account-circle</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ user.data.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ user.data.email }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon @click="logOut">
              <v-icon color="grey lighten-1">mdi-logout</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <v-list-item v-else>
          <SignInButton class="mx-auto"></SignInButton>
        </v-list-item>
        <v-divider></v-divider>
        <v-text-field
          v-if="!user.data.name"
          v-model="name"
          label="Name"
          prepend-icon="mdi-account"
          :rules="notEmpty"
          class="mb-2"
        ></v-text-field>
        <v-text-field
          v-if="!user.data.email"
          v-model="email"
          label="Email"
          prepend-icon="mdi-email"
          :rules="[...emailRules, ...notEmpty]"
          class="mb-2"
        ></v-text-field>
        <v-text-field
          v-model="discordUsername"
          label="Discord Username"
          prepend-icon="mdi-discord"
          placeholder="mayuko#1234"
          persistent-hint
          :hint="`Be sure to join our Discord server to stay in touch with the community: ${discordUrl}`"
          class="mb-2"
          :rules="[...notEmpty, ...discordRules]"
        ></v-text-field>
        <v-textarea
          v-model="projectIdea"
          outlined
          label="Tell us about your project idea!"
          :rules="notEmpty"
        ></v-textarea>

        <v-combobox
          v-model="technologies"
          :items="technologyOptions"
          :search-input.sync="technologySearch"
          hide-selected
          label="What technologies will you use?"
          hint="Type in your tech stack and press `enter` to add it to the list. Items in the dropdown are just suggestions."
          multiple
          persistent-hint
          small-chips
          deletable-chips
          prepend-icon="mdi-language-python"
          :rules="notEmpty"
        >
          <template v-slot:no-data>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  No results matching "<strong>{{ technologySearch }}</strong
                  >". Press <kbd>enter</kbd> to create a new one.
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-combobox>
        <v-select
          v-model="proficiency"
          :items="proficiencyLevels"
          item-value="value"
          item-text="text"
          label="Select your proficiency"
          prepend-icon="mdi-equalizer"
          :rules="notEmpty"
        ></v-select>
        <v-autocomplete
          v-model="timezone"
          :items="timezones"
          item-text="text"
          item-value="text"
          label="Timezone"
          auto-select-first
          prepend-icon="mdi-clock"
          :rules="notEmpty"
        ></v-autocomplete>
        <v-autocomplete
          v-model="preferredLanguages"
          :items="languages"
          label="Preferred Language(s)"
          multiple
          small-chips
          deletable-chips
          auto-select-first
          prepend-icon="mdi-translate"
          :rules="notEmpty"
        ></v-autocomplete>
        <v-checkbox
          v-model="checkinGroup"
          label="Please add me to a check-in group."
          hint="Checkin groups are used for keeping each other accountable during the month. To learn more, visit the FAQ page: https://codewithfriends.io/faq"
          persistent-hint
        ></v-checkbox>
        <v-autocomplete
          v-if="checkinGroup"
          v-model="groupMembers"
          :items="groupSearchResults"
          :loading="loadingGroupSearch"
          :search-input.sync="groupSearch"
          chips
          hide-no-data
          hide-selected
          label="I'd like to be in a group with..."
          item-text="name"
          item-value="uid"
          multiple
          hint="Search for other members you are interested in forming a check-in group with. Users must have signed into the website at least once. If you leave this blank, we'll form a check-in group for you that works best for your time zone."
          persistent-hint
          auto-select-first
          prepend-icon="mdi-account-group"
        >
          <template v-slot:selection="data">
            <v-chip
              v-bind="data.attrs"
              :input-value="data.selected"
              close
              @click="data.select"
              @click:close="removeUser(data.item)"
            >
              <v-avatar left>
                <img v-if="data.item.avatar_url" :src="data.item.avatar_url" />
                <v-icon v-else -xlarge>mdi-account-circle</v-icon>
              </v-avatar>
              {{ data.item.name }}
            </v-chip>
          </template>
          <template v-slot:item="data">
            <v-list-item-avatar>
              <img v-if="data.item.avatar_url" :src="data.item.avatar_url" />
              <v-icon v-else x-large>mdi-account-circle</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ data.item.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ data.item.email }}</v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </v-autocomplete>
        <v-checkbox v-model="codeOfConduct" :rules="agree">
          <template v-slot:label>
            <div>
              I agree and will adhere to the
              <a
                target="_blank"
                href="/code-of-conduct"
                title="Code of Conduct"
                @click="openLink($event.target)"
                >Code of Conduct</a
              >.
            </div>
          </template>
        </v-checkbox>
        <div class="text-right">
          <v-btn color="accent" :loading="submittingForm" @click="signUp">
            Sign Up!
            <v-icon right>mdi-send</v-icon>
          </v-btn>
        </div>
      </v-form>
    </v-card-text>
  </div>
</template>

<script>
import timezones from 'timezones.json'
import languages from 'languages-list'
import { mapState, mapActions } from 'vuex'
import SignInButton from '@/components/SignInButton'

export default {
  name: 'SignUpForm',
  components: {
    SignInButton,
  },
  props: {
    page: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    name: '',
    email: '',
    timezones,
    timezone: '',
    languages,
    preferredLanguages: [],
    signUpValid: false,
    discordUsername: '',
    projectIdea: '',
    technologies: [],
    technologyOptions: [
      'AI',
      'Android Development',
      'Arduino',
      'Data Science',
      'Docker',
      'Flutter',
      'Game Development',
      'iOS Development',
      'Machine Learning',
      'Node',
      'React',
      'Python',
      'Rust',
      'Swift',
      'Vue',
    ],
    technologySearch: '',
    proficiencyLevels: [
      {
        value: 'Novice',
        text: 'New to many or all of the technologies',
      },
      {
        value: 'Intermediate',
        text: 'Used them on a few projects',
      },
      {
        value: 'Expert',
        text: 'Uses the technologies professionally',
      },
    ],
    proficiency: '',
    checkinGroup: false,
    groupMembers: [],
    groupSearch: '',
    groupSearchResults: [],
    loadingGroupSearch: false,
    discordRules: [
      (v) =>
        /.+#.+/.test(v) ||
        'Be sure to use the full Discord username, including the hash number.',
    ],
    emailRules: [(v) => /.+@.+/.test(v) || 'E-mail must be valid'],
    notEmpty: [(v) => (!!v && v.length > 0) || 'Required Field'],
    agree: [(v) => v || 'You must agree to the Code of Conduct to proceed.'],
    submittingForm: false,
    codeOfConduct: false,
  }),
  computed: {
    ...mapState(['user', 'socialMedia']),
    discordUrl() {
      return this.socialMedia.find(({ name }) => name === 'Discord').url
    },
  },
  watch: {
    groupSearch() {
      if (
        !this.groupSearch ||
        this.groupSearch.length < 3 ||
        this.groupSearchResults.length > 0
      )
        return
      this.loadingGroupSearch = true

      this.$fireStore
        .collection('users')
        .where('name', '>', '')
        .get()
        .then((users) => {
          const userList = []
          users.forEach((doc) => {
            userList.push({ ...doc.data(), uid: doc.id })
          })
          this.groupSearchResults = userList
          this.loadingGroupSearch = false
        })
    },
  },
  methods: {
    ...mapActions({
      logOut: 'user/logOut',
      submitSignup: 'event/submitSignup',
    }),
    openLink(url) {
      window.open(url)
    },
    removeUser(item) {
      const index = this.groupMembers.indexOf(item.uid)
      if (index >= 0) this.groupMembers.splice(index, 1)
    },
    signUp() {
      if (!this.$refs.form.validate()) return
      this.submittingForm = true
      const data = {
        event: this.page.slug,
        name: this.user.data.name || this.name,
        email: this.user.data.email || this.email,
        discord: this.discordUsername,
        description: this.projectIdea,
        technologies: this.technologies,
        experience: this.proficiency,
        timezone: this.timezone,
        languages: this.preferredLanguages,
        checkinGroup: this.checkinGroup,
        preferredGroup: this.groupMembers,
        user: this.user.data.uid,
        timestamp: new Date(),
      }

      this.submitSignup(data).then(() => {
        this.submittingForm = false
        this.$emit('close')
        this.$emit('signed-up')
      })
    },
  },
}
</script>
