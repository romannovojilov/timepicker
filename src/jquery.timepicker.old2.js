(function ($) {
    $.fn.timepicker = function (option) {
        var setting = {
            
        };
        if (option) $.extend(setting, option);

        function Event() {
            var list = [];
            this.add = function(fn) {
                list.push(fn);
            }
        
            this.call = function(sender, eventArgs) {
                for(var i = 0; i < list.length; i++) {
                    list[i](sender, eventArgs);
                }
            }
        
            this.toEmpty = function() {
                list = [];
            }
        }

        var onchange = new Event();

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
            }
        ];

        var wrapper = undefined, 
            items = undefined;

        var initialize = function() {
            wrapper = $('<div class="timepicker-box" onclick="event.cancelBubble = true;"></div>');
            items = [];
            for(var i = 0; i < params.length; i++) {

                var item = $('<div class="timepicker-item"></div>');
                var checker = $('<div data-minval="' + params[i].value.min + '" data-maxval="' + params[i].value.max + '" class="timepicker-checker">' + params[i].value.current + '</div>');
                checker.bind('click', function() {
                    $(this).text($(this).attr('data-minval'));
                });
                var toUp = $('<a href="#" class="timepicker-checker-button"></a>');
                toUp.bind('click', function() {
                    update($(this).siblings('.timepicker-checker'), true);
                    return false;
                });
                var toDown = $('<a href="#" class="timepicker-checker-button"></a>');     
                toDown.bind('click', function() {
                    update($(this).siblings('.timepicker-checker'), false);
                    return false;
                });

                item.append(toUp)
                    .append(checker)
                    .append(toDown);
                
                items[params[i].name] = item;
                items[params[i].name].bind('mousewheel DOMMouseScroll', function (event) {
                    update($(this).find('.timepicker-checker'), event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0);
                });
            }
        }
        initialize();

        var update = function (sender, isUp) {
            var val = parseInt($(sender).text());
            var minVal = parseInt($(sender).attr('data-minval'));
            var maxVal = parseInt($(sender).attr('data-maxval'));
            $(sender).text(isUp ? (val + 1 > maxVal ? 0: val + 1): (val - 1 < minVal ? maxVal: val - 1));
            

            currentInput.val($(sender).text()).focus();

            onchange.call(currentInput, {

            });
        };

        

        var currentInput = undefined;
        var render = function(input) {
            currentInput = input;
            wrapper.children('.timepicker-spliter').remove();
            for (var i = 0; i < params.length; i++) {
                var delta = 1;
                wrapper.append(items[params[i].name]);
                if (i + delta < params.length)
                    wrapper.append('<span class="timepicker-spliter"></span>');
            }
            setPosition();

            $('body').append(wrapper);
            wrapper.show();

            return wrapper;
        }

        var setPosition = function() {
            if(currentInput) 
                $(wrapper).css('left', ($(currentInput).offset().left) + 'px')
                    .css('top', ($(currentInput).offset().top + $(currentInput).outerHeight()) + 'px');
        }

        $(window).bind('resize', setPosition);
        $(document).bind('click', function() {
            wrapper.hide();
        });

        return this.each(function () {
            $(this).attr('onclick', 'event.cancelBubble = true;');

            $(this).bind('focus', function () {
                render($(this));
            });

            $(this).bind('keydown', function (e) {
                if(e.keyCode == 9) {
                    wrapper.hide();
                }
            });

        });
    }
})(jQuery);