<template>
  <div class="base-tab-content-element">
    <top-toolbar ref="topToolbar"></top-toolbar>
    <bottom-toolbar ref="bottomToolbar"></bottom-toolbar>
    <JqxLayout :width="'100%'" class="layout" :layout="layout">
      <!-- 左 -->
      <div data-container="LeftPanel">左</div>
      <!-- 中 -->
      <div data-container="CenterPanel" class="jqx-grid-content-custom">
        <div id="mainGrid"></div>
      </div>
      <!-- 右 -->
      <div data-container="RightPanel">
        <!-- 风机选型 -->
        <div data-container="machineSelectionPanel">
          <JqxPanel :width="'100%'" :height="'50%'" style="border-style: none">
            <!-- <selection-grid key="machineTop"></selection-grid> -->
          </JqxPanel>
          <JqxPanel :width="'100%'" :height="'50%'" style="border-style: none">
            <!-- <selection-grid key="machineBottom"></selection-grid> -->
          </JqxPanel>
        </div>
        <!-- 控制箱选型 -->
        <div data-container="controlBoxSelectionPanel">
          <JqxPanel :width="'100%'" :height="'50%'" style="border-style: none">
            <!-- <selection-grid key="controlBoxTop"></selection-grid> -->
          </JqxPanel>
          <JqxPanel :width="'100%'" :height="'50%'" style="border-style: none">
            <!-- <selection-grid key="controlBoxBottom"></selection-grid> -->
          </JqxPanel>
        </div>
      </div>
    </JqxLayout>
  </div>
</template>

<script>
import Vue from "vue";

import JqxLayout from "jqwidgets-scripts/jqwidgets-vue/vue_jqxlayout.vue";
import JqxPanel from "jqwidgets-scripts/jqwidgets-vue/vue_jqxpanel.vue";
import TopToolbar from "./childComps/HandlerTopToolbar"
import BottomToolbar from "./childComps/HandlerBottomToolbar"
import MainGrid from "./childComps/HandleMainGrid";
import SelectionGrid from "./childComps/SelectionGrid";

import { debounce } from "@/common/util.js";
export default {
  name: "QuoteHandle",
  components: {
    JqxLayout,
    JqxPanel,
    TopToolbar,
    BottomToolbar
  },
  data: () => {
    const that = this;
    return {
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
                  title: "历史报价",
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
                    let maiGridInstance = new maiGridComponent({
                      // propsData: {
                      //   width: 190,
                      //   height: 25,
                      //   type: "jqxInput",
                      //   showUploadButton: true,
                      // },
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
                      title: "风机选型",
                      contentContainer: "machineSelectionPanel",
                      initContent: function () {
                        // let TopComponent = Vue.extend(MachineSelectionGridTop);
                        // new TopComponent({}).$mount("#machineSelectionGridTop");

                        // let BottomComponent = Vue.extend(
                        //   MachineSelectionGridBottom
                        // );
                        // new BottomComponent({}).$mount(
                        //   "#machineSelectionGridBottom"
                        // );
                      },
                    },
                    {
                      type: "layoutPanel",
                      title: "控制箱选型",
                      contentContainer: "controlBoxSelectionPanel",
                      initContent: function () {

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
  mounted() {},
  methods: {

  },
};
</script>

<style scoped>
.layout {
  height: calc(100vh - 170px);
}
::v-deep .jqx-widget-content{
  overflow: hidden;
}
</style>