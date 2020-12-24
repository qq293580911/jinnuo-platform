<template>
  <div style="width:100%;height:300px">
    <set-customer-window
      ref="setCustomerWindow"
    ></set-customer-window>
  </div>
</template>

<script>
import SetCustomerWindow from '@/views/contract/childComps/SetCustomerWindow.vue'
export default {
  components: {
    SetCustomerWindow,
  },
  created() {

  },
  mounted() {
    this.$refs.setCustomerWindow.open()
  },
  data() {
    return {}
  },
  methods: {},
}
</script>

<style scoped>
</style>
