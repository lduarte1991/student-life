<template>
    <v-container fluid>
        <v-row>
        <v-col id='filter' style='padding-right:30px' class='col-12 col-sm-4'>
            <v-text-field id='srch' append-icon="mdi-magnify" class='search-box' @input="search" type='text' placeholder="Search..."/>
            <h2>Filter</h2>
            <h3 v-if='school.length > 0'>School</h3>
            <v-chip-group column>
                <v-chip :input-value="filterValues[sch]" @click="toggleFilter(sch)" v-for='sch in school' class="ma-2" filter>{{sch}}</v-chip>
            </v-chip-group>
            <h3 v-if='audience.length > 0'>Audience</h3>
            <v-chip-group column>
                <v-chip :input-value="filterValues[aud]" @click="toggleFilter(aud)" v-for='aud in audience' class="ma-2" filter>{{aud}}</v-chip>
            </v-chip-group>
            <h3 v-if='group.length > 0'>Group</h3>
            <v-chip-group column>
                <v-chip :input-value="filterValues[g]" @click="toggleFilter(g)" v-for='g in group' class="ma-2" filter>{{g}}</v-chip>
            </v-chip-group>

        </v-col>
        <v-col class="row" v-if='evs.length === 0'>
            Sorry, no events on this date with filters selected (if any).
        </v-col>
        <v-col class="row" v-else>
            <v-row v-for='event in evs' class='column col-70'>
                <v-col class='col-3 col-md-3'>
                <strong>Start:</strong><br>{{event.start | moment("ddd, MMM D h:mma")}}<br><strong>End:</strong><br>{{event.end | moment("ddd, MMM D h:mma")}}
                </v-col>
                <v-col>
                <h3 @click="openEvent(event)" class='event-title' role="button" tabindex="0">{{event.title}}</h3>
                <div class='event-description'>
                    {{event.description}}
                </div>
                <v-chip-group column>
                    <v-chip :input-value="filterValues[sch.name]" @click="toggleFilter(sch.name)" v-for='sch in event.schools' class="ma-2" filter>{{sch.name}}</v-chip>
                    <v-chip :input-value="filterValues[aud.audience]" @click="toggleFilter(aud.audience)" v-for='aud in event.audience' class="ma-2" filter>{{aud.audience}}</v-chip>
                    <v-chip :input-value="filterValues[g.group]" @click="toggleFilter(g.group)" v-for='g in event.group' class="ma-2" filter>{{g.group}}</v-chip>
                </v-chip-group>
                </v-col>
            </v-row>
        </v-col>
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
        </v-row>
    </v-container>
</template>

<script>
    module.exports = {
        data: function() {
            return {
                evs: [],
                selectedEv: null,
                school: [],
                group: [],
                audience: [],
                dialog: false,
                filterValues: {},
                filteredTags: []
            }
        },
        mounted: function() {
            const self = this;
            function collectFilterData(data) {
                let evs = data;
                let school = new Set([]);
                let group = new Set([]);
                let audience = new Set([]);

                // collects unique instances for the filter bar on the left
                evs.forEach(function(ev) {
                    ev.schools.forEach(function(tag) {
                        school.add(tag.name);
                        self.filterValues[tag.name] = false;
                    });
                    ev.group.forEach(function(tag) {
                        group.add(tag.group);
                        self.filterValues[tag.group] = false;
                    });
                    ev.audience.forEach(function(tag) {
                        audience.add(tag.audience);
                        self.filterValues[tag.audience] = false;
                    });
                });

                // this ensures that filter options are for things that actually
                // exist. i.e. if there are no HLS events, HLS filter button
                // will not appear
                self.school = Array.from(school);
                self.group = Array.from(group);
                self.audience = Array.from(audience);
                return data;
            }
            this.axios
                .get('https://devo.playremote.hxtech.org/event/today/')
                .then(response => this.evs = collectFilterData(response.data))
                .then( () => this.original_events = this.evs)
        },
        methods: {
            openEvent: function(ev) {
                this.selectedEv = ev;
                this.dialog = true;
            },
            closeEvent: function() {
                this.selectedEv = null;
                this.dialog = false;
            },
            search: function(searchVal) {
                // otherwise, show only those events where the search-term
                // is found in the title and/or description
                searchVal = searchVal.toLowerCase();
                let current_display_data = this.original_events.filter(function(item) {
                    return item.title.toLowerCase().indexOf(searchVal) > -1 || item.description.toLowerCase().indexOf(searchVal) > -1;
                });

                // actually draws changes on screen
                this.evs = current_display_data;
            },
            toggleFilter: function(tag) {
                // checks to see if person is selecting or deselecting
                var ind = this.filteredTags.indexOf(tag);
                if (ind > -1) {
                    this.filteredTags.splice(ind, 1);
                    this.filterValues[tag] = false;
                } else {
                    this.filteredTags.push(tag);
                    this.filterValues[tag] = true;
                }
                // runs filter with latest selection of tags
                this.filter(this.filteredTags);
            },
            filter: function(tagList) {
                let current_display_data = this.original_events;
                if (tagList.length === 0) {
                    // should go back to its original state if no filter selected
                    current_display_data = this.original_events;
                } else {
                    current_display_data = this.original_events.filter(function(item) {
                        var found = false;

                        // tags are stored in a faceted way, this returns only events with those tags
                        tagList.forEach(function(tag) {
                            found = found || item.schools.map(e => e.name).indexOf(tag) > -1 || item.group.map(e => e.group).indexOf(tag) > -1 || item.audience.map(e => e.audience).indexOf(tag) > -1;
                        });
                        return found;
                    });
                }

                // actually draws changes on screen
                this.evs = current_display_data;
            }

        }
    }
</script>
