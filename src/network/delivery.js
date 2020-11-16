import { request } from "@/network/request"

export function showDeliveryList(source,params) { 
  return request({
    url:source.url,
    method:source.type,
    source,
    params
  })
}

export function deleteDelivery(params) {  
  return request({
    url:'/dlvDtl/deleteDeliveryDetailById.do',
    method:'Delete',
    params
  })
}

export function showDeliveryDetailList(source,params) { 
  return request({
    url:source.url,
    method:source.type,
    source,
    params
  })
}
