import {
  request
} from "@/network/request";

// 基本分类
export function getCategory(url, source, params) {
  return request({
    url: url,
    source,
    method: 'GET',
    params
  })
}

export function addCategory(params) {
  return request({
    url: '/productCateg/addProductCategory.do',
    method: 'post',
    params
  })
}

export function deleteCategory(params) {
  return request({
    url: '/productCateg/delProductCategory.do',
    method: 'delete',
    params
  })
}

export function updateCategory(params) {
  return request({
    url: '/productCateg/updProductCategoryInfo.do',
    method: 'put',
    params
  })
}

// 标准分类
export function getStandardCategory(url, source, params) {
  return request({
    url: url,
    source,
    method: 'GET',
    params
  })
}

export function addStandardCategory(params) {
  return request({
    url: '/productCateg/addStandardSort.do',
    method: 'post',
    params
  })
}

export function deleteStandardCategory(params) {
  return request({
    url: '/productCateg/delStandardSort.do',
    method: 'delete',
    params
  })
}

export function updateStandardCategory(params) {
  return request({
    url: '/productCateg/updStandardSortInfo.do',
    method: 'put',
    params
  })
}

// 指派类型
export function getAssignType(url, source, params) {
  return request({
    url: url,
    source,
    method: 'GET',
    params
  })
}

export function addAssignType(params) {
  return request({
    url: '/productCateg/addAssignType.do',
    method: 'post',
    params
  })
}

export function deleteAssignType(params) {
  return request({
    url: '/productCateg/delAssignType.do',
    method: 'delete',
    params
  })
}

export function updateAssignType(params) {
  return request({
    url: '/productCateg/updAssignTypeInfo.do',
    method: 'put',
    params
  })
}

// 设备类产品
export function showMachineList(source, params) {
  return request({
    url: source.url,
    method: source.type,
    source,
    params
  })
}

export function addMachineProduct(params) {
  return request({
    url: '/productManage/addMachineProduct.do',
    method: 'post',
    data: params
  })
}

export function deleteMachineProduct(params) {
  return request({
    url: '/productCateg/delMachineProduct.do',
    method: 'delete',
    params: params
  })
}

export function updateMachineProduct(params) {
  return request({
    url: '/productManage/addNonMachineProduct.do',
    method: 'put',
    params: params
  })
}

export function getAllMachineProduct(source, params) {
  return request({
    url: source.url,
    method: source.type,
    params
  })
}

// 非设备类产品
export function showNonMachineList(source, params) {
  return request({
    url: source.url,
    method: source.type,
    source,
    params
  })
}

// 价格方案
export function showPricePlan(source, params) {
  return request({
    url: source.url,
    method: source.type,
    source,
    params
  })
}

export function getPricePlan() {
  return request({
    url: '/productPrice/getPriceSchemeSource.do'
  })
}

// 设备类价格
export function showMachinePrice(source, params) {
  return request({
    url: source.url,
    method: source.type,
    source,
    params
  })
}

export function addMachinePrice(params) {
  return request({
    url: '/productPrice/addMachinePrice.do',
    method:'post',
    data:params
  })
}

export function deleteMachinePrice(params) {  
  return request({
    url: '/productPrice/delMachinePrice.do',
    method:'delete',
    data:params
  })
}

export function updateMachinePrice(params) {
  return request({
    url: '/productPrice/updMachinePriceInfo.do',
    method:'put',
    data:params
  })
}
// 非设备类价格
export function showNonMachinePrice(source, params) {
  return request({
    url: source.url,
    method: source.type,
    source,
    params
  })
}

export function addNonMachinePrice(params) {
  return request({
    url: '/productPrice/addNonMachinePrice.do',
    method:'post',
    data:params
  })
}

export function updateNonMachinePrice(params) {
  return request({
    url: '/productPrice/updNonMachinePriceInfo.do',
    method:'put',
    data:params
  })
}
