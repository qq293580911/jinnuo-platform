import { request } from "@/network/request";

export function getQuotationList(params){
  return request({
    url:"/qtnManage/showQuotationList.do",
    method:"GET",
    params
  })
}

export function deleteCard(params) {  
  return request({
    url:"/qtnManage/deleteQuotationById.do",
    method:"Delete",
    params
  })
}

export function download(params){
  return request({
    url:"/qtnManage/getDownloadURL.do",
    method:"GET",
    params
  })
}

// 报价详细
export function showDetailList(source, params){
  return request({
    url: source.url,
    method: source.type,
    source,
    params
  })
}


