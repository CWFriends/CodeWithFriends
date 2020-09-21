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
            <v-icon v-else large>mdi-account-circle</v-icon>
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
          :items="[
            ...user.repos,
            {
              name: 'Other',
              description: 'Is your project not on Github?',
              id: user.data.uid,
            },
          ]"
          label="Select the Project Repository"
          item-text="name"
          item-value="id"
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
          v-if="repo === user.data.uid"
          v-model="title"
          label="Project Title"
          prepend-icon="mdi-format-text"
          :rules="notEmpty"
          class="mb-2"
        ></v-text-field>
        <v-text-field
          v-model="demoUrl"
          label="Demo URL"
          prepend-icon="mdi-link"
          class="mb-2"
          hint="Is there a place where we can see how the project functions?"
        ></v-text-field>
        <v-file-input
          v-model="image"
          class="mb-2"
          :rules="[
            (value) =>
              !value ||
              value.size < 1000000 ||
              'Image size should be less than 1MB!',
          ]"
          accept="image/png, image/jpeg, image/bmp"
          prepend-icon="mdi-camera"
          label="Upload a Preview Image"
        ></v-file-input>
        <v-textarea
          v-model="description"
          outlined
          counter
          label="Project Description"
          :rules="[...notEmpty, ...descRule]"
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
                <v-icon v-else large>mdi-account-circle</v-icon>
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
    image: undefined,
    submissionValid: false,
    submittingForm: false,
    title: '',
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
    descRule: [(v) => v.length <= 140 || 'Max 140 characters'],
    strRule: [(v) => v.length <= 60 || 'Max 60 characters'],
    notEmpty: [
      (v) =>
        (!!v && (typeof v === 'number' || v.length > 0)) || 'Required Field',
    ],
  }),
  computed: {
    ...mapState(['user', 'event']),
    signupDetails() {
      return this.event.signups.find(({ user }) => user === this.user.data.uid)
    },
    filteredUserList() {
      return this.event.users
        .filter(({ uid }) => uid !== this.user.data.uid)
        .map((user) => ({
          avatar_url: user.avatar_url,
          name: this.event.signups.find((signup) => signup.user === user.uid)
            .name,
          uid: user.uid,
        }))
    },
  },
  mounted() {
    this.description = this.signupDetails.description
    this.technologies = this.signupDetails.technologies
  },
  methods: {
    ...mapActions({
      logOut: 'user/logOut',
      submitProject: 'event/submitProject',
    }),
    removeUser(item) {
      const index = this.teamMembers.indexOf(item.uid)
      if (index >= 0) this.teamMembers.splice(index, 1)
    },
    setRepoFields() {
      if (!this.repo || this.repo === this.user.data.uid) return

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
        event: this.page.slug,
        repoId: repo?.id || this.user.data.uid,
        repoUrl: repo?.html_url || '',
        title: repo?.name || this.title,
        demoUrl: this.demoUrl,
        description: this.description,
        technologies: this.technologies,
        teamMembers: this.teamMembers,
        user: this.user.data.uid,
        image: this.image,
        timestamp: new Date(),
      }

      this.submitProject(data).then(() => {
        this.submittingForm = false
        this.$emit('close')
        this.$emit('submitted')
      })
    },
  },
}
</script>
