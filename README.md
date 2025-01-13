以下是修改后的文档，修复了语法错误并简化了表达：

---

# JsPsych-Vue

A Vue component for [JsPsych](https://www.jspsych.org/v7), compatible with most official plugins and extensions.

Easily integrate third-party components into JsPsych experiments.

[中文文档](./README.zh.md)

Demo: [https://hggshiwo.github.io/jspsych-vue/](https://hggshiwo.github.io/jspsych-vue/)

## Setup

Install via Yarn:

```bash
yarn add jspsych-vue
```

Or via npm:

```bash
npm install jspsych-vue
```

**Note**: Ensure `jspsych` (v7) is also installed in your project. You can use npm or a CDN. See the [official tutorial](https://www.jspsych.org/latest/tutorials/hello-world/) for details.

Using a CDN is recommended. Add the required CSS files to your project:

```js
import './assets/main.css'
import 'jspsych-vue/dist/style.css'
import 'jspsych/css/jspsych.css' // Skip this line if using a CDN.

import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

### In Components

Pass `options` to initialize the `jsPsych` instance. For npm users, pass the `module` prop as well:

```html
<script lang="ts" setup>
  import * as jsPsychModule from 'jspsych'; // For npm users
  const options = { ... }; // Experiment options
</script>

<template>
  <JsPsych :options="options"></JsPsych>
  <!-- For npm users -->
  <JsPsych :options="options" :module="jsPsychModule"></JsPsych>
</template>
```

That's it!

---

## Basic Usage

### 1. Replace Plugins with Components

JsPsych plugins define experiment logic, interfaces, and data handling. However, they limit UI flexibility as everything is rendered in JavaScript. With JsPsych-Vue, you can replace plugins with Vue components and freely use third-party UI libraries.

To use a Vue component in JsPsych, ensure:

1. It exports a top-level `info` object (similar to JsPsych plugins).
2. It calls `jsPsych.finishTrial` at the appropriate time.

Example:

```html
<template>
  <div>Custom UI goes here...</div>
</template>

<script>
  export default {
    info: {
      parameters: { ... } // Same structure as a JsPsych plugin
    },
    setup(props) {
      // Perform experiment logic
      jsPsych.finishTrial(); // Ensure to call this to proceed
    }
  };
</script>
```

For components using the `setup` syntax:

```html
<script setup>
  const info = defineOptions({
    parameters: { ... }
  });
</script>
```

Do not use local variables within `info`.

Props provided to components include:

- `trial`: Parameters passed when defining the timeline.
- `on_load`: Callback for the load event.

Refer to the JsPsych documentation for details.

---

### 2. Define the Timeline in a JavaScript File

Create a timeline file (e.g., `timeline/xxx.js`) and replace the `type` field with `component`:

Example:

```js
// timeline/HelloWorld.ts
import HelloWorld from '@/component/HelloWorld.vue'

const timeline = [{ component: HelloWorld }]
export default timeline
```

If a JsPsych instance is required:

```js
// timeline/HelloWorld.ts
import HelloWorld from '@/component/HelloWorld.vue'

const getTimeline = (jsPsych) => [
  {
    component: HelloWorld,
    on_finish: () => {
      // Use the jsPsych instance as needed
    }
  }
]
export default getTimeline
```

---

### 3. Render Components and Start the Experiment

Define the render location and call `run` to start the experiment.

Example:

```html
<template>
  <JsPsych @init="e => jsPsych = e"></JsPsych>
</template>

<script>
  import timeline1 from '@/timeline/HelloWorld.ts'

  let jsPsych = null

  onMounted(() => {
    jsPsych.run(timeline1)
  })
</script>
```

---

### 4. Use Plugins in JsPsych-Vue

While plugins cannot render Vue components directly, you can still use them within the timeline. Nested timelines can mix plugins and components. See [nested timelines](https://www.jspsych.org/v7/overview/timeline/#nested-timelines) for details.

Key differences:

- **Define Trials**:

  - Plugin:
    ```js
    const trial = { type: MyPlugin, parameter1: value1 }
    ```
  - Component:
    ```js
    const trial = { component: MyComponent, prop1: value1 }
    ```

- **Logic**:
  - Plugin:
    ```js
    class Plugin {
      trial(display_element, trial, on_load) {
        // Render and handle logic
      }
    }
    ```
  - Component:
    ```html
    <script>
      export default {
        setup(props) {
          const trial = props.trial
          const on_load = props.on_load
          // Handle logic
        }
      }
    </script>
    ```

---

### 5. Access the JsPsych Instance

Two methods are available:

1. Use the `init` event:

   ```html
   <template>
     <JsPsych @init="init"></JsPsych>
   </template>

   <script setup>
     let jsPsych
     const init = (instance) => (jsPsych = instance)
   </script>
   ```

2. Use Vue's `provide`:

   ```html
   <script setup>
     import { provide } from 'vue'
     const jsPsych = provide('jsPsych')
   </script>
   ```

---

### 6. Render Default Components Before/After the Experiment

Use slots to display content before or after an experiment.

Example:

```html
<JsPsych>
  <div>Loading...</div>
</JsPsych>
```

---

### 7. Use Slots in Custom Components

Pass components in the timeline and use them as slots.

Example:

```ts
const timeline = [{ component: MyComponent, compSlot: () => MySlot }]
```

In `MyComponent`:

```html
<script setup>
  const props = defineProps(['trial'])
  const MySlot = props.trial.compSlot
</script>

<template>
  <div>
    ...
    <MySlot></MySlot>
  </div>
</template>
```

---

For more details, see the [reference](./doc/reference.md) or [examples](./doc/example.md).
