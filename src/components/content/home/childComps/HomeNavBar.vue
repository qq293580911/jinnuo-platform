<template>
  <div>
    <a-menu
      mode="horizontal"
      theme="dark"
      v-model="current"
    >
      <a-menu-item key="mail">
        <a-icon type="mail" />Navigation One
      </a-menu-item>
      <a-sub-menu key="app">
        <span
          class="submenu-title-wrapper"
          slot="title"
        >
          <a-icon type="appstore" />产品中心
        </span>
        <a-menu-item key="appstore:1">
          抗震支架
        </a-menu-item>
        <a-menu-item key="appstore:2">
          3C产品
        </a-menu-item>
        <a-menu-item key="appstore:3">
          其他产品
        </a-menu-item>
        <a-menu-item key="appstore:4">
          在线客服
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu>
        <span
          class="submenu-title-wrapper"
          slot="title"
        >
          <a-icon type="setting" />系统设置
        </span>
      </a-sub-menu>
      <a-menu-item key="more">
        <a
          target="_blank"
          @click="aboutUs"
        >关于金诺</a>
      </a-menu-item>
      <a-dropdown :placement="'bottomRight'">
        <a-avatar
          :src="avatarSrc"
          :style="{
            backgroundColor: color,
            verticalAlign: 'middle',
            cursor: 'pointer'
          }"
          shape="square"
          size="large"
        >{{ avatarValue }}</a-avatar>
        <a-menu slot="overlay">
          <!-- <a-menu-item>更换头像</a-menu-item> -->
          <a-menu-item @click="updatePassword">修改密码</a-menu-item>
          <a-menu-item @click="signOut()">退出登录</a-menu-item>
        </a-menu>
      </a-dropdown>
    </a-menu>

    <update-password-window ref="updatePasswordWindow"></update-password-window>
  </div>
</template>

<script>
import UpdatePasswordWindow from '@/components/content/user/UpdatePasswordWindow.vue'
const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae']
export default {
  components: {
    UpdatePasswordWindow,
  },
  data() {
    return {
      current: [''],
      avatarSrc: 'require("@/assets/avatar/avatar01.svg")',
      avatarValue: 'USER',
      color: colorList[Math.floor(Math.random() * (3 - 0)) + 0],
    }
  },
  computed: {
    getAvatarSrc(item) {
      return `@/assets/avatar/avatar${item}.svg`
    },
  },
  created() {
    const userInfo = JSON.parse(window.sessionStorage.getItem('user'))
    if (userInfo['avatar']) {
      this.avatarSrc = require(`@/assets/avatar/${userInfo['avatar']}.svg`)
    } else if (userInfo['gender'] == '女') {
      this.avatarValue = userInfo['name']
      const number = Math.floor(Math.random() * (40 - 21)) + 21
      this.avatarSrc = require(`@/assets/avatar/avatar${number}.svg`)
    } else {
      this.avatarValue = userInfo['name']
      let number = Math.floor(Math.random() * (20 - 1)) + 1
      if (number < 10) {
        number = `0${number}`
      }
      this.avatarSrc = require(`@/assets/avatar/avatar${number}.svg`)
    }
  },
  methods: {
    aboutUs() {
      window.open('http://www.kingnuo.net/AboutSt_jndljj.html')
    },
    getRamdom(min, max) {
      return Math.floor(Math.random() * (max - min)) + min
    },
    updatePassword() {
      this.$refs.updatePasswordWindow.open('修改密码')
    },
    signOut() {
      window.sessionStorage.removeItem('token')
      this.$router.replace({ path: '/login' })
    },
  },
}
</script>

<style scoped>
.ant-menu-horizontal {
  line-height: 64px;
}
.ant-avatar {
  float: right;
  margin: 12px;
}
</style>
