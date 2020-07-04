"use strict";
exports.__esModule = true;
/**
 * 时间工具类
 * @class
 * @todo 一些计划中的功能
 *
 * - [x] 初始化时间
 * - [x] 格式化时间
 * - [x] 时间计算
 * - [x] 时间增减量计算
 * - [ ] 农历
 * - [x] 今年多少天，当前第几天等
 * - [x] 尽量全使用静态方法
 */
var dms_date = /** @class */ (function () {
    function dms_date() {
    }
    /**
     * 时间格式化函数
     *
     * @param {string|number|Date} dateBase 需要被格式的时间（默认为当前时间）
     * @param {string} format 希望格式
     * - YYYY: 四位数年
     * - YY  : 两位数年
     * - MMMM: 月名称
     * - MMM : 月名称缩写
     * - MM  : 两位数月（01-12）
     * - M   : 自动位数月（1-12）
     * - DDDD: 星期几
     * - DDD : 星期几缩写
     * - DD  : 两位数日（01-31）
     * - D   : 自动位数日（1-31）
     * - HH  : 两位数时（二十四小时制）（00-23）
     * - H   : 自动位数时（二十四小时制）（0-23）
     * - hh  : 两位数时（十二小时制）（01-12）
     * - h   : 自动位数时（十二小时制）（1-12）
     * - mm  : 两位数分（00-59）
     * - m   : 自动位数分（0-59）
     * - ss  : 两位数秒（00-59）
     * - s   : 自动位数秒（0-59）
     * - f   : 时分秒
     * - ff  : 百分秒
     * - fff : 千分秒
     * - tt  : 上午/下午（小写）
     * - t   : 晨/昏（小写）
     * - TT  : 上午/下午
     * - T   : 晨/昏
     * - zzzz: 四位时区（例如-05：00）
     * - zzz : 三位时区（例如-5：00）
     * - zz  : 两位时区（例如-05）
     * - z   : 一位时区（例如-5）
     * @param {string} lang 语言，可选 `en` 和 `zh`
     * @returns {string} 格式后的时间字符串
     */
    dms_date.format = function (dateBase, format, lang) {
        if (dateBase === void 0) { dateBase = new Date(); }
        if (format === void 0) { format = 'YYYY-MM-DD hh:mm:ss'; }
        if (lang === void 0) { lang = 'en'; }
        /**
         * 时间名称本地化对象
         * @property { object } en
         * @property { object } zh
         */
        var local = {
            en: {
                monthName: function (i) {
                    return [
                        'January',
                        'February',
                        'March',
                        'April',
                        'May',
                        'June',
                        'July',
                        'August',
                        'September',
                        'October',
                        'November',
                        'December',
                    ][i];
                },
                monthNameShort: function (i) {
                    return [
                        'Jan',
                        'Feb',
                        'Mar',
                        'Apr',
                        'May',
                        'Jun',
                        'Jul',
                        'Aug',
                        'Sep',
                        'Oct',
                        'Nov',
                        'Dec',
                    ][i];
                },
                dayName: function (i) {
                    return [
                        'Sunday',
                        'Monday',
                        'Tuesday',
                        'Wednesday',
                        'Thursday',
                        'Friday',
                        'Saturday',
                    ][i];
                },
                dayNameShort: function (i) {
                    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i];
                },
                meridiem: function (h) { return ['AM', 'PM'][Math.floor(h / 12)]; },
                meridiemShort: function (h) { return ['A', 'P'][Math.floor(h / 12)]; }
            },
            zh: {
                monthName: function (i) {
                    return [
                        '一',
                        '二',
                        '三',
                        '四',
                        '五',
                        '六',
                        '七',
                        '八',
                        '九',
                        '十',
                        '十一',
                        '十二',
                    ][i] + '月';
                },
                monthNameShort: function (i) { return i + 1 + ' 月'; },
                dayName: function (i) {
                    return '周' + ['日', '一', '二', '三', '四', '五', '六'][i];
                },
                dayNameShort: function (i) {
                    return '星期' + ['日', '一', '二', '三', '四', '五', '六'][i];
                },
                meridiem: function (h) { return ['上午', '下午'][Math.floor(h / 12)]; },
                meridiemShort: function (h) { return ['晨', '昏'][Math.floor(h / 12)]; }
            }
        };
        var dateObj = {};
        dateBase = this.dateIt(dateBase);
        dateObj.YYYY = dateBase.getFullYear();
        dateObj.M = dateBase.getMonth() + 1;
        dateObj.D = dateBase.getDate();
        dateObj.dayIndex = dateBase.getDay();
        dateObj.H = dateBase.getHours();
        dateObj.h = dateObj.H % 12 === 0 ? 12 : dateObj.H % 12;
        dateObj.m = dateBase.getMinutes();
        dateObj.s = dateBase.getSeconds();
        dateObj.fff = this.addPadding(dateBase.getMilliseconds(), 3);
        dateObj.ff = (this.addPadding(Math.floor(dateBase.getMilliseconds() / 10)));
        dateObj.f = Math.floor(dateBase.getMilliseconds() / 100);
        dateObj.zzzz = this.addPadding(Math.floor(-dateBase.getTimezoneOffset() / 60)) +
            ':' +
            this.addPadding(-dateBase.getTimezoneOffset() % 60);
        dateObj.zzz = ((Math.floor(-dateBase.getTimezoneOffset() / 60) +
            ':' +
            this.addPadding(-dateBase.getTimezoneOffset() % 60)));
        dateObj.zz = (this.addPadding(Math.floor(-dateBase.getTimezoneOffset() / 60)));
        dateObj.z = Math.floor(-dateBase.getTimezoneOffset() / 60);
        dateObj.YY = dateObj.YYYY.toString().substring(2);
        dateObj.MMMM = local[lang].monthName(+dateObj.M - 1);
        dateObj.MMM = local[lang].monthNameShort(+dateObj.M - 1);
        dateObj.MM = this.addPadding(+dateObj.M);
        dateObj.DDDD = local[lang].dayName(dateObj.dayIndex);
        dateObj.DDD = local[lang].dayNameShort(dateObj.dayIndex);
        dateObj.DD = this.addPadding(+dateObj.D);
        dateObj.HH = this.addPadding(+dateObj.H);
        dateObj.hh = this.addPadding(+dateObj.h);
        dateObj.mm = this.addPadding(+dateObj.m);
        dateObj.ss = this.addPadding(+dateObj.s);
        dateObj.TT = local[lang].meridiem(dateObj.h);
        dateObj.T = local[lang].meridiemShort(dateObj.h);
        dateObj.tt = dateObj.TT.toLowerCase();
        dateObj.t = dateObj.T.toLowerCase();
        var formatLetters = format.split('');
        var formatArr = [];
        var temp = {
            nowLetter: '',
            nowWord: ''
        };
        for (var i = 0; i < formatLetters.length; i++) {
            // 如果没有缓存字符串，那么缓存
            if (temp.nowWord.length === 0) {
                temp.nowLetter = formatLetters[i];
                temp.nowWord = formatLetters[i];
                continue;
            }
            // <存在缓存>
            // 如果当前字符和前一个字符不同，将缓存推入数组，重新开始缓存
            if (formatLetters[i] !== temp.nowLetter) {
                formatArr.push(temp.nowWord in dateObj
                    ? String(dateObj[temp.nowWord])
                    : temp.nowWord);
                temp.nowLetter = formatLetters[i];
                temp.nowWord = formatLetters[i];
                continue;
            }
            // 追加到缓存中
            temp.nowWord += formatLetters[i];
            continue;
        }
        if (temp.nowWord.length !== 0) {
            formatArr.push(temp.nowWord in dateObj
                ? String(dateObj[temp.nowWord])
                : temp.nowWord);
        }
        return formatArr.join('');
    };
    /**
     * 时间差计算
     *
     * @static
     * @param {(string|number|Date)} dateStart - 起始时间
     * @param {(string|number|Date)} dateEnd- 结束时间（默认为当前时间）
     * @returns { object } different
     * - { boolean } different.forword - 时间走向，结束时间是否晚于开始时间
     * - { array } different.diff - 时间差，依次为多少天、时、分、秒、千分秒
     * @memberof dms_date
     */
    dms_date.timeDiff = function (dateStart, dateEnd) {
        if (dateEnd === void 0) { dateEnd = new Date; }
        var startStamp = +this.dateIt(dateStart);
        var endStamp = +this.dateIt(dateEnd);
        var _a = startStamp <= endStamp
            ? [startStamp, endStamp]
            : [endStamp, startStamp], dateBefore = _a[0], dateAfter = _a[1];
        var different = {
            forword: startStamp <= endStamp,
            diff: []
        };
        var discrepancy = dateAfter - dateBefore;
        different.diff.push(Math.floor(discrepancy / this.multiple(0)));
        different.diff.push(Math.floor(discrepancy / this.multiple(1)) % 24);
        different.diff.push(Math.floor(discrepancy / this.multiple(2)) % 60);
        different.diff.push(Math.floor(discrepancy / this.multiple(3)) % 60);
        different.diff.push(Math.floor(discrepancy / this.multiple(4)) % 1000);
        return different;
    };
    /**
     * 对时间进行指定偏移
     *
     * @static
     * @param offset - 偏移量对象
     * @param { boolean } offset.forword - 时间走向，是否向后偏移
     * @param { array } offset.diff - 时间差，依次为多少天、时、分、秒、千分秒
     * @param {(string|number|Date)} dateBase - 进行偏移的时间（默认为当前时间）
     * @returns {Date} - 返回偏移后的时间对象
     * @memberof dms_date
     */
    dms_date.timeOffset = function (offset, dateBase) {
        var _this = this;
        if (dateBase === void 0) { dateBase = +new Date(); }
        var offsetMillisecond = 0;
        offset.diff.forEach(function (t, i) {
            offsetMillisecond += t * _this.multiple(i);
        });
        return new Date(+this.dateIt(dateBase)
            + (offset.forword ? 1 : -1)
                * offsetMillisecond);
    };
    /**
     * 获取年信息
     *
     * @static
     * @param {(string|number)} year - 年份（默认为今年）
     * @returns {object} 信息对象
     * - yearInfo.start 这一年开始的时间戳
     * - yearInfo.end 这一年结束的时间戳（下一年的开始）
     * - yearInfo.days 这一年的天数
     * @memberof dms_date
     */
    dms_date.getYearInfo = function (year) {
        if (year === void 0) { year = (new Date()).getFullYear(); }
        var yearInfo = {};
        yearInfo.start = +new Date(+year, 0);
        yearInfo.end = +new Date(+year + 1, 0);
        yearInfo.days =
            +year % 4 ? 365 : +year % 100 ? 366 : +year % 400 ? 365 : 366;
        return yearInfo;
    };
    /**
     * 获取月信息
     *
     * @static
     * @param {(string|number)} year - 年份（默认为今年）
     * @param {(string|number)} month - 月份（默认为当前月）
     * @returns {object} 信息对象
     * - monthInfo.start 这一月开始的时间戳
     * - monthInfo.end 这一月结束的时间戳（下一月的开始）
     * - monthInfo.days 这一月的天数
     * @memberof dms_date
     */
    dms_date.getMonthInfo = function (year, month) {
        if (year === void 0) { year = (new Date()).getFullYear(); }
        if (month === void 0) { month = (new Date()).getMonth() + 1; }
        var monthInfo = {};
        monthInfo.start = +new Date(+year, +month - 1);
        monthInfo.end = +new Date(+month === 12 ? +year + 1 : +year, +month === 12 ? 0 : +month);
        monthInfo.days = (monthInfo.end - monthInfo.start) / this.multiple(0);
        return monthInfo;
    };
    /**
     * 获取日信息
     *
     * @static
     * @param {(string|number)} year - 年份（默认为今年）
     * @param {(string|number)} month - 月份（默认为当前月）
     * @param {(string|number)} day - 日（默认为当天）
     * @returns {{[key:string]: number}} 信息对象
     * - dayInfo.start 这一天开始的时间戳
     * - dayInfo.end 这一天结束的时间戳（下一天的开始）
     * - dayInfo.days 这是当年的第几天
     * - dayInfo.weekStart - 这一天所在一周的开始时间
     * - dayInfo.weekEnd - 这一天所在一周的结束时间
     * - dayInfo.weeks - 所在的是这一年的第几周
     * @memberof dms_date
     */
    dms_date.getDayInfo = function (year, month, day) {
        if (year === void 0) { year = (new Date()).getFullYear(); }
        if (month === void 0) { month = (new Date()).getMonth() + 1; }
        if (day === void 0) { day = (new Date()).getDate(); }
        var dayInfo = {};
        dayInfo.start = +new Date(+year, +month - 1, +day);
        dayInfo.end = dayInfo.start + this.multiple(0);
        var dayIndex = (new Date(dayInfo.start)).getDay();
        dayInfo.weekStart = dayInfo.start - this.multiple(0) * dayIndex;
        dayInfo.weekEnd = dayInfo.end + this.multiple(0) * (6 - dayIndex);
        dayInfo.days = (dayInfo.start - this.getYearInfo(year)['start']) / this.multiple(0);
        dayInfo.weeks = Math.ceil((dayInfo.days - dayIndex) / 7) + 1;
        return dayInfo;
    };
    /**
     * 返回对应时间单位对应的毫秒数
     *
     * @private
     * @static
     * @param index 索引，依次为 天、时、分、秒、毫秒
     * @returns 对应的时间相当于多少毫秒
     * @memberof dms_date
     */
    dms_date.multiple = function (index) {
        var m = [
            864e5,
            36e5,
            6e4,
            1e3,
            1,
        ];
        return m[index];
    };
    /**
     * 将输入转化为确定的（类型）时间对象
     *
     * @param {(number|string|Date)} dateIn 输入的数字、字符串或时间对象
     * @returns {Date} 返回一个时间对象
     */
    dms_date.dateIt = function (dateIn) {
        return (dateIn instanceof Date) ? dateIn : new Date(dateIn);
    };
    /**
     * 两位化数字
     *
     * @static
     * @param {(number|string)} num 输入的数字
     * @param {number} digits 保留的位数
     * @returns {string} 两位数字的字符串
     * @memberof dms_date
     */
    dms_date.addPadding = function (num, digits) {
        if (digits === void 0) { digits = 2; }
        var zeroArr = [];
        for (var i = 0; i < digits; i++)
            zeroArr.push('0');
        var longNum = zeroArr.join('') + String(num);
        return longNum.substr(longNum.length - digits, longNum.length);
    };
    return dms_date;
}());
exports["default"] = dms_date;
