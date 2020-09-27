<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="5" md="4" lg="3" xl="2">
        <v-card>
          <v-list>
            <v-list-item-group v-model="selectedType">
              <v-list-item v-for="(item, i) in types" :key="i">
                <v-list-item-icon>
                  <v-icon v-text="item.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="item.name"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
      <v-col>
        <v-sheet height="600">
          <v-calendar
            ref="calendar"
            type="week"
            v-model="calendar"
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
      </v-col>
    </v-row>
  </v-container>
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
  mounted() {
    this.ready = true
    this.scrollToTime()
    this.updateTime()
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
