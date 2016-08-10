/// <reference path="../typings/index.d.ts" />
interface jnumberPlusOptions {
    step?: number;
    min?: number;
    max?: number;
    value?: number;
    cls?: string;
    plusElement?: string | HTMLElement | JQuery;
    minusElement?: string | HTMLElement | JQuery;
}
interface jnumberPlus {
    plusElement: HTMLButtonElement;
    minusElement: HTMLButtonElement;
}
interface JQuery {
    jnumberPlus(): JQuery | number | boolean;
}
