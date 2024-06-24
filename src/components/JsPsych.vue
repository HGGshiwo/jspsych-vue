<script lang="ts">
import { defineComponent, h, defineEmits, onMounted, provide, ref, shallowRef, getCurrentInstance, nextTick } from 'vue';
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
        style: `{ width: ${experiment_width} }`,
      }
      var componentCfg: Record<string, any> = {
        key: nanoid(),         
        trial: this.trial,
        on_load: this.on_load 
      } 
      console.log(this.trial, this.on_load)
      const _component = component && [h(component, componentCfg)]
      return h('div', config, _component);
    },
    setup(props: any) {
      const myRef = ref(null)
      console.log('content')
      onMounted(() => {
        trialFn && trialFn(myRef.value, props.trial, props.on_load)
      })
      return { myRef }
    }
  })
}
export default {
  props: {
    timeline: {
      type: Array,
      required: true
    },
    options: {
      type: Object,
      default: {}
    },
    reset: {
      type: Boolean,
      default: true
    }
  },
  emits: ['init'],
  setup(props: any) {
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

    curComp.value = createJsPsychContent();

    const options = jsPsych.options || jsPsych.opts
    const experiment_width = options.experiment_width || '100%';

    const _timeline = props.timeline.map((data: any) => {
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
        type: Plugin,
        ...data.options,
      }
    })

    nextTick(() => {
      console.log(curComp.value)
      jsPsych.run(_timeline)
    })
    return {
      key, curComp, curTrial, curOnLoad, display_element, content_element
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