<template>
  <div class="base-tab-content-element">
    <top-toolbar ref="topToolbar"></top-toolbar>
    <bottom-toolbar ref="bottomToolbar"></bottom-toolbar>
    <JqxLayout :width="'100%'" class="layout" :layout="layout">
      <!-- 左 -->
      <div data-container="LeftPanel">
        <div id="todayQuote" style="height:600px"></div>
      </div>
      <!-- 中 -->
      <div data-container="CenterPanel">
        <div id="mainGrid"></div>
      </div>
      <!-- 右 -->
      <div data-container="RightPanel">
        <!-- 风机选型 -->
        <div data-container="machineSelectionPanel">
          <JqxPanel :width="'100%'" :height="'50%'" style="border-style: none">
            <div id="blowerSelectionGridTop"></div>
          </JqxPanel>
          <JqxPanel :width="'100%'" :height="'50%'" style="border-style: none">
            <div id="blowerSelectionGridBottom"></div>
          </JqxPanel>
        </div>
        <!-- 控制箱选型 -->
        <div data-container="controlBoxSelectionPanel">
          <JqxPanel :width="'100%'" :height="'50%'" style="border-style: none">
            <div id="controlBoxSelectionGridTop"></div>
          </JqxPanel>
          <JqxPanel :width="'100%'" :height="'50%'" style="border-style: none">
            <div id="controlBoxSelectionGridBottom"></div>
          </JqxPanel>
        </div>
        <!-- 换气扇选型 -->
        <div data-container="ventilatorSelectionPanel">
          <JqxPanel :width="'100%'" :height="'50%'" style="border-style: none">
            <div id="ventilatorSelectionGridTop"></div>
          </JqxPanel>
        </div>
        <!-- 方形壁式风机选型 -->
        <div data-container="wallSelectionPanel">
          <JqxPanel :width="'100%'" :height="'50%'" style="border-style: none">
            <div id="wallSelectionGridTop"></div>
          </JqxPanel>
        </div>
        <!-- GDF管道离心风机选型 -->
        <div data-container="ductSelectionPanel">
          <JqxPanel :width="'100%'" :height="'50%'" style="border-style: none">
            <div id="ductSelectionGridTop"></div>
          </JqxPanel>
        </div>
        <!-- 超静音送风机选型 -->
        <div data-container="muteSelectionPanel">
          <JqxPanel :width="'100%'" :height="'50%'" style="border-style: none">
            <div id="muteSelectionGridTop"></div>
          </JqxPanel>
        </div>
        <!-- 边墙风机选型 -->
        <div data-container="sideWallSelectionPanel">
          <JqxPanel :width="'100%'" :height="'50%'" style="border-style: none">
            <div id="sideWallSelectionGridTop"></div>
          </JqxPanel>
        </div>
        <!-- 边墙（防爆）风机选型 -->
        <div data-container="sideWallEPSelectionPanel">
          <JqxPanel :width="'100%'" :height="'50%'" style="border-style: none">
            <div id="sideWallEPSelectionGridTop"></div>
          </JqxPanel>
        </div>
      </div>
    </JqxLayout>
  </div>
</template>

<script>
import Vue from "vue";
import store from "@/store";
import JqxLayout from "jqwidgets-scripts/jqwidgets-vue/vue_jqxlayout.vue";
import JqxListBox from "jqwidgets-scripts/jqwidgets-vue/vue_jqxlistbox.vue";
import JqxPanel from "jqwidgets-scripts/jqwidgets-vue/vue_jqxpanel.vue";
import TopToolbar from "./childComps/HandlerTopToolbar";
import BottomToolbar from "./childComps/HandlerBottomToolbar";
import MainGrid from "./childComps/HandleMainGrid";
import SelectionGrid from "./childComps/SelectionGrid";

