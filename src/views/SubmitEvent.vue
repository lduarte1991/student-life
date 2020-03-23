<template>
    <v-container fluid>
    <v-stepper v-model="step_counter" class="mx-auto" style="max-width:800px">
        <v-stepper-header>
            <v-stepper-step :complete="step_counter > 1" step="1">Event Info</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step :complete="step_counter > 2" step="2">Audience</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step :complete="step_counter > 3" step="3">Submit</v-stepper-step>
        </v-stepper-header>
        <v-stepper-items>
            <v-stepper-content step="1">
    <v-form ref="form">
        <v-text-field v-model='title' label="Event Title"></v-text-field>
        <v-textarea v-model='description' solo label="Event Description"></v-textarea>
        <v-container fluid>
        <v-row>
        <v-col>
        <v-menu ref="start_menu" v-model="start_menu" :return-value.sync="start_date" :close-on-content-click="false">
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="start_date"
            label="Start Date for Event"
            readonly
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="start_date" scrollable>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="start_menu = false">Cancel</v-btn>
          <v-btn text color="primary" @click="$refs.start_menu.save(start_date)">OK</v-btn>
        </v-date-picker>
        </v-menu>
        </v-col>
        <v-col>
        <v-menu ref="start_time_menu" v-model="start_time_menu" :return-value.sync="start_time" :close-on-content-click="false">
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="start_time"
            label="Start Time for Event"
            readonly
            v-on="on"
          ></v-text-field>
        </template>
        <v-time-picker v-model="start_time" scrollable>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="start_time_menu = false">Cancel</v-btn>
          <v-btn text color="primary" @click="$refs.start_time_menu.save(start_time)">OK</v-btn>
        </v-time-picker>
      </v-menu>
      </v-col>
      <v-col>
        <v-text-field v-model='duration' label="Event Duration (in minutes)" type="number"></v-text-field>
        </v-col>
        </v-row>
        </v-container>
        <v-text-field v-model='platform' label="Event Platform"></v-text-field>
        <v-text-field v-model='join_link' label="Event Link"></v-text-field>
        </v-form>
        <v-btn dark
          color="red darken-4"
          @click="step_counter = 2"
          class="float-right"
        >
          Continue
        </v-btn>
    </v-stepper-content>

    <v-stepper-content step="2">
    <v-form ref="form">
    Schools
        <span v-for="sch in schools">
        <v-checkbox :label="sch.name" v-model="sch.active"></v-checkbox>
        </span>
    Audience
        <span v-for="aud in audience">
        <v-checkbox :label="aud.name" v-model="aud.active"></v-checkbox>
        </span>
        <span v-if="activeGroup.length>0" v-for="g in activeGroup">
        <v-checkbox :label="g.name" v-model="g.active"></v-checkbox>
        </span>
  </v-form>
    <v-btn
          @click="step_counter = 1"
          class="float-left"
        >
          Back
        </v-btn>
    <v-btn dark
          color="red darken-4"
          @click="step_counter = 3"
          class="float-right"
        >
          Continue
        </v-btn>
  </v-stepper-content>
  <v-stepper-content step="3">
    <v-form ref="form">
        <v-text-field v-model='creator' label="Organizer Name"></v-text-field>
        <v-text-field v-model='creator_email' label="Organizer Email"></v-text-field>
        <v-checkbox label="Display email in event" v-model="display_email"></v-checkbox>

    </v-form>
    <v-btn 
          @click="step_counter = 2"
          class="float-left"
        >
          Back
        </v-btn>
    <v-btn dark
          color="red darken-4"
          class="float-right"
        >
          Submit
        </v-btn>
  </v-stepper-content>
  </v-stepper-items></v-stepper>
  </v-container>
</template>

<script>
    export default {
        data: function() {
            return {
                creator: "",
                creator_email: "",
                display_email: false,
                title: "",
                description: "",
                join_link: "",
                step_counter: 1,
                platform: "",
                duration: 30,
                start_date: new Date().toISOString().substr(0, 10),
                start_time: "",
                start_menu: false,
                start_time_menu: false,
                schools: [
                    {
                        name: "HLS",
                        active: false,
                    },
                    {
                        name: "HBS",
                        active: false,
                    },
                    {
                        name: "HGSE",
                        active: false,
                    }
                ],
                audience: [
                    {
                        name: "Faculty",
                        active: false,
                    },
                    {
                        name: "Students",
                        active: false,
                    },
                    {
                        name: "PhD Research / Fellows",
                        active: false,
                    },
                ],
                activeGroup: [],
                group: {
                    "HLS": [
                        {
                            name: 'Leverett',
                            active: false,
                        },
                        {
                            name: 'Mather',
                            active: false
                        }
                    ],
                },
            }
        },
        mounted: function() {
            console.log(this);
        },
        methods: {
            update: function(obj, prop, event) {
                console.log(obj, prop, event.target);
                this.$set(obj, prop, event.target.value);
            }
        }
    }
</script>