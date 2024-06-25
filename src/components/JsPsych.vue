<script lang="ts">
import { defineComponent, h, defineEmits, onMounted, provide, ref, shallowRef, getCurrentInstance, nextTick, computed } from 'vue';
import { JsPsych, initJsPsych } from 'jspsych';
import { nanoid } from 'nanoid';

const createJsPsychContent = (component = undefined, experiment_width = "100%", trialFn: Function | undefined = undefined) => {
  return defineComponent({
    props: {
      trial: {
        type: Object,
        required: true
      },
      on_load: {
        type: Function,
        required: true
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
      console.log('ccc', props.trial && props.trial.stimulus)
      onMounted(() => {
        trialFn && trialFn(myRef.value, props.trial, props.on_load)
      })
      return { myRef }
    }
  })
}
export default {
  props: {
    options: {
      type: Object,
      default: {}
    },
    reset: {
      type: Boolean,
      default: true
    },
    autoRun: {
      type: Boolean,
      default: true
    }
  },
  emits: ['init'],
  expose: ['run'],
  setup(props: any, { slots }: any) {
    const curComp = shallowRef<any>()
    const curTrial = ref<any>()
    const curOnLoad = ref<any>()

    const display_element = ref()
    const content_element = ref()
    const key = ref();

    (JsPsych as any).prototype.prepareDom = function () {
      this.displayContainerElement = document.body
      this.DOM_container = this.displayContainerElement

      this.contentElement = document.querySelector("#jspsych-content")
      this.DOM_target = this.contentElement

      this.data.createInteractionListeners();
      window.addEventListener("beforeunload", props.options.on_close);
    }

    const jsPsych: any = initJsPsych(props.options)
    provide('jsPsych', jsPsych)
    getCurrentInstance()!.emit('init', jsPsych)

    curComp.value = createJsPsychContent(slots.default());

    const options = jsPsych.options || jsPsych.opts
    const experiment_width = options.experiment_width || '100%';

    const convertTimeline = (timeline: any[]) => timeline.map((data: any) => {
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
          console.log(trial.stimulus)
          curTrial.value = trial
          curOnLoad.value = on_load
          const doTrial = (...args: any[]) => super.trial && super.trial.call(this, ...args)
          curComp.value = createJsPsychContent(data.component, experiment_width, doTrial)
        }
      }

      return {
        type: Plugin,
        ...data.options,
      }
    })

    const run = (timeline: any) => {
      return jsPsych.run(convertTimeline(timeline))
    }
    return {
      key, curComp, curTrial, curOnLoad, display_element, content_element, run
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
</style>