# JsPsych-Vue

A Vue component for [JsPsych](https://www.jspsych.org/v7).

Compatible with most official plugins and extensions.

Feel free to use any third-party component in JsPsych! 🎉🎉🎉

[中文文档](./README.zh.md)

## Install

Use yarn

```
yarn add jspsych-vue
```

Use npm

```
npm install jspsych-vue
```

In your main.js:

```js
import 'jspsych-vue/dist/style.css'
```

Then in some where of your vue app:

```html
<template>
  <JsPsych ref="jsPsychRef"></JsPsych>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  const jsPsychRef = ref<any>()

  onMounted(() => {
    jsPsychRef.value.run(trail)
  })
</script>
```

Thats all you need to use JsPsych-Vue.

## Bassic Usage

### 1. Define the component like any Vue component, but ensure the following:

- Export the `info` property at the top level of the component (see [jsPsych Plugin](https://www.jspsych.org/v7/developers/plugin-development/#static-info))
- Call `jsPschy.finishTrial` at the appropriate time
- Utilize the `trial` and `on_load` props at the appropriate locations

Example:

```html
<template>
  <div>Anything you want to show...</div>
</template>
<script>
  export default {
    setup(props) {
      //You can access `props.trial` and `props.on_load` here.
      ...
    },
    info: {
      parameters: {...}
    }
  }
</script>
```

For users of the setup syntax sugar.

Example:

```html
<script setup>
  const info = defineOptions({
    parameters: {...}
  })
</script>
```

Ensure not to use any local variables within `info`.

Same as the Plugin’s [trial method](https://www.jspsych.org/v7/developers/plugin-development/#trial), the component accepts two props:

- `trial`: Parameters from the parameters object that can be passed in when defining the timeline
- `on_load`: Callback function for the load event

Please refer to the JsPsych documentation for specifics.

### 2. Define the timeline in js file.

In a js file, for instance, `timeline/xxx.js` in the root directory, define a [trials](https://www.jspsych.org/v7/overview/timeline/), and set its component attribute to the component you have written.

Example:

```js
//timeline/HelloWorld.ts
import HelloWorld from '@/component/HelloWorld.vue'

const timeline = [{ component: HelloWorld }]
export default timeline
```

If you need to use a jsPsych instance, you can also export a function.

Example:

```js
//timeline/HelloWorld.ts
import HelloWorld from '@/component/HelloWorld.vue'

const getTimeline (jsPsych: any) = [
  {
    component: HelloWorld,
    on_finish: () => {
      //You can use the jsPsych instance somewhere.
    }
  }
]
export default getTimeline
```

**Note**:

1. The type attribute is still supported but cannot be used simultaneously with component attribute.
2. Nested timelines are supported..

Simply put, you can replace the type of certain trials with component while leaving other trials unchanged.

### 3. Define the location for rendering the component somewhere and call `run` to start the experiment.

Define the location for rendering the component and call run to start the experiment at a specific location.

Example:

```html
<template>
  <JsPsych ref="JsPschRef"></JsPsych>
</template>

<script>
  import timeline1 from '@/timeline/HellowWorld.ts'
  onMounted(() => {
    jsPschRef.value.run(timeline1)
  })
</script>
```

### 4.Obtain the jsPsych instance

Every JsPsych component instantiates a JsPsych object. There are two methods to access the instance.:

The instance is returned during the JsPsych init event.

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

Using `provide` within a JsPsych component.

Example:

```html
<script setup>
  import { porvice } from 'vue'
  const jsPsych = provide('jsPsych')
</script>
```

## Reference

### Props

JsPsych components accept a property called [options](https://www.jspsych.org/v7/reference/jspsych/#parameters) which can be used to configure the JsPsych object. The distinction is as follows:

| Parameter       | type         | Description                                                                                                                                                                |
| --------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| display_element | css selector | It is used to specify the DOM_target in JsPsych, which defaults to body and is related to event listening. The actual display position is specified through the component. |

### Methods

The JsPsych component has the following methods. Please be mindful not to call methods with the same name on the JsPsych object.

| Name                       | Type                                              | Description                                                                                                                             |
| -------------------------- | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `run`                      | `(Trials: any[])=>Promise`                        | To start an experiment, use a function that is equivalent to `JsPsych.run`                                                              |
| `adaddNodeToEndOfTimeline` | `(Node: any)=>void`                               | To add a node at the end, use a function that is equivalent to `JsPsych.addNodeToEndOfTimeline`.                                        |
| `displayData`              | `(options: {format: string, dom: Element})=>void` | To render data on a specified DOM element, use a function that is consistent with `JsPsychData.displayData`, for other functionalities. |

Other methods of the `JsPsych` object can be called at will.

### Slots

JsPsych provides three slots to display at the beginning or end of an experiment.

| Name    | Time to use                                             |
| ------- | ------------------------------------------------------- |
| default | Before `run` called or after `options.on_finish` called |
| start   | before `run` called                                     |
| finish  | after `on_finish` called                                |

**Note**:

- When both `default` and `start/finish` are defined, `start/finish` takes priority for display.

- The Function Call in the following order:

  ```mermaid
  graph LR
  	b[default/start.onMounted] --run--> c[options.on_start]
  	c--do trial-->a[options.on_end]
  	a-->d[default/end.onMounted]
  ```

Example:

```html
<JsPsych>
  <template #start>
    <p>Welcome!</p>
    <p></p
  ></template>
</JsPsych>
```

## Example

The Example includes:

- A simple “Hello World” example demonstrates how to use components instead of trials.
- [Simple Reaction Time Task](https://www.jspsych.org/v7/tutorials/rt-task/) demonstrates how to use JsPsych’s plugin in JsPsych-Vue

If you want to run the example, first clone the entire repository

```shell
git clone https://github.com/HGGshiwo/jspsych-vue.git
```

Install the dependencies in the root directory

```
yarn install
```

Start the server.

```
yarn serve
```
