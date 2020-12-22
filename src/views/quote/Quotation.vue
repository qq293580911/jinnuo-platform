<template>
  <div :style="contentStyle">
    <a-layout>
      <a-layout-header>
        <JqxToolbar
          :width="'100%'"
          :height="35"
          :rtl="false"
          :tools="tools"
          :initTools="initTools"
        >
        </JqxToolbar>
      </a-layout-header>
      <a-layout>
        <a-layout-content>
          <JqxPanel
            :width="'50%'"
            :height="'100%'"
            :autoUpdate="true"
            class="panel"
          >
            <div style="height: 90%">
              <a-card-grid
                v-for="(itemInfo, index) in cards"
                :key="index"
                class="a-card-grid"
                :id="'card' + itemInfo.file_id"
                @click="itemClick(itemInfo)"
              >
                <quotation-item class="item">
                  <slot slot="left">
                    <div class="img"></div>
                  </slot>
                  <slot slot="center">
                    <div style="width: 100%">
                      <div class="title">
                        名称:{{ itemInfo.file_name_reserve_price }}
                      </div>
                      <a-row
                        type="flex"
                        justify="space-between"
                      >
                        <a-col :span="8">
                          <div>上传时间：{{ itemInfo.upload_time }}</div>
                        </a-col>
                        <a-col :span="4">
                          <div>上传者：{{ itemInfo.uploader }}</div>
                        </a-col>
                        <a-col :span="6">
                          <div>报价日期：{{ itemInfo.quote_date }}</div>
                        </a-col>
                        <a-col :span="6">
                          <div>报价人：{{ itemInfo.quoter_name }}</div>
                        </a-col>
                      </a-row>
                    </div>
                  </slot>
                  <slot slot="right">
                    <div
                      class="download-icon"
                      @click="
                        download(
                          itemInfo.file_id,
                          '底价',
                          itemInfo.file_name_reserve_price
                        )
                      "
                    ></div>
                  </slot>
                </quotation-item>
              </a-card-grid>
            </div>
          </JqxPanel>
          <JqxPanel
            :width="'50%'"
            :height="'100%'"
            :autoUpdate="true"
            class="panel"
          >
            <div style="height: 90%">
              <a-card-grid
                v-for="(itemInfo, index) in cards"
                :key="index"
                class="a-card-grid"
              >
                <quotation-item class="item">
                  <slot slot="left">
                    <div class="img"></div>
                  </slot>
                  <slot slot="center">
                    <div style="width: 100%">
                      <div class="title">
                        名称:{{ itemInfo.file_name_quote_price }}
                      </div>
                      <a-row
                        type="flex"
                        justify="space-between"
                      >
                        <a-col :span="8">
                          <div>上传时间：{{ itemInfo.upload_time }}</div>
                        </a-col>
                        <a-col :span="4">
                          <div>上传者：{{ itemInfo.uploader }}</div>
                        </a-col>
                        <a-col :span="6">
                          <div>报价日期：{{ itemInfo.quote_date }}</div>
                        </a-col>
                        <a-col :span="6">
                          <div>报价人：{{ itemInfo.quoter_name }}</div>
                        </a-col>
                      </a-row>
                    </div>
                  </slot>
                  <slot slot="right">
                    <div
                      class="download-icon"
                      @click="
                        download(
                          itemInfo.file_id,
                          '报价',
                          itemInfo.file_name_quote_price
                        )
                      "
                    ></div>
                  </slot>
                </quotation-item>
              </a-card-grid>
            </div>
          </JqxPanel>
        </a-layout-content>
      </a-layout>
      <a-layout-footer>
        <a-pagination
          show-quick-jumper
          :default-current="1"
          v-model="current"
          :show-size-changer="true"
          :page-size-options="pageSizeOptions"
          :page-size="pageSize"
          :total="pageTotal"
          @change="onChange"
          @showSizeChange="showSizeChange"
        >
          <template
            slot="buildOptionText"
            slot-scope="props"
          >
            <span>{{ props.value }}条/页</span>
          </template>
        </a-pagination>
      </a-layout-footer>
    </a-layout>
    <JqxLoader
      ref="jqxLoader"
      :imagePosition="'top'"
      :autoOpen="false"
      :text="'加载中...'"
      :width="100"
      :height="60"
    >
    </JqxLoader>
    <quotation-upload-window ref="uploadWindow"></quotation-upload-window>
    <quotation-detail-window ref="detailWindow"></quotation-detail-window>
  </div>
</template>

<script>
import JqxToolbar from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxtoolbar.vue'
import JqxPanel from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxpanel.vue'
import JqxLoader from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxloader.vue'

import QuotationItem from './childComps/QuotationItem'
import QuotationUploadWindow from './childComps/QuotationUploadWindow'
import QuotationDetailWindow from './childComps/QuotationDetailWindow'

