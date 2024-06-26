<script lang="ts">
import { defineComponent, h, onMounted, provide, ref, shallowRef, getCurrentInstance } from 'vue';
import { JsPsych, initJsPsych } from "jspsych"
import { nanoid } from 'nanoid';

const createJsPsychContent = (component = undefined, experiment_width = "100%", trialFn: Function | undefined = undefined) => {
  return defineComponent({
    props: {
      trial: {
        type: Object,
        required: false
      },
      on_load: {
        type: Function,
        required: false
      }
    },
    render() {
      var config: Record<string, any> = {
        ref: 'myRef',
        class: "jspsych-content",
        id: 'jspsych-content',
        tabIndex: "0",
        style: `width: ${experiment_width};`,
      }
      var componentCfg: Record<string, any> = {
        key: nanoid(),
        ...this.$props
      }
      let _component: any; // jsPsych Content的子组件
      if (Array.isArray(component)) { // 渲染默认插槽
        _component = (component as any[]).map((c: any) => h(c))
      }
      else {
        _component = component && h(component, componentCfg)
      }
      return h('div', config, _component);
    },
    setup(props: any) {
      const myRef = ref(null)
      onMounted(() => {
        trialFn && trialFn(myRef.value, props.trial, props.on_load)
      })
      return { myRef }
    }
  })
}

const parseDisplayElement = (display_element: any) => {
  if (!display_element) {
    return document.body;
  }
  if (display_element instanceof Element) {
    return display_element
  }
  if (typeof display_element === 'string') {
    const dom = document.querySelector(display_element)
    if (!dom) {
      console.error("The element with the specified selector does not exist.")
      return dom
    }
  }
  console.error("Display element must be an HTML element or a string that specifies a query selector.")
}
export default {
  props: {
    options: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['init'],
  expose: ['run', 'addNodeToEndOfTimeline', 'displayData'],
  setup(props, { slots }: any) {
    const curComp = shallowRef<any>()
    const curTrial = ref<any>()
    const curOnLoad = ref<any>()

    const display_element = ref()
    const content_element = ref()
    const key = ref();

    (JsPsych as any).prototype.prepareDom = function () {
      let display_element = parseDisplayElement(props.options.display_element)
      this.displayContainerElement = display_element
      this.DOM_container = this.displayContainerElement

      this.contentElement = document.querySelector("#jspsych-content")
      this.DOM_target = this.contentElement

      this.data.createInteractionListeners();
      window.addEventListener("beforeunload", props.options.on_close);
    }

    const finishComp = (slots.finish && slots.finish()) || (slots.default && slots.default())
    const newOptions = props.options
    if (finishComp) {
      const _finish = props.options.on_finish
      newOptions.on_finish = (...args: any[]) => {
        _finish && _finish(...args)
        curComp.value = createJsPsychContent(finishComp, experiment_width)
      }
    }

    const jsPsych: any = initJsPsych(props.options)
    provide('jsPsych', jsPsych)
    getCurrentInstance()!.emit('init', jsPsych)

    const options = jsPsych.options || jsPsych.opts
    let experiment_width = options.experiment_width || '100%';
    if (typeof experiment_width === 'number') {
      experiment_width = `${experiment_width}px`
    }

    const startComp = (slots.start && slots.start()) || (slots.default && slots.default())
    curComp.value = createJsPsychContent(startComp, experiment_width);

    const convertTimelineNode = (data: any) => {
      //可以指定type或者是component
      if (data.type && data.component) {
        throw new Error('Cannot specify both type and component in a single timeline node.')
      }
      else if (!data.type && !data.component) {
        throw new Error('Must specify either type or component in a timeline node.')
      }

      const base = data.type || Object
      const info = data.component ? data.component.info || {} : {}
      class Plugin extends base {
        static info = { ...base.info, ...info };
        trial(display_element: HTMLElement, trial: any, on_load: any) {
          curTrial.value = trial
          curOnLoad.value = on_load
          const doTrial = (...args: any[]) => super.trial && super.trial.call(this, ...args)
          curComp.value = createJsPsychContent(data.component, experiment_width, doTrial)
        }
      }
      return {
        ...data,
        type: Plugin,
      }
    }

    const convertTimeline = (timeline: any[] | any): any => {
      //允许传入一个数组或者一个配置对象, 配置对象需要有timeline属性
      if (timeline.type || timeline.component) {
        return convertTimelineNode(timeline)
      }
      if (Array.isArray(timeline)) {
        return timeline.map((node: any) => convertTimeline(node))
      }
      else {
        //如果是配置对象, 必须有timeline属性
        return {
          ...timeline,
          timeline: convertTimeline(timeline.timeline)
        }
      }
    }

    const run = (timeline: any) => {
      return jsPsych.run(convertTimeline(timeline))
    }

    const addNodeToEndOfTimeline = (node: any) => {
      jsPsych.addNodeToEndOfTimeline(convertTimeline(node))
    }

    const displayData = (config: any) => {
      var format = config.format || "json";
      format = format.toLowerCase();
      if (format != "json" && format != "csv") {
        console.log("Invalid format declared for displayData function. Using json as default.");
        format = "json";
      }

      const data_string = format === "json" ? jsPsych.data.allData.json(true) : jsPsych.data.allData.csv();
      var _display_element = config.dom || display_element
      _display_element.innerHTML = '<pre id="jspsych-data-display"></pre>';
      document.getElementById("jspsych-data-display")!.textContent = data_string;
    }
    return {
      key, curComp, curTrial, curOnLoad, display_element, content_element, run, addNodeToEndOfTimeline, displayData
    }
  }
}
</script>

<template>
  <div ref="display_element" class="jspsych-display-element">
    <div id="jspsych-content-wrapper" class="jspsych-content-wrapper">
      <component :trial="curTrial" :on_load="curOnLoad" :is="curComp" />
    </div>
  </div>
</template>

<style lang="scss">
.jspsych-display-element {
  height: 100%;
  width: 100%;
}

html,
body,
#app {
  height: 100%;
  width: 100%;
  margin: 0;
}
</style>