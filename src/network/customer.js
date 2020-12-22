import { request } from "@/network/request";

export function showCustomerList(source, params) {
  return request({
    url: source.url,
    method: source.type,
    source,
    params
  })
}

export function addCustomer(params) {  
  return request({
    url: '/customer/addCustomer.do',
    method: 'Post',
    data:params
  })
}

export function deleteCustomer(params) {  
  return request({
    url: '/customer/deleteCustomerByIds.do',
    method: 'Delete',
    data:params
  })
}

export function updateCustomer(params) {  
  return request({
    url: '/customer/updateCustomerById.do',
    method: 'Put',
    data:params
  })
}



