import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Lara from './presets/lara';
import Tooltip from 'primevue/tooltip';
import ToastService from 'primevue/toastservice';




const app = createApp(App);
app.use(PrimeVue, {
  unstyled: true,
  pt: Lara
});
app.use(ToastService);
app.directive('tooltip', Tooltip);

app.mount('#app')
