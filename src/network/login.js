import { request } from "@/network/request";

export function login(params) {
  return request({
    url: 'login.do',
    method: 'post',
    data: params
  })
}

export class User {
  constructor(logininfo) {
    this.id = logininfo.userId
    this.account = logininfo.account
    this.name = logininfo.userName
    this.gender = logininfo.gender
    this.theme = logininfo.theme
  }
}
