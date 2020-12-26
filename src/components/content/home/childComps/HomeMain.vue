<template>
  <div class="main">
    <JqxTabs
      ref="myTabs"
      :width="'100%'"
      :height="'100%'"
      :position="'top'"
      :animationType="'none'"
      :selectionTracker="false"
      :showCloseButtons="true"
      @removed="removed($event)"
    >
      <ul>
        <li
          style="margin-left: 30px"
          hasclosebutton="false"
        >首页</li>
      </ul>
      <div>这是欢迎页</div>
    </JqxTabs>
  </div>
</template>

<script>
import Vue from 'vue'
import store from '@/store'
Vue.use(store)
import JqxTabs from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxtabs.vue'
// 产品管理
import ProductManagement from 'views/product/Management'
import ProductCategory from 'views/product/Category'
import ProductPrice from 'views/product/Price'
// 报价管理
import QuoteHandle from 'views/quote/Handle'
import Quotation from 'views/quote/Quotation'
import QuoteManagement from 'views/quote/Management'
// 客户管理
import CustomerManagement from 'views/customer/Customer'
// 合同管理
import ContractManagement from 'views/contract/Management'
import ContractInvoice from 'views/contract/Invoice'
// 下单，送货
import OrderManagement from 'views/order/Management'
import DeliveryManagement from 'views/delivery/Management'
// 销售统计
import SalesStatistics from 'views/sales/Statistics'
// 用户,角色，权限分配
import UserManagement from 'views/user/User'
import RoleManagement from 'views/user/Role'
import AuthorityAssign from 'views/user/Authority'
// 部门，员工
import DepartmentEmployee from 'views/department/DepartmentEmployee'
import DepartmentManagement from 'views/department/Department'
import SalesGroupManagement from 'views/group/SalesGroup'
import EmployeeManagement from 'views/employee/Employee'
// 用品类型，管理，统计
import SuppliesCategory from 'views/supplies/Category'
import SuppliesManagement from 'views/supplies/Management'
import SuppliesStatistics from 'views/supplies/StatisticsManagement'
// 测试模块
import AuthorityManagement from 'views/system/Authority'
import Test from 'views/system/Test'

import { Module } from '@/common/const.js'
export default {
  name: 'HomeMain',
  components: {
    JqxTabs,
  },
  data() {
    return {}
  },
  mounted() {
    this.$bus.$off('addTab').$on('addTab', (obj) => {
      const length = this.$refs.myTabs.length()
      let has = false
      for (let i = 0; i < length + 1; i++) {
        const title = this.$refs.myTabs.getTitleAt(i)
        if (title === obj.title) {
          has = true
          this.$refs.myTabs.select(i)
          break
        }
      }

      if (has == false) {
        this.addLast(obj)
      }
    })
  },
  methods: {
    addLast(obj) {
      this.$refs.myTabs.addLast(
        `${obj.title}`,
        `<div id="${obj.content}"></div>`
      )
      let component = null
      switch (obj.component) {
        case Module.PRODUCT_MANAGEMENT:
          component = Vue.extend(ProductManagement)
          break
        case Module.PRODUCT_CATEGORY:
          component = Vue.extend(ProductCategory)
          break
        case Module.PRODUCT_PRICE:
          component = Vue.extend(ProductPrice)
          break
        case Module.QUOTE_HANDLE:
          component = Vue.extend(QuoteHandle)
          break
        case Module.QUOTATION:
          component = Vue.extend(Quotation)
          break
        case Module.QUOTE_MANAGEMENT:
          component = Vue.extend(QuoteManagement)
          break
        case Module.CUSTOMER_MANAGEMENT:
          component = Vue.extend(CustomerManagement)
          break
        case Module.CONTRACT_MANAGEMENT:
          component = Vue.extend(ContractManagement)
          break
        case Module.ORDER_MANAGEMENT:
          component = Vue.extend(OrderManagement)
          break
        case Module.DELIVERY_MANAGEMENT:
          component = Vue.extend(DeliveryManagement)
          break
        case Module.SALES_STATISTICS:
          component = Vue.extend(SalesStatistics)
          break
        case Module.CONTRACT_INVOICE:
          component = Vue.extend(ContractInvoice)
          break
        case Module.USER_MANAGEMENT:
          component = Vue.extend(UserManagement)
          break
        case Module.ROLE_MANAGEMENT:
          component = Vue.extend(RoleManagement)
          break
        case Module.AUTHORITY_ASSIGN:
          component = Vue.extend(AuthorityAssign)
          break
        case Module.DEPARTMENT_EMPLOYEE:
          component = Vue.extend(DepartmentEmployee)
          break
        case Module.DEPARTMENT_MANAGEMENT:
          component = Vue.extend(DepartmentManagement)
          break
        case Module.SALES_GROUP_MANAGEMENT:
          component = Vue.extend(SalesGroupManagement)
          break
        case Module.EMPLOYEE_MANAGEMENT:
          component = Vue.extend(EmployeeManagement)
          break
        case Module.SUPPLIES_CATEGORY:
          component = Vue.extend(SuppliesCategory)
          break
        case Module.SUPPLIES_MANAGEMENT:
          component = Vue.extend(SuppliesManagement)
          break
        case Module.SUPPLIES_STATISTICS:
          component = Vue.extend(SuppliesStatistics)
          break
        case Module.AUTHORITY_MANAGEMENT:
          component = Vue.extend(AuthorityManagement)
          break
        case Module.TEST:
          component = Vue.extend(Test)
          break
      }
      this.vm = new component({
        store,
      }).$mount(`#${obj.content}`)
    },
    removed(event) {
      this.vm.$destroy()
    },
  },
}
</script>

<style scoped>
/* 很重要，不能删，删了窗体验证会扰乱布局 */
.main {
  height: calc(100vh - 64px);
  overflow:hidden;
}
::v-deep .jqx-tabs-content-element{
  overflow: hidden;
}
</style>
