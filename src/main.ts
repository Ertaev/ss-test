import "./assets/main.css";
import "element-plus/dist/index.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import ElementPlus from "element-plus";

const app = createApp(App);

app.use(ElementPlus);
app.use(createPinia());

app.mount("#app");
