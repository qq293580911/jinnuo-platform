import {
  request
} from "@/network/request";

// 报价处理
export function getToolsCompsSource(params) {  
  return request({
    url:'/qtnProc/getToolbarComponentResource.do',
    method:'Get',
    params
  })
}

export function filterData(params) {  
  return request({
    url:'/qtnProc/getFilterData.do',
    method:'Post',
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
