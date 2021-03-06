// 省市县多级联动
const { province, city, area, data } = require('province-city-china/data')
// 获得省
export function getProvince() {
  return province
}
// 获得市
export function getCity(provinceValue) {
  let cities = []
  // 北京，天津，上海，重庆特别行政区只有两级
  // // 港，澳，台只有一级
  if (['11', '12', '31', '50', '71', '81', '82'].includes(provinceValue, 0)) {
    cities = province
      .filter((item) => {
        return item['province'] == provinceValue
      })
      .map((item) => {
        item['city'] = '01'
        return item
      })
  } else {
    let citys = city.filter((item) => {
      return item['province'] == provinceValue && item['city'] != 0
    })
    //  县级市
    let countyLevelCity = area.filter((item) => {
      const find = citys.some((it) => {
        return it['city'] == item['city']
      })
      return item['province'] == provinceValue && find == false
    })
    cities = citys.concat(countyLevelCity)
  }
  return cities
}
// 获得县
export function getArea(...params) {
  const provinceValue = params[0]
  const cityValue = params[1]
  const cityLabel = params[2]
  let areas = []
  areas = area.filter((item) => {
    return item['province'] == provinceValue && item['city'] == cityValue
  })
  const isCountyLevelCity = areas.some((item) => {
    return item['name'] == cityLabel
  })
  if (isCountyLevelCity) {
    return []
  }
  return areas
}

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

// eslint-disable-next-line no-extend-native
Date.prototype.format = function (fmt) {
  var o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    S: this.getMilliseconds(), // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}

// 时间戳格式化日期
export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = o[k] + ''
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : padLeftZero(str)
      )
    }
  }
  return fmt
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}

export function formatToTree(list) {
  // filter会遍历原数组的每一项，因为有children引用的存在，返回值只需要返回第一层数据就可以了
  // 当然，此处也可改用双层for循环
  return list.filter(function (parent) {
    // 遍历原数组的每一项，找出当前项的所有子节点
    const branchArr = list.filter(function (child) {
      return parent.id == child.parentId
    })
    // 为当前项数据追加children引用
    parent.children = branchArr
    return !parent.parentId // 过滤出第一层
  })
}

// jqwidgets的格式化过滤器
export function formatFilter(serverdata) {
  const filterGroups = serverdata.filterGroups
  for (let i = 0; i < filterGroups.length; i++) {
    serverdata[`filterGroups[${i}][field]`] = filterGroups[i][`field`]
    const filters = filterGroups[i][`filters`]
    for (let j = 0; j < filters.length; j++) {
      serverdata[`filterGroups[${i}][filters][${j}][label]`] =
        filters[j][`label`]
      serverdata[`filterGroups[${i}][filters][${j}][value]`] =
        filters[j][`value`]
      serverdata[`filterGroups[${i}][filters][${j}][condition]`] =
        filters[j][`condition`]
      serverdata[`filterGroups[${i}][filters][${j}][operator]`] =
        filters[j][`operator`]
      serverdata[`filterGroups[${i}][filters][${j}][field]`] =
        filters[j][`field`]
      serverdata[`filterGroups[${i}][filters][${j}][type]`] = filters[j][`type`]
    }
  }
  delete serverdata.filterGroups
  return serverdata
}

// 计算杂项税金
export function calc_misc_tax(...params) {
  const amount = params[0]
  const installFee = params[1]
  let rate = params[2]
  if (amount === 0) {
    return 0
  }
  if (rate % 1 === 0) {
    return rate
  }
  if (typeof rate == 'string' && rate.indexOf('%') > -1) {
    rate = rate.replace('%', '') / 100
  }
  rate = parseFloat(rate)
  let result = ((amount - installFee) / (1 + rate)) * rate
  result = Math.round(result)
  return isNaN(result) ? 0 : result
}

