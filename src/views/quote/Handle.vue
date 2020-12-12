<template>
  <div class="base-tab-content-element">
    <top-toolbar ref="topToolbar"></top-toolbar>
    <bottom-toolbar ref="bottomToolbar"></bottom-toolbar>
    <JqxLayout
      ref="myLayout"
      :width="'100%'"
      class="layout"
      :layout="layout"
      :resizable="false"
    >
      <!-- 左 -->
      <div data-container="LeftPanel">
        <div id="todayQuote"></div>
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
        <!-- 外购风机选型 -->
        <div data-container="outsideSelectionPanel">
          <JqxPanel :width="'100%'" :height="'50%'" style="border-style: none">
            <div id="outsideSelectionGridTop"></div>
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
import {
  GENERAL_BLOWER,
  OUTSIDE_BUY,
  VENTILATOR,
  CONTROL_BOX,
  WALL_BLOWER,
  DUCT_BLOWER,
  MUTE_BLOWER,
  SIDE_WALL_BLOWER,
  SIDE_WALL_BLOWER_EP,
} from "@/common/const.js";
export default {
  name: "QuoteHandle",
  components: {
    JqxLayout,
    JqxListBox,
    JqxPanel,
    TopToolbar,
    BottomToolbar,
  },
  beforeCreate() {},
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
                    let instance = new maiGridComponent({
                      store,
                    }).$mount("#mainGrid");
                    that.$refs.mainGrid = instance;
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
                        // that.ribbon = div[0].parentElement.parentElement;
                        let SelectionGridComponent = Vue.extend(SelectionGrid);
                        that.generalBlowerTopInstance = new SelectionGridComponent(
                          {
                            propsData: {
                              selectionType: "常规风机",
                              columnGroupName: "非3C",
                            },
                          }
                        ).$mount("#blowerSelectionGridTop");
                        that.generalBlowerBottomInstance = new SelectionGridComponent(
                          {
                            propsData: {
                              selectionType: "常规风机",
                              columnGroupName: "3C",
                            },
                          }
                        ).$mount("#blowerSelectionGridBottom");

                        that.generalBlowerTopInstance.$on("rowselect", () => {
                          that.generalBlowerBottomInstance.clearselection();
                        });

                        that.generalBlowerBottomInstance.$on(
                          "rowselect",
                          () => {
                            that.generalBlowerTopInstance.clearselection();
                          }
                        );
                      },
                    },
                    {
                      type: "layoutPanel",
                      title: "外购风机",
                      contentContainer: "outsideSelectionPanel",
                      initContent: function (div, a, b, c) {
                        let SelectionGridComponent = Vue.extend(SelectionGrid);
                        that.outsideBuyBlowerInstance = new SelectionGridComponent(
                          {
                            propsData: {
                              selectionType: "外购风机",
                              columnGroupName: "非3C",
                            },
                          }
                        ).$mount("#outsideSelectionGridTop");
                      },
                    },
                    {
                      type: "layoutPanel",
                      title: "控制箱",
                      contentContainer: "controlBoxSelectionPanel",
                      initContent: function () {
                        let SelectionGridComponent = Vue.extend(SelectionGrid);
                        that.controlBoxTopInstance = new SelectionGridComponent(
                          {
                            propsData: {
                              selectionType: "控制箱",
                              columnGroupName: "非3C",
                            },
                          }
                        ).$mount("#controlBoxSelectionGridTop");
                        that.controlBoxBottomInstance = new SelectionGridComponent(
                          {
                            propsData: {
                              selectionType: "控制箱",
                              columnGroupName: "3C",
                            },
                          }
                        ).$mount("#controlBoxSelectionGridBottom");

                        that.controlBoxTopInstance.$on("rowselect", () => {
                          that.controlBoxBottomInstance.clearselection();
                        });

                        that.controlBoxBottomInstance.$on("rowselect", () => {
                          that.controlBoxTopInstance.clearselection();
                        });
                      },
                    },
                    {
                      type: "layoutPanel",
                      title: "换气扇",
                      contentContainer: "ventilatorSelectionPanel",
                      initContent: function () {
                        let SelectionGridComponent = Vue.extend(SelectionGrid);
                        that.ventilatorInstance = new SelectionGridComponent({
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
                        that.wallBlowerInsatnce = new SelectionGridComponent({
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
                        that.ductBlowerInsatnce = new SelectionGridComponent({
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
                        that.muteBlowerInstance = new SelectionGridComponent({
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
                        that.sideWallBlowerInsatnce = new SelectionGridComponent(
                          {
                            propsData: {
                              columnGroupName: "非3C",
                            },
                          }
                        ).$mount("#sideWallSelectionGridTop");
                      },
                    },
                    {
                      type: "layoutPanel",
                      title: "边墙风机（防爆）",
                      contentContainer: "sideWallEPSelectionPanel",
                      initContent: function () {
                        let SelectionGridComponent = Vue.extend(SelectionGrid);
                        that.sideWallBlowerEPInstance = new SelectionGridComponent(
                          {
                            propsData: {
                              columnGroupName: "非3C",
                            },
                          }
                        ).$mount("#sideWallEPSelectionGridTop");
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
  beforeCreate() {},
  created() {},
  mounted() {
    const that = this;
    // 今日报价
    this.todayQuoteInstance = jqwidgets.createInstance(
      "#todayQuote",
      "jqxListBox",
      {
        source: this.$store.state.todayQuote,
        width: 148,
        height: (function () {
          return document.body.clientHeight - 208;
        })(),
        allowDrop: true,
        allowDrag: true,
        displayMember: "name",
        valueMember: "content",
      }
    );

    // 刷新今日报价
    this.$bus.$off("refreshTodayQuote").$on("refreshTodayQuote", () => {
      this.todayQuoteInstance.source = this.$store.state.todayQuote;
      this.todayQuoteInstance.refresh();
    });
    // 今日报价绑定选择事件
    this.todayQuoteInstance.addEventHandler("dragEnd", (event) => {
      this.$confirm({
        title: `记录移除`,
        okText: "确认",
        cancelText: "取消",
        centered: true,
        content: (h) => (
          <div style="color:red;">确认要移除这个报价记录吗？</div>
        ),
        onOk() {
          const index = event.args.index;
          that.$store.dispatch("removeTodayQuote", index);
          that.todayQuoteInstance.removeAt(index);
        },
        onCancel() {},
        class: "test",
      });
    });

    // 渲染选型网格
    this.$bus
      .$off("renderSelectionList")
      .$on("renderSelectionList", (...params) => {
        const selectionType = params[0]["selectionType"];
        const list = params[1];
        const certificate = params[0]["certificate"];
        switch (selectionType) {
          case GENERAL_BLOWER:
            that.generalBlowerTopInstance.source.localdata = list;
            that.generalBlowerBottomInstance.source.localdata = list;
            that.generalBlowerTopInstance.refresh();
            that.generalBlowerBottomInstance.refresh();
            if (certificate) {
              that.generalBlowerBottomInstance.selectrow(0);
            } else {
              that.generalBlowerTopInstance.selectrow(0);
            }
            break;
          case OUTSIDE_BUY:
            that.outsideBuyBlowerInstance.source.localdata = list;
            that.outsideBuyBlowerInstance.refresh();
            that.outsideBuyBlowerInstance.selectrow(0);
            break;
          case VENTILATOR:
            that.ventilatorInstance.source.localdata = list;
            that.ventilatorInstance.refresh();
            that.ventilatorInstance.selectrow(0);
            break;
          case CONTROL_BOX:
            that.controlBoxTopInstance.source.localdata = list;
            that.controlBoxBottomInstance.source.localdata = list;
            that.controlBoxTopInstance.refresh();
            that.controlBoxBottomInstance.refresh();
            if (certificate) {
              that.controlBoxBottomInstance.selectrow(0);
            } else {
              that.controlBoxTopInstance.selectrow(0);
            }
            break;
          case WALL_BLOWER:
            that.wallBlowerInsatnce.source.localdata = list;
            that.wallBlowerInsatnce.refresh();
            that.wallBlowerInsatnce.selectrow(0);
            break;
          case DUCT_BLOWER:
            that.ductBlowerInsatnce.source.localdata = list;
            that.ductBlowerInsatnce.refresh();
            that.ductBlowerInsatnce.selectrow(0);
            break;
          case MUTE_BLOWER:
            that.muteBlowerInstance.source.localdata = list;
            that.muteBlowerInstance.refresh();
            that.muteBlowerInstance.selectrow(0);
            break;
          case SIDE_WALL_BLOWER:
            that.sideWallBlowerInsatnce.source.localdata = list;
            that.sideWallBlowerInsatnce.refresh();
            that.sideWallBlowerInsatnce.selectrow(0);
            break;
          case SIDE_WALL_BLOWER_EP:
            that.sideWallBlowerEPInstance.source.localdata = list;
            that.sideWallBlowerEPInstance.refresh();
            that.sideWallBlowerEPInstance.selectrow(0);
            break;
          default:
            break;
        }
      });

    // 卡片集
    this.$bus.$off("selectRibbon").$on("selectRibbon", (val) => {
      console.log($('.jqx-ribbon'))
      let ribbonIndex = 0;
      switch (val) {
        case GENERAL_BLOWER:
          ribbonIndex = 0;
          break;
        case OUTSIDE_BUY:
          ribbonIndex = 1;
          break;
        case CONTROL_BOX:
          ribbonIndex = 2;
          break;
        case VENTILATOR:
          ribbonIndex = 3;
          break;
        case WALL_BLOWER:
          ribbonIndex = 4;
          break;
        case DUCT_BLOWER:
          ribbonIndex = 5;
          break;
        case MUTE_BLOWER:
          ribbonIndex = 6;
          break;
        case SIDE_WALL_BLOWER:
          ribbonIndex = 7;
          break;
        case SIDE_WALL_BLOWER_EP:
          ribbonIndex = 8;
          break;
        default:
          break;
      }
      const selector = document.getElementsByClassName('jqx-ribbon')[2];
      $(selector).jqxRibbon("selectAt", ribbonIndex);
    });
  },
  methods: {
    selectRibbon(val) {
      const that = this;
      let ribbonIndex = 0;
      switch (val) {
        case GENERAL_BLOWER:
          ribbonIndex = 0;
          break;
        case OUTSIDE_BUY:
          ribbonIndex = 1;
          break;
        case CONTROL_BOX:
          ribbonIndex = 2;
          break;
        case VENTILATOR:
          ribbonIndex = 3;
          break;
        case WALL_BLOWER:
          ribbonIndex = 4;
          break;
        case DUCT_BLOWER:
          ribbonIndex = 5;
          break;
        case MUTE_BLOWER:
          ribbonIndex = 6;
          break;
        case SIDE_WALL_BLOWER:
          ribbonIndex = 7;
          break;
        case SIDE_WALL_BLOWER_EP:
          ribbonIndex = 8;
          break;
        default:
          break;
      }
      const selector = document.getElementsByClassName('jqx-ribbon')[2];
      $(selector).jqxRibbon("selectAt", ribbonIndex);
    },
  },
  beforeDestroy() {
    
  },
  destroyed() {
    this.$refs.mainGrid.$destroy();
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
  overflow: inherit;
}
</style>