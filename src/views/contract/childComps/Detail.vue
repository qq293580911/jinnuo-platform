<template>
  <div :style="contentStyle">
    <JqxGrid
      ref="myGrid"
      :width="'100%'"
      :height="'100%'"
      :columnsresize="true"
      :columnsautoresize="true"
      :localization="localization"
      :source="dataAdapter"
      :columns="columns"
      :showtoolbar="true"
      :rendertoolbar="createButtonsContainers"
      :pageable="true"
      :pagesize="20"
      :pagesizeoptions="pagesizeoptions"
      :sortable="true"
      :filterable="true"
      :altrows="true"
      :enabletooltip="true"
      :editable="editable"
      :editmode="'dblclick'"
      :selectionmode="'multiplerowsextended'"
      :virtualmode="true"
      :rendergridrows="rendergridrows"
      :showstatusbar="true"
      :statusbarheight="30"
      :showaggregates="true"
      :rowdetails="true"
      :initrowdetails="initrowdetails"
      :rowdetailstemplate="rowdetailstemplate"
      @cellclick="onCellclick($event)"
    >
    </JqxGrid>
    <JqxMenu
      ref="jqxMenu"
      :mode="'popup'"
      :autoOpenPopup="false"
      :width="120"
      :height="140"
      @itemclick="onItemclick($event)"
    >
      <div>
        <ul>
          <li>设置客户</li>
        </ul>
      </div>
    </JqxMenu>
    <preview-window
      ref="previewWindow"
      :src="previewUrl"
    ></preview-window>
    <contract-window ref="contractWindow"></contract-window>
    <upload-window
      ref="uploadWindow"
      :annex-type="annexType"
    ></upload-window>
    <set-customer-window
      ref="setCustomerWindow"
      @sendCustomer="sendCustomer"
    ></set-customer-window>
  </div>
</template>

<script>
import axios from 'axios'
import JqxGrid from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue'
import JqxMenu from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxmenu.vue'

import PreviewWindow from '@/components/common/PreviewWindow.vue'
import ContractWindow from './ContractWindow.vue'
import SetCustomerWindow from './SetCustomerWindow.vue'
import UploadWindow from '@/components/content/annex/UploadWindow.vue'

