//plan

//すべて選択
function broadcasterChangeAll(selectors, allSelector) {
    selectors.on('change', function(i, elm) {
        selectors.each(function(i, e) {
            var flg = $(this).prop('checked');
            if (!flg) {
                allSelector.prop('checked', false);
                return false;
            }
            if (i == selectors.length - 1) {
                if (flg) {
                    allSelector.prop('checked', true);
                }
            }
        });
    });
    allSelector.on('change', function() {
        var flg = $(this).prop('checked');
        if (flg) {
            selectors.each(function(i, e) {
                $(this).prop('checked', true);
            });
        } else {
            selectors.each(function(i, e) {
                $(this).prop('checked', false);
            });
        }

    });
}
//broadcasterChangeAll($('.broadcaster'), $('#broadcaster_all_check'))

$.jCanvas.defaults.fromCenter = false; //キャンバス 左上視点

// reset time_slot_pattern
function resetTimeSlotPattern(selectedPatternId) {
    $('#time_slot_pattern_id').empty();
    $(patternArr).each(function(i, v) {
        let option = $('<option>').val(v.id)
            .text(v.time_slot_pattern_name)
            .attr('data-ontime', JSON.stringify(v.time_slot));
        if (v.id == selectedPatternId) option.prop('selected', 'selected');
        $('#time_slot_pattern_id').append(option);
    });
    $('#time_slot_pattern_id').change();
}

