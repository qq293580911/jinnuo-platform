import {
  request
} from "@/network/request.js"

export function showEmployeeList(url, source, params) {
  return request({
    url,
    method: source.type,
    source,
    params
  })
}

export function addEmployee(params) {
  return request({
    url: '/emp/addEmployee.do',
    method: 'Post',
    data: params
  })
}

export function deleteEmployee(params) {
  return request({
    url: '/emp/deleteEmployee.do',
    method: 'Delete',
    data: params
  })
}

export function updateEmployee(params) {
  return request({
    url: '/emp/updateEmployee.do',
    method: 'Put',
    data: params
  })
}

export function showEmployeePosition(url, source, params) {
  return request({
    url,
    source,
    method: source.type,
    params
  })
}

export function getEmployeePosition(params) {
  return request({
    url:'/emp/getEmployeePositionList.do',
    method: 'Get',
    params
  })
}

export function assignPosition(param) {
  return request({
    url: '/emp/assignEmployeePosition.do',
    method: 'Post',
    data: param
  })
}

export function getQuoter() {
  return request({
    url: '/emp/getAllInServiceQuoter.do'
  })
}

export function getSalesman() {
  return request({
    url: '/emp/getAllSalesman.do'
  })
}
