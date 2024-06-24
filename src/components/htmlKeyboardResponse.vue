<template>
  <div class="aaa" ref="content"></div>
</template>

<script setup lang="ts">

import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
import { onMounted, ref } from 'vue';

const content = ref()
const props = defineProps(['trail'])

onMounted(()=>{
  // htmlKeyboardResponse.prototype.trial(content.value, props.trail)
})

defineOptions({
  type: htmlKeyboardResponse,
})
</script>
