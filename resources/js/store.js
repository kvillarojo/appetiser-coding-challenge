import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';
import 'vue-toastr-2/dist/vue-toastr-2.min.css'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        api: {
            data: {
                'dateFrom': null,
                'dateTo': null,
                'eventName':'',
                'weekDays': []
            }
        },
    },
    getters: {
        'API_DATA': (state) => state.api.data
    },
    mutations: {
        'ADD_EVENT_REQUEST': (state, payload) => {
            if(payload.events){
                state.api.data = JSON.parse(payload.events);
            }
        }
    },
    actions: {
        saveCalendarEvents(context, payload){
            axios.post('/api/calendar', payload).then(response => {
                toastr.success('New event successFully added!', 'Add Event');
                context.dispatch('getCalendarEvents');
            }).catch(error => {
                console.log(error);
            });
        },
        getCalendarEvents(context){
            axios.get('/api/calendar').then(response => {
                context.commit('ADD_EVENT_REQUEST', response.data)
            }).catch(error => {
                console.log(error);
            });
        }
    }
});