// 计算杂项物管费
export function calc_misc_log_manage_fee(...params) {
  const amount = params[0]
  const installFee = params[1]
  let rate = params[2]
  if (amount === 0) {
    return 0
  }
  if (rate % 1 === 0) {
    return rate
  }
  if (typeof rate == 'string' && rate.indexOf('%') > -1) {
    rate = rate.replace('%', '') / 100
  }
  rate = parseFloat(rate)
  let result = (amount - installFee) * rate
  result = Math.round(result)
  return isNaN(result) ? 0 : result
}

// 计算杂项质保金
export function calc_misc_warranty(...params) {
  const amount = params[0]
  const installFee = params[1]
  let rate = params[2]
  if (amount === 0) {
    return 0
  }
  if (rate % 1 === 0) {
    return rate
  }
  if (typeof rate == 'string' && rate.indexOf('%') > -1) {
    rate = rate.replace('%', '') / 100
  }
  rate = parseFloat(rate)
  let result = (amount - installFee) * rate
  result = Math.round(result)
  return isNaN(result) ? 0 : result
}

// 计算杂项运费
export function calc_misc_freight(...params) {
  const amount = params[0]
  const installFee = params[1]
  const tax = params[2]
  const logManageFee = params[3]
  const warranty = params[4]
  let rate = params[5]
  if (amount === 0) {
    return 0
  }
  if (rate % 1 === 0) {
    return rate
  }
  if (typeof rate == 'string' && rate.indexOf('%') > -1) {
    rate = rate.replace('%', '') / 100
  }
  rate = parseFloat(rate)
  let result = (amount - installFee - tax - logManageFee - warranty) * rate
  result = Math.round(result)
  return isNaN(result) ? 0 : result
}

// 计算下单底价
export function calc_rsv_p(...param) {
  let result = param.reduce(function (prev, curr, idx, arr) {
    return prev - curr // reduce() 方法接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终计算为一个值
  })
  result = Math.round(result)
  return isNaN(result) ? 0 : result
}

