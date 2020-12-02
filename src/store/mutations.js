import {
  SAVE_PERMISSIONS,
  SAVE_SALESMANS,
  SAVE_QUOTERS,
  SAVE_PRICE_PLAN,
  // 报价处理
  SAVE_CURRENT_QUOTE_NAME,
  SAVE_CURRENT_QUOTE_CONTENT,
  SAVE_TODAY_QUOTE
  
} from './mutation-types'

//mutations唯一目的就是修改state中的状态
//mutations中的每个方法完成的事情尽可能单一
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
  [SAVE_PRICE_PLAN](state, payload) {
    state.pricePlan = payload
  },
  [SAVE_CURRENT_QUOTE_NAME](state, payload) {
    state.currentQuote.name = payload
  },
  [SAVE_CURRENT_QUOTE_CONTENT](state, payload) {
    state.currentQuote.content = payload
  },
  [SAVE_TODAY_QUOTE](state, payload){
    state.todayQuote.push(payload)
  }
}
