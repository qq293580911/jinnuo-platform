import {
  request
} from "@/network/request"
import LAY_EXCEL from 'lay-excel';

export function showMachineList(source, params) {
  return request({
    url: source.url,
    method: source.type,
    source,
    params
  })
}

export function showTubeList(source, params) {
  return request({
    url: source.url,
    method: source.type,
    source,
    params
  })
}

