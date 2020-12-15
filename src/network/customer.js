import { request } from "@/network/request";

export function showCustomerList(source, params) {
  return request({
    url: source.url,
    method: source.type,
    source,
    params
  })
}



