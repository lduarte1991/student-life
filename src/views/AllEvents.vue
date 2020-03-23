<template>
    <div>
        <v-dialog v-model='dialog' transition="dialog-bottom-transition">
            <v-card v-if="selectedEv !== null">
                <v-toolbar dark color="red darken-4">
                  <v-btn icon dark @click="closeEvent">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-container fluid>
                    <v-row>
                        <v-col class='col-12'>
                            <h3>{{selectedEv.title}}</h3>
                            <p>{{selectedEv.start | moment("ddd, MMM D h:mma")}} to {{selectedEv.end | moment("ddd, MMM D h:mma")}}
                            <p>Organized by {{selectedEv.creator_name}}</p>
                            <p>{{selectedEv.description}}</p>
                            <p v-if="selectedEv.schools.length>0"><strong>School(s): </strong>{{selectedEv.schools.map(s => s.name).join(', ')}}</p>
                            <p v-if="selectedEv.audience.length>0"><strong>Audience: </strong>{{selectedEv.audience.map(s => s.audience).join(', ')}}</p>
                            <p v-if="selectedEv.group.length>0"><strong>House(s): </strong>{{selectedEv.group.map(s => s.group).join(', ')}}</p>
                            <p v-if='selectedEv.platform.length>0'><strong>Platform: </strong>{{selectedEv.platform}}</p>
                            <v-btn dark :href="selectedEv.join_link" color="red darken-4">Event Link</v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>
        </v-dialog>
        <vue-cal class="vuecal--blue-theme" :on-event-click="openEvent" :disable-views="['years', 'year']" :time-from="0 * 60" :time-to="24 * 60" :events='evs' style="height: 800px" />
    </div>
</template>
<script>
    import VueCal from 'vue-cal';
    import 'vue-cal/dist/vuecal.css';
    import moment from 'moment-timezone';

    export default {
        components: { VueCal },
        data: function() {
            return {
                evs: [],
                selectedEv: null,
                dialog: false,
            }
        },
        mounted: function() {
            const self = this;
            function formatDateTime(data) {
                data.forEach(function(event) {
                    event["start"] = moment(event.start).format('YYYY-MM-DD HH:MM');
                    event["end"] = moment(event.end).format('YYYY-MM-DD HH:MM');
                });
                console.log(data);
                return data;
            }
            this.axios
                .get('http://127.0.0.1:8000/event/all/')
                .then(response => this.evs = formatDateTime(response.data))
                .then( () => this.original_events = this.evs)
        },
        methods: {
            openEvent: function(ev) {
                // opens an modal view for a particular event
                this.selectedEv = ev;
                this.dialog = true;
            },
            closeEvent: function() {
                // closes modal view
                this.selectedEv = null;
                this.dialog = false;
            },
        }
    }
</script>