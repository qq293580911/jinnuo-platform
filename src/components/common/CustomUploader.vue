<template>
  <div
    :style="{
      width: getWidth,
      height: getHeight,
    }"
    class="wrapper"
  >
    <input :id="textId" type="text" />
    <input
      :id="fileId"
      :style="{
        width: getWidth,
        height: getHeight,
      }"
      @change="changed($event)"
      class="file"
      multiple
      type="file"
    />
    <div style="margin-left: 5px" v-if="showUploadButton">
      <JqxTooltip :content="'上传'" :position="'mouse'">
        <JqxButton
          :imgSrc="require('@/assets/iconfont/custom/upload.svg')"
          @click="open"
          style="cursor: pointer"
          v-if="type == 'jqxInput'"
        ></JqxButton>
        <input
          :style="{
            height: getHeight,
          }"
          @click="open"
          class="button"
          type="button"
          v-else
          value="浏览"
        />
      </JqxTooltip>
    </div>
  </div>
</template>

<script>
import JqxTooltip from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxtooltip.vue'
import JqxButton from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxbuttons.vue'

import LAY_EXCEL from 'lay-excel'
export default {
  name: 'CustomUploder',
  components: {
    JqxTooltip,
    JqxButton
  },
  data() {
    return {
      inputValue: '',
      fileContent: {},
      file: null
    }
  },
  props: {
    type: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 0
    },
    showUploadButton: {
      type: Boolean,
      default: false
    },
    fieldsCofig: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  created() {
    this.textId = 'textInput' + JQXLite.generateID()
    this.fileId = 'file' + JQXLite.generateID()
  },
  computed: {
    getWidth() {
      return this.width + 'px'
    },
    getHeight() {
      return this.height + 'px'
    }
  },
  mounted() {
    const that = this
    // 创建自定义风格input
    switch (this.type) {
      case 'jqxInput': {
        const input = document.getElementById(that.textId)
        jqwidgets.createInstance(input, 'jqxInput', {
          width: this.width,
          height: this.height
        })
        break
      }
      default:
        break
    }
  },
  methods: {
    open() {
      const file = document.getElementById(this.fileId)
      file.click()
    },
    changed(event) {
      this.file = event.target.files[0]
      const that = this
      // 文件名称
      let fileName = event.target.value
      fileName = fileName.substring(
        fileName.lastIndexOf('\\') + 1,
        fileName.length
      )

      const input = document.getElementById(this.textId)
      input.value = fileName
      this.inputValue = fileName
      // 文件内容
      const files = event.target.files
      LAY_EXCEL.importExcel(files, that.fieldsCofig, function(data, book) {
        event.srcElement.value = '' // 及时清空,避免下次选择相同的文件无法触发事件
        that.fileContent = data
        that.$emit('changed', data)
      })
    }
  }
}
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
