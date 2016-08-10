///<reference path="../typings/index.d.ts"/>

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

(function ($) {
    'use strict';

    function initFunc(config: jnumberPlusOptions): JQuery {
        let $self: JQuery = this;

        // Only initalize widget once
        if ($self.data('jnumberPlus')) {
            return $self;
        }

        // Get default value
        let {
            step = $self.data('step'),
            min = $self.prop('min'),
            max = $self.prop('max'),
            value = $self.val(),
            cls = $self.data('cls'),
            plusElement = $self.data('pluselement'),
            minusElement = $self.data('minuselement'),
        } = config;

        // Init value, make sure it is within range
        stepFunc.call($self, step || 1);
        minFunc.call($self, $self.prop('min'));
        maxFunc.call($self, $self.prop('max'));
        valFunc.call($self, $self.val());

        // Init "+" & "-" controls
        let $plus = plusElement ? $(plusElement) : $('<button>+</button>');
        let $minus = minusElement ? $(minusElement) : $('<button>-</button>');
        let data: jnumberPlus = {
            plusElement: $plus[0],
            minusElement: $minus[0]
        };
        $self.data({
            pluselement: $plus[0],
            minuselement: $minus[0],
            jnumberPlus: data,
        });

        $minus
            .addClass('jnumber-plus__minus')
            .addClass(cls)
            .on('click', function (event) {
                let step = stepFunc.call($self);
                let value = valFunc.call($self);
                valFunc.call($self, value  - step);
                event.preventDefault();
            });

        $plus
            .addClass('jnumber-plus__plus')
            .addClass(cls)
            .on('click', function (event) {
                let step = stepFunc.call($self);
                let value = valFunc.call($self);
                valFunc.call($self, value + step);
                event.preventDefault();
            });

        $self
            .addClass('jnumber-plus__input')
            .before($minus)
            .after($plus)
            .on('change', function (event) {
                let target = <HTMLInputElement>event.target;
                let value = target.value;
                valFunc.call($self, value);
            });

        return $self;
    }

    function minFunc(value?: number): JQuery | number {
        let $self: JQuery = this;
        if (typeof value === 'undefined') {
            return parseFloat($self.prop('min'));
        } else {
            return $self.prop('min', $.isNumeric(value) ? value : null);
        }
    }

    function maxFunc(value?: number): JQuery | number {
        let $self: JQuery = this;
        if (typeof value === 'undefined') {
            return parseFloat($self.prop('max'));
        } else {
            return $self.prop('max', $.isNumeric(value) ? value : null);
        }
    }

    function stepFunc(value?: number): JQuery | number {
        let $self: JQuery = this;
        if (typeof value === 'undefined') {
            return parseFloat($self.data('step'));
        } else {
            return $self.data('step', $.isNumeric(value) ? value || 1 : 1);
        }
    }

    enum ValidateError {
        NAN,
        TooBig,
        TooSmall,
    }

    function _validateFunc(value, min, max): ValidateError {
        if (!$.isNumeric(value)) {
            return ValidateError.NAN;
        } else if (min != null && min !== '' && value < min) {
            return ValidateError.TooSmall;
        } else if (max != null && max !== '' && value > max) {
            return ValidateError.TooBig;
        }
        return
    }

    function isValidFunc(value: number = null): boolean {
        let $self: JQuery = this;
        let v = value != null ? value : $self.val();
        let min = minFunc.call($self);
        let max = maxFunc.call($self);
        let error = _validateFunc(v, min, max);
        return error == null;
    }

    function valFunc(value?: number): JQuery | number {
        let $self: JQuery = this;
        if (typeof value === 'undefined') {
            return parseFloat($self.val());
        } else {
            let min = minFunc.call($self);
            let max = maxFunc.call($self);
            let error = _validateFunc(value, min, max);
            if (error === ValidateError.NAN) {
                value = null;
            } else if (error === ValidateError.TooBig) {
                value = max;
            } else if (error === ValidateError.TooSmall) {
                value = min;
            }
            return $self.val(value);
        }
    }

    function controlButton(): JQuery {
        let $self: JQuery = this;
        let data: jnumberPlus = $self.data('jnumberPlus');
        return $([data.minusElement, data.plusElement]);
    }

    // Basic plugin function
    $.fn.jnumberPlus = function (method: string | jnumberPlusOptions, ...args: any[]): JQuery | number | boolean {
        let callingMethod = typeof method === 'string';
        let methodName = callingMethod ? <string>method : null;
        let initOptions: jnumberPlusOptions = $.isPlainObject(method) ? <jnumberPlusOptions>method : {};
        let $self: JQuery = $(this);
        let multipleScope: boolean = $self.length > 0;

        if (callingMethod) {
            // Calling relavent method
            let methods = {
                min: minFunc,
                max: maxFunc,
                step: stepFunc,
                val: valFunc,
                isValid: isValidFunc,
                controlButton: controlButton,
            };
            let func: () => JQuery | number | boolean = methods[methodName];
            if (func) {
                return func.apply($self, args);
            } else {
                return $self;
            }
        } else {
            // Init component
            $self.each(function (i, el) {
                initFunc.call($(el), initOptions);
            });
            return $self;
        }
    };
})(jQuery);
