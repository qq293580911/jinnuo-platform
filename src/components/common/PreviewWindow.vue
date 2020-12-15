<template>
  <div>
    <JqxWindow
      ref="myWindow"
      :width="'90%'"
      :height="'90%'"
      :autoOpen="false"
      :position="{ x: '20%', y: '5%' }"
    >
      <div style="overflow:hidden;">
        <slot name="preview">
          <iframe
            :src="src"
            :width="width"
            :height="width"
            :frameborder="0"
          ></iframe>
        </slot>
      </div>
    </JqxWindow>
  </div>
</template>

<script>
import JqxWindow from "jqwidgets-scripts/jqwidgets-vue/vue_jqxwindow.vue";
export default {
  components: {
    JqxWindow
  },
  props: {
    src: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      width: "99.9%",
      height: "99%",
      frameborder: 0
    };
  },
  methods: {
    open(...params) {
      this.$refs.myWindow.setTitle(params[0]);
      this.$refs.myWindow.open();
    }
  }
};
</script>

<style scoped>
.xxx{
  overflow: hidden;
}
</style>