import { Message } from '@/common/const.js'
import { getQuotationList, download } from '@/network/quote.js'

import { deleteCard } from '@/network/quote.js'
export default {
  name: 'Quotation',
  components: {
    JqxToolbar,
    JqxPanel,
    JqxLoader,
    QuotationItem,
    QuotationUploadWindow,
    QuotationDetailWindow,
  },
  computed: {
    contentStyle() {
      return {
        height: 'calc(100vh - 100px)',
      }
    },
    pageTotal() {
      return this.total / this.pageSize + (this.total % 10)
    },
  },
  data: function () {
    return {
      tools: 'custom | custom',
      toolsIndex: -1,
      queryParams: {},
      cards: [],
      pageSizeOptions: ['5', '10', '20', '30', '40', '50'],
      current: 1,
      pageSize: 10,
      total: 0,
      selectCardId: 0,
    }
  },
  created() {
    this.render()
  },
  mounted() {
    const that = this
    // 绑定上传事件
    if (this.uploadButtonInstance) {
      this.uploadButtonInstance.addEventHandler('click', (event) => {
        this.$refs.uploadWindow.open('选择文件')
      })
    }
    // 绑定删除事件
    if (this.deleteButtonInstance) {
      this.deleteButtonInstance.addEventHandler('click', (event) => {
        const selectedClass = document.querySelector('.selected')
        if (selectedClass == null) {
          this.$message.warning(Message.NO_OBJECT_SELECTED)
          return false
        }
        this.$confirm({
          title: `${Message.CONFIRM_DELETE}`,
          okText: '确认',
          okType: 'danger',
          cancelText: '取消',
          centered: true,
          // eslint-disable-next-line no-dupe-keys
          okType: 'danger',
          content: (h) => <div style="color:red;">将连关联文件一并删除</div>,
          onOk() {
            that.deleteCard(that.selectCardId)
          },
          onCancel() {},
          class: 'test',
        })
      })
    }
    // 绑定条件选择事件
    this.conditionSelectorInstance.addEventHandler('select', (event) => {
      this.queryParams.paramsCondition = event.args.item.value
    })

    this.searchInputInstance.addEventHandler('input', (event) => {
      this.queryParams.param = event.target.value
    })

    this.searchButtonInstance.addEventListener('click', (event) => {
      this.render()
    })

    this.refreshButtonInstance.addEventHandler('click', (event) => {
      this.conditionSelectorInstance.clearSelection()
      this.searchInputInstance.val('')
      this.queryParams = {}
      this.render()
    })
  },
  methods: {
    render(page = this.current, rows = this.pageSize) {
      this.$nextTick(() => {
        this.$refs.jqxLoader.open(200, 50)
      })
      const params = {
        page,
        rows,
        jsonParams: JSON.stringify(this.queryParams),
      }
      getQuotationList(params).then((res) => {
        this.cards = res.rows
        this.total = res.total
        this.$refs.jqxLoader.close()
      })
    },
    initTools: function (type, index, tool, menuToolIninitialization) {
      if (this.toolsIndex < index) {
        const that = this
        switch (index) {
          case 0: {
            const buttonsContainer = document.createElement('div')
            buttonsContainer.style.cssText =
              'overflow: hidden; position: relative;'
            tool[0].appendChild(buttonsContainer)
            if (this.hasAuthority(this, 'quotation:upload')) {
              const uploadButtonContainer = document.createElement('div')
              const uploadButtonID = JQXLite.generateID()
              uploadButtonContainer.id = uploadButtonID
              uploadButtonContainer.style.cssText =
                'float: left; margin-left: 5px;cursor:pointer;'
              buttonsContainer.appendChild(uploadButtonContainer)
              this.uploadButtonInstance = jqwidgets.createInstance(
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
            }

            if (this.hasAuthority(this, 'quotation:delete')) {
              const deleteButtonContainer = document.createElement('div')
              const deleteButtonID = JQXLite.generateID()
              deleteButtonContainer.id = deleteButtonID
              deleteButtonContainer.style.cssText =
                'float: left; margin-left: 5px;cursor:pointer;'
              buttonsContainer.appendChild(deleteButtonContainer)
              this.deleteButtonInstance = jqwidgets.createInstance(
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
            }

            break
          }
          case 1: {
            tool[0].style.float = 'right'
            const buttonsContainer2 = document.createElement('div')
            // 查询条件选择器
            const selectorContainer = document.createElement('div')
            const conditionSelectorID = JQXLite.generateID()
            selectorContainer.id = conditionSelectorID
            selectorContainer.style.cssText = 'float: right; margin-right: 5px;'
            // 查询输入框和点击按钮
            const searchBarContainer = document.createElement('div')
            const searchBarID = JQXLite.generateID()
            searchBarContainer.id = searchBarID
            searchBarContainer.style.cssText =
              'float: right; margin-right: 5px;'

            const searchInputContainer = document.createElement('input')
            const parameterID = JQXLite.generateID()
            searchInputContainer.id = parameterID

            const searchBtn = document.createElement('div')
            const searchButtonID = JQXLite.generateID()
            searchBtn.id = searchButtonID
            searchBtn.style.cssText = 'cursor: pointer;'

            const searchImgContainer = document.createElement('img')
            searchImgContainer.style.cssText = 'width:16px;height:16px'
            searchImgContainer.src = require(`@/assets/iconfont/custom/search_lg.png`)
            searchBtn.appendChild(searchImgContainer)

            searchBarContainer.appendChild(searchInputContainer)
            searchBarContainer.appendChild(searchBtn)
            that.searchButtonInstance = searchBtn

            // 刷新按钮
            const refreshButtonContainer = document.createElement('div')
            const refreshButtonID = JQXLite.generateID()
            refreshButtonContainer.id = refreshButtonID
            refreshButtonContainer.style.cssText =
              'float: right; margin-right: 5px;'

            buttonsContainer2.appendChild(refreshButtonContainer)
            buttonsContainer2.appendChild(searchBarContainer)
            buttonsContainer2.appendChild(selectorContainer)
            tool[0].appendChild(buttonsContainer2)

            /* 创建 */
            this.conditionSelectorInstance = jqwidgets.createInstance(
              `#${conditionSelectorID}`,
              'jqxDropDownList',
              {
                width: 100,
                source: [
                  { label: '', value: '' },
                  { label: '底价名称', value: 'file_name_reserve_price' },
                  { label: '报价名称', value: 'file_name_quote_price' },
                  { label: '报价人', value: 'quoter_name' },
                  { label: '业务员', value: 'salesman_name' },
                ],
                displayMember: 'label',
                valueMember: 'value',
              }
            )

            this.searchInputInstance = jqwidgets.createInstance(
              `#${searchBarID}`,
              'jqxInput',
              {
                placeHolder: '选择查找条件输入参数进行查询',
                height: 25,
                width: 250,
                minLength: 1,
              }
            )

            this.refreshButtonInstance = jqwidgets.createInstance(
              `#${refreshButtonID}`,
              'jqxButton',
              {
                imgSrc: require(`@/assets/iconfont/custom/refresh.svg`),
              }
            )
            break
          }

          default:
            break
        }
        this.toolsIndex = index
      }
    },
    itemClick(itemInfo) {
      const lastSelectedElement = document.getElementById(
        'card' + this.selectCardId
      )
      if (lastSelectedElement) {
        lastSelectedElement.classList.remove('selected')
      }
      this.selectCardId = itemInfo.file_id
      const element = document.getElementById('card' + this.selectCardId)
      element.classList.toggle('selected')
    },
    download(id, type, name) {
      const params = {
        jsonParams: JSON.stringify({
          id,
          type,
        }),
      }
      download(params).then((res) => {
        const a = document.createElement('a')
        a.href = res.url
        a.download = name
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      })
    },
    onChange(page, pageSize) {
      this.render(page, pageSize)
    },
    showSizeChange(current, size) {
      this.pageSize = size
      this.render(current, this.pageSize)
    },
    deleteCard(id) {
      const params = {
        jsonParams: JSON.stringify({
          id,
        }),
      }
      deleteCard(params).then((res) => {
        const lastSelectedElement = document.getElementById(
          'card' + this.selectCardId
        )
        if (lastSelectedElement) {
          lastSelectedElement.classList.remove('selected')
        }
        this.selectCardId = 0
        this.render()
      })
    },
  },
}
</script>

<style scoped>
.ant-layout {
  height: 100%;
}
.ant-layout-header {
  padding: 0px;
  height: auto;
  background: white !important;
}
.panel {
  float: left;
  border-style: none;
}
.a-card-grid {
  width: 99%;
  height: 10%;
  cursor: pointer;
  margin: 4px;
  border-radius: 5px;
}

.item {
  position: relative;
  top: 0px;
}

.img {
  width: 45px;
  height: 45px;
  background-size: contain;
  background-image: url('../../assets/iconfont/custom/xlsx_big.png');
  background-repeat: no-repeat;
  float: left;
  margin-right: 20px;
}

.title {
  color: #333;
  font-weight: 900;
  margin-bottom: 0.5em;
}

.ant-col {
  font-size: 85%;
  color: #888d94;
}

.download-icon {
  width: 20px;
  height: 20px;
  background-image: url('../../assets/iconfont/custom/cloud-download.png');
  background-size: contain;
  background-repeat: no-repeat;
  float: right;
  margin: 1em;
}
.ant-layout-footer {
  height: 40px;
  padding: 0px;
  background-color: #efefef;
  display: flex;
  align-items: center;
}
.ant-pagination {
  margin-left: auto;
}
.selected {
  background: #356aa0;
}
</style>
