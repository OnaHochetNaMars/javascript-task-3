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
};

function toDate(date) {
    var dayOfWeek = date.substring(0, 2);
    var day = DaysOfWeek[dayOfWeek];
    var hours = parseInt (date.substring(3, 5)) - parseInt (date.substring(8));
    var minutes = parseInt (date.substring(6, 8));

    return new Date (2016, 9, day, hours, minutes);
}

function toNewSchedule(schedule) {
    var newSchedule = {};
    for (var key in schedule) {
        if ({}.hasOwnProperty.call(schedule, key)) {
            var n = (schedule[key]).length;
            newSchedule[key] = [];
            for (var i = 0; i < n; i++) {
                newSchedule[key][i] = {
                    from: toDate (schedule[key][i].from),
                    to: toDate (schedule[key][i].to)
                };
                newSchedule[key].len = n;
            }
        }
    }

    return newSchedule;
}

function maxFrom(date1, date2, date3) {
    if (date1.from > date2.from && date1.from > date3.from) {
        return date1.from;
    }
    if (date2.from > date3.from) {
        return date2.from;
    }

    return date3.from;
}

function minTo(date1, date2, date3) {
    if (date1.to < date2.to && date1.to < date3.to) {
        return date1.to;
    }
    if (date2.to < date3.to) {
        return date2.to;
    }

    return date3.to;
}

function maxDate(date1, date2) {
    if (date1 > date2) {
        return date1;
    }

    return date2;
}

function minDate(date1, date2) {
    if (date1 < date2) {
        return date1;
    }

    return date2;
}

function toFreeSchedule(schedule) {
    var freeSchedule = {};
    for (var key in schedule) {
        if ({}.hasOwnProperty.call(schedule, key)) {
            freeSchedule[key] = [];
            var n = (schedule[key]).length;
            freeSchedule[key][0] = {
                from: new Date (2016, 9, 1, 0, 0),
                to: schedule[key][0].from
            };
            for (var i = 1; i < n; i++) {
                freeSchedule[key][i] = {
                    from: schedule[key][i - 1].to,
                    to: schedule[key][i].from
                };
            }
            freeSchedule[key][n] = {
                from: schedule[key][n - 1].to,
                to: new Date (2016, 9, 3, 23, 59)
            };
            freeSchedule[key].len = n + 1;
        }
    }

    return freeSchedule;
}

function gangFreeTime(schedule) {
    var freeTime = [];
    var D = schedule.Danny.len;
    var R = schedule.Rusty.len;
    var L = schedule.Linus.len;
    function func(i, j, k) {
        var a = maxFrom (schedule.Danny[i], schedule.Rusty[j], schedule.Linus[k]);
        var b = minTo (schedule.Danny[i], schedule.Rusty[j], schedule.Linus[k]);
        if (b > a) {
            freeTime.push({
                from: a,
                to: b
            });
        }
    }
    for (var i = 0; i < D; i++) {
        for (var j = 0; j < R; j++) {
            for (var k = 0; k < L; k++) {
                func(i, j, k);
            }
        }
    }

    return freeTime;
}

function findTimeForRobbery(freeTime, workingHours) {
    var n = freeTime.length;
    var res = [];
    var date = [workingHours.from, workingHours.to];
    var hours = [];
    var minutes = [];
    var bank = [];
    hours[0] = parseInt (date[0].substring (0, 2)) - parseInt (date[0].substring (5));
    hours[1] = parseInt (date[1].substring (0, 2)) - parseInt (date[1].substring (5));
    minutes[0] = parseInt (date[0].substring (3, 5));
    minutes[1] = parseInt (date[1].substring (3, 5));
    for (var i = 0; i < n; i++) {
        var day = freeTime[i].from.getDate();
        if (day > 3) {
            return res;
        }
        bank[0] = new Date (2016, 9, day, hours[0], minutes[0]);
        bank[1] = new Date (2016, 9, day, hours[1], minutes[1]);
        var a = maxDate (freeTime[i].from, bank[0]);
        var b = minDate (freeTime[i].to, bank[1]);
        if (b > a) {
            res.push({
                from: a,
                to: b
            });
        }
    }

    return res;
}

function mainFunction(timeToRobbery, duration) { // не знаю как назвать функцию=(
    var msInDuration = duration * 60 * 1000;
    var res = [];
    var n = timeToRobbery.length;
    var c = 0;
    for (var i = 0; i < n; i++) {
        var a = (timeToRobbery[i].to - timeToRobbery[i].from);
        if (a >= msInDuration) {
            res[c] = {};
            res[c] = timeToRobbery[i];
            c++;
        }
    }
    if (c === 0) {
        return null;
    }

    return res; // время для ограбления
}

function formateDate(date, gmt) {
    var day = date.getDate();
    var hours = date.getHours() + gmt;
    var minutes = date.getMinutes();
    var week = ['', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
    day = week[day];
    if (hours < 10) {
        hours = '0' + hours;
    }
    hours = String(hours);
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    minutes = String(minutes);

    return [day, hours, minutes];
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
    var newSchedule = {};
    newSchedule = toNewSchedule (schedule);
    var freeSchedule = toFreeSchedule (newSchedule);
    var freeTime = gangFreeTime (freeSchedule);
    var timeForRobbery = findTimeForRobbery (freeTime, workingHours);
    var timeToRobbery = mainFunction (timeForRobbery, duration);
    var gmt = parseInt (workingHours.from.substring(5));

    return {

        /**
         * Найдено ли время
         * @returns {Boolean}
         */
        exists: function () {

            return (timeToRobbery !== null);
        },

        /**
         * Возвращает отформатированную строку с часами для ограбления
         * Например,
         *   "Начинаем в %HH:%MM (%DD)" -> "Начинаем в 14:59 (СР)"
         * @param {String} template
         * @returns {String}
         */
        format: function (template) {
            if (!this.exists()) {
                return '';
            }
            var format = formateDate(timeToRobbery[0].from, gmt);
            var newTemplate = template
                .replace('%DD', format[0])
                .replace('%HH', format[1])
                .replace('%MM', format[2]);

            return newTemplate;
        }
    };
};
