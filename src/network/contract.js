import { request } from "@/network/request";

// 合同
export function showContractDetails(source,params){
  return request({
    url:source.url,
    method: source.type,
    source,
    params
  })
}

export function getContractAnnexList(source,params) {  
  return request({
    url:source.url,
    method:source.type,
    source,
    params
  })
}

// 合同发票
export function showInvoiceList(source,params){
  return request({
    url:source.url,
    method: source.type,
    source,
    params
  })
}


