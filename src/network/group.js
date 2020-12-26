import { request } from '@/network/request'

export function getSalesGroupList(params) {
  return request({
    url: '/group/getSalesGroupList.do',
    method: 'Get',
    params,
  })
}

export function addGroup(params) {
  return request({
    url: '/group/addSalesGroup.do',
    method: 'Post',
    data: params,
  })
}

export function deleteGroup(params) {
  return request({
    url: '/group/deleteSalesGroup.do',
    method: 'Delete',
    data: params,
  })
}

export function updateGroup(params) {
  return request({
    url: '/group/updateSalesGroup.do',
    method: 'Put',
    data: params,
  })
}

export function assignGroupSalesman(params) {  
  return request({
    url: '/group/assignGroupSalesman.do',
    method: 'Post',
    data: params,
  })
}
