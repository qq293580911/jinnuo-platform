<template>
  <div :style="contentStyle">
    <div class="top"><slot name="top"></slot></div>
    <div class="bottom">
      <div class="left"><slot name="bottomLeft"></slot></div>
      <div class="center"><slot name="bottomCenter"></slot></div>
      <div class="right"><slot name="bottomRight"></slot></div>
    </div>
  </div>
</template>

<script>
export default {
  computed:{
    contentStyle(){
      return {
        width:'100%',
        height:'calc(100vh - 202px)'
      }
    }
  }
};
</script>
<style scoped>
.content {
  width: 100%;
  height:95%;
  /* background-color: green; */
  /* display: flex; */
}
.top {
  width: 100%;
  height: calc(45%);
  /* background-color: yellow; */
  float: left;
  /* flex: 1; */
}
.bottom {
  width: 100%;
  height: calc(54%);
  /* background-color: green; */
  float: left;
  display: flex;
}
.bottom .left {
  width: calc(33%);
  height: calc(100%);
  /* background-color: red; */
  float: left;
  margin: 0 auto;
}
.bottom .center {
  width: calc(33%);
  height: calc(100%);
  background-color: white;
  float: left;
  margin: 0 auto;
}
.bottom .right {
  width: calc(33%);
  height: calc(100%);
  /* background-color: blue; */
  float: left;
  margin: 0 auto;
  flex: 1;
}
</style>
