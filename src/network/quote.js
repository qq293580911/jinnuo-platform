import {
  request
} from "@/network/request";

// 报价处理
export function getSplitPlan(params) {
  return request({
    url: '/qtnProc/getSplitPlan.do',
    method: 'Get',
    params
  })
}

export function filterData(params) {
  return request({
    url: '/qtnProc/getFilterData.do',
    method: 'Post',
    data: params
  })
}

export function handle(params) {
  return request({
    url: '/qtnProc/doNonMachineProcess.do',
    method: 'Post',
    data: params
  })
}

export function filterSelectionParams(params) {
  const productName = params['productName']
  let specModel = params["specModel"]
  specModel = specModel.toUpperCase()
    .replace("M/H", "m³/h")
    .replace("M³/H", "m³/h")
    .replace("M3/H", "m³/h")
    .replace("KW", "kw");
  // 获得风机类型
  let machineType = ''
  if (/柜|箱|离心|HTFC/.test(productName)) {
    machineType = "柜机"
  } else {
    machineType = "圆机"
  }
  // 获得风量
  let airVolume = "";
  let len = specModel.indexOf("m³/h");
  if (len > 0) {
    for (let i = len - 1; i > 0; i--) {
      const c = specModel.charAt(i);
      if (/\d|\.|\//.test(c) == false) {
        airVolume = specModel.substring(i + 1, specModel.indexOf("m³/h"));
        break;
      }
    }
  } else if (specModel.indexOf("Q=")) {
    len = specModel.indexOf("Q=")
    for (let i = len + 2; i < specModel.length; i++) {
      const c = specModel.charAt(i);
      if (/\d|\.|\//.test(c) == false) {
        airVolume = specModel.substring(specModel.indexOf("Q=") + 2, i);
        break;
      }
    }
  }
  // 获得功率
  let power = "";
  len = specModel.indexOf("kw");
  if (len > 0) {
    for (let i = len - 1; i > 0; i--) {
      const c = specModel.charAt(i);
      if (/\d|\.|\//.test(c) == false) {
        power = specModel.substring(i + 1, specModel.indexOf("kw"));
        break;
      }
    }
  } else if (specModel.indexOf("N=")) {
    len = specModel.indexOf("N=")
    for (let i = len + 2; i < specModel.length; i++) {
      const c = specModel.charAt(i);
      if (/\d|\.|\//.test(c) == false) {
        airVolume = specModel.substring(specModel.indexOf("N=") + 2, i);
        break;
      }
    }
  }
  // 获得速度类型
  let speedType = ""
  if (/\/|\\/.test(airVolume)) {
    speedType = "双速";
  } else if (specModel.indexOf('风量') != specModel.lastIndexOf('风量')) {
    speedType = "双速";
  } else if (specModel.indexOf('速') != specModel.lastIndexOf('速')) {
    speedType = "双速";
  } else if (specModel.indexOf('Q') != specModel.lastIndexOf('Q')) {
    speedType = "双速";
  } else if (/\/|\\/.test(power)) {
    speedType = "双速";
  } else {
    speedType = "单速"
  }
  // 获得认证类型
  let certificate = ''
  if (/T35|外购|防[爆,暴]|送|补|加压|混流|斜流|排风|管道|通风|壁式/.test(productName)) {
    certificate = false
  } else if (/双速|高温|排烟|PY/.test(productName)) {
    certificate = true
  } else {
    certificate = true
  }

  const map = {
    machineType,
    airVolume,
    speedType,
    power,
    certificate
  }
  return map
}

export function getGeneralBlowerList(params) {
  return request({
    url: '/qtnProc/getFanModelSelectionList.do',
    method: 'Get',
    params
  })
}

export function getOutsideBuyList(params) {
  return request({
    url: '/qtnProc/getOutsideBuyModelSelectionList.do',
    method: 'Get',
    params
  })
}

export function getVentilatorList(params) {
  return request({
    url: '/qtnProc/getVentilatorSelectionList.do',
    method: 'Get',
    params
  })
}

export function getControlBoxList(params) {
  return request({
    url: '/qtnProc/getControlBoxModelSelectionList.do',
    method: 'Get',
    params
  })
}

export function getSmallBlowerList(params) {
  return request({
    url: '/qtnProc/getFanModelSelectionList.do',
    method: 'Get',
    params
  })
}

export function getAddControlBoxList(params) {
  return request({
    url: '/qtnProc/getBatchAddControlBoxList.do',
    method: 'Post',
    data: params
  })
}

// 报价单管理
export function getQuotationList(params) {
  return request({
    url: "/qtnManage/showQuotationList.do",
    method: "GET",
    params
  })
}

export function deleteCard(params) {
  return request({
    url: "/qtnManage/deleteQuotationById.do",
    method: "Delete",
    params
  })
}

export function download(params) {
  return request({
    url: "/qtnManage/getDownloadURL.do",
    method: "GET",
    params
  })
}

// 报价详细
export function showDetailList(source, params) {
  return request({
    url: source.url,
    method: source.type,
    source,
    params
  })
}

export function queryDuplicate(params) {
  return request({
    url: '/qtnManage/queryQuotationExist.do',
    method: 'Get',
    params
  })
}

export function addQuotationAndDetail(form) {
  return request({
    url: '/qtnManage/addQuotationAndDetail.do',
    method: 'Post',
    data: form,
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8'
    }
  })
}

// 报价统计
export function getQuoterColumnChartData(params) {
  return request({
    url: '/qtnStat/getQuoterQuotationColumnChartData.do',
    method: 'Get',
    params
  })
}
