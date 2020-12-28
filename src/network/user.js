import { request } from '@/network/request'

// 用户
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

// 角色
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

export function getRoleListByUserId(params) {
  return request({
    url: '/user/showRoleListByUserId.do',
    method: 'Get',
    params,
  })
}

// 角色权限
export function findRoleAuthority(params) {
  return request({
    url: '/permission/findPermissionByRoleId.do',
    method: 'Get',
    params,
  })
}

export function saveRoleAuthority(params) {
  return request({
    url: '/rolePermission/saveRolePermissions.do',
    method: 'Post',
    data: params,
  })
}

// 用户组权限
export function showUserGroupAuthorityList(params) {
  return request({
    url: '/permission/showUserGroupAuthorityList.do',
    method: 'Get',
    params,
  })
}

export function saveUserGroupAuthority(params) {
  return request({
    url: '/permission/saveUserGroupAuthority.do',
    method: 'Post',
    data: params,
  })
}
