# JsPsych-Vue

A Vue component for [JsPsych](https://www.jspsych.org/v7).

兼容大部分的官方Plugin和Extention.

Feel free to use any third-party component in JsPsych! 🎉🎉🎉

[English Document](./README.md)

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

### 1. 像定义任何vue组件一样定义组件, 但是需要满足三个条件:

- 在组件顶层导出 `info` 属性(详见[jsPsych Plugin](https://www.jspsych.org/v7/developers/plugin-development/#static-info))
- 在合适的时机调用 `jsPschy.finishTrial`
- 在合适的地方使用`trial`和`on_load`两个props

例子:

```html
<template>
  <div>Anything you want to show...</div>
</template>
<script>
  export default {
    setup(props) {
      //这里可以访问props.trial和props.on_load
      ...
    },
    info: {
      parameters: {...}
    }
  }
</script>
```

对于setup语法糖用户, 例子:

```html
<script setup>
  const info = defineOptions({
    parameters: {...}
  })
</script>
```

注意不能在info中使用任何局部变量。

和Plugin的[trial](https://www.jspsych.org/v7/developers/plugin-development/#trial)方法一样, 组件接受两个props:

- trial: parameter中的参数, 可以在定义timeline的时候传入
- on_load: load事件的回调函数

具体请看官网的文档。

### 2. 在js文件中定义timeline

在某个js文件中(比如根目录下的timeline/xxx.js)定义一个[trials](https://www.jspsych.org/v7/overview/timeline/), 并且将其component属性定义为你编写的组件。

例子:

```js
//timeline/HelloWorld.ts
import HelloWorld from '@/component/HelloWorld.vue'

const timeline = [{ component: HelloWorld }]
export default timeline
```

如果需要使用jsPsych实例, 也可以导出一个函数, 例子:

```js
//timeline/HelloWorld.ts
import HelloWorld from '@/component/HelloWorld.vue'

const getTimeline (jsPsych: any) = [
  {
    component: HelloWorld,
    on_finish: () => {
      //可以在某个地方使用jsPsych实例
    }
  }
]
export default getTimeline
```

**Note**:

1. type属性仍然被支持, 但是不能和component同时使用
2. 支持嵌套的timeline.

简单来说, 你可以将某些trial的type替换为component, 而保持其他trial不变。

### 3. 在某个地方定义组件渲染的位置, 并且调用run开始实验

就如同vue-router一样, 你需要定义一个组件渲染的位置。并调用run开始实验。

例子:

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

### 4.获取jsPsych实例

每个JsPsych组件都会实例化一个JsPsych对象, 有两种方法访问实例:

JsPsych的init事件时会返回该实例, 例子:

```html
<template>
  <JsPsych @init="init"></JsPsych>
</template>

<script setup>
  let jsPsych;
  const init = (instance: any) => jsPsych = instance;
</script>
```

在JsPsych组件内部使用provide, 例子:

```html
<script setup>
  import { porvice } from 'vue'
  const jsPsych = provide('jsPsych')
</script>
```

## 文档

### Props

JsPsych 组件接受一个名为[options](https://www.jspsych.org/v7/reference/jspsych/#parameters)的属性, 可以通过该属性配置JsPsych对象。区别如下:
|Parameter|type|Description|
|-|-|-|
|display_element|css selector|用于指定JsPsych中的DOM_target, 默认为body, 和事件监听有关, 实际显示位置通过组件指定|

### Methods

JsPsych组件上具有以下方法, 注意不要调用JsPsych对象上的同名方法。
|名称|类型|描述|
|-|-|-|
|run|`(Trials: any[])=>Promise`|开始一个实验, 和JsPsych.run功能相同|
|adaddNodeToEndOfTimeline|`(Node: any)=>void`|在结束时添加一个节点, 和JsPsych.addNodeToEndOfTimeline功能相同|
|displayData|`(options: {format: string, dom: Element})=>void`|在指定的dom元素上绘制数据, 其他和JsPsychData.displayData功能一致|

JsPsych对象的其他方法可以随便调用。

### Slots

JsPsych提供了三个插槽, 可以在实验开始或者结束时显示。

| 名称    | 使用时机                           |
| ------- | ---------------------------------- |
| default | 调用run之前, options.on_finish之后 |
| start   | 调用run之前                        |
| finish  | 调用on_finish之时                  |

**Note**:

- 当同时定义了`default`和`start/finish`时, 优先显示`start/finish`。
- 函数的调用顺序如下：

  ```mermaid
  graph LR
  	b[default/start.onMounted] --run--> c[options.on_start]
  	c--do trial-->a[options.on_end]
  	a-->d[default/end.onMounted]
  ```

例子:

```html
<JsPsych>
  <template #start>
    <p>Welcome!</p>
    <p></p
  ></template>
</JsPsych>
```

## Example

示例中包含了

- 一个简单的Hello World示例演示如何使用组件替代Trial
- [Simple Reaction Time Task](https://www.jspsych.org/v7/tutorials/rt-task/) 演示了如何在JsPsych-Vue使用JsPsych的Plugin.

如果你想运行示例, 首先克隆整个仓库

```shell
git clone https://github.com/HGGshiwo/jspsych-vue.git
```

在根目录中安装依赖

```
yarn install
```

启动服务

```
yarn serve
```
