import VueRouter from 'vue-router'
import Resource from '../components/Resource'
// import Exe from '../components/Exe'


export default new VueRouter({
    mode:'hash',
    routes: [
        {
            path: '/qbg',
            beforeEnter(to, from, next) {
                window.location.replace('/qbg.html');
            }
        },
        { path: '/:platform', component: Resource },
        { path: '/', redirect: '/m' },

    ]
})