$(function() {
    $.fn.exChange = function(callback, fn) {
        var func = fn || function() { return $(this).val(); };
        $(this).each(function() {
            var val = $(this).val();
            var prev = $(this).val();
            var d = $.Deferred();
            $(this).change(function() {
                if ($(this).val() == prev) return;
                var self = $(this);
                var p = d.promise();
                Array.prototype.push.call(arguments, d);
                callback.apply(this, arguments);
                p.done(function() {
                    d = $.Deferred();
                    prev = $(self).val();
                }).fail(function() {
                    d = $.Deferred();
                    self.val(prev);
                });
            });
        });
        return $(this);
    };


    //datepicker
    $('.datepicker.form-control').datepicker({
        language: 'ja',
        format: "yyyy-mm-dd",
        weekStart: 1,
        autoclose: true,
    });

    // メッセージ用ダイアログ
    $('.planning_modal').iziModal({
        onOpening: function() {
            resizeBody();
        }
    });

    //パータンのselect挿入
    // resetTimeSlotPattern(false);

    //モーダル
    if ($("#new_pattern").length) {
        $("#new_pattern").iziModal({
            width: '750px',
            onOpening: function() {
                this.opened = false;
                resizeBody();
                createNewCalendar();
            },
            onOpened: function() {
                if (this.opened == false) {
                    this.opened = true;
                    newCalendarPositon('#new_pattern_block');
                }
            },
            onClosing: function() {
                CalendarDelete();
            }
        });
    }

    //モーダル カレンダー設定
    var calendarMaxWidth = 1315;

    $('#calendar_pattern_btn').on('click', function(e) {
        var _tarmDay = tarmDay();
        if (isNaN(_tarmDay)) {
            errNotify(['・プランニング期間が設定されていません。']);
            // $('#calendar_pattern_no_view').iziModal('open');
        } else {
            let from = $('#planning_from_date').val();
            let to = $('#planning_to_date').val();
            if ((new Date(from)).getMonth() != (new Date(to)).getMonth()) {
                errNotify(['・プランニング期間は同月内で指定してください。']);
            } else {
                $("#calendar_pattern").iziModal('open');
            }
        }
    });

    if ($("#calendar_pattern").length) {
        $("#calendar_pattern").iziModal({
            width: '100%',
            onOpening: function() {
                this.opened = false;
                resizeBody();
                if (calendarMaxWidth < document.documentElement.clientWidth) {
                    $("#calendar_pattern").css('width', calendarMaxWidth + 'px');
                }
                var start_date = $('#planning_from_date').val();
                var end_date = $('#planning_to_date').val();
                if (isEnableDate(start_date) && isEnableDate(end_date)) {
                    createCalendar();
                }
            },
            onOpened: function() {
                if (this.opened == false) {
                    this.opened = true;
                    newCalendarPositon('#calendar_pattern_block');
                }
            },
            onClosing: function() {
                CalendarDelete();
            }
        });
    }

    if ($("#calendar_pattern_chk").length) {
        $("#calendar_pattern_chk").iziModal({
            width: '100%',
            onOpening: function() {
                resizeBody();
                if (calendarMaxWidth < document.documentElement.clientWidth) {
                    $("#calendar_pattern_chk").css('width', calendarMaxWidth + 'px');
                }
                var start_date = $('#planning_from_date').val();
                var end_date = $('#planning_to_date').val();
                if (isEnableDate(start_date) && isEnableDate(end_date)) {
                    createCalendar();
                }
            },
            onOpened: function() {
            },
            onClosing: function() {
                CalendarDelete();
            }
        });
    }

    function resizeBody() {
        $('.iziModal').css('padding-left', '0');
        $("body").css("min-height", $("#sidebar").height());
    }


    /* */

    // パターン変更
    $('#time_slot_pattern_id').exChange(function(event, deferred) {
        if ($('#custom_time_slot').val() == '1') {
            $('#calendar_pattern_reset_pattern .btn_Back').one('click', function() {
                // $('#time_slot_pattern_id').val(prev);
                deferred.reject();
                disablePatternDeleteBtn();
            });
            $('#btn_ok_calendar_pattern_reset_pattern').one('click', function() {
                deferred.resolve();
            });
            $('#calendar_pattern_reset_pattern').iziModal('open');
        } else {
            deferred.resolve();
            //
            // console.log('#time_slot_pattern_id exChange');
            timeSlotFormat();
        }
    });
    // 目盛り変更
    $('#time_every').exChange(function(event, deferred) {
        if ($('#custom_time_slot').val() == '1' && $(this).val() == 60) {
            $('#calendar_pattern_reset_pattern .btn_Back').one('click', function() {
                deferred.reject();
            });
            $('#btn_ok_calendar_pattern_reset_pattern').one('click', function() {
                deferred.resolve();
            });
            $('#calendar_pattern_reset_pattern').iziModal('open');
        } else {
            deferred.resolve();
        }
    });
    // プランニング期間FROM
    $('#planning_from_date').exChange(function(event, deferred) {
        if ($('#custom_time_slot').val() == '1') {
            $('#calendar_pattern_reset_pattern .btn_Back').one('click', function() {
                deferred.reject();
                $('#planning_from_date').datepicker('setDate', $('#planning_from_date').val());
            });
            $('#btn_ok_calendar_pattern_reset_pattern').one('click', function() {
                deferred.resolve();
            });
            $('#calendar_pattern_reset_pattern').iziModal('open');
        } else {
            deferred.resolve();
            //
            // console.log('#planning_from_date exChange');
            timeSlotFormat();
        }
    });
    // プランニング期間TO
    $('#planning_to_date').exChange(function(event, deferred) {
        if ($('#custom_time_slot').val() == '1') {
            $('#calendar_pattern_reset_pattern .btn_Back').one('click', function() {
                deferred.reject();
                $('#planning_to_date').datepicker('setDate', $('#planning_to_date').val());
            });
            $('#btn_ok_calendar_pattern_reset_pattern').one('click', function() {
                deferred.resolve();
            });
            $('#calendar_pattern_reset_pattern').iziModal('open');
        } else {
            deferred.resolve();
            //
            // console.log('#planning_to_date exChange');
            timeSlotFormat();
        }
    });

    // 規模単位変更
    $('#budget_unit_id').change(function(event) {
        if ($('#budget_unit_id').val() == 1) {
            $('#over_buy_unit_amount_label').text('金額');
            $('#over_buy_unit_amount_unit').text('千円');
            $('#budget,#over_buy_num_amount')
                .removeClass('hankaku-only')
                .addClass('hankaku-num-only');
        } else if ($('#budget_unit_id').val() == 2) {
            $('#over_buy_unit_amount_label').text('GRP');
            $('#over_buy_unit_amount_unit').text('GRP');
            $('#budget,#over_buy_num_amount')
                .addClass('hankaku-only')
                .removeClass('hankaku-num-only');
        } else {
            $('#over_buy_unit_amount_label').text('延べ視聴人数');
            $('#over_buy_unit_amount_unit').text('千世帯、千人');
            $('#budget,#over_buy_num_amount')
                .addClass('hankaku-only')
                .removeClass('hankaku-num-only');
        }
    });


    // $('.planning_date').change(function() {
    //     console.log('.planning_date change');
    //     timeSlotFormat();
    // });

    // time_slots データをymd_hi形式に変換
    function timeSlotFormat() {
        if (!isNaN(tarmDay())) {
            // console.log('==== A');
            if ($('#custom_time_slot').val() != '1') {
                let data = $('#time_slot_pattern_id option:selected').data('ontime');
                $('#time_slots').val(JSON.stringify(data));
                // console.log('==== B', data.length);
            }
            var start_date = $('#planning_from_date').val();
            var end_date = $('#planning_to_date').val();
            if (isEnableDate(start_date) && isEnableDate(end_date)) {
                createCalendar();
            }
            let time_slots = $.map($('#calendar_pattern .timeCheck.selected>input'), function($elm, $index){return $elm.name;});
            // console.log('==== C', time_slots.length);
            $('#time_slots').val(JSON.stringify(time_slots));
            CalendarDelete();
        }
    }

    $('#btn_ok_calendar_pattern_reset_pattern').on('click', function() {
        let data = $('#time_slot_pattern_id option:selected').data('ontime');
        $('#time_slots').val(JSON.stringify(data));
        $('#custom_time_slot').val('0');
        $('#msg_custom_time_slot').hide();
        $('#calendar_pattern_reset_pattern').iziModal('close');

        // console.log('#btn_ok_calendar_pattern_reset_pattern click');
        timeSlotFormat();
    });

    /* */


    /* カレンダ―生成 設定値 */
    var timeStart = 5;
    var timeEnd = 28;


    /* 新規パターン登録　カレンダ―生成 */
    function createNewCalendar() {
        $('#new_pattern_time_slot_pattern_name').val('');
        $('#error_time_slot_pattern_name').text('');
        $('#error_time_slot').text('');

        /* 新規パータン 作成
        	<div id="new_pattern_block">
        		<div id="timeHour" class="weekDayBlock">
        			<div>&nbsp;</div>
        			<div>05</div>
        			<div>06</div>
        		</div>

        		<div class="weekDayBlock Mon">
        			<div class="weekDay">月</div>
        			<div class="timeCheck"><input type="checkbox" name="Mon_5"></div>
        			<div class="timeCheck"><input type="checkbox" name="Mon_6"></div>
        		</div>
        		<div class="weekDayBlock Tue">
        			<div class="weekDay">火</div>
        			<div class="timeCheck"><input type="checkbox" name="Tue_6"></div>
        		</div>

        	</div><!-- new_pattern_block -->
        */

        //カレンダ作成
        var weekThArr = ['月', '火', '水', '木', '金', '土', '日']; //表示用
        var weekCheckboxArr = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']; //class用

        var timeEvery = $('#time_every').val(); //30分、60分指定
        timeEvery = timeEvery.replace("分", "");
        //console.log("timeEvery",timeEvery);

        createTime('#new_pattern_block', timeEvery); //時間ブロック作成

        var j;
        var k;
        //曜日
        for (j = 0; j < weekCheckboxArr.length; j++) {
            $('#new_pattern_block').append('<div class="weekDayBlock ' + weekCheckboxArr[j] + '"></div>');
            $('.' + weekCheckboxArr[j]).append('<div class="weekDay">' + weekThArr[j] + '</div>');
            for (k = timeStart; k <= timeEnd; k++) {
                var inputTime = k;
                if (k < 10) {
                    inputTime = '0' + inputTime;
                }

                let timeDiv = $('<div class="timeCheck">&nbsp;</div>');
                inputTime = inputTime + '00';
                $('.' + weekCheckboxArr[j]).append(timeDiv.append('<input type="checkbox" name="' + weekCheckboxArr[j] + '_' + inputTime + '">'));
                if (timeEvery != 60) { //30分単位の場合
                    inputTime = inputTime.replace(/00$/, '30');
                    $('.' + weekCheckboxArr[j]).append('<div class="timeCheck">&nbsp;<input type="checkbox" name="' + weekCheckboxArr[j] + '_' + inputTime + '"></div>');
                } else {
                    inputTime = inputTime.replace(/00$/, '30');
                    timeDiv.append('<input type="checkbox" name="' + weekCheckboxArr[j] + '_' + inputTime + '">');
                }
            }
        }
    }

    //カレンダー　時間ブロック生成

    function createTime(_target, _timeEvery) {
        //時間
        $(_target).append('<div id="timeHour" class="weekDayBlock"></div>');
        if (_target == '#new_pattern_block') {
            $('#timeHour').append('<div class="noTime">&nbsp;</div>');
        } else {
            $('#timeHour').append('<div class="noTime">&nbsp;<br>&nbsp;</div>');
        }
        for (i = timeStart; i <= timeEnd; i++) {
            var _no = i;
            if (i < 10) {
                _no = '0' + _no;
            }
            _no = _no + ':00';

            $('#timeHour').append('<div>' + _no + '</div>');

            if (_timeEvery != 60) { //30分単位の場合
                _no = _no.replace(':00', ':30');
                $('#timeHour').append('<div>' + _no + '</div>');
            }
        }
    }

    //カレンダー表示
    function createCalendar() {

        var weekArr = ['日', '月', '火', '水', '木', '金', '土']; //表示用
        var weekCheckboxArr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; //class用

        var timeEvery = $('#time_every').val(); //30分、60分指定
        timeEvery = timeEvery.replace("分", "");
        //console.log("timeEvery",timeEvery);

        createTime('#calendar_pattern_block', timeEvery); //時間ブロック作成

        var _tarmDay = tarmDay();
        // console.log('_tarmDay',_tarmDay);


        $('#calendar_pattern_block').append('<div id="calendar_block"></div>');
        var start_date = new Date($('#planning_from_date').val());
        var end_date = new Date($('#planning_to_date').val());

        // console.log('planning_date:', start_date, end_date);

        _start_date = start_date.getTime();
        _end_date = end_date.getTime();

        let selectArr = JSON.parse($('#time_slots').val() ? $('#time_slots').val() : '[]');

        while (_start_date <= _end_date) {
            //console.log('start_date1',_start_date);

            var d = new Date(_start_date);
            //console.log("月",d.getMonth()+1);
            //console.log("日",d.getDate());
            //console.log("曜日",weekArr[d.getDay()]);
            var d_year = d.getFullYear();
            var d_Month = d.getMonth() + 1;
            if (d_Month < 10) {
                d_Month = '0' + d_Month;
            }
            var d_date = d.getDate();
            if (d_date < 10) {
                d_date = '0' + d_date;
            }
            var d_week = d.getDay();

            var _id = 'd' + d_year + d_Month + d_date;
            // console.log('_id', (''+d_year + d_Month + d_date), holidays[d_year + d_Month + d_date]);
            var _holiday = (holidays['' + d_year + d_Month + d_date]) ? 'Sun' : '';
            let w = (_holiday) ? _holiday : weekCheckboxArr[d_week];

            $('#calendar_block').append('<div id="' + _id + '" class="weekDayBlock ' + weekCheckboxArr[d_week] + " " + _holiday +'"></div>');
            //$('#calendar_pattern_block').append('<div id="'+_id+'" class="weekDayBlock '+weekCheckboxArr[d_week]+'"></div>');
            $('#' + _id).append('<div class="weekDay">' + d_Month + '/' + d_date + '<br>' + weekArr[d_week] + '</div>');

            // console.log('time:', timeStart, timeEnd);
            var k;
            for (k = timeStart; k <= timeEnd; k++) {
                var inputTime = k;
                if (k < 10) {
                    inputTime = '0' + inputTime;
                }

                let timeDiv = $('<div class="timeCheck">&nbsp;</div>');
                inputTime = inputTime + '00';
                // 日付classと曜日classどっちも付与
                timeDiv.addClass(w + '_' + inputTime);
                timeDiv.addClass(_id + '_' + inputTime);

                let hasTime = 0 <= selectArr.indexOf(w + '_' + inputTime)
                            || 0 <= selectArr.indexOf(_id + '_' + inputTime);

                if (hasTime) timeDiv.addClass('selected');

                // console.log(w + '_' + inputTime + ':' + selectArr.indexOf(w + '_' + inputTime)
                //     , _id + '_' + inputTime + ':' + selectArr.indexOf(_id + '_' + inputTime));

                $('#' + _id).append(timeDiv.append('<input type="checkbox" name="' + _id + '_' + inputTime + '" ' + (hasTime ? 'checked' : '') + '>'));
                if (timeEvery != 60) { //30分単位の場合
                    inputTime = inputTime.replace(/00$/, '30');
                    hasTime = 0 <= selectArr.indexOf(w + '_' + inputTime)
                                || 0 <= selectArr.indexOf(_id + '_' + inputTime);
                    $('#' + _id).append('<div class="timeCheck ' + weekCheckboxArr[d_week] + '_' + inputTime + ' ' + _id + '_' + inputTime + (hasTime ? ' selected' : '') + '">&nbsp;<input type="checkbox" name="' + _id + '_' + inputTime + '" ' + (hasTime ? 'checked' : '') + '></div>');
                } else {
                    inputTime = inputTime.replace(/00$/, '30');
                    timeDiv.append('<input type="checkbox" name="' + _id + '_' + inputTime + '" ' + (hasTime ? 'checked' : '') + '>');
                }
            }

            _start_date += 86400000; //1日追加（ミリ秒）

        }
//        onTime();
    }
    
    function isEnableDate(strDate) {
        if(!strDate.match(/^\d{4}\-\d{2}\-\d{2}$/)){
            return false;
        }
        return true;
    }


    //カレンダーを開いた時に選択状態にする
    function onTime() {
        var _selected_data = $('#time_slots').val();
        if (!_selected_data) {
            return;
        }

        // selectArr = _selected_data.split(',');
        selectArr = JSON.parse(_selected_data);

        for (var i = 0; i < selectArr.length; i++) {
            var _target = selectArr[i]
            // console.log('_target',_target);
            $('#calendar_pattern_block .timeCheck').each(function(index, element) {
                if ($(this).hasClass(_target)) {
                    // console.log("hit---",this, _target);
                    $(this).addClass('selected');
                    $(this).find('input[type="checkbox"]').attr('checked', true);
                }
            });
        }

    }

    //canvas
    function newCalendarPositon(_target) {
        // console.log('newCalendarPositon');
        var topNum;
        var leftNum;
        var hightNum;
        var widthNum;
        //位置計算
        $('.timeCheck').each(function(index, element) {
            if (index == 0) {
                // console.log($(this),$(this).position().top, $(this).position().left);
                topNum = $(this).position().top;
                leftNum = $(this).position().left;
            }
            if (index == $('.timeCheck').length - 1) {
                // console.log($(this),$(this).position().top, $(this).position().left);
                hightNum = $(this).position().top - topNum + $(this).outerHeight();
                widthNum = $(this).position().left - leftNum + $(this).outerWidth();
            }
        });

        //canvas 四角描写
        $(_target).append('<canvas id="drawRange" width="' + widthNum + 'px" height ="' + hightNum + 'px" ></canvas >');
        $('#drawRange').css({
            'position': 'absolute',
            'top': topNum,
            'left': leftNum,
            'cursor': 'crosshair'
        });
        var startX;
        var startY;
        var endX;
        var endY;

        $('#drawRange').on('mousedown', function(e) {
            // console.log('mousedown');
            startX = e.offsetX;
            startY = e.offsetY;
            $("canvas").drawRect({
                layer: true,
                name: 'myBox',
                strokeStyle: "black",
                strokeWidth: 1,
                x: startX,
                y: startY,
                width: 0,
                height: 0
            });

            $('#drawRange').on('mousemove', function(e) {
                // console.log('mousemove');
                endX = e.offsetX;
                endY = e.offsetY;
                var w = endX - startX;
                var h = endY - startY;
                $('canvas').animateLayer('myBox', {
                    width: w,
                    height: h
                }, 0);
            });
            $('#drawRange').on('mouseup', function(e) {
                // console.log('mouseup');
                endX = e.offsetX;
                endY = e.offsetY;
                $('#drawRange').off('mousemove');
                $('#drawRange').off('mouseup');
                //$('#drawRange').removeLayer('myBox');

            });
        });
        $('#drawRange').on('click', function(e) {
            // console.log('click',startX,startY,endX,endY);
            $('#drawRange').removeLayer('myBox');
            $('#drawRange').drawLayers();
            hitCheck(startX, startY, endX, endY, topNum, leftNum)
        });
    }
    //当たり判定
    function hitCheck(_startX, _startY, _endX, _endY, _topNum, _leftNum) {
        var lowX;
        var highX;
        var lowY;
        var highY;
        if (_startX < _endX) {
            lowX = _startX;
            highX = _endX;
        } else {
            lowX = _endX;
            highX = _startX;
        }
        if (_startY < _endY) {
            lowY = _startY;
            highY = _endY;
        } else {
            lowY = _endY;
            highY = _startY;
        }
        // console.log('lowX',lowX,'highX',highX,'lowY',lowY,'highY',highY,'_topNum',_topNum,'_leftNum',_leftNum);
        $('.timeCheck').each(function(index, element) {
            var _x = $(this).position().left - _leftNum;
            var _w = $(this).outerWidth();
            var _y = $(this).position().top - _topNum;
            var _h = $(this).outerHeight();
            if (_x <= highX && (_x + _w) >= lowX && _y <= highY && (_y + _h) >= lowY) {
                checkOnOff($(this));
            }
        });
    }


    //当たり判定後のトグル
    function checkOnOff(_this) {
        // console.log(_this);
        if ($('input[type="checkbox"]:checked', _this).val()) {
            // console.log('yes');
            $('input[type="checkbox"]', _this).prop('checked', false);
            $(_this).removeClass('selected');
        } else {
            // console.log('no');
            $('input[type="checkbox"]', _this).prop('checked', true);
            $(_this).addClass('selected');
        }
    }

    //チェック クリア
    $('.selectClear').mousedown(function() {
        $('#new_pattern_block .selected').each(function() {
            $('input[type="checkbox"]', this).prop('checked', false);
            $(this).removeClass('selected');
        });
    });

    //カレンダー削除
    function CalendarDelete() {
        $('#new_pattern_block').empty();
        $('#calendar_pattern_block').empty();
    }

    /* プランニング期間 */

    $('#display_date').on('click', function() {
        tarmDay();
    });

    //日数計算
    function tarmDay() {
        var start_date = new Date($('#planning_from_date').val());
        var end_date = new Date($('#planning_to_date').val());

        var termDay = Math.ceil((end_date - start_date) / 86400000) + 1;
        //console.log('termDay',termDay);

        return termDay;
    }

    // https://tc39.github.io/ecma262/#sec-array.prototype.find
    if (!Array.prototype.find) {
    	Object.defineProperty(Array.prototype, 'find', {
    		value: function(predicate) {
    			// 1. Let O be ? ToObject(this value).
    			if (this == null) {
    				throw new TypeError('"this" is null or not defined');
    			}
    			var o = Object(this);
    			// 2. Let len be ? ToLength(? Get(O, "length")).
    			var len = o.length >>> 0;
    			// 3. If IsCallable(predicate) is false, throw a TypeError exception.
    			if (typeof predicate !== 'function') {
    				throw new TypeError('predicate must be a function');
    			}
    			// 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
    			var thisArg = arguments[1];
    			// 5. Let k be 0.
    			var k = 0;
    			// 6. Repeat, while k < len
    			while (k < len) {
    				// a. Let Pk be ! ToString(k).
    				// b. Let kValue be ? Get(O, Pk).
    				// c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
    				// d. If testResult is true, return kValue.
    				var kValue = o[k];
    				if (predicate.call(thisArg, kValue, k, o)) {
    					return kValue;
    				}
    				// e. Increase k by 1.
    				k++;
    			}
    			// 7. Return undefined.
    			return undefined;
    		},
    		configurable: true,
    		writable: true
    	});
    }

    // 初期表示用
    if ($('#custom_time_slot').val() != '1') {
        timeSlotFormat();
    }

//ie sticy対策

  var userAgent = window.navigator.userAgent.toLowerCase();

  if(userAgent.indexOf('rv:11') != -1 || userAgent.indexOf('msie') != -1) {

    var _target = $('#form_save_planning .accordion-inner');
    var _height;
    var tblLeftPositionBase;//mene開閉のleft position
    var _scroll_num
    $(window).scroll(function() {
      if(_target.css('display') == 'block'){//アコーディオン開閉判定
       _height = $('#form_save_planning .accordion-inner').height() + $('#form_save_planning .accordion-inner').offset().top;
      } else {
       _height = $('#form_save_planning .accordion-inner').offset().top;
      };
      _scroll_num = $(this).scrollTop();
      if(_scroll_num > _height){//縦スクロール判定

        tblLeftPosition =  (tblLeftPositionBase - $(this).scrollLeft());//position ledtの値

        $("#sticky-block").css({'position':'fixed','top':'50px','left':tblLeftPosition + 'px'});
        //accordion-planning
        var accordionPlanning = document.getElementById('accordion-planning');
        var accordionPlanningHeight = accordionPlanning.getBoundingClientRect().height
        var tickyHideTh = document.getElementById('sticky-block');
        var tickyHideThHeight = tickyHideTh.getBoundingClientRect().height - (50 + 5 + accordionPlanningHeight);// top + margin + プランニング条件の高さ
        $("#sticky-hide-table").css({'margin-top': String(tickyHideThHeight) + 'px'});
      }else{
          
        var tickyHideTh = document.getElementById('position_list_table-tr');
        var tickyHideThHeight = tickyHideTh.getBoundingClientRect().height;
        $("#sticky-hide-table").css({'margin-top': '-' + String(tickyHideThHeight) + 'px'});
        $("#sticky-block").css({'position':'static'});
      }
    });

    //リサイズと、メニュー開閉で_widthを変更させる
    $(window).resize(function() {
      var _width = $("#form_save_planning").width();
      $("#sticky-block").css({'width':_width+'px'});
    });

    function stickyBlockWidth(){//幅調整
      var _width = $("#form_save_planning").width();
      if ($("#sidebar ul.sidemenu").hasClass("menu_open")) {//メニュー 開
       stickyBlockWidthTime();
      } else {//メニュー 閉
        $("#sticky-block").css({'width':_width+'px'});
        tblLeftPositionBase = $('#sidebar').width() + parseInt($('#form_save_planning').css('padding-left'));
      }

    };

    stickyBlockWidth();

    function stickyBlockWidthTime(){//menu クリック時、cssで実装されている為、コールバックが受けらないので、時間差で対応
      setTimeout(function(){
        _width = $("#form_save_planning").width();
        $("#sticky-block").css({'width':_width+'px'});

        tblLeftPositionBase = $('#sidebar').width() + parseInt($('#form_save_planning').css('padding-left'));

        if( _scroll_num > _height){
          $("#sticky-block").css({'position':'fixed','top':'50px','left':tblLeftPositionBase + 'px'});
        }
        
        //IE用でCM枠件数が多い場合はサイドメニュー開閉に時間がかかるため、指定幅になっていない場合はもう一度実行する
        if ((tblLeftPositionBase != 90) && (tblLeftPositionBase != 254)) {
          setTimeout(function(){
            _width = $("#form_save_planning").width();
            $("#sticky-block").css({'width':_width+'px'});

            tblLeftPositionBase = $('#sidebar').width() + parseInt($('#form_save_planning').css('padding-left'));
            
            if( _scroll_num > _height){
              $("#sticky-block").css({'position':'fixed','top':'50px','left':tblLeftPositionBase + 'px'});
            }

          },800)
        }
      },800)
    }

     $("#menu_btn").on("click", function(){
      stickyBlockWidthTime();
    });

  }//ie sticy対策

});

$(document).ready(function(){
    
    var tickyHideTh = document.getElementById('position_list_table-tr');
    var tickyHideThHeight = tickyHideTh.getBoundingClientRect().height;
    $("#sticky-hide-table").css({'margin-top': '-' + String(tickyHideThHeight) + 'px'});
});