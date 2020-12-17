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

export function addCategory(params) {
  return request({
    url: '',
    method: 'Post',
    data: params
  })
}

export function deleteCategory(params) {
  return request({
    url: '',
    method: 'Delete',
    data: params
  })
}

export function updateCategory(params) {
  return request({
    url: '',
    method: 'Put',
    data: params
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
