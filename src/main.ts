import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

const mode =  import.meta.env?.MODE || "cordova";

console.log("Current mode is:", mode);

createApp(App).mount('#app')
