import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'toastr/build/toastr.min.css';
import { fpjsPlugin } from '@fingerprintjs/fingerprintjs-pro-vue-v3';

const app = createApp(App);
app.use(router);
app.use(fpjsPlugin, {
    loadOptions: {
        apiKey: "ku2mYGIIWMIwbxtxaqRp",
    },
}).mount('#app');