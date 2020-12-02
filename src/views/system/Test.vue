<template>
  <div>
    <CustomUploader
      :width="190"
      :height="25"
      :type="'jqxInput'"
      :showUploadButton="true"
      refs="uploader"
    ></CustomUploader>
    <selection-grid ref="selectionGrid" :selection-type="'常规风机'"></selection-grid>
  </div>
</template>

<script>
import CustomUploader from "@/components/common/CustomUploader";
import SelectionTool from "@/views/quote/childComps/SelectionTool";
import SelectionGrid from "@/views/quote/childComps/SelectionGrid"
export default {
  components: {
    CustomUploader,
    SelectionTool,
    SelectionGrid,
  },
  created() {},
  methods: {
    init() {},
  },
};
</script>

<style scoped>
</style>