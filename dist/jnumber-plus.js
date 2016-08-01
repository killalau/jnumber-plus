///<reference path="../typings/index.d.ts"/>
(function ($) {
    'use strict';
    function initFunc(config) {
        var $self = this;
        // Get default value
        var _a = config.step, step = _a === void 0 ? $self.data('step') : _a, _b = config.min, min = _b === void 0 ? $self.prop('min') : _b, _c = config.max, max = _c === void 0 ? $self.prop('max') : _c, _d = config.value, value = _d === void 0 ? $self.val() : _d;
        // Init value, make sure it is within range
        stepFunc.call($self, step || 1);
        minFunc.call($self, $self.prop('min'));
        maxFunc.call($self, $self.prop('max'));
        valFunc.call($self, $self.val());
        // Init "+" & "-" controls
        var $minus = $('<button>-</button>');
        var $plus = $('<button>+</button>');
        var data = {
            plusElement: $plus[0],
            minusElement: $minus[0]
        };
        $self.data('jnumberPlus', data);
        $minus
            .addClass('jnumber-plus__minus')
            .on('click', function (event) {
            var step = stepFunc.call($self);
            var value = valFunc.call($self);
            valFunc.call($self, value - step);
        });
        $plus
            .addClass('jnumber-plus__plus')
            .on('click', function (event) {
            var step = stepFunc.call($self);
            var value = valFunc.call($self);
            valFunc.call($self, value + step);
        });
        $self
            .addClass('jnumber-plus__input')
            .before($minus)
            .after($plus)
            .on('change', function (event) {
            var target = event.target;
            var value = target.value;
            valFunc.call($self, value);
        });
    }
    function minFunc(value) {
        var $self = this;
        if (typeof value === 'undefined') {
            return parseFloat($self.prop('min'));
        }
        else {
            return $self.prop('min', $.isNumeric(value) ? value : null);
        }
    }
    function maxFunc(value) {
        var $self = this;
        if (typeof value === 'undefined') {
            return parseFloat($self.prop('max'));
        }
        else {
            return $self.prop('max', $.isNumeric(value) ? value : null);
        }
    }
    function stepFunc(value) {
        var $self = this;
        if (typeof value === 'undefined') {
            return parseFloat($self.data('step'));
        }
        else {
            return $self.data('step', $.isNumeric(value) ? value || 1 : 1);
        }
    }
    var ValidateError;
    (function (ValidateError) {
        ValidateError[ValidateError["NAN"] = 0] = "NAN";
        ValidateError[ValidateError["TooBig"] = 1] = "TooBig";
        ValidateError[ValidateError["TooSmall"] = 2] = "TooSmall";
    })(ValidateError || (ValidateError = {}));
    function _validateFunc(value, min, max) {
        if (!$.isNumeric(value)) {
            return ValidateError.NAN;
        }
        else if (min != null && min !== '' && value < min) {
            return ValidateError.TooSmall;
        }
        else if (max != null && max !== '' && value > max) {
            return ValidateError.TooBig;
        }
        return;
    }
    function isValidFunc(value) {
        if (value === void 0) { value = null; }
        var $self = this;
        var v = value != null ? value : $self.val();
        var min = minFunc.call($self);
        var max = maxFunc.call($self);
        var error = _validateFunc(v, min, max);
        return error == null;
    }
    function valFunc(value) {
        var $self = this;
        if (typeof value === 'undefined') {
            return parseFloat($self.val());
        }
        else {
            var min = minFunc.call($self);
            var max = maxFunc.call($self);
            var error = _validateFunc(value, min, max);
            if (error === ValidateError.NAN) {
                value = null;
            }
            else if (error === ValidateError.TooBig) {
                value = max;
            }
            else if (error === ValidateError.TooSmall) {
                value = min;
            }
            return $self.val(value);
        }
    }
    function controlButton() {
        var $self = this;
        var data = $self.data('jnumberPlus');
        return $([data.minusElement, data.plusElement]);
    }
    // Basic plugin function
    $.fn.jnumberPlus = function (method) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var callingMethod = typeof method === 'string';
        var methodName = callingMethod ? method : null;
        var initOptions = $.isPlainObject(method) ? method : {};
        var $self = $(this);
        if (callingMethod) {
            // Calling relavent method
            var methods = {
                min: minFunc,
                max: maxFunc,
                step: stepFunc,
                val: valFunc,
                isValid: isValidFunc,
                controlButton: controlButton
            };
            var func = methods[methodName];
            if (func) {
                return func.apply($self, args);
            }
            else {
                return $self;
            }
        }
        else {
            // Init component
            initFunc.call($self, initOptions);
        }
    };
})(jQuery);
