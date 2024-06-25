import HelloWorld from "../components/HelloWorld.vue"
const timeline = (jsPsych: any) => [
  { component: HelloWorld, msg: "Hello" },
  { component: HelloWorld, msg: "World" },
  { component: HelloWorld, msg: "Goodbye" },
]

export default timeline;