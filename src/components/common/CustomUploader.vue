<template>
  <div
    :style="{
      width: getWidth,
      height: getHeight,
    }"
    class="wrapper"
  >
    <input type="text" :id="textId" />
    <input
      type="file"
      :id="fileId"
      multiple
      class="file"
      :style="{
        width: getWidth,
        height: getHeight,
      }"
    />
    <div style="margin-left: 5px" v-if="showUploadButton">
      <JqxTooltip :position="'mouse'" :content="'上传'">
        <JqxButton
          style="cursor: pointer"
          v-if="type == 'jqxInput'"
          :imgSrc="require('@/assets/iconfont/custom/upload.svg')"
          @click="open"
        ></JqxButton>
        <input
          v-else
          type="button"
          class="button"
          @click="open"
          :style="{
            height: getHeight,
          }"
          value="浏览"
        />
      </JqxTooltip>
    </div>
  </div>
</template>

<script>
import JqxTooltip from "jqwidgets-scripts/jqwidgets-vue/vue_jqxtooltip.vue";
import JqxButton from "jqwidgets-scripts/jqwidgets-vue/vue_jqxbuttons.vue";

import LAY_EXCEL from "lay-excel";
export default {
  name: "CustomUploder",
  components: {
    JqxTooltip,
    JqxButton,
  },
  data() {
    return {
      inputValue: "",
      fileCotent: [],
    };
  },
  props: {
    type: {
      type: String,
      default: "",
    },
    width: {
      type: Number,
      default: 0,
    },
    height: {
      type: Number,
      default: 0,
    },
    showUploadButton: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    this.textId = "textInput" + JQXLite.generateID();
    this.fileId = "file" + JQXLite.generateID();
  },
  computed: {
    getWidth() {
      return this.width + "px";
    },
    getHeight() {
      return this.height + "px";
    },
  },
  mounted() {
    const that = this;
    // 创建自定义风格input
    switch (this.type) {
      case "jqxInput":
        const input = document.getElementById(that.textId);
        let jqxInput = jqwidgets.createInstance(input, "jqxInput", {
          width: this.width,
          height: this.height,
        });
        break;
    }

    // file绑定change事件
    const file = document.getElementById(that.fileId);
    file.addEventListener("change", function (event) {
      let fileName = event.target.value;
      fileName = fileName.substring(
        fileName.lastIndexOf("\\") + 1,
        fileName.length
      );
      // 文件名称
      const input = document.getElementById(that.textId);
      input.value = fileName;
      that.inputValue = fileName;
      // 文件内容
      const files = event.target.files;
      LAY_EXCEL.importExcel(
        files,
        {
          fields: {
            serialNumber: "A",
            productName: "B",
            specModel: "C",
            unit: "D",
            quantity: "E",
            unitPrice: "F",
            totalPrice: "G",
            remark: "H",
            selection: "I",
            transfer: "J",
            formula: "K",
            designateType: "L",
          },
        },
        function (data, book) {
          console.log(data);
        }
      );

      // this.value = null;
    });
  },
  methods: {
    open() {
      const file = document.getElementById(this.fileId);
      file.click();
    },
  },
};
</script>

<style scoped>
.wrapper {
  position: relative;
  display: flex;
  justify-content: center;
}
.file {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  cursor: pointer;
}
.button {
  width: 40px;
  font-size: 10px;
}
</style>