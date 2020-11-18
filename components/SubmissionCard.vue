<template>
  <v-card height="100%" class="d-flex flex-column">
    <v-img
      v-if="project.image"
      class="align-end"
      height="150px"
      :src="project.image"
    ></v-img>
    <v-card-title v-text="project.title"></v-card-title>
    <v-divider></v-divider>

    <v-card-subtitle>
      <v-chip
        v-for="(tech, i) in project.technologies"
        :key="i"
        small
        class="my-1 mr-2"
        >{{ tech }}</v-chip
      >
    </v-card-subtitle>

    <v-card-text>
      {{ project.description }}
    </v-card-text>
    <v-card-text class="d-flex align-end flex-grow-1">
      <v-row align="end">
        <v-col>
          <UserAvatar
            v-for="user in teamMembers"
            :key="user.uid"
            :user="user"
            :size="36"
          ></UserAvatar>
        </v-col>
        <v-col cols="auto">
          <div class="text-right">
            <v-btn
              v-if="project.demoUrl"
              icon
              :href="project.demoUrl"
              target="_blank"
              :title="project.title + ' Demo'"
              class="ma-1"
            >
              <v-icon>mdi-link</v-icon>
            </v-btn>
            <v-btn
              v-if="project.repoUrl"
              icon
              :href="project.repoUrl"
              target="_blank"
              :title="project.title + ' Github Repository'"
              class="ma-1"
            >
              <v-icon>mdi-github</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import UserAvatar from '@/components/UserAvatar'

export default {
  components: {
    UserAvatar,
  },
  props: {
    project: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    usersData() {
      return this.$store.state.event?.data?.usersData
    },
    teamMembers() {
      const users = [this.project.user, ...this.project.teamMembers]
      return this.usersData?.filter(({ uid }) => users.includes(uid))
    },
  },
}
</script>
