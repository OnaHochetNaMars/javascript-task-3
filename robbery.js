'use strict';

/**
 * Сделано задание на звездочку
 * Реализовано оба метода и tryLater
 */
exports.isStar = false;

var WEEK = ['', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
var YEAR = 2016;
var MONTH = 9;
var BEGIN_OF_WEEK = new Date (YEAR, MONTH, 1, 0, 0);
var END_OF_WEEK = new Date (YEAR, MONTH, 7, 23, 59);

function toTypeDate(date, bankTimeZone) {
    var dayOfWeek = date.slice(0, 2);
    var currentDay = WEEK.indexOf(dayOfWeek);
    var hours = parseInt (date.slice(3, 5), 10) - parseInt (date.slice(8), 10) + bankTimeZone;
    var minutes = parseInt (date.slice(6, 8), 10);

    return new Date (YEAR, MONTH, currentDay, hours, minutes);
}

function toNewSchedule(schedule, bankTimeZone) {
    var newSchedule = {};
    var keys = Object.keys(schedule);
    keys.forEach(function (key) {
        var n = (schedule[key]).length;
        if (n === 0) {
            newSchedule[key] = [{
                from: BEGIN_OF_WEEK,
                to: BEGIN_OF_WEEK
            }];
        } else {
            newSchedule[key] = [];
            for (var i = 0; i < n; i++) {
                newSchedule[key].push({
                    from: toTypeDate (schedule[key][i].from, bankTimeZone),
                    to: toTypeDate (schedule[key][i].to, bankTimeZone)
                });
            }
        }
    });

    return newSchedule;
}

// minOrMax = 1 если нужно найти максимум и
// -1 если нужно найти минимум
function compareDate(minOrMax) {
    var dates = [].slice.call(arguments, 1);
    dates.sort (function (date1, date2) {
        return (date2 - date1) * minOrMax;
    });

    return dates[0];
}

function toFreeSchedule(schedule) {
    var freeSchedule = {};
    var keys = Object.keys(schedule);
    keys.forEach(function (key) {
        freeSchedule[key] = [];
        var n = (schedule[key]).length;
        freeSchedule[key][0] = {
            from: BEGIN_OF_WEEK,
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
            to: END_OF_WEEK
        };
        freeSchedule[key].len = n + 1;
    });

    return freeSchedule;
}

function gangFreeTime(schedule) {
    var freeTime = [];
    var begin;
    var end;
    schedule.Danny.forEach(function (i) {
        schedule.Rusty.forEach(function (j) {
            schedule.Linus.forEach(function (k) {
                begin = compareDate (1, i.from, j.from, k.from);
                end = compareDate (-1, i.to, j.to, k.to);
                if (end > begin) {
                    freeTime.push({
                        from: begin,
                        to: end
                    });
                }
            });
        });
    });

    return freeTime;
}

function dateToObject(date) {
    return {
        hours: parseInt(date.slice(0, 2), 10),
        minutes: parseInt(date.slice(3, 5), 10)
    };
}

function findTimeForRobbery(freeTime, workingHours, res) {
    var startBankWork = dateToObject(workingHours.from);
    var endBankWork = dateToObject(workingHours.to);
    var bank = {};
    freeTime.forEach(function (interval) {
        var day = interval.from.getDate();
        bank.start = new Date (YEAR, MONTH, day, startBankWork.hours, startBankWork.minutes);
        bank.end = new Date (YEAR, MONTH, day, endBankWork.hours, endBankWork.minutes);
        var begin = compareDate (1, interval.from, bank.start);
        var end = compareDate (-1, interval.to, bank.end);
        if (end > begin) {
            res.push({
                from: begin,
                to: end
            });
        }
    });

    return res;
}

function mainFunction(timeToRobbery, msInDuration) {
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

function toString(number) {
    if (number < 10) {
        number = '0' + number;
    }
    number = String(number);

    return number;
}

function formateDate(date) {
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    day = WEEK[day];
    hours = toString (hours);
    minutes = toString(minutes);

    return [day, hours, minutes];
}

function formateFreeTime(freeTime) {
    var res = [];
    freeTime.forEach(function (interval) {
        var day1 = interval.from.getDate();
        var day2 = interval.to.getDate();
        for (var i = day1; i <= Math.min(day2, 3); i++) {
            res.push({
                from: compareDate (1, new Date (YEAR, MONTH, i, 0, 0), interval.from),
                to: compareDate (-1, new Date (YEAR, MONTH, i, 23, 59), interval.to)
            });
        }
    });

    return res;
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
    var gmt = parseInt (workingHours.from.slice(5), 10);
    var msInDuration = 60 * 1000 * duration;
    newSchedule = toNewSchedule (schedule, gmt);
    var freeSchedule = toFreeSchedule (newSchedule);
    var freeTime = gangFreeTime (freeSchedule);
    freeTime = formateFreeTime (freeTime);
    var timeForRobbery = findTimeForRobbery (freeTime, workingHours, []);
    var timeToRobbery = mainFunction (timeForRobbery, msInDuration);

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
            var format = formateDate(timeToRobbery[0].from);
            var newTemplate = template
                .replace('%DD', format[0])
                .replace('%HH', format[1])
                .replace('%MM', format[2]);

            return newTemplate;
        }
    };
};
