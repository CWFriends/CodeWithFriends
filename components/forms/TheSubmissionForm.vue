<template>
  <div>
    <v-card-title>{{ page.title }} Project Submissions</v-card-title>
    <v-card-subtitle
      >Fill out the form below to submit your project for the
      event!</v-card-subtitle
    >
    <v-card-text>
      <v-form ref="form" v-model="submissionValid" lazy-validation>
        <v-list-item>
          <v-list-item-avatar>
            <img v-if="user.data.avatar_url" :src="user.data.avatar_url" />
            <v-icon large v-else>mdi-account-circle</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ signupDetails.name }}</v-list-item-title>
            <v-list-item-subtitle>{{
              signupDetails.email
            }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon @click="logOut">
              <v-icon color="grey lighten-1">mdi-logout</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <v-divider></v-divider>
        <v-autocomplete
          v-model="repo"
          :items="user.repos"
          label="Select the Project Repository"
          item-text="name"
          item-value="id"
          hint="Must be a public repository on Github, owned by you."
          persistent-hint
          auto-select-first
          :rules="notEmpty"
          prepend-icon="mdi-github"
          @change="setRepoFields"
        >
          <template v-slot:item="data">
            <v-list-item-content>
              <v-list-item-title>{{ data.item.name }}</v-list-item-title>
              <v-list-item-subtitle>{{
                data.item.description
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </v-autocomplete>
        <v-text-field
          v-model="demoUrl"
          label="Demo URL"
          prepend-icon="mdi-link"
          class="mb-2"
          hint="Is there a place where we can see how the project functions?"
        ></v-text-field>
        <v-textarea
          v-model="description"
          outlined
          label="Project Description"
          :rules="notEmpty"
        ></v-textarea>
        <v-combobox
          v-model="technologies"
          :items="technologyOptions"
          :search-input.sync="technologySearch"
          hide-selected
          label="What technologies did you use?"
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
        <v-autocomplete
          v-model="teamMembers"
          :items="filteredUserList"
          chips
          label="Team Members"
          item-text="name"
          item-value="uid"
          multiple
          hint="Did you work with others on this project?"
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
                <img v-if="data.item.avatar_url" :src="data.item.avatar_url" />
                <v-icon large v-else>mdi-account-circle</v-icon>
              </v-avatar>
              {{ data.item.name }}
            </v-chip>
          </template>
          <template v-slot:item="data">
            <v-list-item-avatar>
              <img v-if="data.item.avatar_url" :src="data.item.avatar_url" />
              <v-icon x-large v-else>mdi-account-circle</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ data.item.name }}</v-list-item-title>
            </v-list-item-content>
          </template>
        </v-autocomplete>
        <div class="text-right">
          <v-btn color="primary" :loading="submittingForm" @click="submit">
            Submit Your Project!
          </v-btn>
        </div>
      </v-form>
    </v-card-text>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'ProjectSubmissionForm',
  props: {
    page: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    submissionValid: false,
    submittingForm: false,
    repo: '',
    demoUrl: '',
    description: '',
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
    teamMembers: [],
    notEmpty: [
      (v) =>
        (!!v && (typeof v === 'number' || v.length > 0)) || 'Required Field',
    ],
  }),
  computed: {
    ...mapState(['user', 'userList', 'signups']),
    signupDetails() {
      return this.signups.find(({ user }) => user === this.user.data.uid)
    },
    filteredUserList() {
      return this.signups
        .filter(
          ({ event, user }) =>
            event === this.page.slug && user !== this.user.data.uid
        )
        .map((signup) => ({
          avatar_url: this.userList.find(({ uid }) => signup.user === uid)
            .avatar_url,
          name: signup.name,
          uid: signup.uid,
        }))
    },
  },
  methods: {
    ...mapActions(['logOut', 'submitProject']),
    removeUser(item) {
      const index = this.teamMembers.indexOf(item.uid)
      if (index >= 0) this.teamMembers.splice(index, 1)
    },
    setRepoFields() {
      if (!this.repo) return

      const repo = this.user.repos.find(({ id }) => id === this.repo)
      this.demoUrl = repo.homepage || this.demoUrl
      this.description =
        repo.description || this.description || this.signupDetails.description
      this.technologies =
        repo.language && !this.technologies.includes(repo.language)
          ? [...this.technologies, repo.language]
          : this.technologies
    },
    submit() {
      if (!this.$refs.form.validate()) return
      this.submittingForm = true

      const repo = this.user.repos.find((repo) => repo.id === this.repo)
      const data = {
        repoId: repo.id,
        repoUrl: repo.html_url,
        demoUrl: this.demoUrl,
        description: this.description,
        technologies: this.technologies,
        teamMembers: this.teamMembers,
        user: this.user.data.uid,
      }

      this.submitProject(data).then(() => {
        this.submittingForm = false
        this.$emit('close')
        this.$emit('submitted')
      })
    },
  },
  mounted() {
    this.description = this.signupDetails.description
    this.technologies = this.signupDetails.technologies
  },
}
</script>
