import { createRouter, createWebHistory } from 'vue-router';
import Register from '../components/UserRegister.vue';
import Login from '../components/UserLogin.vue';
import WelcomePage from '../components/WelcomePage.vue';

const routes = [
    {
        path: '/register',
        name: 'Register',
        component: Register,
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
    {
        path: '/',
        name: 'Welcome',
        component: WelcomePage,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
