/// <reference path="../typings/index.d.ts" />
interface jnumberPlusOptions {
    step?: number;
    min?: number;
    max?: number;
    value?: number;
}
interface jnumberPlus {
    plusElement: HTMLButtonElement;
    minusElement: HTMLButtonElement;
}
interface JQuery {
    jnumberPlus(): JQuery | number;
}
