<template>
  <div class="wrapper">
    <div class="left"><slot name="left">左</slot></div>
    <div class="center"><slot name="center">中</slot></div>
    <div class="right"><slot name="right">右</slot></div>
  </div>
</template>

<script>
export default {
  name: "QuotationItem"
};
</script>

<style scoped>
.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}
.left {
  width: 10%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.center {
  flex: 1;
  display: flex;
  justify-content: left;
  align-items: center;
}
.right {
  width: 10%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
