import {
  request
} from "@/network/request";


// 合同
export function showContractDetails(source, params) {
  return request({
    url: source.url,
    method: source.type,
    source,
    params
  })
}

export function getContractAnnexList(source, params) {
  return request({
    url: source.url,
    method: source.type,
    source,
    params
  })
}

export function addContract(params) {
  return request({
    url: '/contrDtl/addContractDetail.do',
    method: 'Post',
    data: params
  })
}

export function deleteContract(params) {
  return request({
    url: '/contrDtl/deleteContractDetailById.do',
    method: 'Delete',
    data: params
  })
}

export function updateContract(params) {
  return request({
    url: '/contrDtl/updateContractDetail.do',
    method: 'Put',
    data: params
  })
}

export function checkContractNumberExist(params) {
  return request({
    url: '/contrDtl/checkContractNumberExists.do',
    method: 'Get',
    params
  })
}

export function checkDuplicate(params) {
  return request({
    url: '/contrDtl/checkDuplicateByProjectName.do',
    method: 'Get',
    params
  })
}
