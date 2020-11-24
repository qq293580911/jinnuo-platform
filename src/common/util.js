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
  let amount = param[0];
  let rate = param[1];
  amount == null ? amount = 0 : amount = amount
  if (amount === 0) {
    return 0
  }
  if (rate % 1 === 0) {
    return rate
  }
  if (typeof rate == 'string' && rate.indexOf('%') > -1) {
    rate = rate.replace('%', '') / 100;
  }
  let result = amount - (amount / (1 + rate));
  result = Math.round(result);
  return isNaN(result) ? 0 : result
}

// 计算下单底价
export function calc_ord_rsv_p(...param) {
  let result = param.reduce(function (prev, curr, idx, arr) {
    return prev - curr; //reduce() 方法接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终计算为一个值
  });
  result = Math.round(result)
  return isNaN(result) ? 0 : result
}

// 导出函数
export function dataExport(...params) {
  const fileName = params[0]
  const columns = params[1]
  const rowsData = params[2]
  // 列下标转换列号
  let createCellPos = function (n) {
    let ordA = 'A'.charCodeAt(0);
    let ordZ = 'Z'.charCodeAt(0);
    let len = ordZ - ordA + 1;
    let s = "";
    while (n >= 0) {
      s = String.fromCharCode(n % len + ordA) + s;
      n = Math.floor(n / len) - 1;
    }
    return s;
  };
  // 梳理数据前
  let filterCofig = {}
  let aggregatesRow = {}
  const titleRow = {}
  const headFields = []
  const columnWidths = {}
  columns.records.filter(item => {
    return item['datafield'] != null && item['datafield'] != ''
  }).forEach((item, index) => {
    const text = item['text']
    const dataField = item['datafield']
    titleRow[dataField] = text;
    headFields.push(dataField);
    columnWidths[`${String.fromCharCode(64 + index + 1)}`] = item['width'];
    filterCofig[dataField] = dataField
    aggregatesRow[dataField] = ''
    if (item['aggregates'] != null) {
      filterCofig[dataField] = function (value, line, data, lineIndex, newField) {
        return {
          v: value,
          t: 'n'
        }
      }
      aggregatesRow[dataField] = {
        t: 'n',
        //第2行开始是因为后面会加标题头，结尾行也响应加1
        f: `${item['aggregates'][0]}(${createCellPos(index)}2:${createCellPos(index)}${rowsData.length+1})`
      }
    }
  })

  let data = rowsData.map(item => {
    const map = {};
    headFields.forEach((field) => {
      map[field] = item[field];
    });
    return map
  })
  // 梳理数据
  data = LAY_EXCEL.filterExportData(data, filterCofig);
  //设置标题头
  data.unshift(titleRow);
  // 末尾聚合行
  data.push(aggregatesRow)
  // 调用设置样式的函数，传入设置的范围，支持回调
  // 这个地方是导致导出没样式的问题所在
  LAY_EXCEL.setExportCellStyle(data, `A1:${createCellPos(Object.keys(data[0]).length - 1)}${data.length}`, {
    s: {
      font: {
        name: '宋体',
        sz: 10
      },
      border: {
        top: {
          style: 'thin'
        },
        bottom: {
          style: 'thin'
        },
        left: {
          style: 'thin'
        },
        right: {
          style: 'thin'
        }
      },
      alignment: {
        horizontal: 'center',
        vertical: 'center',
        wrapText: true
      }
    }
  }, function (cell, newCell, row, config, currentRow, currentCol, fieldKey) {   
    if(currentRow===0){
      newCell['s']['fill'] = {
        fgColor: {
          rgb: "BABABA"
        }
      }
    }
    return newCell;
  });
  const colConfig = LAY_EXCEL.makeColConfig(columnWidths, 80);
  const end = data.length;
  const rowConfig = LAY_EXCEL.makeRowConfig({
    1: 25,
    [end]: 25
  }, 25);

  LAY_EXCEL.exportExcel(data, fileName, 'xlsx', {
    extend: {
      // '!merges': mergeConf,
      '!cols': colConfig,
      '!rows': rowConfig
    }
  });
}
