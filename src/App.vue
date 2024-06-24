<template>
  <JsPsych @init="e=>console.log(e)" :timeline="timeline"></JsPsych>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import JsPsych from "./components/JsPsych.vue";
import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
import HelloWorld2 from "./components/HelloWorld2.vue";

const timeline = [
  { component: HelloWorld2, options: { msg: "hello" } },
  { component: HelloWorld2, options: { msg: "world" } },
  { type: htmlKeyboardResponse, options: { stimulus: "Press the space bar!" } },
  { component: HelloWorld2, options: { msg: "goodbye" } },
]
export default defineComponent({
  name: "App",
  components: {
    JsPsych,
  },
  data() {
    return {
      timeline,
    };
  },
});
</script>

<style lang="scss">
html,
body,
#app {
  height: 100%;
  width: 100%;
  margin: 0;
}
</style>
