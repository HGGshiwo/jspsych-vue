
declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}

declare module '*.png' {
    const value: any;
    export = value;
}

declare module '@jspsych/plugin-preload';
declare module '@jspsych/plugin-image-keyboard-response';