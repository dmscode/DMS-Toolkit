"use strict";
/**
 * 稻米鼠用户脚本工具集
 * @name DMS UserScript Toolkit
 * @version 0.0.1
 * @description 一些用户脚本中常用功能的合集。
 * @author 稻米鼠
 * @file DMS-UserScript-Toolkit.ts
 */
/**
 * 一些用户脚本中常用功能的合集
 * @classdesc 唯一被导出的对象
 * - log: 日志打印
 * - formatDate: 日期格式化
 * @class
 * @todo
 * - 定时执行（兼容方式）
 * - 页面变化监控
 * - sleep
 * - 记录数组的入栈和出栈
 * - 本地记录数据的一套方法方法
 */
var DMSToolkit = /** @class */ (function () {
    function DMSToolkit() {
    }
    /**
     * 日志输出
     * @param {*} msgContent 日志内容，调用原生 `console.log` 方法打印
     * @param {string} [byWho='default'] 此日志由谁发出
     * @memberof DMSToolkit
     * @function
     * @static
     */
    DMSToolkit.log = function (msgContent, byWho) {
        if (byWho === void 0) { byWho = 'default'; }
        console.log(byWho, '-', this.formatDate(new Date(), 'HH:mm:ss'), ':', msgContent);
    };
    /**
     * 时间格式化函数
     * @param {(string|number|Date)} time 传入时间
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
     * @memberof DMSToolkit
     * @function
     * @static
     */
    DMSToolkit.formatDate = function (time, format, lang) {
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
        /**
         * 两位化数字
         *
         * @param {(number|string)} num 输入的数字
         * @returns {string} 两位数字的字符串
         */
        var addPadding = function (num, digits) {
            if (digits === void 0) { digits = 2; }
            var zeroArr = [];
            for (var i = 0; i < digits; i++)
                zeroArr.push('0');
            var longNum = zeroArr.join('') + String(num);
            return longNum.substr(longNum.length - digits, longNum.length);
        };
        var date = {};
        var dateBase = new Date(time instanceof Date ? +time : time);
        date.YYYY = dateBase.getFullYear();
        date.YYY = date.YYYY; // 此条目单纯为了替换字符串时不出错
        date.YY = date.YYYY.toString().substring(2);
        date.M = dateBase.getMonth() + 1;
        date.MM = addPadding(date.M);
        date.MMMM = local[lang].monthName(date.M - 1);
        date.MMM = local[lang].monthNameShort(date.M - 1);
        date.D = dateBase.getDate();
        date.DD = addPadding(date.D);
        var dayIndex = dateBase.getDay();
        date.DDDD = local[lang].dayName(dayIndex);
        date.DDD = local[lang].dayNameShort(dayIndex);
        date.H = dateBase.getHours();
        date.HH = addPadding(date.H);
        date.h = date.H % 12 === 0 ? 12 : date.H % 12;
        date.hh = addPadding(date.h);
        date.m = dateBase.getMinutes();
        date.mm = addPadding(date.m);
        date.s = dateBase.getSeconds();
        date.ss = addPadding(date.s);
        date.fff = addPadding(dateBase.getMilliseconds(), 3);
        date.ff = addPadding(Math.floor(dateBase.getMilliseconds() / 10));
        date.f = Math.floor(dateBase.getMilliseconds() / 100);
        date.zzzz = addPadding(Math.floor(-dateBase.getTimezoneOffset() / 60)) + ":" + addPadding(-dateBase.getTimezoneOffset() % 60);
        date.zzz = (Math.floor(-dateBase.getTimezoneOffset() / 60) + ":" + addPadding(-dateBase.getTimezoneOffset() % 60));
        date.zz = addPadding(Math.floor(-dateBase.getTimezoneOffset() / 60));
        date.z = Math.floor(-dateBase.getTimezoneOffset() / 60);
        date.TT = local[lang].meridiem(date.h);
        date.T = local[lang].meridiemShort(date.h);
        date.tt = date.TT.toLowerCase();
        date.t = date.T.toLowerCase();
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
                formatArr.push(temp.nowWord in date ? String(date[temp.nowWord]) : temp.nowWord);
                temp.nowLetter = formatLetters[i];
                temp.nowWord = formatLetters[i];
                continue;
            }
            // 追加到缓存中
            temp.nowWord += formatLetters[i];
            continue;
        }
        if (temp.nowWord.length !== 0) {
            formatArr.push(temp.nowWord in date ? String(date[temp.nowWord]) : temp.nowWord);
        }
        return formatArr.join('');
    };
    DMSToolkit.sleep = function (time) {
        return new Promise(function (resolve) { return setTimeout(resolve, time); });
    };
    return DMSToolkit;
}());
