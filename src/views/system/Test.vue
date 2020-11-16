<template>
  <div class="base-tab-content-element">
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
          <JqxPanel :width="'50%'" :height="'100%'" class="panel">
            <div style="height:90%">
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
                      名称:{{ itemInfo.file_name_reserve_price }}
                    </div>
                    <a-row type="flex" justify="space-between">
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
          <JqxPanel :width="'50%'" :height="'100%'" class="panel"> yy</JqxPanel>
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
          <template slot="buildOptionText" slot-scope="props">
            <span>{{ props.value }}条/页</span>
          </template>
        </a-pagination>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script>
import JqxToolbar from "jqwidgets-scripts/jqwidgets-vue/vue_jqxtoolbar.vue";
import JqxPanel from "jqwidgets-scripts/jqwidgets-vue/vue_jqxpanel.vue";

import QuotationItem from "@/views/quote/childComps/QuotationItem.vue";

import { Message } from "@/common/const.js";
import { getQuotationList, download } from "@/network/quote.js";
export default {
  components: {
    JqxToolbar,
    JqxPanel,
    QuotationItem,
  },
  created() {
    this.render(this.current, this.pageSize);
  },
  data: function () {
    return {
      tools: "custom | custom",
      queryParams: {},
      cards: [],
      pageSizeOptions: ["5", "10", "20", "30", "40", "50"],
      current: 1,
      pageSize: 10,
      total: 0,
    };
  },
  computed: {
    pageTotal() {
      return this.total / this.pageSize + (this.total % 10);
    },
  },
  methods: {
    initTools: function (type, index, tool, menuToolIninitialization) {
      switch (index) {
        case 0:
          let buttonsContainer = document.createElement("div");
          buttonsContainer.style.cssText =
            "overflow: hidden; position: relative;";

          let uploadButtonContainer = document.createElement("div");
          let deleteButtonContainer = document.createElement("div");
          uploadButtonContainer.id = "uploadBtn";
          deleteButtonContainer.id = "deleteBtn";
          uploadButtonContainer.style.cssText =
            "float: left; margin-left: 5px;";
          deleteButtonContainer.style.cssText =
            "float: left; margin-left: 5px;";
          buttonsContainer.appendChild(uploadButtonContainer);
          buttonsContainer.appendChild(deleteButtonContainer);
          tool[0].appendChild(buttonsContainer);

          let uploadButton = jqwidgets.createInstance(
            "#uploadBtn",
            "jqxButton",
            {
              imgSrc: require(`@/assets/iconfont/custom/upload.svg`),
            }
          );

          jqwidgets.createInstance("#uploadBtn", "jqxTooltip", {
            content: "上传",
            position: "bottom",
          });

          let deleteButton = jqwidgets.createInstance(
            "#deleteBtn",
            "jqxButton",
            {
              imgSrc: require(`@/assets/iconfont/custom/ashbin.svg`),
            }
          );

          jqwidgets.createInstance("#deleteBtn", "jqxTooltip", {
            content: "删除",
            position: "bottom",
          });

          break;
        case 1:
          tool[0].style.float = "right";
          let buttonsContainer2 = document.createElement("div");
          // 查询条件选择器
          let selectorContainer = document.createElement("div");
          selectorContainer.id = "conditionSelector";
          selectorContainer.style.cssText = "float: right; margin-right: 5px;";
          // 查询输入框和点击按钮
          let searchBarContainer = document.createElement("div");
          searchBarContainer.id = "searchBar";
          searchBarContainer.style.cssText = "float: right; margin-right: 5px;";

          let searchInputContainer = document.createElement("input");
          searchInputContainer.id = "parameter";

          let searchBtn = document.createElement("div");
          searchBtn.id = "searchBtn";
          searchBtn.style.cssText = "cursor: pointer;";

          let searchImgContainer = document.createElement("img");
          searchImgContainer.style.cssText = "width:16px;height:16px";
          searchImgContainer.src = require(`../../assets/iconfont/custom/search_lg.png`);
          searchBtn.appendChild(searchImgContainer);

          searchBarContainer.appendChild(searchInputContainer);
          searchBarContainer.appendChild(searchBtn);

          // 刷新按钮
          let refreshButtonContainer = document.createElement("div");
          refreshButtonContainer.id = "refreshBtn";
          refreshButtonContainer.style.cssText =
            "float: right; margin-right: 5px;";

          buttonsContainer2.appendChild(refreshButtonContainer);
          buttonsContainer2.appendChild(searchBarContainer);
          buttonsContainer2.appendChild(selectorContainer);
          tool[0].appendChild(buttonsContainer2);

          /* 创建 */
          let dropDownList = jqwidgets.createInstance(
            "#conditionSelector",
            "jqxDropDownList",
            {
              width: 100,
              source: [
                { label: "", value: "" },
                { label: "底价名称", value: "file_name_reserve_price" },
                { label: "报价名称", value: "file_name_quote_price" },
                { label: "报价人", value: "quoter_name" },
                { label: "业务员", value: "salesman_name" },
              ],
              displayMember: "label",
              valueMember: "value",
            }
          );

          dropDownList.addEventHandler("select", (event) => {
            this.queryParams.param = event.args.item.label;
            this.queryParams.paramsCondition = event.args.item.value;
          });

          let searchInput = jqwidgets.createInstance("#searchBar", "jqxInput", {
            placeHolder: "选择查找条件输入参数进行查询",
            height: 25,
            width: 250,
            minLength: 1,
          });

          let refreshButton = jqwidgets.createInstance(
            "#refreshBtn",
            "jqxButton",
            {
              imgSrc: require(`@/assets/iconfont/custom/refresh.svg`),
            }
          );

          break;
        default:
          break;
      }
    },
    render(page, rows) {
      const params = {
        page,
        rows,
        jsonParams: JSON.stringify(this.queryParams),
      };
      getQuotationList(params).then((res) => {
        this.cards = res.rows;
        this.total = res.total;
      });
    },
    onChange(page, pageSize) {
      this.render(page, pageSize);
    },
    showSizeChange(current, size) {
      this.pageSize = size;
      this.render(current, size);
    },
  },
};
</script>

<style  scoped>
.ant-layout {
  height: calc(100vh - 103px);
}
.ant-layout-header {
  padding: 0px;
  height: auto;
  background: white !important;
}
.ant-col {
  font-size: 85%;
  color: #888d94;
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
</style>