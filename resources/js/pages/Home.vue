<template>
    <div>
        <div class="card">
            <div class="card-header">
                <b> Calendar App </b>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-4">
                        <div class="alert alert-danger" v-if="errors">
                            <ul class="m-0">
                                <li v-for="(value, id) in errors" :key="id">
                                    {{ value.join('\n') }}
                                </li>
                            </ul>
                        </div>

                        <form @submit.prevent="submitEvents" method="post">
                            <div class="form-group">
                                <label> Event </label>
                                <input class="form-control" v-model="form.eventName"/>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <span> From </span>
                                        <input class="form-control" v-model="form.dateFrom" id="dateFrom" autocomplete="off" >
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <span> To </span>
                                        <input class="form-control" v-model="form.dateTo" id="dateTo" autocomplete="off" >
                                    </div>
                                </div>
                            </div>

                            <div class="form-group">

                                <input type="checkbox" id="Sun" value="Sun" v-model="form.weekDays">
                                <label for="Sun">Sun</label>

                                <input type="checkbox" id="Mon" value="Mon" v-model="form.weekDays">
                                <label for="Mon">Mon</label>

                                <input type="checkbox" id="Tue" value="Tue" v-model="form.weekDays">
                                <label for="Tue">Tue</label>

                                <input type="checkbox" id="Wed" value="Wed" v-model="form.weekDays">
                                <label for="Wed">Wed</label>

                                <input type="checkbox" id="Thu" value="Thu" v-model="form.weekDays">
                                <label for="Thu">Thu</label>

                                <input type="checkbox" id="Fri" value="Fri" v-model="form.weekDays">
                                <label for="Fri">Fri</label>

                                <input type="checkbox" id="Sat" value="Sat" v-model="form.weekDays">
                                <label for="Mon">Sat</label>

                            </div>

                            <div class="form-group">
                                <button class="btn btn-success" type="submit">Save</button>
                            </div>
                        </form>
                    </div>
                    <div class="col-md-8">
                        <h2> <b> {{ currentDate }} </b> </h2>

                        <table class="table table-striped">
                            <tbody>
                                <tr v-for="day in days" :key='day.id' :class="[inDateRange(day.num) && inWeekDays(day.week) ? 'col-active' : '']">
                                    <th scope="row">{{ day.id }}</th>
                                    <td> {{ inDateRange(day.num) &&  inWeekDays(day.week) ? calendarEvents.eventName : ''}} </td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
<script>
    import validate from 'validate.js';

    export default {
        name: 'Home',
        data () {
            return {
                currentDate: '',
                days:[],
                errors: null,
                form: {
                    eventName: '',
                    dateFrom: null,
                    dateTo: null,
                    weekDays: []
                }
            }
        },
        computed: {
            calendarEvents() {
                return this.$store.getters.API_DATA;
            }
        },
        methods: {
            initDatePicker(){
                const dateFormat =  'yy-mm-dd'
                const _this = this;

                $('#dateFrom').datepicker({
                    changeMonth: false,
                    changeYear: false,
                    stepMonths: false,
                    dateFormat: dateFormat
                }).on('change', function() {
                    _this.form.dateFrom = $(this).val();
                });

                $('#dateTo').datepicker({
                    changeMonth: false,
                    changeYear: false,
                    stepMonths: false,
                    dateFormat: dateFormat
                }).on('change', function() {
                    _this.form.dateTo = $(this).val();
                });
            },
            getMonthName() {
                const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];

                const d = new Date();
                this.currentDate = monthNames[d.getMonth()] + ' ' + d.getFullYear();
            },
            getDaysInMonth (month, year) {
                return new Date(year, month, 0).getDate();
            },
            getCurrentDayName (d){
                return d.toString().split(' ')[0];
            },
            setDaysArray(y, m) {
                const numDaysInMonth = this.getDaysInMonth(m, y);
                let name = '';

                return Array.from(Array(numDaysInMonth), (x, index) => {
                    index += 1;
                    name = this.getCurrentDayName(new Date(m+'/'+ index +'/'+y))
                    return {id:index + ' ' + name, week: name, num: index }
                })
            },
            getNumDays(){
                const d = new Date();
                this.days = this.setDaysArray(d.getFullYear(), (d.getMonth()+1));
            },
            getDaysBetween(from, to) {
                const end = new Date(to);
                const arr = new Array();
                const dt = new Date(from);

                while (dt <= end) {
                    arr.push(dt.getDate());
                    dt.setDate(dt.getDate() + 1);
                }
                return arr;
            },
            inDateRange(d){
                const {dateFrom, dateTo} = this.calendarEvents
                const range = this.getDaysBetween(dateFrom, dateTo);
                return (range.indexOf(d) !== -1)
            },
            inWeekDays(d){
                const {weekDays} = this.calendarEvents
                return (weekDays.indexOf(d) !== -1)
            },
            initCalendarEvents() {
                this.getMonthName();
                this.getNumDays();
            },
            formConstraints: () => ({
                eventName: {
                    presence: true,
                        length: {
                        minimum: 3
                    }
                },
                dateFrom: {
                    presence: true,
                },
                dateTo: {
                    presence: true,
                },
                weekDays: {
                    presence: true,
                        length: {
                            minimum: 1,
                            message: '^Please select week days!'
                    }
                }
            }),
            submitEvents() {
                const errors = validate(this.$data.form, this.formConstraints());

                if (errors) {
                    this.errors = errors;
                    return false;
                } else {
                    this.errors = null;
                    this.$store.dispatch('saveCalendarEvents', this.form);
                }
            }
        },
        mounted() {
            this.initDatePicker();
            this.initCalendarEvents();

            this.$store.dispatch('getCalendarEvents');
        }
    }
</script>
