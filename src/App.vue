<template>
  <v-app id="inspire">
    <v-app-bar
      app
      color="red darken-4"
      dark
    >
      <v-toolbar-title>Socialize Remotely</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="white" light href="/logout">Log out</v-btn>
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <v-row class="mb-4">
          <v-col>
            <div class="d-flex align-center">
              <div>
                <v-btn-toggle borderless>
                  <v-btn value="calendar" to="/">
                    <span>Today</span>
                    <v-icon right>mdi-view-list</v-icon>
                  </v-btn>

                  <v-btn value="list" to="/all-events">
                    <span>All events</span>
                    <v-icon right>mdi-calendar-month</v-icon>
                  </v-btn>
                </v-btn-toggle>
              </div>

              <div class="ml-auto">
                <v-btn to="/submit-event" color="primary">
                  <v-icon left>mdi-calendar-plus</v-icon> Submit event
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <router-view />
          </v-col>
        </v-row>
      </v-container>
    </v-content>

    <v-footer
      color="red darken-4"
      app
    >
      <span class="white--text">©2020 VPAL | Terms of Service</span>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
    })
  }
</script>
