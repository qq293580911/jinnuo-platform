import {
  SAVE_PERMISSIONS,
  SAVE_SALESMANS,
  SAVE_QUOTERS,
  SAVE_PRICE_PLAN,
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
  }
}
