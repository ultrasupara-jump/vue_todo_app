import { createApp, VueElement } from 'vue'
import App from './App.vue'
import router from './router'
import { initializeApp } from 'firebase/app'; //追加
import 'firebase/firestore' //追加

VueElement.config.productionTip = false

createApp(App).use(router).mount('#app')

const firebaseConfig = {
    apiKey: "AIzaSyBuGaLC4kkOHp0dEd2V_eepTZ_3lzZdwMU",
    authDomain: "vue-todo-app-92f9f.firebaseapp.com",
    projectId: "vue-todo-app-92f9f",
    storageBucket: "vue-todo-app-92f9f.appspot.com",
    messagingSenderId: "267300502849",
    appId: "1:267300502849:web:a6c7e32826158f66b275c0"
};

initializeApp(firebaseConfig); //追加

export const db = firebase.firestore() // 追加
