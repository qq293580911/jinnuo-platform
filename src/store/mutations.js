import {
  SAVE_PERMISSIONS,
  SAVE_PRICE_PLAN,
} from './mutation-types'

//mutations唯一目的就是修改state中的状态
//mutations中的每个方法完成的事情尽可能单一
export default {
  [SAVE_PERMISSIONS](state, payload) {
    state.permissions = payload
  },
  [SAVE_PRICE_PLAN](state, payload) {
    state.pricePlan = payload
  }
}
