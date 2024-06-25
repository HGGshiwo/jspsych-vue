# jspsych-vue


## run

```html
<template>
   <JsPsych ref="jsPsychRef" :timeline="timeline"></JsPsych> 
</template>

<script setup>
    const timeline = ref([
        { type: htmlKeyboardResponse, options: { stimulus: "Press the space bar!" } },
    ])
    const jsPsychRef = ref<any>();

    onMouted(()=>{
        await jsPsychRef.value.run()

        //next run, should reset timeline
        timeline.value = [
            { type: htmlKeyboardResponse, options: { stimulus: "Press the space bar2!" } },
        ]
        await jsPsychRef.value.run()
    })
</script>
```

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
