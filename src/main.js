import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VueI18n from 'vue-i18n'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSyringe, faCheck } from "@fortawesome/free-solid-svg-icons";
import TreeView from "vue-json-tree-view"
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

Vue.config.productionTip = false;

//Icons
Vue.component('font-awesome-icon', FontAwesomeIcon);
library.add(faSyringe);
library.add(faCheck);

//Translations
Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: (navigator.language || navigator.userLanguage).includes('en') ? 'en' : 'fr',
  messages: {
    'en': require('./locales/en.json'),
    'fr': require('./locales/fr.json'),
  }
});

//Toast
Vue.use(Toast, {});

//Json viewer
Vue.use(TreeView)

new Vue({
  i18n,
  vuetify,
  render: h => h(App)
}).$mount('#app')
