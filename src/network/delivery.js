import { request } from '@/network/request'

export function showDeliveryList(source, params) {
  return request({
    url: source.url,
    method: source.type,
    source,
    params,
  })
}

export function addDelivery(param) {
  return request({
    url: '/dlvDtl/addDeliveryDetail.do',
    method: 'Post',
    data: param,
  })
}

export function deleteDelivery(params) {
  return request({
    url: '/dlvDtl/deleteDeliveryDetailById.do',
    method: 'Delete',
    data: params,
  })
}

export function updateDelivery(param) {
  return request({
    url: '/dlvDtl/updateDeliveryDetail.do',
    method: 'Put',
    data: param,
  })
}

export function syncToServer(params) {  
  return request({
    url: '/dlvDtl/syncToServer.do',
    method: 'Put',
    data: params,
  })
}

export function showDeliveryDetailList(source, params) {
  return request({
    url: source.url,
    method: source.type,
    source,
    params,
  })
}

export function getRelatedOrderInfo(params) {
  return request({
    url: '/dlvDtl/getOrderInfoListByOrderNumber.do',
    method: 'Post',
    data: params,
  })
}

export function importDelivery(params) {
  return request({
    url: '/dlvDtl/importDeliveryDetail.do',
    method: 'Post',
    data: params,
  })
}

export function showDeliveryDoneList(source, params) {
  return request({
    url: source.url,
    method: source.type,
    source,
    params,
  })
}
