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
