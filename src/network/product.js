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
    data: params
  })
}

export function deleteCategory(params) {
  return request({
    url: '/productCateg/delProductCategory.do',
    method: 'delete',
    data: params
  })
}

export function updateCategory(params) {
  return request({
    url: '/productCateg/updProductCategoryInfo.do',
    method: 'put',
    data: params
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
    url: '/productManage/delMachineProduct.do',
    method: 'delete',
    data: params
  })
}

export function updateMachineProduct(params) {
  return request({
    url: '/productManage/updMachineProductInfo.do',
    method: 'put',
    data: params
  })
}

export function getAllMachineProduct() {
  return request({
    url: '/productManage/getAllMachineProduct.do',
    method:'Get'
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

export function getFormula(params) {
  return request({
    url: `/productManage/getAllProductFormula.do`,
    method: `Get`,
    params
  })
}

export function addNonMachineProduct(params) {
  return request({
    url: `/productManage/addNonMachineProduct.do`,
    method: `Post`,
    data: params
  })
}

export function deleteNonMachineProduct(params) {
  return request({
    url: '/productManage/delNonMachineProduct.do',
    method: 'Delete',
    data: params
  })
}

export function updateNonMachineProduct(params) {
  return request({
    url: `/productManage/updNonMachineProductInfo.do`,
    method: `Put`,
    data: params
  })
}

export function getAllNonMachineProduct(source) {
  return request({
    url: '/productManage/getAllNonMachineProduct.do',
    method: 'Get'
  })
}

// 换气扇
export function showVentilatorList(source, params) {
  return request({
    url: source.url,
    method: source.type,
    source,
    params
  })
}

export function addVentilator(params) {
  return request({
    url: '/productManage/addVentilator.do',
    method: 'Post',
    data: params
  })
}

export function deleteVentilator(params) {
  return request({
    url: '/productManage/delVentilator.do',
    method: 'Delete',
    data: params
  })
}

export function updateVentilator(params) {
  return request({
    url: '/productManage/updVentilatorInfo.do',
    method: 'Put',
    data: params
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

export function addPricePlan(params) {
  return request({
    url: '/productPrice/addPriceScheme.do',
    method: 'Post',
    data: params
  })
}

export function deletePricePlan(params) {
  return request({
    url: '/productPrice/delPriceScheme.do',
    method: 'Delete',
    data: params
  })
}

export function updatePricePlan(params) {
  return request({
    url: '/productPrice/updPriceSchemeInfo.do',
    method: 'Put',
    data: params
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
    method: 'post',
    data: params
  })
}

export function deleteMachinePrice(params) {
  return request({
    url: '/productPrice/delMachinePrice.do',
    method: 'delete',
    data: params
  })
}

export function updateMachinePrice(params) {
  return request({
    url: '/productPrice/updMachinePriceInfo.do',
    method: 'put',
    data: params
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
    method: 'post',
    data: params
  })
}

export function deleteNonMachinePrice(params) {
  return request({
    url: '/productPrice/delNonMachinePrice.do',
    method: 'Delete',
    data: params
  })
}

export function updateNonMachinePrice(params) {
  return request({
    url: '/productPrice/updNonMachinePriceInfo.do',
    method: 'put',
    data: params
  })
}
