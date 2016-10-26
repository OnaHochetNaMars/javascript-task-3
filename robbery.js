'use strict';

/**
 * Сделано задание на звездочку
 * Реализовано оба метода и tryLater
 */
exports.isStar = false;

var DaysOfWeek = {
    'ПН': 1,
    'ВТ': 2,
    'СР': 3,
    'ЧТ': 4,
    'ПТ': 5,
    'СБ': 6,
    'ВС': 7
}

function toDate (date) {
    var dayOfWeek = date.substring(0, 2);
    var day = DaysOfWeek[dayOfWeek];
    var hours = parseInt (date.substring(3, 5)) - parseInt (date.substring(8));
    var minutes = parseInt (date.substring(6, 8));
    return new Date (2016, 09, day, hours, minutes);
}

function newSchedule (schedule) {
    var schedule1 = {};
    for (var key in schedule) {
        var n = (schedule[key]).length;
        schedule1[key] = [];
        for (var i = 0; i < n; i++) {
            schedule1[key][i] = {
                from: toDate (schedule[key][i].from),
                to: toDate (schedule[key][i].to)
            }
            schedule1[key].len = n;
        }
    }
    return schedule1;
}

function maxFrom (date1, date2, date3) {
    if (date1.from > date2.from && date1.from > date3.from) return date1.from;
    if (date2.from > date3.from) return date2.from;
    return date3.from;
}

function minTo (date1, date2, date3) {
    if (date1.to < date2.to && date1.to < date3.to) return date1.to;
    if (date2.to < date3.to) return date2.to;
    return date3.to;
}

function maxDate (date1, date2) {
    if (date1 > date2) { return date1;}
    return date2;
}

function minDate (date1, date2) {
    if (date1 < date2) { return date1;}
    return date2;
}

function toFreeSchedule (schedule) {
    var freeSchedule = {};
    for (var key in schedule) {
        freeSchedule[key] = [];
        var n = (schedule[key]).length;
        freeSchedule[key][0] = {
            from: new Date (2016, 09, 1, 0, 0),
            to: schedule[key][0].from
        }
        for (var i = 1; i < n; i++) {
            freeSchedule[key][i] = {
                from: schedule[key][i - 1].to,
                to: schedule[key][i].from
            }
        }
        freeSchedule[key][n] = {
            from: schedule[key][n - 1].to,
            to: new Date (2016, 09, 3, 23, 59)
        }
        freeSchedule[key].len = n + 1;
    }
    
    return freeSchedule;
}

function gangFreeTime (schedule) {
    var freeTime = [];
    var c = 0;
    var D = schedule.Danny.len;
    var R = schedule.Rusty.len;
    var L = schedule.Linus.len;
    //console.log (D, R, L);
    for (var i = 0; i < D; i++) {
        for (var j = 0; j < R; j++) {
            for (var k = 0; k < L; k++) {
                var date1 = schedule.Danny[i];
                var date2 = schedule.Rusty[j];
                var date3 = schedule.Linus[k];
                //console.log (date1);
                var a = maxFrom (date1, date2, date3);
                var b = minTo (date1, date2, date3);
                if (b > a) {
                    freeTime[c] = {
                        from: a,
                        to: b
                    }
                    c++;
                }
            }
        }
    }
    
    return freeTime;
}

function timeForRobbery (gangFreeTime, workingHours) {
    var n = gangFreeTime.length;
    var res = [];
    var c = 0;
    for (var i = 0; i < n; i++) {
        //console.log ((gangFreeTime[i].from).getDate());
        //var day = 1;
        var day = gangFreeTime[i].from.getDate();
        if (day > 3) { return res;}
        var date1 = workingHours.from;
        var date2 = workingHours.to;
        var hour1 = parseInt (date1.substring (0, 2)) - parseInt (date1.substring (5));
        var hour2 = parseInt (date2.substring (0, 2)) - parseInt (date2.substring (5));
        var minutes1 = parseInt (date1.substring (3, 5));
        var minutes2 = parseInt (date2.substring (3, 5));
        var bankWorkFrom = new Date (2016, 09, day, hour1, minutes1);
        var bankWorkTo = new Date (2016, 09, day, hour2, minutes2);
        var a = maxDate (gangFreeTime[i].from, bankWorkFrom);
        var b = minDate (gangFreeTime[i].to, bankWorkTo);
        if (b > a) {
            res[c] = {
                from: a,
                to: b
            }
            c++;
        }
    }
    
    return res;
}

function mainFunction (time_to_robbery, duration) {//не знаю как назвать функцию=(
    var msInDuration = duration*60*1000;
    var res = [];
    var n = time_to_robbery.length;
    var c = 0;
    for (var i = 0; i < n; i++) {
        var a = (time_to_robbery[i].to - time_to_robbery[i].from);
        if (a >= msInDuration) {
            //console.log(a);
            res[c] = time_to_robbery[i];
            c++;
        }
    }
    //console.log (res);
    return res; // время для ограбления
}

/**
 * @param {Object} schedule – Расписание Банды
 * @param {Number} duration - Время на ограбление в минутах
 * @param {Object} workingHours – Время работы банка
 * @param {String} workingHours.from – Время открытия, например, "10:00+5"
 * @param {String} workingHours.to – Время закрытия, например, "18:00+5"
 * @returns {Object}
 */

exports.getAppropriateMoment = function (schedule, duration, workingHours) {
    //console.info(schedule, duration, workingHours);
    //переводим расписание в формат Date()
    var schedule1 = {};
    schedule1 = newSchedule (schedule);
    //console.info(schedule1);
    var freeSchedule = toFreeSchedule (schedule1);
    //console.info(freeSchedule);
    var freeTime = gangFreeTime (freeSchedule);
    //console.info(freeTime);
    var time_for_robbery = timeForRobbery (freeTime, workingHours);
    //console.info(time_for_robbery);
    var time_to_robbery = mainFunction (time_for_robbery, duration);
    //console.info(time_to_robbery);

    return {

        time: time_to_robbery,

        /**
         * Найдено ли время
         * @returns {Boolean}
         */
        exists: function () {
            return (time_to_robbery !== []);
        },

        /**
         * Возвращает отформатированную строку с часами для ограбления
         * Например,
         *   "Начинаем в %HH:%MM (%DD)" -> "Начинаем в 14:59 (СР)"
         * @param {String} template
         * @returns {String}
         */
        format: function (template) {
            return template;
        }
    };
};
