<script lang="ts">
import { defineComponent, h, defineEmits, onMounted, provide, ref, shallowRef, getCurrentInstance } from 'vue';
import { JsPsych, initJsPsych } from 'jspsych';
import { nanoid } from 'nanoid';

const createElement = (that: any, trialFn: Function, trial: object, on_load: Function) => defineComponent({
  render() {
    return h('div', { ref: 'myRef'});
  },
  setup() {
    const myRef = ref(null)
    onMounted(() => {
      trialFn.call(that, myRef.value, trial, on_load)
    })
    return { myRef }
  }
})

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

    const experiment_width = ref()
    const display_element = ref()
    const content_element = ref()
    const key = ref()

    onMounted(() => {
      (JsPsych as any).prototype.prepareDom = function () {
        this.displayContainerElement = display_element.value
        this.DOM_container = display_element.value
        this.contentElement = content_element.value
        this.DOM_target = content_element.value
        this.data.createInteractionListeners();
        window.addEventListener("beforeunload", props.options.on_close);
      }

      const jsPsych: any = initJsPsych(props.options)
      provide('jsPsych', jsPsych)
      getCurrentInstance()!.emit('init', jsPsych)

      const options = jsPsych.options || jsPsych.opts
      experiment_width.value = options.experiment_width || '100%';

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
            if (data.component) {
              curComp.value = data.component
            }
            else {
              curComp.value = createElement(this, super.trial, trial, on_load)
            }
            if (props.reset) {
              key.value = nanoid()
            }
          }
        }

        return {
          type: Plugin,
          ...data.options,
        }
      })
      jsPsych.run(_timeline)
    })
    return {
      key, curComp, curTrial, curOnLoad, experiment_width, display_element, content_element
    }
  }
}
</script>

<template>
  <div ref="display_element" class="jspsych-display-element">
    <div id="jspsych-content-wrapper" class="jspsych-content-wrapper" >
      <div ref="content_element" class="jspsych-content" :key="key" tabIndex="0" :style="{ width: experiment_width }"
        id="jspsych-content" >
        <component :trail="curTrial" :on_load="curOnLoad" :is="curComp" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.jspsych-display-element {
  height: 100%;
  width: 100%;
}
</style>