## Reference

### Props

JsPsych components accept a property called [options](https://www.jspsych.org/v7/reference/jspsych/#parameters) which can be used to configure the JsPsych object. The distinction between JsPsych official object is as follows:

| Parameter       | type         | Description                                                                                                                                                                |
| --------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| display_element | css selector | It is used to specify the DOM_target in JsPsych, which defaults to body and is related to event listening. The actual display position is specified through the component. |

### Methods

Jspsych-Vue component doesn't offer any methods, just use jspsych object.

But the componet overwrite jspsych.data.displayData as follows:

| Name          | Type                                              | Description                                                                                            |
| ------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `displayData` | `(options: {format: string, dom: Element})=>void` | To display data, same as `JsPsychData.displayData`, but you can define in which dom to render the data |

### Slots

JsPsych Component provides three slots to display something at the beginning or end of an experiment.

| Name    | Time to use                                             |
| ------- | ------------------------------------------------------- |
| default | Before `run` called or after `options.on_finish` called |
| start   | before `run` called                                     |
| finish  | after `on_finish` called                                |

> **Note**:
>
> - When both `default` and `start/finish` are defined, `start/finish` takes priority for display.
> - When you call run for multiply times, `start` only show one time, and `end` show the rest of time between on_finish and next run.
> - The Function Call in the following order:
>
> ![lifecircle.drawio](assets/lifecircle.drawio.svg)

Example:

```html
<JsPsych>
  <template #start>
    <p>Welcome!</p>
  </template>
</JsPsych>
```

That will render a default welcome message before run called.
