import {
  request
} from "@/network/request";

// 合同发票
export function showContractInvoiceList(source,params){
  return request({
    url:source.url,
    method: source.type,
    source,
    params
  })
}

export function addContractInvoice(params) {  
  return request({
    url:'/contrInv/addContractInvoice.do',
    method:'Post',
    data:params
  })
}

export function deleteContractInvoice(params) {  
  return request({
    url:'/contrInv/deleteContractInvoice.do',
    method:'Delete',
    data:params
  })
}

export function updateContractInvoice(params) {  
  return request({
    url:'/contrInv/updateContractInvoice.do',
    method:'Put',
    data:params
  })
}

