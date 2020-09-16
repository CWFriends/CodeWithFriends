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
            <img :src="user.data.avatar_url" />
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
          label="Discord Username"
          prepend-icon="mdi-discord"
          v-model="discordUsername"
          persistent-hint
          :hint="`Be sure to join our Discord server to stay in touch with the community: ${discordUrl}`"
          class="mb-2"
          :rules="notEmpty"
        ></v-text-field>
        <v-text-field
          label="Email"
          prepend-icon="mdi-email"
          v-model="email"
          :rules="[...emailRules, ...notEmpty]"
          class="mb-2"
          v-if="!user.data.email"
        ></v-text-field>
        <v-textarea
          outlined
          name="projectIdea"
          label="Tell us about your project idea!"
          v-model="projectIdea"
          :rules="notEmpty"
        ></v-textarea>
        <v-combobox
          v-model="technologies"
          :items="technologyOptions"
          :search-input.sync="technologySearch"
          hide-selected
          label="What technologies will you use?"
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
          :items="timezones"
          item-text="text"
          item-value="text"
          label="Timezone"
          v-model="timezone"
          auto-select-first
          prepend-icon="mdi-clock"
          :rules="notEmpty"
        ></v-autocomplete>
        <v-autocomplete
          :items="languages"
          label="Preferred Language(s)"
          multiple
          small-chips
          deletable-chips
          v-model="preferredLanguages"
          auto-select-first
          prepend-icon="mdi-translate"
          :rules="notEmpty"
        ></v-autocomplete>
        <v-checkbox
          v-model="checkinGroup"
          label="Please add me to a check-in group."
        ></v-checkbox>
        <v-autocomplete
          v-if="checkinGroup"
          v-model="groupMembers"
          :items="filteredUserList"
          chips
          label="Preferred Check-in Team"
          item-text="name"
          item-value="uid"
          multiple
          hint="Search for other members you are interested in forming a check-in group with. Users must have signed into the website at least once."
          persistent-hint
          auto-select-first
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
                <v-img :src="data.item.avatar_url"></v-img>
              </v-avatar>
              {{ data.item.name }}
            </v-chip>
          </template>
          <template v-slot:item="data">
            <v-list-item-avatar>
              <img :src="data.item.avatar_url" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-html="data.item.name"></v-list-item-title>
              <v-list-item-subtitle
                v-html="data.item.email"
              ></v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </v-autocomplete>
        <div class="text-right">
          <v-btn
            color="primary"
            :disabled="!signUpValid"
            @click="signUp"
            :loading="submittingForm"
          >
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
    emailRules: [(v) => /.+@.+/.test(v) || 'E-mail must be valid'],
    notEmpty: [(v) => (!!v && v.length > 0) || 'Required Field'],
    submittingForm: false,
  }),
  computed: {
    ...mapState(['user', 'userList', 'socialMedia']),
    discordUrl() {
      return this.socialMedia.find((item) => item.name === 'Discord').url
    },
    filteredUserList() {
      return this.userList.filter((user) => user.uid !== this.user.data.uid)
    },
  },
  methods: {
    ...mapActions(['logOut', 'submitForm']),
    removeUser(item) {
      const index = this.groupMembers.indexOf(item.uid)
      if (index >= 0) this.groupMembers.splice(index, 1)
    },
    signUp() {
      if (!this.$refs.form.validate()) return
      this.submittingForm = true
      const data = {
        event: this.page.slug,
        name: this.user.data.name,
        email: this.user.data.email || this.email,
        discord: this.discordUsername,
        description: this.projectIdea,
        technologies: this.technologies,
        experience: this.proficiency,
        timezone: this.timezone,
        languages: this.preferredLanguages,
        checkinGroup: this.checkinGroup,
        preferredGroup: this.groupMembers,
      }

      this.submitForm(data).then(() => {
        this.submittingForm = false
        this.$emit('close')
        this.$emit('signed-up')
      })
    },
  },
}
</script>
