import HelloWorld from "@/components/HelloWorld.vue"
import HelloWorld2 from "@/components/HelloWorld2.vue"
import HtmlKeyboardResponse from "@/components/htmlKeyboardResponse.vue"
import { createJsPsych } from "@/plugin/jspsych"

const trials = [
    HtmlKeyboardResponse,
    HelloWorld2
]

const jsPsych = createJsPsych({
    trials
})



export default jsPsych