import { request } from '@/network/request'

export function showUserList(source, params) {
  return request({
    url: source.url,
    method: source.type,
    source,
    params,
  })
}

export function addUser(params) {
  return request({
    url: '/user/addUser.do',
    method: 'Post',
    data: params,
  })
}

export function deleteUser(params) {
  return request({
    url: '/user/deleteUserByIds.do',
    method: 'Post',
    data: params,
  })
}

export function updateUserInfo(params) {
  return request({
    url: '/user/updateUserInformation.do',
    method: 'Put',
    data: params,
  })
}

export function showRoleList(source, params) {
  return request({
    url: source.url,
    method: source.type,
    source,
    params,
  })
}

export function addRole(params) {  
  return request({
    url: '/role/addRole.do',
    method: 'Post',
    data: params,
  })
}

export function deleteRole(params) {
  return request({
    url: '/role/delRoleById.do',
    method: 'Delete',
    data: params,
  })
}

export function updateRole(params) {
  return request({
    url: '/role/updateRoleInfo.do',
    method: 'Put',
    data: params,
  })
}
