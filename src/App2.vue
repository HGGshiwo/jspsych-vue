<template>
  <JsPsych :autoRun="false" ref="jsPsychRef">
    <button type="button" class="btn btn-primary" @click="run">Click to Run</button>
  </JsPsych>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import JsPsych from "./components/JsPsych.vue";
import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";

const jsPsychRef = ref<any>();
const run = () => {
  jsPsychRef.value.run([
    { type: htmlKeyboardResponse, options: { stimulus: "Press the space bar!" } },
  ])
    .then((res: any) => {
      //next run, should reset timeline
      jsPsychRef.value.run([
        { type: htmlKeyboardResponse, options: { stimulus: "Press the space bar2!" } },
      ])
    })
}



</script>