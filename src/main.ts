import 'jspsych/css/jspsych.css';
import { createApp } from "vue";
import App from "./App.vue";
import jsPsych from "./jspsych";


const app = createApp(App)
// app.use(jsPsych)
app.mount("#app")

// import {initJsPsych} from 'jspsych';
// import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';

// const jsPsych = initJsPsych();

// const trial = {
//   type: htmlKeyboardResponse,
//   stimulus: 'Hello world!',
// }

// jsPsych.run([trial]);