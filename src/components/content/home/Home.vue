<template>
  <a-layout>
    <!-- 上部导航 -->
    <a-layout-header>
      <home-nav-bar></home-nav-bar>
    </a-layout-header>

    <a-layout id="components-layout-demo-custom-trigger" class="content">
      <!-- 左侧菜单 -->
      <a-layout-sider v-model="collapsed" collapsible>
        <div class="sider-header">
          <div class="logo"></div>
        </div>
        <home-aside></home-aside>
      </a-layout-sider>

      <a-layout>
        <!-- 右侧控制栏 -->
        <!-- <a-layout-header
          style="background: #fff; padding: 0; height: 40px; display: flex"
        <a-icon
            class="trigger"
            :type="collapsed ? 'menu-unfold' : 'menu-fold'"
            @click="() => (collapsed = !collapsed)"
          /> 
        </a-layout-header> -->
        <!-- 右侧主面板 -->
        <a-layout-content>
          <home-main />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script>
import HomeNavBar from "./childComps/HomeNavBar";
import HomeAside from "./childComps/HomeAside";
import HomeMain from "./childComps/HomeMain";
import { getPermissions } from "@/network/home.js";
import { getSalesman, getQuoter } from "@/network/employee.js";
import { getPricePlan,getCategory, getAssignType,getFormula } from "@/network/product.js";
import { getSplitPlan } from "@/network/quote.js";
jqx.theme = "ui-smoothness";
export default {
  name: "Home",
  components: {
    HomeNavBar,
    HomeAside,
    HomeMain,
  },
  data() {
    return {
      collapsed: false,
    };
  },
  created() {},
  mounted() {
    const that = this;
    // 全局监听，页面刷新的时候将store里state的值存到sessionStorage中，然后从sessionStorage中获取，再赋值给store。
    // 然后再把session里面存的删除即可，相当于中间件的作用。
    // 在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem("store")) {
      this.$store.replaceState(
        Object.assign(
          {},
          this.$store.state,
          JSON.parse(sessionStorage.getItem("store"))
        )
      );
      sessionStorage.removeItem("store");
    }

    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.onbeforeunload = function (e) {
      // TODO
      sessionStorage.setItem("store", JSON.stringify(that.$store.state));
    };

    this.getPermissions();
    this.getSlasmans();
    this.getQuoters();
    this.getProductTypes();
    this.getAssignTypes();
    this.getPricePlans();
    this.getSplitPlans();
    this.getFormulas();
  },
  methods: {
    getPermissions() {
      const permissions = this.$store.state.permissions;
      if (Array.isArray(permissions) == false) {
        this.user = JSON.parse(window.sessionStorage.getItem("user"));
        const params = {
          jsonParams: JSON.stringify({
            userId: this.user.id,
          }),
        };
        getPermissions(params).then((responese) => {
          this.$store.dispatch("savePermissions", responese);
        });
      }
    },
    getQuoters() {
      const quoters = this.$store.state.quoters;
      if (Array.isArray(quoters) == false) {
        getQuoter().then((responese) => {
          this.$store.dispatch("saveQuoters", responese);
        });
      }
    },
    getSlasmans() {
      const salesmans = this.$store.state.salesmans;
      if (Array.isArray(salesmans) == false) {
        getSalesman().then((responese) => {
          this.$store.dispatch("saveSalesmans", responese);
        });
      }
    },
    getProductTypes() {
      const that = this
      const productTypes = this.$store.state.productType;
      if (Array.isArray(productTypes) == false) {
        const source = {
          datatype: "json",
          datafields: [
            { name: "id", map: "pc_id", type: "number" },
            { name: "parentid", map: "pc_pid", type: "number" },
            { name: "text", map: "pc_name", type: "string" },
            { name: "value", map: "pc_id", type: "string" },
          ],
          id: "id",
          type: "json",
          url: "/productCateg/getProductCategoryData.do",
        };
        const dataAdapter = new jqx.dataAdapter(source, {
          loadServerData(serverdata, source, callback) {
            getCategory(source.url, source, serverdata).then((res) => {
              callback({
                records: res.records,
              });
            });
          },
          loadComplete(records) {
            that.$store.state.productType = records;
          },
        });
        dataAdapter.dataBind();
      }
    },
    getAssignTypes() {
      const that = this;
      const assignTypes = this.$store.state.assignType;
      if (Array.isArray(assignTypes) == false) {
        const source = {
          datatype: "json",
          datafields: [
            { name: "id", map: "at_id", type: "number" },
            { name: "parentid", map: "at_pid", type: "number" },
            { name: "text", map: "at_name", type: "string" },
            { name: "value", map: "at_id", type: "string" },
          ],
          id: "id",
          type: "json",
          url: "/productCateg/getAssignTypeData.do",
        };
        const dataAdapter = new jqx.dataAdapter(source, {
          loadServerData(serverdata, source, callback) {
            getAssignType(source.url, source, serverdata).then((res) => {
              callback({
                records: res.records,
              });
            });
          },
          loadComplete(records) {
            that.$store.state.assignType = records;
          },
        });
        dataAdapter.dataBind();
      }
    },
    getPricePlans() {
      const pricePlans = this.$store.state.pricePlan;
      if (Array.isArray(pricePlans) == false) {
        getPricePlan().then((responese) => {
          if (Array.isArray(responese)) {
            this.$store.dispatch("savePricePlan", responese);
          }
        });
      }
    },
    getSplitPlans() {
      const splitPlans = this.$store.state.splitPlan;
      if (Array.isArray(splitPlans) == false) {
        getSplitPlan().then((responese) => {
          if (Array.isArray(responese)) {
            this.$store.dispatch("saveSplitPlan", responese);
          }
        });
      }
    },
    getFormulas(){
      const formulas = this.$store.state.formula;
      if (Array.isArray(formulas) == false) {
        getFormula().then((responese) => {
          if (Array.isArray(responese)) {
            this.$store.dispatch("saveFormula", responese);
          }
        });
      }
    }
  },
};
</script>

<style scoped>
.content {
  height: calc(100vh - 64px);
}
.sider-header {
  height: 32px;
  display: flex;
  align-items: center;
}

#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  padding: 0px;
  cursor: pointer;
  color: white;
  margin-right: 10px;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  width: 100%;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
  border-radius: 5px;
}
</style>