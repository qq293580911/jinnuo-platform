import {
  request
} from '@/network/request';


// 用品类型
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

export function getAllSuppliesType() {  
  return request({
    url: '/supplies/getAllSuppliesType.do',
    method: 'Get'
  })
}

// 用品管理
export function showSuppliesList(source,params) {  
  return request({
    url:source.url,
    method: source.type,
    source,
    params
  })
}

export function addSupplies(params) {  
  return request({
    url:`/supplies/addOfficeSuppliesInfo.do`,
    method: `Post`,
    data:params
  })
}

export function deleteSupplies(params) {  
  return request({
    url:`/supplies/deleteOfficeSuppliesInfo.do`,
    method: `Delete`,
    data:params
  })
}

export function updateSupplies(params) {  
  return request({
    url:`/supplies/updateOfficeSuppliesInfo.do`,
    method: `Put`,
    data:params
  })
}

// 采购
export function showPurchaseList(source, params) {
  return request({
    url: source.url,
    method: source.type,
    source,
    params
  })
}

// 领用
export function showReceiveList(source, params) {
  return request({
    url: source.url,
    method: source.type,
    source,
    params
  })
}
// 统计
export function showStatisticsList(source, params) {
  return request({
    url: source.url,
    method: source.type,
    source,
    params
  })
}
