import { request } from "@/network/request";

// 附件
export function getAnnexUrl(params) {  
  return request({
    url:'/annex/getAnnexURL.do',
    method:'Get',
    params
  })
}

export function deleteAnnex(params) {  
  return request({
    url:'/annex/deleteAnnexById.do',
    method:'Delete',
    data:params
  })
}

export function downloadAnnex(params) {  
  return request({
    url:'/annex/downloadFile.do',
    method:'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data:params
  })
}