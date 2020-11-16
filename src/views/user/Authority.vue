<template>
  <div class="base-tab-content-element">
    <role ref="roleGrid"></role>
  </div>
</template>

<script>
import Role from 'views/user/Role'
export default {
  components:{
    Role
  }
}
</script>

<style scoped>
.base-tab-content-element {
  height: calc(100vh - 105px);
}
</style>