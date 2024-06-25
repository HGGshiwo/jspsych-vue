# jspsych-vue


## Bassic Usage

```html
<template>
  <JsPsych ref="jsPsychRef"></JsPsych> 
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
const jsPsychRef = ref<any>()

onMounted(() => {
  jsPsychRef.value.run([
    { type: htmlKeyboardResponse, options: { stimulus: "Press the space bar!" } },
  ])
})
</script>
```
## Options
JsPsych 组件接受一个名为options的属性, 可以通过该属性配置JsPsych对象。注意和对象有以下区别:
|Parameter|type|Description|
|-|-|-|
|display_element|css selector|用于指定JsPsych中的DOM_target, 默认为body, 和事件监听有关, 实际显示位置通过组件指定|
|experiment_width|string\|number|string或者number(单位为px)

## Default Slot

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
