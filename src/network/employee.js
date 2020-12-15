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

export function addEmployee(param) {
  return request({
    url: '/emp/addEmployee.do',
    method: 'Post',
    data: param
  })
}

export function deleteEmployee(param) {
  return request({
    url: '/emp/deleteEmployee.do',
    method: 'Delete',
    data: param
  })
}

export function updateEmployee(param) {
  return request({
    url: '/emp/updateEmployee.do',
    method: 'Put',
    data: param
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

export function getEmployeePosition(url, source, params) {
  return request({
    url,
    source,
    method: source.type,
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
    url: '/emp/getAllInServiceSalesman.do'
  })
}
