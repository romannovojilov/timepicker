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

        function TimePickerItem(params) {
            var self = this;
            var minval = params.minval || 0;
            var maxval = params.maxval || 59;
            var current = params.val || 0;
            var name = params.name || ('time_item_from_' + minval + '_to_' + maxval);

            var onchange = new Event();
            this.addObserver = function(callback) {
                onchange.add(callback);
            }

            this.setVal = function(val) {
                current = (val > maxval ? 0 : val < minval ? maxval : val);
                onchange.call(self, { 
                    minval : minval, 
                    maxval : maxval, 
                    val : current, 
                    name : name 
                });
            }

            this.getVal = function() {
                return current;
            }

            this.render = function() {
                var item = $('<div class="timepicker-item"></div>');
                var checker = $('<div data-minval="' + minval + '" data-maxval="' + maxval + '" class="timepicker-checker">' + current + '</div>');
                checker.bind('click', function() {
                    self.setVal(minval);
                });
                var toUp = $('<a href="#" class="timepicker-checker-button"></a>');
                toUp.bind('click', function() {
                    self.setVal(current + 1);
                    return false;
                });
                var toDown = $('<a href="#" class="timepicker-checker-button"></a>');     
                toDown.bind('click', function() {
                    self.setVal(current - 1);
                    return false;
                });

                item.append(toUp)
                    .append(checker)
                    .append(toDown);
                
                item.bind('mousewheel DOMMouseScroll', function (event) {
                    self.setVal(event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0 ? current + 1: current -1);
                });

                self.addObserver(function(sender, args) {
                    checker.text(args.val);
                });

                return item;
            }
        }

        function TimePicker(params) {
            var self = this;

            var wrapper = $('<div class="timepicker-box" onclick="event.cancelBubble = true;"></div>');
            this.render = function() {
                wrapper.html('').hide();
                for(var i = 0; i < params.length; i++) {
                    wrapper.append(params[i].render());
                    if(i+1 < params.length)
                        wrapper.append('<span class="timepicker-spliter"></span>');
                }
                return wrapper;
            }

            this.setPosition = function(x,y) {
                $(wrapper).css('left', x + 'px')
                    .css('top', y + 'px');
            }

            this.show = function() {
                wrapper.show();
            }

            this.hide = function() {
                wrapper.hide();
            }

        }

        var params = [
            new TimePickerItem({
                name: 'hh',
                maxval: 23
            }),
            new TimePickerItem({
                name: 'mm'
            }),
            new TimePickerItem({
                name: 'ss'
            }),
        ];

        var picker = new TimePicker(params); 

        var render = function() {
            picker.render().appendTo('body');
        }
        render();
        
        var currentInput = undefined;
        var initialize = function() {
            currentInput = $(this);
            setPosition();
            picker.show();
        }

        var setPosition = function() {
            if(currentInput) 
                picker.setPosition($(currentInput).offset().left, $(currentInput).offset().top + $(currentInput).outerHeight());
        }

        $(window).bind('resize', setPosition);
        $(document).bind('click', function() {
            picker.hide();
        });


        var line = 'hh:mm:ss';
        for(var i = 0; i < params.length; i++) {
            params[i].addObserver(function(sender, args) {
                console.log(args);
                if(currentInput) {
                    line = line.replace(args.name, (args.val < 10 ? "0" + args.val : "" + args.val));
                    currentInput.val(line);
                }
            });
        }

        return this.each(function () {
            $(this).attr('onclick', 'event.cancelBubble = true;');

            $(this).bind('focus', initialize);

            $(this).bind('keydown', function (e) {
                if(e.keyCode == 9) {
                    picker.hide();
                }
            });
        });
    }
})(jQuery);