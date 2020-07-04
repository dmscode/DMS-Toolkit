"use strict";
exports.__esModule = true;
/**
 * 时间工具类
 *
 * @todo
 * - 初始化时间
 * - 格式化时间
 * - 时间计算
 * - 农历
 * - 今年多少天，当前第几天等
 */
var dms_date = /** @class */ (function () {
    function dms_date(dateBase) {
        if (dateBase === void 0) { dateBase = new Date(); }
        /**
         * 两位化数字
         *
         * @param {(number|string)} num 输入的数字
         * @returns {string} 两位数字的字符串
         */
        this.addPadding = function (num, digits) {
            if (digits === void 0) { digits = 2; }
            var zeroArr = [];
            for (var i = 0; i < digits; i++)
                zeroArr.push('0');
            var longNum = zeroArr.join('') + String(num);
            return longNum.substr(longNum.length - digits, longNum.length);
        };
        this.YYYY = dateBase.getFullYear();
        this.M = dateBase.getMonth() + 1;
        this.D = dateBase.getDate();
        this.dayIndex = dateBase.getDay();
        this.H = dateBase.getHours();
        this.h = this.H % 12 === 0 ? 12 : this.H % 12;
        this.m = dateBase.getMinutes();
        this.s = dateBase.getSeconds();
        this.fff = this.addPadding(dateBase.getMilliseconds(), 3);
        this.ff = this.addPadding(Math.floor(dateBase.getMilliseconds() / 10));
        this.f = Math.floor(dateBase.getMilliseconds() / 100);
        this.zzzz = this.addPadding(Math.floor(-dateBase.getTimezoneOffset() / 60)) + ":" + this.addPadding(-dateBase.getTimezoneOffset() % 60);
        this.zzz = (Math.floor(-dateBase.getTimezoneOffset() / 60) + ":" + this.addPadding(-dateBase.getTimezoneOffset() % 60));
        this.zz = this.addPadding(Math.floor(-dateBase.getTimezoneOffset() / 60));
        this.z = Math.floor(-dateBase.getTimezoneOffset() / 60);
        this.timestamp = +dateBase;
    }
    /**
   * 时间格式化函数
   * @param {string} [format='YY-MM-DD hh:mm:ss'] 希望格式
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
   * @param {string} [lang='en'] 语言，可选 `en` 和 `zh`
   * @returns {string} 格式后的时间字符串
   */
    dms_date.prototype.format = function (format, lang) {
        if (format === void 0) { format = 'YYYY-MM-DD hh:mm:ss'; }
        if (lang === void 0) { lang = 'en'; }
        /**
         * 时间名称本地化对象
         * @property { object } en
         * @property { object } zh
         */
        var local = {
            en: {
                monthName: function (i) { return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][i]; },
                monthNameShort: function (i) { return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]; },
                dayName: function (i) { return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',][i]; },
                dayNameShort: function (i) { return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]; },
                meridiem: function (h) { return ['AM', 'PM'][Math.floor(h / 12)]; },
                meridiemShort: function (h) { return ['A', 'P'][Math.floor(h / 12)]; }
            },
            zh: {
                monthName: function (i) { return ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'][i] + '月'; },
                monthNameShort: function (i) { return (i + 1) + ' 月'; },
                dayName: function (i) { return '周' + ['日', '一', '二', '三', '四', '五', '六'][i]; },
                dayNameShort: function (i) { return '星期' + ['日', '一', '二', '三', '四', '五', '六'][i]; },
                meridiem: function (h) { return ['上午', '下午'][Math.floor(h / 12)]; },
                meridiemShort: function (h) { return ['晨', '昏'][Math.floor(h / 12)]; }
            }
        };
        this.YY = this.YYYY.toString().substring(2);
        this.MMMM = local[lang].monthName(+this.M - 1);
        this.MMM = local[lang].monthNameShort(+this.M - 1);
        this.MM = this.addPadding(+this.M);
        this.DDDD = local[lang].dayName(this.dayIndex);
        this.DDD = local[lang].dayNameShort(this.dayIndex);
        this.DD = this.addPadding(+this.D);
        this.HH = this.addPadding(+this.H);
        this.hh = this.addPadding(+this.h);
        this.mm = this.addPadding(+this.m);
        this.ss = this.addPadding(+this.s);
        this.TT = local[lang].meridiem(this.h);
        this.T = local[lang].meridiemShort(this.h);
        this.tt = this.TT.toLowerCase();
        this.t = this.T.toLowerCase();
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
                formatArr.push(temp.nowWord in this ? String(this[temp.nowWord]) : temp.nowWord);
                temp.nowLetter = formatLetters[i];
                temp.nowWord = formatLetters[i];
                continue;
            }
            // 追加到缓存中
            temp.nowWord += formatLetters[i];
            continue;
        }
        if (temp.nowWord.length !== 0) {
            formatArr.push(temp.nowWord in this ? String(this[temp.nowWord]) : temp.nowWord);
        }
        return formatArr.join('');
    };
    /**
     * 时间差计算
     *
     * @param { object } dateStart - 起始时间
     * @param { object } dateEnd - 结束时间
     * @returns { object } different
     * @property { boolean } forword - 时间走向，结束时间是否晚于开始时间
     * @property { number } days - 时间差包含多少个完整的天
     * @property { number } hours - 时间差小时
     * @property { number } minutes - 时间差分钟
     * @property { number } seconds - 时间差秒
     * @property { number } milliseconds - 时间差千分秒
     */
    dms_date.calculate = function (dateStart, dateEnd) {
        var _a = dateStart.timestamp <= dateEnd.timestamp
            ? [dateStart, dateEnd]
            : [dateEnd, dateStart], dateBefore = _a[0], dateAfter = _a[1];
        var different = {
            forword: dateStart.timestamp <= dateEnd.timestamp,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            milliseconds: 0
        };
        var discrepancy = dateAfter.timestamp - dateBefore.timestamp;
        different.days = Math.floor(discrepancy / 864e5);
        different.hours = Math.floor(discrepancy / 36e5) % 24;
        different.minutes = Math.floor(discrepancy / 6e4) % 60;
        different.seconds = Math.floor(discrepancy / 1000) % 60;
        different.milliseconds = discrepancy % 1000;
        return different;
    };
    return dms_date;
}());
exports["default"] = dms_date;