// 导出
export function dataExport(...params) {
  const fileName = params[0]
  const columns = params[1]
  const rowsData = params[2]
  const customConfig = params[3]
  // 列下标转换列号
  const createCellPos = function (n) {
    const ordA = 'A'.charCodeAt(0)
    const ordZ = 'Z'.charCodeAt(0)
    const len = ordZ - ordA + 1
    let s = ''
    while (n >= 0) {
      s = String.fromCharCode((n % len) + ordA) + s
      n = Math.floor(n / len) - 1
    }
    return s
  }
  // 梳理数据前
  const filterCofig = {}
  const aggregatesRow = {}
  const titleRow = {}
  const headFields = []
  const columnWidths = {}
  columns.records
    .filter((item) => {
      return item['datafield'] != null && item['datafield'] != ''
    })
    .forEach((item, index) => {
      const text = item['text']
      const dataField = item['datafield']
      titleRow[dataField] = text
      headFields.push(dataField)
      columnWidths[`${String.fromCharCode(64 + index + 1)}`] = item['width']
      filterCofig[dataField] = dataField
      aggregatesRow[dataField] = ''

      if (customConfig) {
        const formulaConfig = customConfig['formulaConfig']
        // 判断数字列
        if (customConfig['numberCol'].includes(item['text'])) {
          filterCofig[dataField] = function (
            value,
            line,
            data,
            lineIndex,
            newField
          ) {
            return {
              v: value,
              t: 'n',
            }
          }
          // 如果有自定义公式
          for (let key in formulaConfig) {
            if (key == dataField) {
              const formulaArr = formulaConfig[key]
              filterCofig[dataField] = function (
                value,
                line,
                data,
                lineIndex,
                newField
              ) {
                return {
                  v: value,
                  t: 'n',
                  f: `${formulaArr[0]}${lineIndex + 2}${formulaArr[1]}${
                    formulaArr[2]
                  }${lineIndex + 2}`,
                }
              }
            }
          }
        }
        // 设置合计列
        if (item['aggregates'] != null) {
          aggregatesRow[dataField] = {
            t: 'n',
            // 第2行开始是因为后面会加标题头，结尾行也响应加1
            f: `${item['aggregates'][0]}(${createCellPos(
              index
            )}2:${createCellPos(index)}${rowsData.length + 1})`,
          }
        }
      }
    })

  let data = rowsData.map((item) => {
    const map = {}
    headFields.forEach((field) => {
      map[field] = item[field]
    })
    return map
  })
  // 梳理数据
  data = LAY_EXCEL.filterExportData(data, filterCofig)
  // 设置标题头
  data.unshift(titleRow)
  // 末尾聚合行
  data.push(aggregatesRow)
  // 调用设置样式的函数，传入设置的范围，支持回调
  // 这个地方是导致导出没样式的问题所在
  LAY_EXCEL.setExportCellStyle(
    data,
    `A1:${createCellPos(Object.keys(data[0]).length - 1)}${data.length}`,
    {
      s: {
        font: {
          name: '宋体',
          sz: 12,
        },
        border: {
          top: {
            style: 'thin',
          },
          bottom: {
            style: 'thin',
          },
          left: {
            style: 'thin',
          },
          right: {
            style: 'thin',
          },
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: true,
        },
      },
    },
    function (cell, newCell, row, config, currentRow, currentCol, fieldKey) {
      return newCell
    }
  )

  LAY_EXCEL.setExportCellStyle(
    data,
    `A1:${createCellPos(Object.keys(data[0]).length - 1)}1`,
    {
      s: {
        font: {
          name: '宋体',
          sz: 12,
          bold: true,
        },
        border: {
          top: {
            style: 'thin',
          },
          bottom: {
            style: 'thin',
          },
          left: {
            style: 'thin',
          },
          right: {
            style: 'thin',
          },
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: true,
        },
      },
    }
  )

  let colConfig = LAY_EXCEL.makeColConfig(columnWidths, 80)

  const end = data.length
  let rowConfig = LAY_EXCEL.makeRowConfig(
    {
      1: 25,
      [end]: 25,
    },
    25
  )

  let mergeConf = null

  // 若果有自定义配置
  if (customConfig) {
    // 自定义的列宽度
    if (customConfig.colConfig) {
      colConfig = LAY_EXCEL.makeColConfig(customConfig.colConfig, 80)
    }
    // 自定义的行高度
    if (customConfig.rowConfig) {
      rowConfig = LAY_EXCEL.makeRowConfig(
        {
          1: customConfig['rowConfig']['start'],
          [end]: customConfig['rowConfig']['end'],
        },
        customConfig['rowConfig']['other']
      )
    }
    // 显示合计文本
    if (customConfig.showTotalText) {
      const endRowData = data[data.length - 1]
      endRowData[customConfig.totalTextCell]['v'] = '合计'
      data[data.length - 1] = endRowData
    }
    // 自定义合并
    if (customConfig.mergeConf) {
      mergeConf = LAY_EXCEL.makeMergeConfig(customConfig.mergeConf)
    }
  }
  // 导出
  LAY_EXCEL.exportExcel(data, fileName, 'xlsx', {
    extend: {
      '!merges': mergeConf,
      '!cols': colConfig,
      '!rows': rowConfig,
    },
  })
}

export function getCookie(key) {
  if (document.cookie.length > 0) {
    let start = document.cookie.indexOf(key + '=')
    if (start !== -1) {
      start = start + key.length + 1
      let end = document.cookie.indexOf(';', start)
      if (end === -1) end = document.cookie.length
      return unescape(document.cookie.substring(start, end))
    }
  }
  return ''
}

export function setCookie(cName, value, expiredays) {
  const exdate = new Date()
  exdate.setDate(exdate.getDate() + expiredays)
  document.cookie =
    cName +
    '=' +
    decodeURIComponent(value) +
    (expiredays == null ? '' : ';expires=' + exdate.toGMTString())
}

// 下划线转换驼峰
export function toHump(name) {
  return name.replace(/\_(\w)/g, function (all, letter) {
    return letter.toUpperCase()
  })
}
// 驼峰转换下划线
export function toLine(name) {
  return name.replace(/([A-Z])/g, '_$1').toLowerCase()
}
