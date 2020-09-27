<template>
  <div>
    <v-sheet class="d-flex align-center">
      <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <h5 class="text-h5">
        {{ calendarTitle }}
      </h5>
      <v-spacer></v-spacer>
      <v-btn icon class="ma-2" @click="$refs.calendar.next()">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-sheet>
    <v-sheet height="600">
      <v-calendar
        ref="calendar"
        v-model="calendar"
        :events="events"
        :event-color="getColor"
        :event-more="false"
        :start="new Date(page['signup-date'])"
        @click:event="openEventUrl"
      >
        <template v-slot:event="event">
          <strong
            >{{ event.formatTime(event.eventParsed.start, true) }}
            <v-icon
              v-if="event.event.url"
              color="white"
              x-small
              style="padding-bottom: 2px"
            >
              mdi-open-in-new
            </v-icon></strong
          >

          {{ event.event.name }}
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
  }),
  computed: {
    calendarTitle() {
      const date = this.calendar
        ? new Date(this.calendar)
        : new Date(this.page['signup-date'])

      const offset = date.getTimezoneOffset() * 60000
      const dateOffset = new Date(date.getTime() + offset)

      return new Intl.DateTimeFormat('en-US', {
        month: 'long',
        year: 'numeric',
      }).format(dateOffset)
    },
    events() {
      return this.page.schedule.map((item) => ({
        name: item.title,
        start: new Date(item['start-date']),
        end: new Date(item['end-date']),
        timed: true,
        url: item.url,
        color: item.url ? 'accent' : 'primary',
      }))
    },
  },
  methods: {
    getColor(event) {
      return event.color
    },
    openEventUrl(e) {
      if (e.event.url) {
        window.open(e.event.url)
      }
    },
  },
}
</script>

<style lang="scss">
.v-calendar .v-event {
  white-space: normal;
  max-height: 44px;
  height: auto !important;
  padding: 2px;
}

.v-calendar.v-calendar-events .v-calendar-weekly__day {
  overflow: scroll;
  overflow-x: hidden;
}

.v-calendar-weekly__day-label {
  position: sticky;
  top: 0;
  background: white;
  z-index: 2;
  margin: 0 1px;

  .v-outside & {
    background: transparent;
  }
}
</style>
