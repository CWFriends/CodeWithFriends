<template>
  <div>
    <v-sheet class="mx-auto mb-6 mt-2">
      <v-slide-group v-model="selectedType" show-arrows mandatory>
        <v-slide-item
          v-for="(type, i) in types"
          :key="i"
          v-slot:default="{ active, toggle }"
        >
          <v-btn
            class="mx-2"
            :input-value="active"
            active-class="accent white--text"
            text
            @click="toggle"
          >
            <v-icon left v-text="type.icon"></v-icon>
            {{ type.name }}
          </v-btn>
        </v-slide-item>
      </v-slide-group>
    </v-sheet>
    <v-sheet height="600">
      <v-calendar
        ref="calendar"
        v-model="calendar"
        type="week"
        :events="events"
        :event-color="getColor"
        :event-more="false"
        :start="new Date(page['signup-date'])"
        interval-height="72"
      >
        <template #day-label-header> <div></div> </template>
        <template #day-body="{ date, week }">
          <div
            class="v-current-time"
            :class="{ first: date === week[0].date }"
            :style="{ top: nowY }"
          ></div>
        </template>
      </v-calendar>
    </v-sheet>
  </div>
</template>

<script>
export default {
  props: {
    page: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    calendar: null,
    ready: false,
    selectedType: 0,
    types: [
      {
        name: 'Frontend',
        icon: 'mdi-language-html5',
      },
      {
        name: 'Backend',
        icon: 'mdi-language-python',
      },
      {
        name: 'Android Dev',
        icon: 'mdi-android',
      },
      {
        name: 'iOS Dev',
        icon: 'mdi-language-swift',
      },
      {
        name: 'Game Dev',
        icon: 'mdi-unity',
      },
      {
        name: 'Machine Learning',
        icon: 'mdi-robot',
      },
    ],
  }),
  computed: {
    cal() {
      return this.ready ? this.$refs.calendar : null
    },
    nowY() {
      return this.cal ? this.cal.timeToY(this.cal.times.now) + 'px' : '-10px'
    },
    events() {
      return this.eventsList.filter(({ type }) =>
        type.includes(this.types[this.selectedType].name)
      )
    },
    eventsList() {
      return this.page.labs.flatMap((person) =>
        person.schedule.map((schedule) => ({
          name: person.name,
          start: new Date(schedule['start-date']),
          end: new Date(schedule['end-date']),
          timed: true,
          type: person.type,
          color: 'primary',
        }))
      )
    },
  },
  mounted() {
    this.ready = true
    this.scrollToTime()
    this.updateTime()
  },
  methods: {
    getCurrentTime() {
      return this.cal
        ? this.cal.times.now.hour * 60 + this.cal.times.now.minute
        : 0
    },
    scrollToTime() {
      const time = this.getCurrentTime()
      const first = Math.max(0, time - (time % 30) - 30)

      this.cal.scrollToTime(first)
    },
    updateTime() {
      setInterval(() => this.cal.updateTimes(), 60 * 1000)
    },
    getColor(event) {
      return event.color
    },
  },
}
</script>

<style lang="scss">
.v-calendar .v-event-timed {
  white-space: normal;
}

.v-current-time {
  height: 2px;
  background-color: #ea4335;
  position: absolute;
  left: -1px;
  right: 0;
  pointer-events: none;

  &.first::before {
    content: '';
    position: absolute;
    background-color: #ea4335;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-top: -5px;
    margin-left: -6.5px;
  }
}
</style>
