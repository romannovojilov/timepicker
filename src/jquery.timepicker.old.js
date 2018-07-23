(function ($) {
    $.fn.timepicker = function (option) {
        var setting = {
            format: 'hh:mm:ss'
        };
        if (option) $.extend(setting, option);

        var CurrentPicker = new Object();

        var hour, minutes, seconds;

        var getCurrentTime = function () {
            hour = new Date().getHours();
            minutes = new Date().getMinutes();
            seconds = new Date().getSeconds();
        }

        var getThisTime = function () {
            hour = ($(CurrentPicker).val().split(':')[0] == undefined || $(CurrentPicker).val().split(':')[0] == "" || $(CurrentPicker).val().split(':')[0] == NaN ? 00 : $(CurrentPicker).val().split(':')[0]);
            minutes = ($(CurrentPicker).val().split(':')[1] == undefined || $(CurrentPicker).val().split(':')[1] == "" || $(CurrentPicker).val().split(':')[1] == NaN ? 00 : $(CurrentPicker).val().split(':')[1]);
            seconds = ($(CurrentPicker).val().split(':')[2] == undefined || $(CurrentPicker).val().split(':')[2] == "" || $(CurrentPicker).val().split(':')[2] == NaN ? 00 : $(CurrentPicker).val().split(':')[2]);
        }

        var updateTimePicker = function () {
            hourObject.text((hour.toString().length == 1 ? "0" + hour : hour));
            minutesObject.text((minutes.toString().length == 1 ? "0" + minutes : minutes));
            secondsObject.text((seconds.toString().length == 1 ? "0" + seconds : seconds));
            hour = validateTime(hourObject);
            minutes = validateTime(minutesObject);
            seconds = validateTime(secondsObject);
        }

        var validateTime = function (sender) {
            var currentVal = parseInt($(sender).text()) == NaN ? 00 : parseInt($(sender).text());
            var minVal = parseInt($(sender).attr('data-minval'));
            var maxVal = parseInt($(sender).attr('data-maxval'));

            if (currentVal < minVal) {
                currentVal = maxVal;
            }
            if (currentVal > maxVal) {
                currentVal = minVal;
            }
            $(sender).text((currentVal.toString().length == 1 ? "0" + currentVal : currentVal));
            return currentVal;
        }

        var setTimePicker = function () {
            hour = validateTime(hourObject);
            minutes = validateTime(minutesObject);
            seconds = validateTime(secondsObject);
            $(CurrentPicker).val((hour.toString().length == 1 ? "0" + hour : hour) + ":" + (minutes.toString().length == 1 ? "0" + minutes : minutes) + ":" + (seconds.toString().length == 1 ? "0" + seconds : seconds));
        }

        var adaptateResult = function () {
            var format = CurrentPicker.val().toString();
            format = format.replace(/[^0-9]+/g, '');
            if (format.length > 2) {
                format = format.slice(0, 2) + ":" + format.slice(2);
            }

            if (format.length > 5) {
                format = format.slice(0, 5) + ":" + format.slice(5);
            }


            CurrentPicker.val(format.substring(0, 8));
        }


        var timepickerObject = $('<div class="timepicker-box" onclick="event.cancelBubble = true;"></div>');
        getCurrentTime();
        var hourObject = $('<div data-minval="00" data-maxval="23" class="timepicker-checker">' + hour + '</div>');
        var minutesObject = $('<div data-minval="00" data-maxval="59" class="timepicker-checker">' + minutes + '</div>');
        var secondsObject = $('<div data-minval="00" data-maxval="59" class="timepicker-checker">' + seconds + '</div>');

        hourObject.bind('mousewheel DOMMouseScroll', function (event) {
            if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0)
                scrollTimeObjects($(this), true);
            else 
                scrollTimeObjects($(this), false);
        });

        minutesObject.bind('mousewheel DOMMouseScroll', function (event) {
            if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0)
                scrollTimeObjects($(this), true);
            else
                scrollTimeObjects($(this), false);
        });

        secondsObject.bind('mousewheel DOMMouseScroll', function (event) {
            if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0)
                scrollTimeObjects($(this), true);
            else
                scrollTimeObjects($(this), false);
        });

        var scrollTimeObjects = function (sender, isUp) {
            var currentVal = parseInt($(sender).text());
            var minVal = parseInt($(sender).attr('data-minval'));
            var maxVal = parseInt($(sender).attr('data-maxval'));

            if (isUp) {
                currentVal--;
                if (currentVal < minVal) {
                    currentVal = maxVal;
                }
            }
            else {
                currentVal++;
                if (currentVal > maxVal) {
                    currentVal = minVal;
                }
            }
            $(sender).text(currentVal.toString().length == 1 ? "0" + currentVal: currentVal);
            setTimePicker();
        }

        timepickerObject.append(hourObject).append('<span class="timepicker-spliter">:</span>').append(minutesObject).append('<span class="timepicker-spliter">:</span>').append(secondsObject);
        
        $(this).focus(function () {
            timepickerObject.stop().fadeIn(150);
            CurrentPicker = $(this);
            if ($(this).val() == "" && setting.isSetLocalTime) {
                getCurrentTime();
            }
            else {
                getThisTime();
            }
            updateTimePicker();
            
            setTimePicker();
            $(timepickerObject).css('top', ($(this).offset().top + 34) + 'px');
            $(timepickerObject).css('left', ($(this).offset().left) + 'px');
            $('body').append(timepickerObject);
        });

        $(this).focusout(function () {
            setTimePicker();
            timepickerObject.stop().fadeOut(150);
        });

        $(this).keydown(function (e) {
            if (e.keyCode == 13)
                return false;
            CurrentPicker = $(this);
            adaptateResult();
            if (e.keyCode != 8 && (e.keyCode < 37 || e.keyCode > 40) && e.ctrlKey == false)
                CurrentPicker.val(CurrentPicker.val().substring(0, 8));

            
        });

        $(this).keyup(function () {
            CurrentPicker = $(this);
            adaptateResult();
            getThisTime();
            updateTimePicker();
        });

    };
})(jQuery);