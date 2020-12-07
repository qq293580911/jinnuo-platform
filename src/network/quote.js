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
  return request({
    url: '/qtnProc/getModelSelectionParams.do',
    method: 'Post',
    data: params
  })
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
    data:params
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
      'Content-Type': 'multipart/form-data'
    }
  })
}
