import { request } from '@/network/request'

export function showPermissionTree(source) {  
  return request({
    url: source.url,
    source,
    method: 'GET'
  })
}

export function showPermissionList(source, params) {  
  return request({
    url: source.url,
    method: source.type,
    source,
    params,
  })
}