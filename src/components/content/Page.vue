<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import ProductManagement from 'views/product/management'
export default {
  name: 'Page',
  components: {
    ProductManagement
  }
}
</script>

<style scoped>

</style>
