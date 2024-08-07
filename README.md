# JsPsych-Vue

A Vue component for [JsPsych](https://www.jspsych.org/v7).

Compatible with most official plugins and extensions.

Feel free to use any third-party component in JsPsych! 🎉🎉🎉

[中文文档](./README.zh.md)

## Setup

Use yarn

```
yarn add jspsych-vue
```

Use npm

```
npm install jspsych-vue
```

**Note**: To use jspsych-vue, you should also add jspsych(v7) to your project, both npm install and CDN are supported. For more details, see [https://www.jspsych.org/latest/tutorials/hello-world/](https://www.jspsych.org/latest/tutorials/hello-world/)

CDN are recommond.

Add css files to your project, which is look like:

```js
import './assets/main.css'
import 'jspsych-vue/dist/style.css'
import 'jspsych/css/jspsych.css' // if use CDN, do not add this line.

import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

Then in your component, you should pass options to init jspsych object. For npm user, you should also pass module props.

```html
<script lang="ts" setup>
  import * as jsPsychModule from 'jspsych' // for npm user
  const options = {...} // any options
</script>
<template>
  <JsPsych :options="options"></JsPsych>
  <!-- for npm user, use module props -->
  <JsPsych :options="options" :module="jsPsychModule"></JsPsych>
</template>
```

That's all!

## Bassic Usage

### 1. Write Component instead of Jspsych Plugin

Jspsych Plugin is the basic part of an experiement, it defines the interface, collects data, push the timeline and so on. By the way, there are plenty of plugins you can find in jspsych and jspsych-contrib.

Though Jspsych Plugin is powerful, the limitation is that you can only use js to draw the interface. So here comes Jspsych-Vue, which allows you to replace any Plugin by a Vue Component, and feel free to use any third-part UI component!

If you want to use a Component in JsPsych, make sure it meets following two requets:

- Export the `info` property at the top level of the component (see [jsPsych Plugin](https://www.jspsych.org/v7/developers/plugin-development/#static-info))
- Call `jsPschy.finishTrial` at the appropriate time to go to next trial.

Example:

```html
<template>
  <div>Anything you want to show...</div>
</template>
<script>
  export default {
    info: {
      parameters: {...} // info just the same as Jspsych Plugin
    },
    setup(props) {
      // no more trial function, just do anthing within setup.
      ...
      jsPsych.finiTrial() // remember to finish trial at some point, like when user click the button.
    }
  }
</script>
```

For users of the setup sugar, you should define info like this.

```html
<script setup>
  const info = defineOptions({
    parameters: {...}
  })
</script>
```

> Ensure not to use any local variables within `info`.

Same as the Plugin’s [trial method](https://www.jspsych.org/v7/developers/plugin-development/#trial), the Vue component can accepts two props:

- `trial`: Parameters from the parameters object that can be passed in when defining the timeline.
- `on_load`: Callback function for the load event.

Please refer to the JsPsych documentation for details.

### 2. Define the timeline in js file.

Just like psych, you should define the timelime to run trials. Create a JS file, for instance, `timeline/xxx.js` in the root directory, then define a [timeline](https://www.jspsych.org/v7/overview/timeline/). But insead of set a Jspsych Plugin to `trial.type`, you should set a Vue Component to `trial.component`.

Example:

```js
//timeline/HelloWorld.ts
import HelloWorld from '@/component/HelloWorld.vue'

const timeline = [{ component: HelloWorld }]
export default timeline
```

If you need use a jsPsych instance to define the timeline, just export a function.

Example:

```js
//timeline/HelloWorld.ts
import HelloWorld from '@/component/HelloWorld.vue'

const getTimeline (jsPsych: JsPsych) = [
  {
    component: HelloWorld,
    on_finish: () => {
      //You can use the jsPsych instance somewhere.
    }
  }
]
export default getTimeline
```

Simply put, you can replace the type of trial by component.

### 3. Define where to render the component and call `run` to start the experiment.

Define where to render the component and call run to start the experiment at a specific time.

Example:

```html
<template>
  <JsPsych @init="e => jsPsch = e"></JsPsych>
</template>

<script>
  import timeline1 from '@/timeline/HellowWorld.ts'
  var jsPsch = null

  onMounted(() => {
    jsPsch.run(timeline1)
  })
</script>
```

That is the complete process for developing a Vue compont with jsPsych. Below are some details.

### 4. Use Jspsych Plugin in Jspych-Vue

You can not use a component in a plugin(Because the trial itself define how to draw the dom, and it may overwrite the component), but you can still use Jspsych Plugin in Jspych-Vue.

Just use the origin way to define a trial, then push it in timeline. You can also define nested timelineNode use both component and trial. For more info see [Nested timeline.](https://www.jspsych.org/v7/overview/timeline/#nested-timelines)

Here are the differences.

- define trials:

  plugin

  ```js
  let trial = { type: MyPlugin, parameters1: xxx, parameters2: xxx }
  ```

  component

  ```js
  let trial = { component: MyComponent, props1: xxx, props2: xxxx }
  ```

- use parameters and do trial:

  plugin

  ```js
  class Plugin {
    trial(display_element, trial, on_load) {
      // draw something use js
      // do trial here
    }
  }
  ```

  component

  ```js
  export default {
    setup(props) {
      let trial = props.trial // {props1: xxx, props2: xxx}
      let on_load = props.on_load
      //do trial here
    }
  }
  ```

- run experiment

  plugin / component

  ```js
  jsPsych.run([trial])
  ```

- display data

  plugin:

  ```js
  jsPsych.data.displayData('json')
  ```

  component

  ```js
  jsPsych.data.displayData({ dom: el, type: 'json' })
  ```

When trial called, your component will be render as a child of Jspsych Component.

### 5.Get the jsPsych instance

Every JsPsych component create a JsPsych instance. There are two methods to access it.

1. Use `init` event outside of a JsPsych component.

   Example:

   ```html
   <template>
     <JsPsych @init="init"></JsPsych>
   </template>

   <script setup>
     let jsPsych;
     const init = (instance: any) => jsPsych = instance;
   </script>
   ```

2. Using `provide` within a JsPsych component.

   Example:

   ```html
   <script setup>
     import { porvice } from 'vue'
     const jsPsych = provide('jsPsych')
   </script>
   ```

## 6. Render default component before experiment

Jspsych-Vue component offer slots that allow you to show component before experiment start/after experiment end.

Example:

```html
<JsPsych>
  <div>Please wait...</div>
</JsPsych>
```

---

## 7. Render slot in Your component

You can pass any componnet in timeline, then use it. Be careful to use a function return the component.

Example:

```ts
const timeline = [{ component: MyComponent, compSlot: () => MySlot }]
```

Then use it in your component:

```html
<script setup>
const props = defineProps(['trial'])
const MySlot = props.trial.compSlot
</script>

<template>
  <div>
    ....
    <MySlot></MySlot>
  <div>
</template>
```

Thats all about how to start.

- If you want to know more details, please go to [reference](./doc/reference.md)
- If you want to see examples, please go to [example](./doc/example.md)
