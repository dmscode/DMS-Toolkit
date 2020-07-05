import dms_date_class from '../dms_date_class';

test('时间格式化', () => {
  expect(
    dms_date_class.format(
      '1992-08-12 18:37:01',
      'YYYY/MM/DD hh-mm-ss'
    )
  ).toBe('1992/08/12 06-37-01');
  expect(
    dms_date_class.format(
      '1992-08-12 18:37:01',
      'YYYY/MM/DD hh-mm-ss MMMM',
      'zh'
    )
  ).toBe('1992/08/12 06-37-01 八月');
  expect(
    dms_date_class.format(
      '1992-08-12 18:37:01',
      'M YYYYYY/MM/DD hh-mm-ss MMMM',
      'zh'
    )
  ).toBe('8 199292/08/12 06-37-01 八月');
});
it('时间差计算', ()=>{
  expect(
    dms_date_class.timeDiff(
      '1982-03-22 08:06:12',
      '1982-06-18 09:02:18'
    )
  ).toEqual({
      "forword": true,
      "diff": [ 88, 0, 56, 6, 0]
    });
})
it('时间偏移量', ()=>{
  expect(
    dms_date_class.timeOffset(
      {
        "forword": true,
        "diff": [ 88, 0, 56, 6, 0]
      },
      '1982-03-22 08:06:12'
    )
  ).toEqual(new Date('1982-06-18 09:02:18'));
})
it('获取时间信息', ()=>{
  expect(
    dms_date_class.getYearInfo('1986')
  ).toEqual({
    "end": 536428800000,
    "start": 504892800000,
    "days": 365
  })
  expect(
    dms_date_class.getMonthInfo('1986', '3')
  ).toEqual({
    "days": 31,
    "end": 512668800000,
    "start": 509990400000,
  })
  expect(
    dms_date_class.getDayInfo('1986', '3', '12')
  ).toEqual({
    "days": 70,
    "end": 511027200000,
    "start": 510940800000,
    "weekEnd": 511286400000,
    "weekStart": 510681600000,
    "weeks": 11,
  })
})