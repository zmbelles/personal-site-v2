import process from 'process/browser';

window.process = process;
import { createApp } from 'vue';
import App from './views/App.vue';
import router from './router';

const app = createApp(App);
app.use(router);
app.use(require('prerender-node').set('prerenderToken', 'AmdTG5do8VyKNtVFk2OI'));
app.mount('#app');



