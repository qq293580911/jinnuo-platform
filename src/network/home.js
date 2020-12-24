import { request } from '@/network/request'

import { Module } from '@/common/const.js'

export function getMenus(params) {
  return request({
    url: 'permission/showMenuModule.do',
    method: 'GET',
    params: {
      jsonParams: JSON.stringify(params),
    },
  })
}

export class Menu {
  constructor(menu) {
    this.id = menu.id
    this.parentId = menu.parentId
    if (menu.parentId) {
      this.component = getMenuComponent(menu.name)
    }
    this.name = menu.name
    this.type = getMenuType(menu.name)
  }
}

function getMenuType(munuName) {
  switch (munuName) {
    case '产品管理':
      return 'anticon-chanpin'
    case '报价管理':
      return 'anticon-baojia'
    case '合同管理':
      return 'anticon-hetong'
    case '下单管理':
      return 'anticon-xiadan'
    case '生产管理':
      return 'anticon-shengchan'
    case '销售管理':
      return 'anticon-xiaoshou'
    case '人事管理':
      return 'anticon-renshi'
    case '用户管理':
      return 'anticon-yonghu'
    case '文档管理':
      return 'anticon-wendang'
    case '系统管理':
      return 'anticon-shezhi'
    case '部门组织':
      return 'anticon-bumen'
    case '客户管理':
      return 'anticon-kehu'
    case '物品领用':
      return 'anticon-wupin'
    default:
      return ''
  }
}

function getMenuComponent(munuName) {
  switch (munuName) {
    case '产品管理':
      return Module.PRODUCT_MANAGEMENT
    case '产品分类':
      return Module.PRODUCT_CATEGORY
    case '产品价格':
      return Module.PRODUCT_PRICE
    case '报价处理':
      return Module.QUOTE_HANDLE
    case '报价管理':
      return Module.QUOTATION
    case '报价统计':
      return Module.QUOTE_MANAGEMENT
    case '合同统计':
      return Module.CONTRACT_MANAGEMENT
    case '合同开票':
      return Module.CONTRACT_INVOICE
    case '下单统计':
      return Module.ORDER_MANAGEMENT
    case '送货统计':
      return Module.DELIVERY_MANAGEMENT
    case '销售统计':
      return Module.SALES_STATISTICS
    case '部门员工':
      return Module.DEPARTMENT_EMPLOYEE
    case '部门管理':
      return Module.DEPARTMENT_MANAGEMENT
    case '销售团队':
      return Module.SALES_GROUP_MANAGEMENT
    case '员工管理':
      return Module.EMPLOYEE_MANAGEMENT
    case '用户管理':
      return Module.USER_MANAGEMENT
    case '角色管理':
      return Module.ROLE_MANAGEMENT
    case '权限分配':
      return Module.AUTHORITY_ASSIGN
    case '客户管理':
      return Module.CUSTOMER_MANAGEMENT
    case '用品类型':
      return Module.SUPPLIES_CATEGORY
    case '用品管理':
      return Module.SUPPLIES_MANAGEMENT
    case '办公用品':
      return Module.SUPPLIES_STATISTICS
    case '权限管理':
      return Module.AUTHORITY_MANAGEMENT
    case '测试模块':
      return Module.TEST
    default:
      return ''
  }
}

export function getPermissions(params) {
  return request({
    url: 'permission/findPermissionByUserId.do',
    method: 'Get',
    params,
  })
}
