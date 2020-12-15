import { request } from "@/network/request"

export function getSalesGroupList(param) {
  return request({
    url: '/group/getSalesGroupList.do',
    method: 'Get',
    params: param
  })
}
