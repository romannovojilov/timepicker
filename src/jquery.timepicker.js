(function ($) {
    $.fn.timepicker = function (option) {
        var setting = {
            format: 'hh:mm:ss:qq'
        };
        if (option) $.extend(setting, option);

        var params = [
            {
                name: 'hh',
                value: {
                    min: 0,
                    max: 23,
                    current: 0
                }
            },
            {
                name: 'mm',
                value: {
                    min: 0,
                    max: 59,
                    current: 0
                }
            },
            {
                name: 'ss',
                value: {
                    min: 0,
                    max: 59,
                    current: 0
                }
            },
            {
                name: 'qq',
                value: {
                    min: 0,
                    max: 1,
                    current: 0
                }
            }
        ];

        var scrollTimeObjects = function (sender, isUp) {
            var val = parseInt($(sender).text());
            var minVal = parseInt($(sender).attr('data-minval'));
            var maxVal = parseInt($(sender).attr('data-maxval'));
            $(sender).find('span').text(isUp ? (val + 1 > maxVal ? 0: val + 1): (val - 1 < minVal ? maxVal: val - 1));
        };

        var wrapper = undefined, 
            spliter = undefined,
            items = undefined;

        var hasMask = function(format, param) {
            if(param)
                return format.indexOf(param.name) > -1;
            return false;
        }

        var generate = function() {
            wrapper = $('<div class="timepicker-box" onclick="event.cancelBubble = true;"></div>');
            spliter = $('<span class="timepicker-spliter"></span>');
            items = [];
            for(var i = 0; i < params.length; i++) {
                
                items[params[i].name] = $('<div data-minval="' + params[i].value.min + '" data-maxval="' + params[i].value.max + '" class="timepicker-checker"><a href="" class="timepicker-checker-button"></a><span>' + params[i].value.current + '</span><a href="" class="timepicker-checker-button"></a></div>');
                items[params[i].name].bind('mousewheel DOMMouseScroll', function (event) {
                    scrollTimeObjects($(this), event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0);
                });
            }
        }
        generate();

        var render = function(format) {
            wrapper.children('.timepicker-spliter').remove();
            for(var i = 0; i < params.length; i++) {
                var delta = 1;
                if(hasMask(format, params[i])) {
                    wrapper.append(items[params[i].name]);
                    if (i+delta < params.length)
                        wrapper.append(spliter.clone());
                } else {
                    items[params[i].name].unwrap();
                }
            }
            return wrapper;
        }

        return this.each(function () {
            $(this).focus(function() {
                var format = $(this).attr('data-format') == undefined ? setting.format : $(this).attr('data-format');
                
                $('body').append(render(format));
            });
        });
    }
})(jQuery);