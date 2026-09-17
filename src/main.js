import process from 'process/browser';

window.process = process;
import { createApp } from 'vue';
import App from './views/App.vue';
import router from './router';
import './styles/global.css';

const app = createApp(App);
app.use(router);
app.mount('#app');
