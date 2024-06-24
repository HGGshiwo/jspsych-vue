import { App, Plugin } from "vue"
import { JsPsych, initJsPsych } from "jspsych";

interface createJsPsychParams {
  trials: object[]
}

let jsPsych: JsPsych;

const createJsPsych = (options: createJsPsychParams): Plugin => {
  jsPsych = initJsPsych({ display_element: "jspsych" })
  const trails = options.trials
  return {
    install(app: App, options: any[]) {
      // 配置此应用
      app.config.globalProperties.$jsPsych = jsPsych
      app.config.globalProperties.$trails = trails
    }
  }
}

const useJsPsych = () => {
  return jsPsych
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $jsPsych: JsPsych
    $trials: object[]
  }
}
export { createJsPsych, useJsPsych }