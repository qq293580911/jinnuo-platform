import { request } from "@/network/request";

export function showContractDetails(source,params){
  return request({
    url:source.url,
    method: source.type,
    source,
    params
  })
}


export function showInvoiceList(source,params){
  return request({
    url:source.url,
    method: source.type,
    source,
    params
  })
}


