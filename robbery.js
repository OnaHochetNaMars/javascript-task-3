'use strict';

/**
 * Сделано задание на звездочку
 * Реализовано оба метода и tryLater
 */
exports.isStar = false;

var WEEK = ['', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
var BEGIN_OF_WEEK = new Date (0, 0, 1, 0, 0);
var END_OF_WEEK = new Date (0, 0, 7, 23, 59);
var msInMinute = 60000;

function leadToDataType(date, bankTimeZone) {
    var dayOfWeek = date.slice(0, 2);
    var currentDay = WEEK.indexOf(dayOfWeek);
    var hours = parseInt(date.slice(3, 5), 10);
    var timeZone = parseInt(date.slice(8), 10);
    hours = hours - timeZone + bankTimeZone;
    var minutes = parseInt(date.slice(6, 8), 10);

    return new Date (0, 0, currentDay, hours, minutes);
}

function maxDate() {
    var dates = [].slice.call(arguments);
    dates.sort(function (date1, date2) {

        return (date2 - date1);
    });

    return dates[0];
}

function minDate() {
    var dates = [].slice.call(arguments);
    dates.sort(function (date1, date2) {

        return (date1 - date2);
    });

    return dates[0];
}

function toFreeSchedule(schedule, bankTimeZone) {
    var freeSchedule = {};
    var keys = Object.keys(schedule);
    keys.forEach(function (key) {
        var length = (schedule[key]).length;
        freeSchedule[key] = [];
        freeSchedule[key].push({
            from: BEGIN_OF_WEEK,
            to: leadToDataType (schedule[key][0].from, bankTimeZone)
        });
        for (var i = 1; i < length; i++) {
            freeSchedule[key].push({
                from: leadToDataType (schedule[key][i - 1].to, bankTimeZone),
                to: leadToDataType (schedule[key][i].from, bankTimeZone)
            });
        }
        freeSchedule[key].push({
            from: leadToDataType (schedule[key][length - 1].to, bankTimeZone),
            to: END_OF_WEEK
        });
    });

    return freeSchedule;
}

function getGangFreeTime(schedule) {
    var freeTime = [];
    schedule.Danny.forEach(function (interval1) {
        schedule.Rusty.forEach(function (interval2) {
            schedule.Linus.forEach(function (interval3) {
                var begin = maxDate (interval1.from, interval2.from, interval3.from);
                var end = minDate (interval1.to, interval2.to, interval3.to);
                if (end > begin) {
                    freeTime.push({
                        from: begin,
                        to: end
                    });
                }
            });
        });
    });
    freeTime = formateFreeTime (freeTime);

    return freeTime;
}

function formateFreeTime(freeTime) {
    var res = [];
    freeTime.forEach(function (interval) {
        var day1 = interval.from.getDate();
        var day2 = interval.to.getDate();
        for (var i = day1; i <= Math.min(day2, 3); i++) {
            res.push({
                from: maxDate (new Date (0, 0, i, 0, 0), interval.from),
                to: minDate (new Date (0, 0, i, 23, 59), interval.to)
            });
        }
    });

    return res;
}

function dateToObject(date) {
    return {
        hours: parseInt(date.slice(0, 2), 10),
        minutes: parseInt(date.slice(3, 5), 10)
    };
}

function getFreeIntervals(freeTime, workingHours, res) {
    var startBankWork = dateToObject(workingHours.from);
    var endBankWork = dateToObject(workingHours.to);
    var bank = {};
    freeTime.forEach(function (interval) {
        var day = interval.from.getDate();
        bank.start = new Date (0, 0, day, startBankWork.hours, startBankWork.minutes);
        bank.end = new Date (0, 0, day, endBankWork.hours, endBankWork.minutes);
        var begin = maxDate (interval.from, bank.start);
        var end = minDate (interval.to, bank.end);
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
    for (var i = 0; i < timeToRobbery.length; i++) {
        var a = (timeToRobbery[i].to - timeToRobbery[i].from);
        if (a >= msInDuration) {
            res.push(timeToRobbery[i]);
        }
    }
    if (res.length === 0) {
        return null;
    }

    return res; // время для ограбления
}

function toString(number) {
    if (number < 10) {
        number = '0' + number;
    }
    number.toString();

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
    var gmt = parseInt(workingHours.from.slice(5), 10);
    var msInDuration = msInMinute * duration;
    var freeSchedule = toFreeSchedule (schedule, gmt);
    var freeTime = getGangFreeTime (freeSchedule);
    var timeForRobbery = getFreeIntervals (freeTime, workingHours, []);
    timeForRobbery = mainFunction (timeForRobbery, msInDuration);

    return {

        /**
         * Найдено ли время
         * @returns {Boolean}
         */
        exists: function () {

            return (timeForRobbery !== null);
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
            var format = formateDate(timeForRobbery[0].from);
            var newTemplate = template
                .replace('%DD', format[0])
                .replace('%HH', format[1])
                .replace('%MM', format[2]);

            return newTemplate;
        }
    };
};
