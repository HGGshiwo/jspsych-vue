class TestPlugin {
  static info = {
    parameters: {}
  }
  jsPsych: any
  constructor(jsPsych) {
    this.jsPsych = jsPsych
  }

  trial(dom: any) {
    console.log('trial', dom)
    document.addEventListener('click', () => {
      this.jsPsych.finishTrial()
    })
  }
}
export default TestPlugin
