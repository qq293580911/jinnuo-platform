import {
  request
} from "@/network/request"
import LAY_EXCEL from 'lay-excel';

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

  const headTitle = {}
  const headFields = []
  const columnWidths = {}

  columns.records.forEach((item, index) => {
    const text = item['text']
    const dataField = item['datafield']
    headTitle[dataField] = text;
    headFields.push(dataField);
    columnWidths[`${String.fromCharCode(64 + index + 1)}`] = Math.round(item['width'] / 2);
  })

  let data = rowsData.map(item => {
    const map = {};
    headFields.forEach((field) => {
      map[field] = item[field];
    });
    return map
  })

  data = LAY_EXCEL.filterExportData(data, {
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

  console.log(data)
  //插入标题
  data.unshift(headTitle);
  // 插入聚合行
  data.push({
    'salesman_company': '合计',
    'salesman_agency': '',
    'salesman': '',
    'is_resign': '',
    'contract_count': {
      t: 'n',
      f: `SUM(E2:E${data.length})`
    },
    'contract_amount': {
      t: 'n',
      f: `SUM(F2:F${data.length})`
    },
    'order_area': {
      t: 'n',
      f: `SUM(G2:G${data.length})`
    },
    'delivery_area': {
      t: 'n',
      f: `SUM(H2:H${data.length})`
    }
  });

  const createCellPos = function (n) {
    const ordA = 'A'.charCodeAt(0);
    const ordZ = 'Z'.charCodeAt(0);
    const len = ordZ - ordA + 1;
    let s = "";
    while (n >= 0) {
      s = String.fromCharCode(n % len + ordA) + s;
      n = Math.floor(n / len) - 1;
    }
    return s;
  };

  // console.log(data)

  // 2. 调用设置样式的函数，传入设置的范围，支持回调
  LAY_EXCEL.setExportCellStyle(data, `A1:${createCellPos(Object.keys(data[0]).length - 1) + [data.length]}`, {
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

  const colConfig = LAY_EXCEL.makeColConfig({
    'A': 80,
    'F': 80
  }, 80);

  const end = data.length;
  const rowConfig = LAY_EXCEL.makeRowConfig({
    1: 25,
    [end]: 25
  }, 25);

  const mergeConf = LAY_EXCEL.makeMergeConfig([
    ['A' + [end], 'D' + [end]]
  ]);

  // console.log(data)

  // LAY_EXCEL.exportExcel(data, '销售统计-风管.xlsx', 'xlsx', {
  //   extend: {
  //     '!merges': mergeConf,
  //     '!cols': colConfig,
  //     '!rows': rowConfig
  //   }
  // });
}
