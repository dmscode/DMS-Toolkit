/**
 * 时间工具类
 * @class
 * @todo 一些计划中的功能
 *
 * - [x] 初始化时间
 * - [x] 格式化时间
 * - [x] 时间计算
 * - [x] 时间增减量计算
 * - [x] 今年多少天，当前第几天等
 * - [x] 尽量全使用静态方法
 * - [ ] 农历
 *   - [ ] 公历转农历
 *   - [ ] 农历转公历
 *   - [ ] 农历月日
 *   - [ ] 干支纪年（生肖属相）
 *   - [ ] 二十四节气
 *   - [ ] 二十八星宿？（我不知道这个有什么用
 *   - [ ] 农历节日
 *   - [ ] 十二时辰
 *   - [ ] 农历某年总天数
 *   - [ ] 农历某月总天数
 *   - [ ] 西方星座？（我不确定计算方法变没变，不了解
 */
class dms_date {
  /**
   * 返回对应时间单位对应的毫秒数
   *
   * @private
   * @static
   * @param index 索引，依次为 天、时、分、秒、毫秒
   * @returns 对应的时间相当于多少毫秒
   * @memberof dms_date
   */
  private static multiple = (index:number):number =>{
    const m:number[] = [
      864e5, // 一天
      36e5,  // 一小时
      6e4,   // 一分钟
      1e3,   // 一秒
      1,     // 千分秒
    ]
    return m[index]
  }
  /**
   * 将输入转化为确定的（类型）时间对象
   *
   * @param {(number|string|Date)} dateIn 输入的数字、字符串或时间对象
   * @returns {Date} 返回一个时间对象
   */
  private static dateIt = (dateIn:number|string|Date):Date => {
    return (dateIn instanceof Date) ? dateIn : new Date(dateIn)
  }
  /**
   * 两位化数字
   *
   * @static
   * @param {(number|string)} num 输入的数字
   * @param {number} digits 保留的位数
   * @returns {string} 两位数字的字符串
   * @memberof dms_date
   */
  private static addPadding = (num: number | string, digits: number = 2): string => {
    const zeroArr: string[] = [];
    for (let i = 0; i < digits; i++) zeroArr.push('0');
    const longNum = zeroArr.join('') + String(num);
    return longNum.substr(longNum.length - digits, longNum.length);
  };
  /**
   * 对时间进行分解
   *
   * @static
   * @memberof dms_date
   * @param {(string|number|Date)} dateBase 需要被格式的时间（默认为当前时间）
   * @param {string} lang 语言，可选 `en` 和 `zh`
   * @returns 分解后的对象
   */
  public static decompose = (
    dateBase: string|number|Date = new Date(),
    lang: string = 'en'
  ):{[key:string]: string|number}=>{
    interface localObject {
      [key: string]: {
        [key: string]: Function;
      };
    }
    /**
     * 时间名称本地化对象
     * @property { object } en
     * @property { object } zh
     */
    const local: localObject = {
      en: {
        monthName: (i: number): string =>
          [
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
          ][i],
        monthNameShort: (i: number): string =>
          [
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
          ][i],
        dayName: (i: number): string =>
          [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
          ][i],
        dayNameShort: (i: number): string =>
          ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
        meridiem: (h: number): string => ['AM', 'PM'][Math.floor(h / 12)],
        meridiemShort: (h: number): string => ['A', 'P'][Math.floor(h / 12)],
      },
      zh: {
        monthName: (i: number): string =>
          [
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
          ][i] + '月',
        monthNameShort: (i: number): string => i + 1 + ' 月',
        dayName: (i: number): string =>
          '周' + ['日', '一', '二', '三', '四', '五', '六'][i],
        dayNameShort: (i: number): string =>
          '星期' + ['日', '一', '二', '三', '四', '五', '六'][i],
        meridiem: (h: number): string => ['上午', '下午'][Math.floor(h / 12)],
        meridiemShort: (h: number): string => ['晨', '昏'][Math.floor(h / 12)],
      },
    };
    const dateObj:{[key: string]: string|number} = {}
    dateBase = dms_date.dateIt(dateBase)
    dateObj.YYYY     = <number>dateBase.getFullYear();
    dateObj.M        = <number>dateBase.getMonth() + 1;
    dateObj.D        = <number>dateBase.getDate();
    dateObj.dayIndex = <number>dateBase.getDay();
    dateObj.H        = <number>dateBase.getHours();
    dateObj.h        = <number>dateObj.H % 12 === 0 ? 12 : dateObj.H % 12;
    dateObj.m        = <number>dateBase.getMinutes();
    dateObj.s        = <number>dateBase.getSeconds();
    dateObj.fff      = <string>dms_date.addPadding(dateBase.getMilliseconds(), 3);
    dateObj.ff       = <string>(
      dms_date.addPadding(Math.floor(dateBase.getMilliseconds() / 10))
    );
    dateObj.f    = <number>Math.floor(dateBase.getMilliseconds() / 100);
    dateObj.zzzz = <string>dms_date.addPadding(Math.floor(-dateBase.getTimezoneOffset() / 60)) +
      ':' +
      dms_date.addPadding(-dateBase.getTimezoneOffset() % 60);
    dateObj.zzz = <string>(
      (Math.floor(-dateBase.getTimezoneOffset() / 60) +
        ':' +
        dms_date.addPadding(-dateBase.getTimezoneOffset() % 60))
    );
    dateObj.zz = <string>(
      dms_date.addPadding(Math.floor(-dateBase.getTimezoneOffset() / 60))
    );
    dateObj.z    = <number>Math.floor(-dateBase.getTimezoneOffset() / 60);
    dateObj.YY   = <string>dateObj.YYYY.toString().substring(2);
    dateObj.MMMM = <string>local[lang].monthName(+dateObj.M - 1);
    dateObj.MMM  = <string>local[lang].monthNameShort(+dateObj.M - 1);
    dateObj.MM   = <string>dms_date.addPadding(+dateObj.M);
    dateObj.DDDD = <string>local[lang].dayName(dateObj.dayIndex);
    dateObj.DDD  = <string>local[lang].dayNameShort(dateObj.dayIndex);
    dateObj.DD   = <string>dms_date.addPadding(+dateObj.D);
    dateObj.HH   = <string>dms_date.addPadding(+dateObj.H);
    dateObj.hh   = <string>dms_date.addPadding(+dateObj.h);
    dateObj.mm   = <string>dms_date.addPadding(+dateObj.m);
    dateObj.ss   = <string>dms_date.addPadding(+dateObj.s);
    dateObj.TT   = <string>local[lang].meridiem(dateObj.h);
    dateObj.T    = <string>local[lang].meridiemShort(dateObj.h);
    dateObj.tt   = <string>dateObj.TT.toLowerCase();
    dateObj.t    = <string>dateObj.T.toLowerCase();
    return dateObj
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
  public static format(
    dateBase: string|number|Date = new Date(),
    format: string = 'YYYY-MM-DD hh:mm:ss',
    lang: string = 'en'
  ): string {
    const dateObj = dms_date.decompose(dateBase, lang)
    const keys = Object.keys(dateObj).sort( (k1, k2)=>k2.length-k1.length)
    const reg = new RegExp(keys.join('|'), 'g')
    return format.replace(reg, m=>String(dateObj[m]));
  }
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
  public static timeDiff(
    dateStart: string|number|Date,
    dateEnd: string|number|Date = new Date
  ):object {
    const startStamp = +this.dateIt(dateStart)
    const endStamp = +this.dateIt(dateEnd)
    let [dateBefore, dateAfter] =
      startStamp <= endStamp
        ? [startStamp, endStamp]
        : [endStamp, startStamp];
    const different: {
      forword: boolean;
      diff: number[];
    } = {
      forword: startStamp <= endStamp,
      diff: [],
    };
    const discrepancy = dateAfter - dateBefore;
    different.diff.push(Math.floor(discrepancy / this.multiple(0) ));
    different.diff.push(Math.floor(discrepancy / this.multiple(1) ) % 24);
    different.diff.push(Math.floor(discrepancy / this.multiple(2) ) % 60);
    different.diff.push(Math.floor(discrepancy / this.multiple(3) ) % 60);
    different.diff.push(Math.floor(discrepancy / this.multiple(4) ) % 1000);
    return different;
  }
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
  public static timeOffset(offset:{
    forword: boolean;
    diff: number[];
  }, dateBase: string|number|Date = +new Date()):Date{
    let offsetMillisecond = 0
    offset.diff.forEach((t, i)=>{
      offsetMillisecond += t*this.multiple(i)
    })
    return new Date(
      + this.dateIt(dateBase)
      + (offset.forword ? 1 : -1)
      * offsetMillisecond
    )
  }

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
  public static getYearInfo(year:string|number=(new Date()).getFullYear()):{[key:string]: number}{
    const yearInfo:{[key:string]:number} = {}
    yearInfo.start = +new Date( +year, 0 )
    yearInfo.end = +new Date( +year+1, 0 )
    yearInfo.days =
      +year % 4 ? 365 : +year % 100 ? 366 : +year % 400 ? 365 : 366;
    return yearInfo
  }
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
  public static getMonthInfo(year:string|number=(new Date()).getFullYear(), month:string|number=(new Date()).getMonth()+1):{[key:string]: number}{
    const monthInfo:{[key:string]:number} = {}
    monthInfo.start = +new Date(+year, +month-1)
    monthInfo.end = +new Date(
      +month===12 ? +year+1 : +year,
      +month===12 ? 0 : +month,
    )
    monthInfo.days = (monthInfo.end - monthInfo.start)/this.multiple(0)
    return monthInfo
  }
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
  public static getDayInfo(year:string|number=(new Date()).getFullYear(), month:string|number=(new Date()).getMonth()+1, day:string|number=(new Date()).getDate()):{[key:string]: number}{
    const dayInfo:{[key:string]:number} = {}
    dayInfo.start = +new Date(+year, +month-1, +day)
    dayInfo.end = dayInfo.start+this.multiple(0)
    const dayIndex = (new Date(dayInfo.start)).getDay()
    dayInfo.weekStart = dayInfo.start - this.multiple(0) * dayIndex
    dayInfo.weekEnd = dayInfo.end + this.multiple(0) * (6 - dayIndex )
    dayInfo.days = (dayInfo.start - this.getYearInfo(year)['start'])/this.multiple(0)
    dayInfo.weeks = Math.ceil( (dayInfo.days-dayIndex)/7 ) + 1
    return dayInfo
  }
}

export default dms_date