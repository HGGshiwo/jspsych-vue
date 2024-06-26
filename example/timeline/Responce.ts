/* eslint-disable no-use-before-define */
import jsPsychPreload from '@jspsych/plugin-preload'
import jsPsychHtmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response'
import jsPsychImageKeyboardResponse from '@jspsych/plugin-image-keyboard-response'
import blue from '../assets/blue.png'
import orange from '../assets/orange.png'

export default (jsPsych: any) => {
  const timeline: any[] = []

  /* preload images */
  const preload = {
    type: jsPsychPreload,
    images: [blue, orange]
  }
  timeline.push(preload)

  /* define welcome message trial */
  const welcome = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: 'Welcome to the experiment. Press any key to begin.'
  }
  timeline.push(welcome)

  /* define instructions trial */
  const instructions = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
      <p>In this experiment, a circle will appear in the center 
      of the screen.</p><p>If the circle is <strong>blue</strong>, 
      press the letter F on the keyboard as fast as you can.</p>
      <p>If the circle is <strong>orange</strong>, press the letter J 
      as fast as you can.</p>
      <div style='width: 700px; display: inline-block;'>
      <div style='float: left;'><img src="${blue}"></img>
      <p class='small'><strong>Press the F key</strong></p></div>
      <div style='float: right;'><img src="${orange}"></img>
      <p class='small'><strong>Press the J key</strong></p></div>
      </div>
      <p>Press any key to begin.</p>
    `,
    post_trial_gap: 2000
  }
  timeline.push(instructions)

  /* define trial stimuli array for timeline variables */
  const test_stimuli = [
    { stimulus: blue, correct_response: 'f' },
    { stimulus: orange, correct_response: 'j' }
  ]

  /* define fixation and test trials */
  const fixation = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<div style="font-size:60px;">+</div>',
    choices: 'NO_KEYS',
    trial_duration: function () {
      return jsPsych.randomization.sampleWithoutReplacement(
        [250, 500, 750, 1000, 1250, 1500, 1750, 2000],
        1
      )[0]
    },
    data: {
      task: 'fixation'
    }
  }

  const test = {
    type: jsPsychImageKeyboardResponse,
    stimulus: jsPsych.timelineVariable('stimulus'),
    choices: ['f', 'j'],
    data: {
      task: 'response',
      correct_response: jsPsych.timelineVariable('correct_response')
    },
    on_finish: function (data: any) {
      data.correct = jsPsych.pluginAPI.compareKeys(data.response, data.correct_response)
    }
  }

  /* define test procedure */
  const test_procedure = {
    timeline: [fixation, test],
    timeline_variables: test_stimuli,
    repetitions: 5,
    randomize_order: true
  }
  timeline.push(test_procedure)

  /* define debrief */
  const debrief_block = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
      const trials = jsPsych.data.get().filter({ task: 'response' })
      const correct_trials = trials.filter({ correct: true })
      const accuracy = Math.round((correct_trials.count() / trials.count()) * 100)
      const rt = Math.round(correct_trials.select('rt').mean())

      return `<p>You responded correctly on ${accuracy}% of the trials.</p>
        <p>Your average response time was ${rt}ms.</p>
        <p>Press any key to complete the experiment. Thank you!</p>`
    }
  }
  timeline.push(debrief_block)
  return timeline
}
