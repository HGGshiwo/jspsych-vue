以下是翻译后的内容：

---

# JsPsych-Vue

一个适用于 [JsPsych](https://www.jspsych.org/v7) 的 Vue 组件，兼容大多数官方插件和扩展。

轻松将第三方组件集成到 JsPsych 实验中。

[English Documentation](./README.md)

演示地址：[https://hggshiwo.github.io/jspsych-vue/](https://hggshiwo.github.io/jspsych-vue/)

---

## 安装

通过 Yarn 安装：

```bash
yarn add jspsych-vue
```

通过 npm 安装：

```bash
npm install jspsych-vue
```

**注意**：确保项目中也安装了 `jspsych`（v7），可以使用 npm 或 CDN。更多详情请参考 [官方教程](https://www.jspsych.org/latest/tutorials/hello-world/)。

建议使用 CDN。在项目中引入以下 CSS 文件：

```js
import './assets/main.css'
import 'jspsych-vue/dist/style.css'
import 'jspsych/css/jspsych.css' // 如果使用 CDN，请省略这一行。

import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

---

### 在组件中使用

需要传递 `options` 参数来初始化 `jsPsych` 实例。如果使用 npm，还需要传递 `module` 参数。

```html
<script lang="ts" setup>
  import * as jsPsychModule from 'jspsych'; // npm 用户
  const options = { ... }; // 实验选项
</script>

<template>
  <JsPsych :options="options"></JsPsych>
  <!-- npm 用户 -->
  <JsPsych :options="options" :module="jsPsychModule"></JsPsych>
</template>
```

这就是基本设置！

---

## 基础用法

### 1. 用 Vue 组件替换插件

JsPsych 插件定义了实验逻辑、界面以及数据收集。但插件仅支持用 JavaScript 渲染界面，有一定局限性。JsPsych-Vue 允许用 Vue 组件替换插件，并可以自由使用第三方 UI 库。

**要在 JsPsych 中使用 Vue 组件，需要满足以下条件**：

1. 导出一个顶层的 `info` 对象（与 JsPsych 插件类似）。
2. 在适当时机调用 `jsPsych.finishTrial` 来结束当前实验环节。

示例：

```html
<template>
  <div>自定义界面内容...</div>
</template>

<script>
  export default {
    info: {
      parameters: { ... } // 与 JsPsych 插件相同的参数定义
    },
    setup(props) {
      // 实验逻辑
      jsPsych.finishTrial(); // 结束当前环节
    }
  };
</script>
```

如果使用 `setup` 语法，定义 `info` 的方式如下：

```html
<script setup>
  const info = defineOptions({
    parameters: { ... }
  });
</script>
```

**注意：不要在 `info` 中使用局部变量。**

Vue 组件可以接收以下两个参数：

- `trial`：定义时间线时传入的参数。
- `on_load`：加载事件的回调函数。

更多细节请参考 JsPsych 文档。

---

### 2. 在 JavaScript 文件中定义时间线

创建一个时间线文件（如 `timeline/xxx.js`），将 `type` 替换为 `component`：

示例：

```js
// timeline/HelloWorld.ts
import HelloWorld from '@/component/HelloWorld.vue'

const timeline = [{ component: HelloWorld }]
export default timeline
```

如果需要使用 JsPsych 实例：

```js
// timeline/HelloWorld.ts
import HelloWorld from '@/component/HelloWorld.vue'

const getTimeline = (jsPsych) => [
  {
    component: HelloWorld,
    on_finish: () => {
      // 在这里使用 jsPsych 实例
    }
  }
]
export default getTimeline
```

---

### 3. 渲染组件并启动实验

定义渲染位置，并通过调用 `run` 方法启动实验。

示例：

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

### 4. 在 JsPsych-Vue 中使用插件

虽然插件无法直接渲染 Vue 组件，但仍可以将插件与组件结合在时间线中使用。嵌套时间线可以同时包含插件和组件。更多信息请参考 [嵌套时间线](https://www.jspsych.org/v7/overview/timeline/#nested-timelines)。

以下是插件和组件的一些区别：

- **定义实验环节**：

  - 插件：
    ```js
    const trial = { type: MyPlugin, parameter1: value1 }
    ```
  - 组件：
    ```js
    const trial = { component: MyComponent, prop1: value1 }
    ```

- **逻辑实现**：
  - 插件：
    ```js
    class Plugin {
      trial(display_element, trial, on_load) {
        // 渲染并处理逻辑
      }
    }
    ```
  - 组件：
    ```html
    <script>
      export default {
        setup(props) {
          const trial = props.trial
          const on_load = props.on_load
          // 处理逻辑
        }
      }
    </script>
    ```

---

### 5. 获取 JsPsych 实例

可以通过两种方式获取 JsPsych 实例：

1. 使用 `init` 事件：

   ```html
   <template>
     <JsPsych @init="init"></JsPsych>
   </template>

   <script setup>
     let jsPsych
     const init = (instance) => (jsPsych = instance)
   </script>
   ```

2. 使用 Vue 的 `provide`：

   ```html
   <script setup>
     import { provide } from 'vue'
     const jsPsych = provide('jsPsych')
   </script>
   ```

---

### 6. 在实验开始/结束前后渲染默认内容

JsPsych-Vue 提供了插槽，允许在实验开始前或结束后显示内容。

示例：

```html
<JsPsych>
  <div>请稍候...</div>
</JsPsych>
```

---

### 7. 在组件中使用插槽

将组件作为插槽传递到时间线中并使用。

示例：

```ts
const timeline = [{ component: MyComponent, compSlot: () => MySlot }]
```

在 `MyComponent` 中使用：

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

以上是如何开始使用的全部内容。

- 了解更多，请参考 [参考文档](./doc/reference.md)。
- 查看示例，请访问 [示例文档](./doc/example.md)。
