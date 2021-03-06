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

export function getAllSupplies() {  
  return request({
    url:`/supplies/getAllSupplies.do`,
    method: `Get`
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

export function addPurchase(params) {  
  return request({
    url: `/supplies/addOfficeSuppliesPurchaseInfo.do`,
    method: `Post`,
    data:params
  })
}

export function deletePurchase(params) {  
  return request({
    url: `/supplies/deleteOfficeSuppliesPurchaseInfo.do`,
    method: `Delete`,
    data:params
  })
}

export function updatePurchase(params) {  
  return request({
    url: `/supplies/updateOfficeSuppliesPurchaseInfo.do`,
    method: `Put`,
    data:params
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

export function getStockQuantity(params) {  
  return request({
    url: `/supplies/getStockQuantity.do`,
    method: `Get`,
    params
  })
}

export function addReceive(params) {  
  return request({
    url: `/supplies/addOfficeSuppliesReceiveInfo.do`,
    method: `Post`,
    data:params
  })
}

export function deleteReceive(params) {  
  return request({
    url: `/supplies/deleteOfficeSuppliesReceiveInfo.do`,
    method: `Delete`,
    data:params
  })
}

export function updateReceive(params) {  
  return request({
    url: `/supplies/updateOfficeSuppliesReceiveInfo.do`,
    method: `Put`,
    data:params
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
