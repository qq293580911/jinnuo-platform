import {
  SAVE_PERMISSIONS,
  SAVE_SALESMANS,
  SAVE_QUOTERS,
  SAVE_PRICE_PLAN,
  // 报价处理
  SAVE_CURRENT_QUOTE_NAME,
  SAVE_CURRENT_QUOTE_CONTENT,
  FILTER_QUOTE_CONTENT,
  SAVE_TODAY_QUOTE
} from './mutation-types'

export default {
  savePermissions(context, payload) {
    return new Promise((resolve, reject) => {
      context.commit(SAVE_PERMISSIONS, payload)
    })
  },
  saveSalesmans(context, payload) {
    return new Promise((resolve, reject) => {
      context.commit(SAVE_SALESMANS, payload)
    })
  },
  saveQuoters(context, payload) {
    return new Promise((resolve, reject) => {
      context.commit(SAVE_QUOTERS, payload)
    })
  },
  savePricePlan(context, payload) {
    return new Promise((resolve, reject) => {
      context.commit(SAVE_PRICE_PLAN, payload)
    })
  },
  saveCurrentQuoteName(context, payload){
    return new Promise((resolve, reject) => {
      context.commit(SAVE_CURRENT_QUOTE_NAME, payload)
    })
  },
  saveCurrentQuoteContent(context, payload) {
    return new Promise((resolve, reject) => {
      context.commit(SAVE_CURRENT_QUOTE_CONTENT, payload)
    })
  },
  filterQuoteContent(context, payload) {
    let startIndex = 0;
    let endIndex;
    // 截取位置
    payload.forEach((row, index) => {
      for (let cell in row) {
        if (row[cell] === "序号") {
          startIndex = index + 1;
        }
        if (/^[小,合,共]+计/.test(row[cell])) {
          endIndex = index;
        }
      }
    });
    payload = payload.slice(startIndex,endIndex)
    payload.map((item,index)=>{
      item['uid'] = index
    })
    return new Promise((resolve, reject) => {
      context.commit(SAVE_CURRENT_QUOTE_CONTENT, payload)
      resolve(payload)
    })
  },
  saveTodayQuote(context, payload){
    return new Promise((resolve, reject) => {
      context.commit(SAVE_TODAY_QUOTE, payload)
    })
  }
}
