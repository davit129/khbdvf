import Vue from "vue";
import App from "./App.vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import axios from "axios";

Vue.use(Vuetify);
const vuetify = new Vuetify({
  icons: {
    iconfont: "mdi",
  },
});

new Vue({
  axios,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
