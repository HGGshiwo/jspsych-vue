/* eslint-disable */
import { initJsPsych } from "jspsych";
import UseVuePlugin from "./plugin/use-vue";
import UseVueExtension from "./extention/use-vue";
import HelloWorld from "./components/HelloWorld.vue";
import 'jspsych/css/jspsych.css'

const jsPsych = initJsPsych({
  extensions: [
    { type: UseVueExtension }
  ]
});

let trial = {
  type: UseVuePlugin,
  extensions: [
    { type: UseVueExtension, params: { component: HelloWorld } }
  ]
};

jsPsych.run([trial]).then(() => {
  var trials = jsPsych.data.get().values().map(item => item.data)
  console.log(trials)
});



