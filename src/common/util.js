// 函数防抖
export function debounce(func, delay) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)

    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)

  }
}

// 时间戳格式化日期
export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
};

function padLeftZero(str) {
  return ('00' + str).substr(str.length);
};

export function formatToTree(list) {
  //filter会遍历原数组的每一项，因为有children引用的存在，返回值只需要返回第一层数据就可以了
  //当然，此处也可改用双层for循环
  return list.filter(function (parent) {
    //遍历原数组的每一项，找出当前项的所有子节点
    let branchArr = list.filter(function (child) {
      return parent.id == child.parentId;
    });
    //为当前项数据追加children引用
    parent.children = branchArr;
    return !parent.parentId; //过滤出第一层
  })
}

// jqwidgets的格式化过滤器
export function formatFilter(serverdata) {
  const filterGroups = serverdata.filterGroups
  for (let i = 0; i < filterGroups.length; i++) {
    serverdata[`filterGroups[${i}][field]`] = filterGroups[i][`field`]
    const filters = filterGroups[i][`filters`]
    for (let j = 0; j < filters.length; j++) {
      serverdata[`filterGroups[${i}][filters][${j}][label]`] = filters[j][`label`]
      serverdata[`filterGroups[${i}][filters][${j}][value]`] = filters[j][`value`]
      serverdata[`filterGroups[${i}][filters][${j}][condition]`] = filters[j][`condition`]
      serverdata[`filterGroups[${i}][filters][${j}][operator]`] = filters[j][`operator`]
      serverdata[`filterGroups[${i}][filters][${j}][field]`] = filters[j][`field`]
      serverdata[`filterGroups[${i}][filters][${j}][type]`] = filters[j][`type`]
    }
  }
  delete serverdata.filterGroups;
  return serverdata
}

// 计算下单杂项费用
export function calc_ord_misc(...param) {
  let amount = param[0]
  let rate = param[1]
  if(rate==null || rate==''){
    rate = 0
  }else if(rate.indexOf("%") > -1){
    rate = parseFloat(rate) / 100;
  }
  amount == null ? amount = 0 : amount = amount
  if(amount==0){
    return 0
  }
  if (rate % 1 == 0) {
    return rate
  }
  let result = amount - (amount / (1 + rate))
  result = Math.round(result)
  return isNaN(result)?0:result
}

// 计算下单底价
export function calc_ord_rsv_p(...param) {
  let result = param.reduce(function (prev, curr, idx, arr) {
    return prev - curr; //reduce() 方法接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终计算为一个值
  });
  result = Math.round(result)
  return isNaN(result)?0:result
}

