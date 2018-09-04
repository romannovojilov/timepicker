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

            this.getName = function() {
                return name;
            }

            this.render = function() {
                var item = $('<div class="timepicker-item"></div>');
                var checker = $('<div class="timepicker-checker">' + current + '</div>');
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

            this.reset = function() {
                self.setVal(minval);
            }
        }

        function TimePicker(items) {
            var self = this;

            var onchange = new Event();
            this.addObserver = function(callback) {
                onchange.add(callback);
            }

            var wrapper = $('<div class="timepicker-box" onclick="event.cancelBubble = true;"></div>');
            this.render = function() {
                wrapper.html('').hide();
                for(var i = 0; i < items.length; i++) {
                    wrapper.append(items[i].render());
                    if(i+1 < items.length)
                        wrapper.append('<span class="timepicker-spliter"></span>');
                    items[i].addObserver(onchange.call);
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

            this.reset = function() {
                for(var i = 0; i < items.length; i++)
                    items[i].reset();
            }

            this.getItems = function() {
                return items;
            }

        }

        function TimePickerController(picker) {
            var self = this;
            var input = null;

            var setPosition = function() {
                if(input) 
                    picker.setPosition($(input).offset().left, $(input).offset().top + $(input).outerHeight());
            }
            $(window).bind('resize', setPosition);

            $(document).bind('click', function() {
                picker.hide();
            });

            var setMask = function () {

            }

            var getTime = function () {
                var items = picker.getItems();
                for(var i = 0; i < items.length; i++) {
                    items[i].setVal(
                        $(input).val().split(':')[i] == undefined || 
                        $(input).val().split(':')[i] == "" || 
                        $(input).val().split(':')[i] == NaN ? 0 : $(input).val().split(':')[i]
                    );
                }
            }
            
        
            picker.addObserver(function(sender, args) {
                //console.log(args);
            });

            
            this.render = function() {
                picker.render().appendTo('body');

                return self;
            }

            this.setInput = function(inp) {
                input = inp;
                
                setPosition();
                setMask();
                getTime();

                $(input).unbind('keyup').bind('keyup', function() {
                    setMask();
                    getTime();
                });

                picker.show();
            }

        }

        var controller = new TimePickerController(
            new TimePicker([
                new TimePickerItem({
                    name: 'hh',
                    maxval: 23
                }),
                new TimePickerItem({
                    name: 'mm'
                }),
                new TimePickerItem({
                    name: 'ss'
                })
            ])
        ).render();
        
        var initialize = function() {
            controller.setInput($(this));
        }

        return this.each(function () {
            $(this).attr('onclick', 'event.cancelBubble = true;');
            $(this).bind('focus', initialize);

            // $(this).bind('keydown', function (e) {
            //     if(e.keyCode == 9) {
            //         picker.hide();
            //     }
            //});
        });
    }
})(jQuery);