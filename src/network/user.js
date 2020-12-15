import { request } from '@/network/request'

export function showUserList(source, params) {
  return request({
    url: source.url,
    method: source.type,
    source,
    params
  })
}

export function showRoleList(source, params) {
  return request({
    url: source.url,
    method: source.type,
    source,
    params
  })
}
