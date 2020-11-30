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
import { getSalesman,getQuoter } from "@/network/employee.js"
import { getPricePlan } from "@/network/product.js"
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
  created() {

  },
  mounted() {
    this.getPermissions();
    this.getSlasmans();
    this.getQuoters();
    this.getPricePlans();
  },
  methods: {
    getPermissions() {
      const permissions = this.$store.state.permissions;
      if (permissions == null) {
        this.user = JSON.parse(window.sessionStorage.getItem("user"));
        const params = {
          jsonParams: JSON.stringify({
            userId: this.user.id,
          }),
        };
        getPermissions(params).then((responese) => {
          this.$store.dispatch("savePermissions", responese).then((res) => {});
        });
      }
    },
    getQuoters() {
      const quotors = this.$store.state.quotors;
      if (quotors == null) {
        getQuoter().then((responese) => {
          this.$store.dispatch("saveQuoters", responese).then((res) => {});
        });
      }
    },
    getSlasmans() {
      const salesmans = this.$store.state.salesmans;
      if (salesmans == null) {
        getSalesman().then((responese) => {
          this.$store.dispatch("saveSalesmans", responese).then((res) => {});
        });
      }
    },
    getPricePlans(){
      const pricePlans = this.$store.state.pricePlans;
      if(pricePlans==null){
        getPricePlan().then((responese) => {
          this.$store.dispatch("savePricePlan", responese).then((res) => {});
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