import { formatFilter, dataExport } from '@/common/util.js'
import { contentHeight } from '@/common/mixin.js'
import {
  Message,
  ADD_CONTRACT,
  EDIT_CONTRACT,
  FILE_UPLOAD,
} from '@/common/const.js'
import { getLocalization } from '@/common/localization.js'
import {
  showContractDetails,
  getContractAnnexList,
  deleteContract,
} from '@/network/contract.js'
import { getAnnexUrl, deleteAnnex } from '@/network/annex.js'
export default {
  components: {
    JqxGrid,
    JqxMenu,
    PreviewWindow,
    ContractWindow,
    SetCustomerWindow,
    UploadWindow,
  },
  mixins: [contentHeight],
  props: {
    isSigned: {
      type: Boolean,
      default: false,
    },
  },
  beforeCreate: function () {
    this.source = {
      filter: () => {
        this.$refs.myGrid.updatebounddata('filter')
      },
      datafields: [
        { name: 'id', type: 'number' },
        { name: 'create_date', type: 'string' },
        { name: 'salesman', type: 'number' },
        { name: 'salesman_name', type: 'string' },
        { name: 'salesman_company', type: 'string' },
        { name: 'salesman_agency', type: 'string' },
        { name: 'contract_number', type: 'string' },
        { name: 'project_name', type: 'string' },
        { name: 'customer_company', type: 'string' },
        { name: 'customer', type: 'number' },
        { name: 'customer_name', type: 'string' },
        { name: 'customer_phone', type: 'string' },
        { name: 'province', type: 'string' },
        { name: 'city', type: 'string' },
        { name: 'county', type: 'string' },
        { name: 'original_price', type: 'number' },
        { name: 'discount_price', type: 'number' },
        { name: 'final_price', type: 'number' },
        { name: 'reserve_price', type: 'number' },
        { name: 'logistics_management_fee', type: 'string' },
        { name: 'freight', type: 'string' },
        { name: 'tax', type: 'string' },
        { name: 'warranty', type: 'string' },
        { name: 'install_fee', type: 'number' },
        { name: 'sign_status', type: 'string' },
        { name: 'sign_date', type: 'string' },
        { name: 'sign_back_date', type: 'string' },
        { name: 'formula_model', type: 'string' },
        { name: 'order_amount', type: 'number' },
        { name: 'delivery_amount', type: 'number' },
        { name: 'execute_status', type: 'string' },
        { name: 'rise_drop_point', type: 'string' },
        { name: 'deduction_bonus_amount', type: 'string' },
        { name: 'performance_bonus_reimbursement', type: 'string' },
        { name: 'is_repeat', type: 'string' },
        { name: 'over_budget_bear', type: 'string' },
        { name: 'creator', type: 'string' },
        { name: 'creator_name', type: 'string' },
      ],
      type: 'get',
      datatype: 'json',
      root: 'rows',
      sortcolumn: 'id',
      sortdirection: 'desc',
      id: 'id',
      url: `/contrDtl/showContractDetails.do`,
      updaterow(rowid, newdata, commit) {
        // console.log(newdata)
      },
    }
  },
  created() {},
  data() {
    const that = this
    return {
      editable: true,
      annexType: '合同附件',
      // 数据网格
      localization: getLocalization('zh-CN'),
      dataAdapter: new jqx.dataAdapter(this.source, {
        formatData: function (data) {
          return data
        },
        loadServerData: function (serverdata, source, callback) {
          if (that.isSigned) {
            serverdata['jsonParams'] = JSON.stringify({
              signStatus: '已签',
            })
          }
          serverdata = formatFilter(serverdata)
          showContractDetails(source, serverdata).then((res) => {
            callback({
              records: res.rows,
              totalrecords: res.total,
            })
          })
        },
        beforeLoadComplete(records) {
          records.map((element) => {
            const orderAmount =
              element['order_amount'] == null ? 0 : element['order_amount']
            const contractAmount = element['final_price']
            const deliveryAmount = element['delivery_amount']
            if (
              orderAmount > 0 &&
              orderAmount == deliveryAmount &&
              orderAmount >= contractAmount
            ) {
              element['execution_state'] = '已完成'
            } else if (orderAmount > 0) {
              element['execution_state'] = '执行中'
            } else {
              element['execution_state'] = '未执行'
            }
            // 获得加点情况
            const beforeDiscountPrice = element['original_price']
            const reservePrice = element['reserve_price']
            const afterDiscountPrice = element['discount_price']
            let addPointDetails
            if (beforeDiscountPrice == reservePrice) {
              addPointDetails = '底价就是报价;'
            } else if (beforeDiscountPrice > reservePrice) {
              let point = (1 - reservePrice / beforeDiscountPrice) * 100
              point = point.toFixed(2) + '%'
              addPointDetails = '底价+' + point + '报价;'
            } else {
              let point = (1 - beforeDiscountPrice / reservePrice) * 100
              point = point.toFixed(2) + '%'
              addPointDetails = '底价-' + point + '报价;'
            }

            if (beforeDiscountPrice > afterDiscountPrice) {
              let point = (1 - afterDiscountPrice / beforeDiscountPrice) * 100
              point = point.toFixed(2) + '%'
              addPointDetails += '合同单价总体优惠' + point + ';'
            }
            if (beforeDiscountPrice < afterDiscountPrice) {
              let point = (1 - beforeDiscountPrice / afterDiscountPrice) * 100
              point = point.toFixed(2) + '%'
              addPointDetails += '合同单价上调' + point + ';'
            }
            if (beforeDiscountPrice == afterDiscountPrice) {
              addPointDetails += '合同总体无优惠'
            }
            element['add_point_detail'] = addPointDetails
          })
        },
      }),
      pagesizeoptions: (() => {
        return [25, 30, 50, 100, 500, 1000, 3000, 5000, 7000, 10000]
      })(),
      rendergridrows: function (obj) {
        return obj.data
      },
      columns: (function () {
        const columns = []
        columns.push({
          text: '创建日期',
          datafield: 'create_date',
          cellsformat: 'yyyy-MM-dd',
          align: 'center',
          cellsalign: 'center',
          pinned: true,
          width: 100,
        })
        columns.push({
          text: '是否重复',
          datafield: 'is_repeat',
          align: 'center',
          cellsalign: 'center',
          width: 100,
          pinned: true,
          cellsrenderer: function (
            row,
            columnfield,
            value,
            defaulthtml,
            columnproperties,
            rowdata
          ) {
            if (value == '常规') {
              return (
                '<span style="width:100%;display:block; text-align: ' +
                columnproperties.cellsalign +
                ';line-height:29px; color: #008000;">' +
                value +
                '</span>'
              )
            } else {
              return (
                '<span style="width:100%;display:block; text-align: ' +
                columnproperties.cellsalign +
                ';line-height:29px; color: #ff0000;">' +
                value +
                '</span>'
              )
            }
          },
        })
        columns.push({
          text: '大区',
          datafield: 'salesman_company',
          align: 'center',
          cellsalign: 'center',
          width: 100,
          pinned: true,
        })
        columns.push({
          text: '办事处',
          datafield: 'salesman_agency',
          align: 'center',
          cellsalign: 'center',
          width: 100,
          pinned: true,
        })
        columns.push({
          text: '业务员',
          datafield: 'salesman_name',
          align: 'center',
          cellsalign: 'center',
          pinned: true,
          width: 100,
          cellsrenderer: function (
            row,
            columnfield,
            value,
            defaulthtml,
            columnproperties,
            rowdata
          ) {
            return (
              '<span style="width:100%;display:block; text-align: ' +
              columnproperties.cellsalign +
              ';line-height:29px; color: #FF0202;">' +
              value +
              '</span>'
            )
          },
        })
        columns.push({
          text: '合同编号',
          datafield: 'contract_number',
          align: 'center',
          cellsalign: 'center',
          pinned: true,
          width: 130,
        })
        columns.push({
          text: '项目名称',
          datafield: 'project_name',
          align: 'center',
          cellsalign: 'center',
          pinned: true,
          width: 150,
        })
        if (that.hasAuthority(that, 'contrDtl:customer')) {
          columns.push({
            text: '采购人',
            datafield: 'customer_name',
            align: 'center',
            cellsalign: 'center',
            width: 100,
            cellsrenderer: function (
              row,
              columnfield,
              value,
              defaulthtml,
              columnproperties,
              rowdata
            ) {
              return (
                '<span style="width:100%;display:block; text-align: ' +
                columnproperties.cellsalign +
                ';line-height:29px; color: #0303FF;">' +
                value +
                '</span>'
              )
            },
          })
        }
        if (that.hasAuthority(that, 'contrDtl:customer_company')) {
          columns.push({
            text: '客户公司',
            datafield: 'customer_company',
            align: 'center',
            cellsalign: 'center',
            width: 100,
          })
        }
        if (that.hasAuthority(that, 'contrDtl:customer_phone')) {
          columns.push({
            text: '客户电话',
            datafield: 'customer_phone',
            align: 'center',
            cellsalign: 'center',
            width: 120,
          })
        }
        columns.push({
          text: '省',
          datafield: 'province',
          align: 'center',
          cellsalign: 'center',
          width: 100,
        })
        columns.push({
          text: '市',
          datafield: 'city',
          align: 'center',
          cellsalign: 'center',
          width: 100,
        })
        columns.push({
          text: '县',
          datafield: 'county',
          align: 'center',
          cellsalign: 'center',
          width: 100,
        })
        columns.push({
          text: '报价',
          datafield: 'original_price',
          align: 'center',
          cellsalign: 'center',
          width: 100,
        })
        columns.push({
          text: '成交价格',
          datafield: 'final_price',
          align: 'center',
          cellsalign: 'center',
          width: 100,
          aggregates: ['sum'],
          aggregatesrenderer: that.aggregatesRenderer,
        })
        columns.push({
          text: '底价',
          datafield: 'reserve_price',
          align: 'center',
          cellsalign: 'center',
          width: 100,
        })
        columns.push({
          text: '物流管理费',
          datafield: 'logistics_management_fee',
          align: 'center',
          cellsalign: 'center',
          width: 110,
        })
        columns.push({
          text: '运费',
          datafield: 'freight',
          align: 'center',
          cellsalign: 'center',
          width: 100,
        })
        columns.push({
          text: '税金',
          datafield: 'tax',
          align: 'center',
          cellsalign: 'center',
          width: 100,
        })
        columns.push({
          text: '质保金',
          datafield: 'warranty',
          align: 'center',
          cellsalign: 'center',
          width: 100,
        })
        columns.push({
          text: '安装费',
          datafield: 'install_fee',
          align: 'center',
          cellsalign: 'center',
          width: 100,
        })
        columns.push({
          text: '签订状态',
          datafield: 'sign_status',
          align: 'center',
          cellsalign: 'center',
          width: 100,
          cellsrenderer: function (
            row,
            columnfield,
            value,
            defaulthtml,
            columnproperties,
            rowdata
          ) {
            if (value == '已签') {
              return (
                '<span style="width:100%;display:block; text-align: ' +
                columnproperties.cellsalign +
                ';line-height:29px; color: #008000;">' +
                value +
                '</span>'
              )
            }
            return (
              '<span style="width:100%;display:block; text-align: ' +
              columnproperties.cellsalign +
              ';line-height:29px; color: #ff0000;">' +
              value +
              '</span>'
            )
          },
        })
        columns.push({
          text: '签订日期',
          datafield: 'sign_date',
          cellsformat: 'yyyy-MM-dd',
          align: 'center',
          cellsalign: 'center',
          width: 100,
        })
        columns.push({
          text: '签回日期',
          datafield: 'sign_back_date',
          cellsformat: 'yyyy-MM-dd',
          align: 'center',
          cellsalign: 'center',
          width: 100,
        })
        columns.push({
          text: '价格方案',
          datafield: 'formula_model',
          align: 'center',
          cellsalign: 'center',
          width: 100,
        })
        if (that.hasAuthority(that, 'contrDtl:order_amount')) {
          columns.push({
            text: '下单金额',
            datafield: 'order_amount',
            align: 'center',
            cellsalign: 'center',
            width: 110,
          })
        }
        if (that.hasAuthority(that, 'contrDtl:delivery_amount')) {
          columns.push({
            text: '送货金额',
            datafield: 'delivery_amount',
            align: 'center',
            cellsalign: 'center',
            width: 100,
          })
        }
        columns.push({
          text: '执行状态',
          datafield: 'execution_state',
          align: 'center',
          cellsalign: 'center',
          width: 100,
          cellsrenderer: function (
            row,
            columnfield,
            value,
            defaulthtml,
            columnproperties,
            rowdata
          ) {
            if (value == '已完成') {
              return (
                '<span style="width:100%;display:block; text-align: ' +
                columnproperties.cellsalign +
                ';line-height:29px; color: #008000;">' +
                value +
                '</span>'
              )
            }
            if (value == '执行中') {
              return (
                '<span style="width:100%;display:block; text-align: ' +
                columnproperties.cellsalign +
                ';line-height:29px; color: #9CD7FF;">' +
                value +
                '</span>'
              )
            }
            return (
              '<span style="width:100%;display:block; text-align: ' +
              columnproperties.cellsalign +
              ';line-height:29px; color: #ff0000;">' +
              value +
              '</span>'
            )
          },
        })
        columns.push({
          text: '加点情况',
          datafield: 'add_point_detail',
          align: 'center',
          cellsalign: 'center',
          width: 250,
        })
        columns.push({
          text: '非3C风阀',
          datafield: 'deduction_bonus_amount',
          align: 'center',
          cellsalign: 'center',
          width: 150,
        })
        columns.push({
          text: '业绩奖金报销',
          datafield: 'performance_bonus_reimbursement',
          align: 'center',
          cellsalign: 'center',
          width: 100,
        })
        columns.push({
          text: '降点情况',
          datafield: 'rise_drop_point',
          align: 'center',
          cellsalign: 'center',
          width: 100,
        })
        columns.push({
          text: '超点承担',
          datafield: 'over_budget_bear',
          align: 'center',
          cellsalign: 'center',
          width: 100,
        })
        columns.push({
          text: '创建者',
          datafield: 'creator_name',
          align: 'center',
          cellsalign: 'center',
          pinned: false,
          width: 100,
        })
        return columns
      })(),
      rowdetailstemplate: {
        rowdetails: "<div class='child-grid' style='margin: 10px;'></div>",
        rowdetailsheight: 220,
        rowdetailshidden: true,
      },
      previewUrl: '',
    }
  },
  mounted() {
    const gridId = this.$refs.myGrid.componentSelector
    $(gridId).on('contextmenu', () => {
      return false
    })
  },
  methods: {
    createButtonsContainers: function (statusbar) {
      const buttonsContainer = document.createElement('div')
      buttonsContainer.style.cssText =
        'overflow: hidden; position: relative; margin: 5px;'
      statusbar[0].appendChild(buttonsContainer)

      // 创建添加按钮
      if (this.hasAuthority(this, 'contrDtl:add')) {
        const addButtonContainer = document.createElement('div')
        const addButtonID = JQXLite.generateID()
        addButtonContainer.id = addButtonID
        addButtonContainer.style.cssText =
          'float: left; margin-left: 5px;cursor: pointer;'
        buttonsContainer.appendChild(addButtonContainer)
        const addButtonInstance = jqwidgets.createInstance(
          `#${addButtonID}`,
          'jqxButton',
          {
            imgSrc: require(`@/assets/iconfont/custom/add-circle.svg`),
          }
        )
        jqwidgets.createInstance(`#${addButtonID}`, 'jqxTooltip', {
          content: '添加',
          position: 'bottom',
        })
        addButtonInstance.addEventHandler('click', (event) => {
          this.$refs.contractWindow.open(ADD_CONTRACT)
        })
      }

      // 创建删除按钮
      if (this.hasAuthority(this, 'contrDtl:delete')) {
        const deleteButtonContainer = document.createElement('div')
        const deleteButtonID = JQXLite.generateID()
        deleteButtonContainer.id = deleteButtonID
        deleteButtonContainer.style.cssText =
          'float: left; margin-left: 5px;cursor: pointer;'
        buttonsContainer.appendChild(deleteButtonContainer)
        const deleteButton = jqwidgets.createInstance(
          `#${deleteButtonID}`,
          'jqxButton',
          {
            imgSrc: require(`@/assets/iconfont/custom/ashbin.svg`),
          }
        )
        jqwidgets.createInstance(`#${deleteButtonID}`, 'jqxTooltip', {
          content: '删除',
          position: 'bottom',
        })

        deleteButton.addEventHandler('click', (event) => {
          const selectedrowindex = this.$refs.myGrid.getselectedrowindex()
          if (selectedrowindex < 0) {
            this.$message.warning({ content: Message.NO_ROWS_SELECTED })
            return false
          }
          const id = this.$refs.myGrid.getrowid(selectedrowindex)
          this.delete(id)
        })
      }

      // 创建修改按钮
      if (this.hasAuthority(this, 'contrDtl:update')) {
        const editButtonContainer = document.createElement('div')
        const editButtonID = JQXLite.generateID()
        editButtonContainer.id = editButtonID
        editButtonContainer.style.cssText =
          'float: left; margin-left: 5px;cursor: pointer;'
        buttonsContainer.appendChild(editButtonContainer)
        const editButton = jqwidgets.createInstance(
          `#${editButtonID}`,
          'jqxButton',
          {
            imgSrc: require(`@/assets/iconfont/custom/edit.svg`),
          }
        )
        jqwidgets.createInstance(`#${editButtonID}`, 'jqxTooltip', {
          content: '编辑',
          position: 'bottom',
        })
        editButton.addEventHandler('click', (event) => {
          const index = this.$refs.myGrid.getselectedrowindex()
          if (index < 0) {
            this.$message.warning({ content: Message.NO_ROWS_SELECTED })
            return false
          }
          const rowData = this.$refs.myGrid.getrowdata(index)
          this.$refs.contractWindow.open(EDIT_CONTRACT, rowData)
        })
      }

      // 创建上传按钮
      if (this.hasAuthority(this, 'contrAnnex:upload')) {
        const uploadButtonContainer = document.createElement('div')
        const uploadButtonID = JQXLite.generateID()
        uploadButtonContainer.id = uploadButtonID
        uploadButtonContainer.style.cssText =
          'float: left; margin-left: 5px;cursor: pointer;'
        buttonsContainer.appendChild(uploadButtonContainer)
        const uploadButton = jqwidgets.createInstance(
          `#${uploadButtonID}`,
          'jqxButton',
          {
            imgSrc: require(`@/assets/iconfont/custom/upload.svg`),
          }
        )
        jqwidgets.createInstance(`#${uploadButtonID}`, 'jqxTooltip', {
          content: '上传',
          position: 'bottom',
        })

        uploadButton.addEventHandler('click', () => {
          const index = this.$refs.myGrid.getselectedrowindex()
          if (index < 0) {
            this.$message.warning({ content: Message.NO_ROWS_SELECTED })
            return false
          }
          const boundId = this.$refs.myGrid.getrowid(index)
          this.$refs.uploadWindow.open(FILE_UPLOAD, boundId)
        })
      }

      // 创建导出按钮
      if (this.hasAuthority(this, 'contrDtl:export')) {
        const exportButtonContainer = document.createElement('div')
        const exportButtonID = JQXLite.generateID()
        exportButtonContainer.id = exportButtonID
        exportButtonContainer.style.cssText =
          'float: left; margin-left: 5px;cursor: pointer;'
        buttonsContainer.appendChild(exportButtonContainer)
        const exportButton = jqwidgets.createInstance(
          `#${exportButtonID}`,
          'jqxButton',
          {
            imgSrc: require(`@/assets/iconfont/custom/export.svg`),
          }
        )
        jqwidgets.createInstance(`#${exportButtonID}`, 'jqxTooltip', {
          content: '导出',
          position: 'bottom',
        })

        exportButton.addEventHandler('click', () => {
          const columns = this.$refs.myGrid.columns
          const rowsData = this.$refs.myGrid.getrows()
          dataExport('合同数据汇总.xlsx', columns, rowsData)
        })
      }

      // 创建刷新按钮
      const reloadButtonContainer = document.createElement('div')
      const reloadButtonID = JQXLite.generateID()
      reloadButtonContainer.id = reloadButtonID
      reloadButtonContainer.style.cssText = 'float: right; margin-left: 5px;'
      buttonsContainer.appendChild(reloadButtonContainer)
      const reloadButton = jqwidgets.createInstance(
        `#${reloadButtonID}`,
        'jqxButton',
        { imgSrc: require(`@/assets/iconfont/custom/refresh.svg`) }
      )
      jqwidgets.createInstance(`#${reloadButtonID}`, 'jqxTooltip', {
        content: '刷新',
        position: 'bottom',
      })

      reloadButton.addEventHandler('click', (event) => {
        this.$refs.myGrid.updatebounddata()
      })
    },
    initrowdetails(index, parentElement, gridElement, record) {
      const that = this
      parentElement.style['z-index'] = 1000
      const id = record.uid.toString()
      const childGrid = $($(parentElement).children()[0])
      const params = {
        jsonParams: JSON.stringify({
          boundId: id,
          annexType: '合同附件',
        }),
      }
      const annexSource = {
        dataFields: [
          { name: 'annex_id', type: 'number' },
          { name: 'annex_name', type: 'string' },
          { name: 'bound_id', type: 'number' },
        ],

        url: '/annex/showAnnexBySelectBoundId.do',
        type: 'get',
        data: params,
        dataType: 'json',
        id: 'annex_id',
      }

      const nestedGridAdapter = new jqx.dataAdapter(annexSource, {
        formatData: function (data) {
          return data
        },
        loadServerData: function (serverdata, source, callback) {
          serverdata = formatFilter(serverdata)
          getContractAnnexList(source, serverdata).then((res) => {
            callback({
              records: res.rows,
              totalrecords: res.total,
            })
          })
        },
        loadComplete(records) {
          records.records.forEach((item) => {
            const annexName = item['annex_name']
            const suffix = annexName.substring(annexName.lastIndexOf('.') + 1)
            item['file_type'] = suffix
          })
        },
      })

      const childGridInstance = jqwidgets.createInstance(childGrid, 'jqxGrid', {
        localization: getLocalization('zh-CN'),
        source: nestedGridAdapter,
        width: '96%',
        height: 200,
        columns: (function () {
          const columns = []
          columns.push({
            text: '附件名称',
            datafield: 'annex_name',
            cellsAlign: 'center',
            align: 'center',
          })
          columns.push({
            text: '文件类型',
            datafield: 'file_type',
            cellsAlign: 'center',
            align: 'center',
            cellsrenderer: function (row, column, value) {
              const imgurl = require(`@/assets/iconfont/custom/${value}.svg`)
              const img =
                '<div style="text-align:center;"><img style="margin: 8px;" width="16" height="16" src="' +
                imgurl +
                '"></div>'
              return img
            },
          })
          if (that.hasAuthority(that, 'contrAnnex:delete')) {
            columns.push({
              text: '',
              datafield: 'annexDelete',
              columntype: 'button',
              width: 50,
              cellsrenderer: function () {
                return '删除'
              },
              buttonclick: function (rowindex) {
                that.$confirm({
                  title: `${Message.CONFIRM_DELETE}`,
                  okText: '确认',
                  cancelText: '取消',
                  centered: true,
                  okType: 'danger',
                  content: (h) => <div style="color:red;"></div>,
                  onOk() {
                    const annexId = childGridInstance.getrowid(rowindex)
                    const params = {
                      jsonParams: JSON.stringify({
                        annexId,
                      }),
                    }
                    deleteAnnex(params).then((res) => {
                      childGridInstance.updatebounddata()
                    })
                  },
                  onCancel() {},
                  class: 'test',
                })
              },
            })
          }
          if (that.hasAuthority(that, 'contrAnnex:preview')) {
            columns.push({
              text: '',
              datafield: 'annexPreview',
              columntype: 'button',
              width: 50,
              cellsrenderer: function () {
                return '预览'
              },
              buttonclick: function (rowindex) {
                const annexId = childGridInstance.getrowid(rowindex)
                const params = {
                  jsonParams: JSON.stringify({
                    annexId,
                  }),
                }
                getAnnexUrl(params).then((res) => {
                  const suffix = res.substring(res.lastIndexOf('.') + 1)
                  if (['xlsx', 'xls', 'doc', 'docx'].includes(suffix, 0)) {
                    that.previewUrl = `https://view.officeapps.live.com/op/view.aspx?src=${res}`
                  } else {
                    that.previewUrl = res
                  }
                  that.$refs.previewWindow.open('预览')
                })
              },
            })
          }
          if (that.hasAuthority(that, 'contrAnnex:download')) {
            columns.push({
              text: '',
              datafield: 'annexDownload',
              columntype: 'button',
              width: 50,
              cellsrenderer: function () {
                return '下载'
              },
              buttonclick: function (rowindex) {
                const annexId = childGridInstance.getcellvalue(
                  rowindex,
                  'annex_id'
                )
                const fileName = childGridInstance.getcellvalue(
                  rowindex,
                  'annex_name'
                )
                const params = {
                  annexId,
                }
                // axios请求二进制流下载
                axios({
                  method: 'post',
                  url: '/api/annex/downloadFile.do',
                  data: params,
                  responseType: 'blob',
                }).then((res) => {
                  const content = res.data
                  const blob = new Blob([content])
                  const elink = document.createElement('a')
                  elink.download = fileName
                  elink.style.display = 'none'
                  elink.href = URL.createObjectURL(blob)
                  document.body.appendChild(elink)
                  elink.click()
                  URL.revokeObjectURL(elink.href) // 释放URL 对象
                  document.body.removeChild(elink)
                })
              },
            })
          }
          return columns
        })(),
      })
    },
    aggregatesRenderer(aggregates, column, element) {
      let renderString = ''
      $.each(aggregates, function (key, value) {
        switch (key) {
          case 'sum':
            renderString +=
              '<div style="position: relative; line-height: 30px; text-align: center; overflow: hidden;">' +
              '合计' +
              ': ' +
              value +
              '</div>'
            break
        }
      })
      return renderString
    },
    delete(id) {
      const params = {
        jsonParams: JSON.stringify({ id }),
      }
      deleteContract(params).then((res) => {
        this.$message.success(Message.DELETE_SUCCESS)
        this.refresh()
      })
    },
    refresh() {
      this.$refs.myGrid.updatebounddata()
    },
    forceReload() {
      console.log(this)
      this.$forceUpdate()
      console.log(1)
    },
    onCellclick(event) {
      if (event.args.rightclick) {
        const clickCellInfo = event.args
        this.clickCellInfo = clickCellInfo
        const scrollTop = $(window).scrollTop()
        const scrollLeft = $(window).scrollLeft()
        this.$refs.jqxMenu.open(
          parseInt(event.args.originalEvent.clientX) + 5 + scrollLeft,
          parseInt(event.args.originalEvent.clientY) + 5 + scrollTop
        )
        return false
      }
    },
    onItemclick(event) {
      const menu = event.args.textContent
      if (menu == '设置客户') {
        const rowData = this.clickCellInfo.row.bounddata
        this.$refs.setCustomerWindow.open('设置客户', rowData)
      }
    },
    sendCustomer(item) {
      console.log(item)
    },
  },
}
</script>

<style scoped>
</style>
