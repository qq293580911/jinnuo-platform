import {
  request
} from '@/network/request';

export function getCategory(source, params) {
  return request({
    url: source.url,
    method: source.type,
    source,
    params
  })
}

export function showPurchaseList(source, params) {
  return request({
    url: source.url,
    method: source.type,
    source,
    params
  })
}

export function showReceiveList(source, params) {
  return request({
    url: source.url,
    method: source.type,
    source,
    params
  })
}

export function showStatisticsList(source, params) {
  return request({
    url: source.url,
    method: source.type,
    source,
    params
  })
}
