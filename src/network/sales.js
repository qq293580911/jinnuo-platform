import {
  request
} from "@/network/request"

// import LAY_EXCEL from 'layexcel'

export function showMachineList(source, params) {
  return request({
    url: source.url,
    method: source.type,
    source,
    params
  })
}

export function showTubeList(source, params) {
  return request({
    url: source.url,
    method: source.type,
    source,
    params
  })
}

export function exportTubeData(rowsData, columns) {

  console.log(LAY_EXCEL)

  const headTitle = {};
  const head = [];
  const columnWidths = [];

  columns.records.forEach(function (currentValue, index) {
    const text = currentValue.text;
    const dataField = currentValue.datafield;
    head.push(dataField);
    headTitle[dataField] = text;
    columnWidths[String.fromCharCode(64 + index + 1)] = currentValue['width'];
  });

  let data = [];
  rowsData.forEach(function (currentValue) {
    const map = {};
    head.forEach(function (field) {
      map[field] = currentValue[field];
    });
    data.push(map);
  });

  data = layexcel.filterExportData(data, {
    'salesman_company': 'salesman_company',
    'salesman_agency': 'salesman_agency',
    'salesman': 'salesman',
    'is_resign': 'is_resign',
    'contract_count': function (value, line, data, lineIndex, newField) {
      return {
        v: value,
        t: 'n'
      }
    },
    'contract_amount': function (value, line, data, lineIndex, newField) {
      return {
        v: value,
        t: 'n'
      }
    },
    'order_area': function (value, line, data, lineIndex, newField) {
      return {
        v: value,
        t: 'n'
      }
    },
    'delivery_area': function (value, line, data, lineIndex, newField) {
      return {
        v: value,
        t: 'n'
      }
    }
  });

  data.unshift(headTitle); //标题
  data.push({
    'salesman_company': '合计',
    'salesman_agency': '',
    'salesman': '',
    'is_resign': '',
    'contract_count': {
      t: 'n',
      f: 'SUM(E2:E' + ([data.length]) + ')'
    },
    'contract_amount': {
      t: 'n',
      f: 'SUM(E2:E' + ([data.length]) + ')'
    },
    'order_area': {
      t: 'n',
      f: 'SUM(G2:G' + ([data.length]) + ')'
    },
    'delivery_area': {
      t: 'n',
      f: 'SUM(H2:H' + ([data.length]) + ')'
    }
  });

  var createCellPos = function (n) {
    var ordA = 'A'.charCodeAt(0);
    var ordZ = 'Z'.charCodeAt(0);
    var len = ordZ - ordA + 1;
    var s = "";
    while (n >= 0) {
      s = String.fromCharCode(n % len + ordA) + s;
      n = Math.floor(n / len) - 1;
    }
    return s;
  };

  // 2. 调用设置样式的函数，传入设置的范围，支持回调
  LAY_EXCEL.setExportCellStyle(data, 'A1:' + createCellPos(Object.keys(data[0]).length - 1) + [data.length], {
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
    return newCell;
  });


  LAY_EXCEL.setExportCellStyle(data, 'A1:' + createCellPos(Object.keys(data[0]).length - 1) + '1', {
    s: {
      fill: {
        fgColor: {
          rgb: "BABABA"
        }
      }
    }
  });

  var colConfig = LAY_EXCEL.makeColConfig({
    'A': 80,
    'F': 80
  }, 80);

  var end = data.length;
  var rowConfig = LAY_EXCEL.makeRowConfig({
    1: 25,
    [end]: 25
  }, 25);

  var mergeConf = LAY_EXCEL.makeMergeConfig([
    ['A' + [end], 'D' + [end]]
  ]);

  LAY_EXCEL.exportExcel(data, '销售统计-风管.xlsx', 'xlsx', {
    extend: {
      '!merges': mergeConf,
      '!cols': colConfig,
      '!rows': rowConfig
    }
  });
}
