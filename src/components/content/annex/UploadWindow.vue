<template>
  <div>
    <JqxWindow
      ref="myWindow"
      :width="320"
      :height="330"
      :autoOpen="false"
      :position="{ x: '40%', y: '40%' }"
    >
      <div>
        <JqxFileUpload
          ref="myUploader"
          :width="'100%'"
          :uploadUrl="uploadUrl"
          :fileInputName="fileInputName"
          :localization="localization"
          @select="onSelect($event)"
          @remove="onRemove($event)"
          @uploadStart="onUploadStart($event)"
          @uploadEnd="onUploadEnd($event)"
        >
        </JqxFileUpload>
      </div>
    </JqxWindow>
  </div>
</template>

<script>
import JqxWindow from "jqwidgets-scripts/jqwidgets-vue/vue_jqxwindow.vue";
import JqxFileUpload from "jqwidgets-scripts/jqwidgets-vue/vue_jqxfileupload.vue";

import { Message, FILE_UPLOAD } from "@/common/const.js";
export default {
  components: {
    JqxWindow,
    JqxFileUpload,
  },
  props: {
    annexType: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      fileCount: 0,
      uploadUrl: `/api/annex/uploadAnnex.do`,
      fileInputName: "file",
      boundId: 0,
      localization: {
        browseButton: "浏览",
        uploadButton: "上传",
        cancelButton: "取消",
        uploadFileTooltip: "上传这个",
        cancelFileTooltip: "删除这个",
      },
    };
  },
  beforeCreate() {},
  methods: {
    open(...params) {
      this.$refs.myWindow.setTitle(params[0]);
      this.boundId = params[1];
      this.$refs.myWindow.open();
    },
    onSelect(event) {
      this.fileCount++;
      const fileName = event.args.file;
      const reg = RegExp(/[#,\\,%,&]/g);
      if (reg.test(fileName)) {
        const lastIndex = args.owner._fileRows.length - 1;
        this.$message.warning(Message.CONTAINS_INVALID_SYMBOL);
        this.$refs.myUploader.cancelFile(lastIndex);
        return false;
      }
    },
    onRemove(event) {
      this.fileCount--;
    },
    onUploadStart(event) {
      const boundId = this.boundId;
      const annexType = this.annexType;
      $("form")
        .append(`<input type="hidden" name="boundId" value="${boundId}" />`)
        .append(
          `<input type="hidden" name="annexType" value="${annexType}" />`
        );
    },
    onUploadEnd(event) {
      const args = event.args;
      const serverResponse = args.response;
      if ($(serverResponse).text() == 1) {
        this.$message.success(Message.UPLOAD_SUCCESS);
      }
      if (this.fileCount == 1) {
        this.$parent.refresh();
      }
      this.$refs.myWindow.close();
    },
  },
};
</script>

<style>
</style>