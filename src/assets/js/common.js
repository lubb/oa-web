import { MessageBox, Message } from 'element-ui';

/**
 * 日期格式化
 * @param fmt：yyyy-MM-dd hh:mm:ss
 * @returns {string}
 */
export function Format(fmt) {
  let o = {
    'M+': this.getMonth() + 1, //月份
    'd+': this.getDate(), //日
    'h+': this.getHours(), //小时
    'm+': this.getMinutes(), //分
    's+': this.getSeconds(), //秒
    'q+': Math.floor((this.getMonth() + 3) / 3), //季度
    'S': this.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    }
  }
  return fmt;
};

/**
 * 初始化默认查询时间范围
 * @param day
 * @returns {startTime|endTime}
 */
export const getRecordTime = (day) => {
  const one = day * 24 * 3600 * 1000;
  const endTime = new Date(Date.now()).setHours(23,59,59);
  const startTime = new Date(endTime - one).setHours(0,0,0);
  return {
    startTime,
    endTime,
  }
};


/**
 * 设置时分秒查询范围
 * @param date
 * @returns {startTime|endTime}
 */
export const setDateTime = (date) => {
  const endTime = new Date(date).setHours(23,59,59);
  const startTime = new Date(date).setHours(0,0,0);
  return {
    startTime,
    endTime,
  }
};


/**
 * 获取当前日期、星期、时间
 * @returns {2020年10月22日 15:00:00 星期三}
 */
const add_zero = (temp) => {
  if(temp<10) return "0"+temp;
  else return temp;
};

export const getCurDate = () => {
  let d = new Date();
  let week;
  switch (d.getDay()){
    case 1: week="星期一"; break;
    case 2: week="星期二"; break;
    case 3: week="星期三"; break;
    case 4: week="星期四"; break;
    case 5: week="星期五"; break;
    case 6: week="星期六"; break;
    default: week="星期天";
  }
  let years = d.getFullYear();
  let month = add_zero(d.getMonth()+1);
  let days = add_zero(d.getDate());

  let ndate = years+"年"+month+"月"+days+"日 "+" "+week;
  document.getElementById('nowDateTime').innerHTML= ndate;
};

/**
 * 查询几天的时间范围，拼接时间
 * @param day
 * @returns {startTime|endTime}
 */
export const timeForMat = (count) => {
  let dateTime = Date.now();
  let timer1 = new Date(dateTime).setHours(0, 0, 0);
  let time2 = new Date();
  time2.setTime(time2.getTime() - (24 * 60 * 60 * 1000 * (count - 1)));
  let timer2 = new Date(time2).setHours(23, 59, 59);
  return {
    startTime: timer2,
    endTime: timer1,
  };
};
