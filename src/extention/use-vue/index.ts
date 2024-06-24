import { JsPsych, JsPsychExtension, JsPsychExtensionInfo } from "jspsych";
import { App, Component, VNode, VNodeProps, createApp, h } from "vue";
import { nanoid } from "nanoid";

interface InitializeParameters { }

interface OnStartParameters {
  component: Component;
  options: any;
}

interface OnLoadParameters { }

interface OnFinishParameters { }

/**
 * **useVue**
 *
 * {description}
 *
 * @author {author}
 * @see {@link {documentation-url}}}
 */
class UseVueExtension implements JsPsychExtension {
  private app: App|undefined = undefined;
  private options: any|undefined = undefined;

  static info: JsPsychExtensionInfo = {
    name: "useVue",
  };
  constructor(private jsPsych: JsPsych) {
    this.jsPsych = jsPsych;
  }

  initialize = ({ }: InitializeParameters): Promise<void> => {
    return new Promise((resolve, reject) => {
      resolve();
    });
  };

  on_start = ({ component, options }: OnStartParameters): void => {
    const name = nanoid()
    if (options) {
      this.options = { ref: name, ...options }
    }
    else {
      this.options = { ref: name }
    }
    this.app = createApp({
      components: { [name]: component },
      render: () => h(component, this.options)
    });
    this.app.mount(this.jsPsych.getDisplayElement());
  };

  on_load = ({ }: OnLoadParameters): void => { };

  on_finish = ({ }: OnFinishParameters): { [key: string]: any } => {
    console.log(this.options, this.app!._instance!.refs)
    const trial = (this.app!._instance!.refs[this.options!.ref] as any).trial;
    if (trial) {
      return trial()
    }
    else return {}
  };
}

export default UseVueExtension;