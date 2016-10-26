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
    console.info(schedule1);

    return {

        /**
         * Найдено ли время
         * @returns {Boolean}
         */
        exists: function () {
            return false;
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
