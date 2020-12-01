<template>
  <div>
    <CustomUploader
      :width="190"
      :height="25"
      :type="'jqxInput'"
      :showUploadButton="true"
      refs="uploader"
    ></CustomUploader>
    <selection-tool
      ref="selectionTool"
      :selection-type="'换气扇选型'"
    ></selection-tool>
  </div>
</template>

<script>
import CustomUploader from "@/components/common/CustomUploader";
import SelectionTool from "@/views/quote/childComps/SelectionTool";
export default {
  components: {
    CustomUploader,
    SelectionTool,
  },
  created() {},
  methods: {
    init() {},
  },
};
</script>

<style scoped>
</style>