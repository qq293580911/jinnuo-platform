import {
  request
} from '@/network/request';

export function showMachineOrderList(source, params) {
  return request({
    url: source.url,
    method: source.type,
    source,
    params
  })
}

export function getDeliveryByOrderNumber(source, params) {
  return request({
    url: source.url,
    method: source.type,
    source,
    params
  })
}

export function showTubeOrderList(source, params) {
  return request({
    url: source.url,
    method: source.type,
    source,
    params
  })
}

export function addOrder(params) {
  return request({
    url: '/ordDtl/addOrderDetail.do',
    method: 'Post',
    data:params
  })
}

export function deleteOrder(params) {
  return request({
    url: '/ordDtl/deleteOrderDetailById.do',
    method: 'Delete',
    data:params
  })
}

export function updateOrder(params) {  
  return request({
    url: '/ordDtl/updateOrderDetail.do',
    method: 'Put',
    data:params
  })
}

export function importOrder(params) {  
  return request({
    url:'/ordDtl/importOrderDetail.do',
    method:'Post',
    data:params
  })
}

export function batahUpdateOrder(params) {  
  return request({
    url: '/ordDtl/syncToServer.do',
    method: 'Put',
    data:params
  })
}

export function batchUpdateOrderByOrderNumber(params) {  
  return request({
    url: '/ordDtl/batchUpdateOrderDetailByField.do',
    method: 'Put',
    data:params
  })
}