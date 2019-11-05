
/**
 * 時間軸
 * @param {HTMLElement} container 時間軸容器
 * @param {Date | String} start 開始日期.
 * @param {Date | String} end 結束日期.
 * @returns {void}
 */
class _time_line {
    constructor(container, start, end, opt) {
        if (container.substring(0, 1) !== "#")
            container = "#" + container;
        if (typeof start === "object" && end === undefined && opt === undefined) {
            opt = start;
        }
        ;
        //variable
        var self = this;
        var div_timeline = $("<div></div>").addClass("timeline");
        var unactive_marker = $("<div></div>").addClass("unactive_marker").hide();
        var play_btn = $("<div></div>").addClass("play-btn");
        var bar_container = $("<div></div>").addClass("bar_container");
        var tip_bar = $("<div></div>").addClass("tip_bar");
        var progress_bar = $("<div></div>").addClass("progress_bar");
        var date_bar = $("<div></div>").addClass("date_bar");
        var time_range_border = $("<div></div>").addClass("time_range");
        var end_play_tip = $("<div></div>").addClass("end_play_tip").html("播放已到結束時間").hide();
        var current_time = null;
        self.speed_base = 1;
        var time_range = {
            start: start,
            end: end
        };
        //event
        this.event = {
            value_changed: "value_changed"
        };
        //object ======================================
        var _opt = {
            play_btn: {
                class: "fas fa-play"
            },
            stop_btn: {
                class: "fas fa-pause"
            },
            repeater: false,
            week: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
            enabled: false,
            animate_speed: 500,
            interval: 60 //minutes
        };
        $.extend(_opt, opt);
        //進度軸
        var progress = {
            playing: false //播放狀態
            ,
            min: 0,
            max: 100,
            value: 0,
            interval: _opt.interval,
            load_value: 0,
            minute_count: 0,
            progress: $("<div></div>").addClass("progress").addClass("bar") //進度bar
            ,
            background: $("<div></div>").addClass("background").addClass("bar") //進度bar 背景
            ,
            load: $("<div></div>").addClass("load").addClass("bar") //已讀取bar
        };
        //資料時間
        var today = new Date();
        var data_time = {
            start: today,
            end: today.setDate(today.getDate() + 1),
            total_minutes: 0,
            text_type: "day"
        };
        //上方的日期提示
        var tip = {
            text: $("<div></div>").addClass("text"),
            arrow: $("<div></div>").html("▼").addClass("arrow"),
            hour: $("<div></div>").addClass("hour"),
            hour_arrow: $("<div></div>").html("▼").addClass("hour_arrow"),
            circle: $("<div></div>").addClass("circle")
        };
        //下方的日期軸
        var date_text = {};
        //private function ======================
        var padleft = function (t, len, char) {
            if (char === undefined)
                char = "0";
            var t_len = t.toString().length;
            if (t_len >= len) {
                return t;
            }
            else {
                return padleft(char + t, len, char);
            }
        };
        //切換播放狀態(播放/停止)
        var switch_play = function () {
            if (_opt.enabled === false)
                return;
            if (progress.playing === true) {
                self.stop();
            }
            else {
                self.play();
            }
        };
        //啟動
        var run = function () {
            go_next();
        };
        var get_tip_date_text = function (date) {
            current_time = date;
            var w = date.getDay();
            var dd = date.getDate();
            var hh = date.getHours();
            if (hh < 10)
                hh = "0" + hh;
            var mm = date.getMinutes();
            if (mm < 10)
                mm = "0" + mm;
            var right = tip.text.offset().left + 138;
            if (right < $(window).width()) {
                return _opt.week[w] + " " + dd + " - " + hh + "：" + mm;
            }
            else {
                return hh + "：" + mm;
            }
        };
        //設定上方的日期 tip
        var set_tip_date = function (date, percent, animate) {
            var speed = _opt.animate_speed * self.speed_base;
            if (animate === false)
                speed = 0;
            if (percent <= 0)
                speed = 0;
            if (percent === 0) {
                tip.text.css("left", "0%");
                tip.arrow.css("left", "0%");
                tip.circle.css("left", "0%");
            }
            ;
            var d = new Date(date);
            var text = get_tip_date_text(d);
            tip.text.html(text);
            tip.text.css("left", percent + "%");
            tip.arrow.css("left", percent + "%");
            tip.circle.css("left", percent + "%");
            fix_tip_hour_position();
            /*
            tip.text
                .stop()
                .animate({
                    left: percent + "%"
                }, {
                        duration: speed
                        , step: function () {
                            fix_tip_hour_position();
                        }
                        , always: function () {
                            var d = get_time_in_progress_bar(tip.text.position().left);
                            var text = get_tip_date_text(d.date);
                            tip.text.html(text);
                        }
                    });
    
            tip.arrow.stop().animate({
                left: percent + "%"
            }, speed);
            */
        };
        //依 x 值, 取得進度軸上的時間
        var get_time_in_progress_bar = function (x) {
            var bar_length = progress_bar.outerWidth();
            var percent = x / bar_length;
            var minute = data_time.total_minutes * percent;
            var mod = minute % progress.interval;
            var offset = Math.round(mod / progress.interval) * progress.interval;
            minute = minute - mod + offset;
            var d = new Date(data_time.start.getTime());
            d.setMinutes(d.getMinutes() + minute);
            return {
                date: d,
                minute_count: minute
            };
        };
        //設定 progress mousemove 的小時 tip
        var set_tip_hour = function (x) {
            var hour = get_time_in_progress_bar(x);
            var div_left_percent = hour.minute_count / data_time.total_minutes * 100;
            tip.hour.css("left", div_left_percent + "%");
            tip.hour_arrow.css("left", div_left_percent + "%");
            fix_tip_hour_position();
            var d = hour.date;
            var hh = (d.getHours() < 10) ? "0" + d.getHours() : d.getHours();
            var mm = (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes();
            tip.hour.html(hh + "：" + mm);
        };
        var stop_animate = function () {
            progress.progress.stop();
            tip.text.stop();
            tip.arrow.stop();
        };
        //設定進度軸的數值
        var set_progress_value = function (value, animate) {
            progress.value = value;
            //var percent = (progress.value - progress.min) / (progress.max - progress.min) * 100
            var percent = (progress.value / progress.minute_count) * 100;
            if (percent < 0)
                percent = 0;
            if (percent > 100)
                percent = 100;
            var speed = _opt.animate_speed * self.speed_base;
            if (animate === false)
                speed = 0;
            if (progress.value <= progress.min)
                speed = 0;
            var date = new Date(data_time.start.getTime());
            date.setMinutes(date.getMinutes() + progress.value);
            if (progress.value === progress.max) {
                //$(end_play_tip).show();
            }
            else {
                $(end_play_tip).hide();
            }
            progress.progress.stop().animate({
                width: percent + "%"
            }, speed, function () {
                set_tip_date(date, percent, animate);
                if (progress.playing === true) {
                    go_next();
                }
            });
            //trigger event
            $(self).trigger(self.event.value_changed, date);
            fix_tip_hour_position();
            current_time = date;
        };
        //依日期取得播放軸的百分比
        var get_time_percent = function (date) {
            var d = new Date(date);
            var st = data_time.start.getTime();
            var ct = d.getTime();
            var m = (ct - st) / 1000 / 60;
            var p = (m / data_time.total_minutes) * 100;
            return p;
        };
        //跳到下一個時段
        var go_next = function () {
            if (progress.playing === false)
                return;
            progress.value += progress.interval;
            if (progress.value > progress.max) {
                if (_opt.repeater === true) {
                    progress.value = progress.min;
                }
                else {
                    progress.value = progress.max;
                    self.stop();
                    return;
                }
            }
            set_progress_value(progress.value);
        };
        var go_next_time_range = function () {
            progress.value += progress.interval;
        };
        //設定上方的 hour tip, 不重疊 date tip
        var fix_tip_hour_position = function () {
            var start = tip.text.offset().left;
            var end = start + tip.text.outerWidth();
            start -= 3;
            end += 3;
            var s = tip.hour.offset().left;
            var e = s + tip.hour.outerWidth();
            if ((s < end) && (e > start)) {
                tip.hour.addClass("offset_top");
                tip.hour_arrow.addClass("offset_top");
            }
            else {
                tip.hour.removeClass("offset_top");
                tip.hour_arrow.removeClass("offset_top");
            }
        };
        //設定下方的日期區塊
        var set_date_block = function () {
            date_bar.empty();
            var day_count = Math.ceil(data_time.total_minutes / (60 * 24));
            var interval = 24;
            data_time.text_type = "day";
            if (day_count <= 2) {
                interval = 1;
                data_time.text_type = "hour";
            }
            interval = 1;
            data_time.text_type = "hour";
            var start = (interval - data_time.start.getHours()) % interval * 60;
            for (var i = start; i <= data_time.total_minutes; i += (60 * interval)) {
                var value = i;
                var d = new Date(data_time.start.getTime());
                d.setMinutes(d.getMinutes() + value);
                var percent = (value / data_time.total_minutes) * 100;
                if (percent < 0)
                    percent = 0;
                var div = $("<div></div>")
                    .addClass("text")
                    .css("left", percent + "%")
                    .attr("data-time", d.getTime());
                date_bar.append(div);
            }
            set_date_block_text();
        };
        //設定下方的日期區塊的文字
        var set_date_block_text = function () {
            if (data_time.text_type === "day") {
                set_date_block_text_date();
            }
            else {
                set_date_block_text_hour();
            }
        };
        //設定下方的日期區塊的文字(日期)
        var set_date_block_text_date = function () {
            date_bar.find("div").each(function (idx, elm) {
                var s = $(elm).position().left;
                var e = 0;
                var next = $(elm).next();
                if (next.length === 0) {
                    e = date_bar.width();
                }
                else {
                    e = $(next).position().left;
                }
                ;
                var width = e - s;
                var d = new Date(parseInt($(elm).attr("data-time")));
                var text = "";
                if (width >= 70) {
                    text = _opt.week[d.getDay()] + " " + d.getDate();
                    $(elm).html(text).css("visibility", "visible");
                }
                else if (width >= 43) {
                    text = _opt.week[d.getDay()].substring(2, 3) + " " + d.getDate();
                    $(elm).html(text).css("visibility", "visible");
                }
                else if (width >= 25) {
                    text = d.getDate();
                    $(elm).html(text).css("visibility", "visible");
                }
                else {
                    var part = Math.floor(date_bar.find("div").length / 4);
                    text = d.getDate();
                    $(elm).html(text).css("visibility", (idx % part === 0) ? "visible" : "hidden");
                }
            });
        };
        //設定下方的日期區塊的文字(小時)
        var set_date_block_text_hour = function () {
            date_bar.find("div").each(function (idx, elm) {
                var s = $(elm).position().left;
                var e = 0;
                var next = $(elm).next();
                if (next.length === 0) {
                    e = date_bar.width();
                }
                else {
                    e = $(next).position().left;
                }
                ;
                var width = e - s;
                var d = new Date(parseInt($(elm).attr("data-time")));
                var text = "";
                if (width >= 30) {
                    text = padleft(d.getHours(), 2);
                    $(elm).css("visibility", "visible");
                }
                else {
                    var interval = (width >= 10) ? 4 : 12;
                    // var part = Math.floor(date_bar.find("div").length / interval);
                    var part = interval;
                    text = padleft(d.getHours(), 2);
                    $(elm).css("visibility", (d.getHours() % part === 0) ? "visible" : "hidden");
                }
                if (d.getHours() === 0) {
                    text += "<br/>" + _opt.week[d.getDay()] + " " + d.getDate();
                }
                $(elm).html(text);
            });
        };
        //啟用 / 關閉 timeline
        var enable_timeline = function (enable) {
            _opt.enabled = enable;
            if (enable === true) {
                play_btn.removeClass("disabled");
                tip_bar.css("visibility", "visible");
            }
            else {
                play_btn.addClass("disabled");
                tip_bar.css("visibility", "hidden");
                progress.min = 0;
                progress.max = 0;
                set_progress_value(0);
                self.stop();
            }
        };
        var set_speed_base = function (base) {
            self.speed_base = base;
            $(".speed-area .item").removeClass("active");
            $(".speed-area .base-" + base).addClass("active");
        };
        var set_last_date = function () {
            var last_hh = padleft(data_time.end.getHours(), 2, "0");
            var last_mm = padleft(data_time.end.getMinutes(), 2, "0");
            $(container).find(".last_date").text(last_hh + ":" + last_mm);
        };
        //public function ==========================
        this.unactive = function () {
            _opt.enabled = false;
            div_timeline.addClass("unactive");
            unactive_marker.show();
        };
        this.active = function () {
            _opt.enabled = true;
            div_timeline.removeClass("unactive");
            unactive_marker.hide();
        };
        this.play = function (trigger) {
            progress.playing = true;
            play_btn.find(".text")
                .removeClass(_opt.play_btn.class)
                .addClass(_opt.stop_btn.class);
            if (progress.value === progress.max) {
                if (_opt.repeater === true) {
                    progress.value = progress.min;
                    set_progress_value(progress.value);
                }
                else {
                    //progress.value = progress.min;
                    //set_progress_value(progress.value);
                    progress.value = progress.max;
                    $(end_play_tip).show();
                    this.stop();
                    return;
                }
            }
            if (trigger === undefined || trigger !== false) {
                $(self).trigger("play_start");
            }
            run();
        };
        this.stop = function () {
            stop_animate();
            set_progress_value(progress.value, false);
            progress.playing = false;
            $(self).trigger("stop_start");
            play_btn.find(".text")
                .removeClass(_opt.stop_btn.class)
                .addClass(_opt.play_btn.class);
        };
        this.get_time = function () {
            return new Date(current_time);
        };
        this.is_end_time = function () {
            return current_time.getTime() == data_time.end.getTime();
        };
        this.set_value = function (value) {
            var v = Math.round((progress.minute_count) * (value / 100));
            v += ((v % progress.interval) * -1);
            set_progress_value(v, false);
        };
        //設定已讀取的日期
        this.set_load_date = function (date) {
            var d = new Date();
            if (typeof date === "string") {
                d = new Date(date);
            }
            else if (typeof date === "object") {
                d = date;
            }
            var min = data_time.start.getTime();
            var max = data_time.end.getTime();
            var value = d.getTime();
            var percent = (value - min) / (max - min) * 100;
            if (percent < 0)
                percent = 0;
            if (percent > 100)
                percent = 100;
            progress.load.css("width", percent + "%");
        };
        //設定起迄日期
        this.set_date = function (start, end) {
            if (start === undefined || start === null || end === undefined || end === null) {
                enable_timeline(false);
                return;
            }
            if (typeof start === 'object') {
                data_time.start = new Date(start);
            }
            else if (typeof start === 'string') {
                data_time.start = new Date(start);
            }
            if (typeof end === "object") {
                data_time.end = new Date(end);
            }
            else if (typeof end === "string") {
                data_time.end = new Date(end);
            }
            var times = data_time.end.getTime() - data_time.start.getTime();
            data_time.total_minutes = times / (1000 * 60);
            progress.min = 0;
            progress.max = data_time.total_minutes;
            progress.minute_count = data_time.total_minutes;
            progress.interval = _opt.interval;
            //set_progress_value(0, false);
            //設定日期
            set_tip_date(data_time.start, 0);
            //下方的日期區塊
            set_date_block();
            enable_timeline(true);
            set_last_date();
        };
        this.set_time_range = function (start, end) {
            this.stop();
            time_range.start = start;
            time_range.end = end;
            time_range_border.show();
            var sp = get_time_percent(start);
            var ep = get_time_percent(end);
            if (ep > 100)
                ep = 100;
            $(time_range_border).css("left", sp + "%");
            $(time_range_border).css("width", (ep - sp) + "%");
            progress.min = progress.minute_count * (sp / 100);
            progress.min += (progress.min % progress.interval) * -1;
            progress.max = progress.minute_count * (ep / 100);
            progress.max += (progress.max % progress.interval) * -1;
            set_speed_base(12);
            this.set_value(sp);
            this.play();
        };
        this.get_time_range = function () {
            return {
                start: data_time.start,
                end: data_time.end
            };
        };
        this.clear_time_range = function () {
            this.stop();
            progress.min = 0;
            progress.max = progress.minute_count;
            time_range.start = null;
            time_range.end = null;
            time_range_border.hide();
        };
        //初始化 =============================
        var init = function () {
            $(container).empty().append(div_timeline);
            //play btn
            var play_icon = $("<i></i>").addClass("text").addClass(_opt.play_btn.class);
            play_btn.append(play_icon);
            div_timeline.append(play_btn);
            div_timeline.append(end_play_tip);
            play_btn.on("click", function () {
                switch_play();
            });
            div_timeline.append(unactive_marker);
            //bar
            div_timeline.append(bar_container);
            //tip bar
            bar_container.append(tip_bar);
            tip_bar.append(tip.text);
            tip_bar.append(tip.arrow);
            tip_bar.append(tip.hour);
            tip_bar.append(tip.hour_arrow);
            tip_bar.append(tip.circle);
            //progress bar
            bar_container.append(progress_bar);
            progress_bar.append(progress.progress);
            progress_bar.append(progress.load);
            progress_bar.append(progress.background);
            //time-range
            time_range_border.hide();
            progress_bar.append(time_range_border);
            progress_bar
                .on("mousemove", function (e) {
                    $(tip.hour).show();
                    $(tip.hour_arrow).show();
                    set_tip_hour(event.offsetX);
                })
                .on("mouseout", function () {
                    tip.hour.hide();
                    tip.hour_arrow.hide();
                })
                .on("click", function () {
                    var playing = progress.playing;
                    self.stop();
                    var hour = get_time_in_progress_bar(event.offsetX);
                    set_progress_value(hour.minute_count, false);
                    if (playing === true) {
                        play_btn.find(".text")
                            .removeClass(_opt.play_btn.class)
                            .addClass(_opt.stop_btn.class);
                        window.setTimeout(self.play, _opt.animate_speed * 3 / 2);
                    }
                    ;
                });
            //tip 拖拉
            var fn_drag = {
                axis: "x",
                start: function () {
                    tip.text.drag_playing = progress.playing;
                    self.stop();
                    if (tip.text.drag_playing === true) {
                        play_btn.find(".text")
                            .removeClass(_opt.play_btn.class)
                            .addClass(_opt.stop_btn.class);
                    }
                    ;
                },
                drag: function (e, ui) {
                    var left = ui.position.left;
                    var max = progress_bar.width();
                    var drag_percent = left / max;
                    var prog_min_percent = (progress.min / progress.minute_count);
                    var prog_max_percent = (progress.max / progress.minute_count);
                    if (prog_max_percent > 1)
                        prog_max_percent = 1;
                    if (drag_percent < prog_min_percent) {
                        ui.position.left = Math.floor(max * prog_min_percent);
                    }
                    if (drag_percent > prog_max_percent) {
                        ui.position.left = Math.floor(max * prog_max_percent);
                    }
                    var hour = get_time_in_progress_bar(ui.position.left);
                    set_progress_value(hour.minute_count, false);
                    tip.arrow.css("left", ui.position.left);
                    tip.circle.css("left", ui.position.left);
                },
                stop: function () {
                    var percent = (progress.value / data_time.total_minutes) * 100;
                    tip.text.css("left", percent + "%");
                    tip.arrow.css("left", percent + "%");
                    tip.circle.css("left", percent + "%");
                    if (tip.text.drag_playing === true) {
                        self.play();
                    }
                    ;
                }
            };
            $(tip.text).draggable(fn_drag);
            $(tip.circle).draggable(fn_drag);
            //date bar
            bar_container.append(date_bar);
            var last_hh = padleft(end.getHours(), 2, "0");
            var last_mm = padleft(end.getMinutes(), 2, "0");
            var last_time = $("<div></div>").addClass("last_date").text(last_hh + ":" + last_mm);
            bar_container.append(last_time);
            //speed bar
            var speed_area = $("<div></div>").addClass("speed-area").attr("title", "播放速度");
            bar_container.append(speed_area);
            var speed = [
                { base: 1, icon: "fas fa-fighter-jet" },
                { base: 3, icon: "fas fas fa-car" },
                { base: 6, icon: "fas fa-motorcycle" },
                { base: 12, icon: "fas fa-male" }
            ];
            for (var i = 0; i < speed.length; i++) {
                var speed_item = $("<div></div>").addClass("item").addClass("base-" + speed[i].base);
                //var speed_icon = $("<i></i>").addClass(speed[i].icon);
                var speed_icon = $("<div></div>").text((speed.length - i) + "x");
                if (i == 0) {
                    speed_item.addClass("active");
                }
                ;
                var fn = (function (base) {
                    return function () {
                        set_speed_base(base);
                    };
                })(speed[i].base);
                speed_item.append(speed_icon);
                speed_item.click(fn);
                speed_area.append(speed_item);
            }
            ;
            //設定起迄日期
            self.set_date(start, end);
            $(window).resize(function () {
                set_date_block_text();
            });
        };
        init();
        return this;
    }
}
