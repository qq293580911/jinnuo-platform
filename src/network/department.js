import {
  request
} from "@/network/request"

export function getDepartment(url,source,params) {  
  return request({
    url,
    method:source.type,
    source
  })
}

export function addDepartment(param) {  
  return request({
    url:'/dept/addDepartment.do',
    method:'Post',
    data:param
  })
}

export function deleteDepartment(param) {  
  return request({
    url:'/dept/deleteDepartment.do',
    method:'Delete',
    data:param
  })
}

export function updateDepartment(param) {  
  return request({
    url:'/dept/updateDepartment.do',
    method:'Put',
    data:param
  })
}