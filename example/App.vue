<template>
  <JsPsychVue :options="options" @init="init">
    <button type="button" class="btn btn-primary m-3" @click="run1">Run Hello World</button>
    <button type="button" class="btn btn-primary m-3" @click="run2">Run Reaction Time</button>
  </JsPsychVue>
  <Teleport to="body">
    <!-- use the modal component, pass in the prop -->
    <modal :show="showModal">
      <template #header>
        <h3>Display Trial Data</h3>
      </template>
      <template #body>
        <div ref="contentRef"></div>
      </template>
      <template #footer>
        <button class="modal-default-button" @click="showModal = false">
          Close
        </button>
      </template>
    </modal>
  </Teleport>
</template>

<script setup lang="ts">
import { nextTick, ref } from "vue";
import JsPsychVue from "../src/JsPsych.vue";
import timeline1 from "./timeline/HelloWorld";
import timeline2 from "./timeline/Responce";
import Modal from "./components/Modal.vue";

let jsPsych: any;
const showModal = ref(false)
const contentRef = ref(null)

const options = {
  on_finish: () => {
    showModal.value = true
    nextTick(() => {
      jsPsych.data.displayData({ dom: contentRef.value })
    })
  }
}

const init = (instance: any) => {
  jsPsych = instance;
};

const run1 = () => {
  jsPsych.run(timeline1(jsPsych));
}

const run2 = () => {
  jsPsych.run(timeline2(jsPsych));
}
</script>