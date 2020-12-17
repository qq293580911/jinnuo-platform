import { request } from '@/network/request'

export function showUserList(source, params) {
  return request({
    url: source.url,
    method: source.type,
    source,
    params
  })
}

export function updateUserInfo(params) {  
  return request({
    url: '/user/updateUserInformation.do',
    method: 'Put',
    data:params
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
