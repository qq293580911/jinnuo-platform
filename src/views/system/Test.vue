<template>
  <div>
    <CustomUploader
      :width="190"
      :height="25"
      :type="'jqxInput'"
      :showUploadButton="true"
      refs="uploader"
    ></CustomUploader>
  </div>
</template>

<script>
import CustomUploader from "@/components/common/CustomUploader";
export default {
  components: {
    CustomUploader,
  },
};
</script>

<style scoped>
</style>