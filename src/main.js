import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './router'

Vue.config.productionTip = false
Vue.use(VueRouter)




new Vue({
    el:'#root',
    components:{App},
    render:h=>h(App),
    methods: {
        
    },
    router:router
})
