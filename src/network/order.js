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

export function getDeliveryByOrderNumber(source,params) {  
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