import { debounce } from "@/common/util.js";
export default {
  name: "QuoteHandle",
  components: {
    JqxLayout,
    JqxListBox,
    JqxPanel,
    TopToolbar,
    BottomToolbar,
  },
  data() {
    const that = this;
    return {
      ribbon: null,
      // 布局
      layout: [
        {
          type: "layoutGroup",
          orientation: "horizontal",
          height: "100%",
          items: [
            {
              type: "autoHideGroup",
              alignment: "left",
              width: "5%",
              unpinnedWidth: "10%",
              items: [
                {
                  type: "layoutPanel",
                  title: "今日报价",
                  contentContainer: "LeftPanel",
                },
              ],
            },
            {
              type: "documentGroup",
              width: "75%",
              items: [
                {
                  type: "documentPanel",
                  title: "当前模板",
                  contentContainer: "CenterPanel",
                  initContent: function () {
                    let maiGridComponent = Vue.extend(MainGrid);
                    new maiGridComponent({
                      store,
                    }).$mount("#mainGrid");
                  },
                },
              ],
            },
            {
              type: "layoutGroup",
              orientation: "vertical",
              width: "20%",
              items: [
                {
                  type: "tabbedGroup",
                  height: "100%",
                  items: [
                    {
                      type: "layoutPanel",
                      title: "常规风机",
                      contentContainer: "machineSelectionPanel",
                      initContent: function (div, a, b, c) {
                        that.ribbon = div[0].parentElement.parentElement;
                        let SelectionGridComponent = Vue.extend(SelectionGrid);
                        new SelectionGridComponent({
                          propsData: {
                            selectionType: "常规风机",
                            columnGroupName: "非3C",
                          },
                        }).$mount("#blowerSelectionGridTop");
                        new SelectionGridComponent({
                          propsData: {
                            selectionType: "常规风机",
                            columnGroupName: "3C",
                          },
                        }).$mount("#blowerSelectionGridBottom");
                      },
                    },
                    {
                      type: "layoutPanel",
                      title: "控制箱",
                      contentContainer: "controlBoxSelectionPanel",
                      initContent: function () {
                        let SelectionGridComponent = Vue.extend(SelectionGrid);
                        new SelectionGridComponent({
                          propsData: {
                            selectionType: "控制箱",
                            columnGroupName: "非3C",
                          },
                        }).$mount("#controlBoxSelectionGridTop");
                        new SelectionGridComponent({
                          propsData: {
                            selectionType: "控制箱",
                            columnGroupName: "3C",
                          },
                        }).$mount("#controlBoxSelectionGridBottom");
                      },
                    },
                    {
                      type: "layoutPanel",
                      title: "换气扇",
                      contentContainer: "ventilatorSelectionPanel",
                      initContent: function () {
                        let SelectionGridComponent = Vue.extend(SelectionGrid);
                        new SelectionGridComponent({
                          propsData: {
                            selectionType: "换气扇",
                            columnGroupName: "非3C",
                          },
                        }).$mount("#ventilatorSelectionGridTop");
                      },
                    },
                    {
                      type: "layoutPanel",
                      title: "方形壁式风机",
                      contentContainer: "wallSelectionPanel",
                      initContent: function () {
                        let SelectionGridComponent = Vue.extend(SelectionGrid);
                        new SelectionGridComponent({
                          propsData: {
                            selectionType: "方形壁式风机",
                            columnGroupName: "非3C",
                          },
                        }).$mount("#wallSelectionGridTop");
                      },
                    },
                    {
                      type: "layoutPanel",
                      title: "GDF",
                      contentContainer: "ductSelectionPanel",
                      initContent: function () {
                        let SelectionGridComponent = Vue.extend(SelectionGrid);
                        new SelectionGridComponent({
                          propsData: {
                            columnGroupName: "非3C",
                          },
                        }).$mount("#ductSelectionGridTop");
                      },
                    },
                    {
                      type: "layoutPanel",
                      title: "超静音送风机",
                      contentContainer: "muteSelectionPanel",
                      initContent: function () {
                        let SelectionGridComponent = Vue.extend(SelectionGrid);
                        new SelectionGridComponent({
                          propsData: {
                            columnGroupName: "非3C",
                          },
                        }).$mount("#muteSelectionGridTop");
                      },
                    },
                    {
                      type: "layoutPanel",
                      title: "边墙风机",
                      contentContainer: "sideWallSelectionPanel",
                      initContent: function () {
                        let SelectionGridComponent = Vue.extend(SelectionGrid);
                        new SelectionGridComponent({
                          propsData: {
                            columnGroupName: "非3C",
                          },
                        }).$mount("#sideWallSelectionGridTop");
                      },
                    },
                    {
                      type: "layoutPanel",
                      title: "边墙风机（防爆）",
                      contentContainer: "sideWallEPSelectionPanel",
                      initContent: function () {
                        let SelectionGridComponent = Vue.extend(SelectionGrid);
                        new SelectionGridComponent({
                          propsData: {
                            columnGroupName: "非3C",
                          },
                        }).$mount("#sideWallEPSelectionGridTop");
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
  },
  created() {},
  mounted() {
    this.todayQuoteInstance = jqwidgets.createInstance(
      "#todayQuote",
      "jqxListBox",
      {
        source: this.$store.state.todayQuote,
        width: 150,
        height: (function(){
          return document.body.clientHeight - 210
        }()),
        displayMember: "name",
        valueMember: "content",
      }
    );

    // 刷新今日报价
    this.$bus.$on("refreshTodayQuote", () => {
      this.todayQuoteInstance.source = this.$store.state.todayQuote;
      this.todayQuoteInstance.refresh();
    });
    // 今日报价绑定选择事件
    this.todayQuoteInstance.addEventHandler('select',(event)=>{
      console.log(event)
    })
  },
  methods: {
    selectRibbon(val) {
      const that = this;
      let ribbonIndex = 0;
      switch (val) {
        case "常规风机":
          ribbonIndex = 0;
          break;
        case "控制箱":
          ribbonIndex = 1;
          break;
        case "换气扇":
          ribbonIndex = 2;
          break;
        case "方形壁式风机":
          ribbonIndex = 3;
          break;
        case "GDF管道离心风机":
          ribbonIndex = 4;
          break;
        case "超静音送风机":
          ribbonIndex = 5;
          break;
        case "边墙风机":
          ribbonIndex = 6;
          break;
        case "边墙风机（防爆）":
          ribbonIndex = 7;
          break;
        default:
          break;
      }
      $(that.ribbon).jqxRibbon("selectAt", ribbonIndex);
    },
  },
};
</script>

<style scoped>
.layout {
  height: calc(100vh - 170px);
}
::v-deep .jqx-widget-content {
  overflow: unset;
}
::v-deep .jqx-layout-group-auto-hide-content-vertical,
.jqx-layout-group-auto-hide-content-horizontal {
  overflow: hidden;
}
</style>