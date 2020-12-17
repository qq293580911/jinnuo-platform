import {
  SAVE_PERMISSIONS,
  SAVE_SALESMANS,
  SAVE_QUOTERS,
  // 产品
  SAVE_FORMULA,
  SAVE_PRICE_PLAN,
  SAVE_SPLIT_PLAN,
  // 报价处理
  SAVE_CURRENT_QUOTE_PRICE_PLAN,
  SAVE_CURRENT_QUOTE_SPLIT_PLAN,
  SAVE_CURRENT_QUOTE_NAME,
  SAVE_CURRENT_QUOTE_CONTENT,
  UPDATE_CURRENT_QUOTE_CONTENT,
  APPEND_CURRENT_QUOTE_CONTENT,
  SAVE_TODAY_QUOTE,
  REMOVE_TODAY_QUOTE
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
  saveFormula(context, payload) {
    return new Promise((resolve, reject) => {
      context.commit(SAVE_FORMULA, payload)
    })
  },
  savePricePlan(context, payload) {
    return new Promise((resolve, reject) => {
      context.commit(SAVE_PRICE_PLAN, payload)
    })
  },
  saveSplitPlan(context, payload) {
    return new Promise((resolve, reject) => {
      context.commit(SAVE_SPLIT_PLAN, payload)
    })
  },
  // 当前报价
  saveCurrentQuotePricePlan(context, payload) {
    return new Promise((resolve, reject) => {
      context.commit(SAVE_CURRENT_QUOTE_PRICE_PLAN, payload)
    })
  },
  saveCurrentQuoteSplitPlan(context, payload) {
    return new Promise((resolve, reject) => {
      context.commit(SAVE_CURRENT_QUOTE_SPLIT_PLAN, payload)
    })
  },
  saveCurrentQuoteName(context, payload) {
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
      for (const cell in row) {
        if (row[cell] === "序号") {
          startIndex = index + 1;
        }
        if (/^[小,合,共]+计/.test(row[cell])) {
          endIndex = index;
        }
      }
    });
    payload = payload.slice(startIndex, endIndex)
    payload.map((item, index) => {
      item['uid'] = index
    })
    return new Promise((resolve, reject) => {
      context.commit(SAVE_CURRENT_QUOTE_CONTENT, payload)
      resolve(payload)
    })
  },
  updateCurrentQuoteContent(context, payload) {
    return new Promise((resolve, reject) => {
      context.commit(UPDATE_CURRENT_QUOTE_CONTENT, payload)
    })
  },
  appendCurrentQuoteContent(context, payload) {
    return new Promise((resolve, reject) => {
      context.commit(APPEND_CURRENT_QUOTE_CONTENT, payload)
    })
  },
  // 今日报价
  saveTodayQuote(context, payload) {
    return new Promise((resolve, reject) => {
      context.commit(SAVE_TODAY_QUOTE, payload)
    })
  },
  removeTodayQuote(context, payload) {
    return new Promise((resolve, reject) => {
      context.commit(REMOVE_TODAY_QUOTE, payload)
    })
  }
}
