import { App, Plugin } from "vue"
import { JsPsych, initJsPsych } from "jspsych";

interface createJsPsychParams {
  trials: object[]
}

let jsPsych: JsPsych;

const createJsPsych = (options: createJsPsychParams): Plugin => {
  return {
    install(app: App, options: any[]) {
      jsPsych = initJsPsych()
      // 配置此应用
      app.config.globalProperties.$jsPsych = jsPsych
    }
  }
}

const useJsPsych = () => {
  return jsPsych
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $jsPsych: JsPsych
  }
}
export { createJsPsych, useJsPsych }