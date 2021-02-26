import {
  SAVE_PERMISSIONS,
  SAVE_SALESMANS,
  SAVE_QUOTERS,
  SAVE_PURCHASERS,
  // 产品
  SAVE_FORMULA,
  SAVE_PRICE_PLAN,
  SAVE_SPLIT_PLAN,
  // 报价处理
  SAVE_CURRENT_QUOTE_PRICE_PLAN,
  SAVE_CURRENT_QUOTE_SPLIT_PLAN,
  SAVE_CURRENT_QUOTE_PRIMARY_GRID_ROW_DATA,
  SAVE_CURRENT_QUOTE_NAME,
  SAVE_CURRENT_QUOTE_CONTENT,
  UPDATE_CURRENT_QUOTE_CONTENT,
  APPEND_CURRENT_QUOTE_CONTENT,
  // 今日报价
  SAVE_TODAY_QUOTE,
  REMOVE_TODAY_QUOTE

} from './mutation-types'

// mutations唯一目的就是修改state中的状态
// mutations中的每个方法完成的事情尽可能单一
export default {
  [SAVE_PERMISSIONS](state, payload) {
    state.permissions = payload
  },
  [SAVE_SALESMANS](state, payload) {
    state.salesmans = payload
  },
  [SAVE_QUOTERS](state, payload) {
    state.quoters = payload
  },
  [SAVE_PURCHASERS](state, payload){
    state.purchasers = payload
  },
  [SAVE_FORMULA](state, payload) {
    state.formula = payload
  },
  [SAVE_PRICE_PLAN](state, payload) {
    state.pricePlan = payload
  },
  [SAVE_SPLIT_PLAN](state, payload) {
    state.splitPlan = payload
  },
  // 当前报价
  [SAVE_CURRENT_QUOTE_PRICE_PLAN](state, payload) {
    state.currentQuote.pricePlan = payload
  },
  [SAVE_CURRENT_QUOTE_SPLIT_PLAN](state, payload) {
    state.currentQuote.splitPlan = payload
  },
  [SAVE_CURRENT_QUOTE_PRIMARY_GRID_ROW_DATA](state, payload){
    state.currentQuote.primaryGridRowData = payload
  },
  [SAVE_CURRENT_QUOTE_NAME](state, payload) {
    state.currentQuote.name = payload
  },
  [SAVE_CURRENT_QUOTE_CONTENT](state, payload) {
    state.currentQuote.content = payload
  },
  [UPDATE_CURRENT_QUOTE_CONTENT](state, payload) {
    payload.forEach(item => {
      state.currentQuote.content[item['uid']] = item
    })
  },
  [APPEND_CURRENT_QUOTE_CONTENT](state, payload) {
    let content = state.currentQuote.content
    content = content.concat(payload)
    state.currentQuote.content = content
  },
  // 今日报价
  [SAVE_TODAY_QUOTE](state, payload) {
    state.todayQuote.push(payload)
  },
  [REMOVE_TODAY_QUOTE](state, payload) {
    state.todayQuote.splice(payload, 1)
  }
}
