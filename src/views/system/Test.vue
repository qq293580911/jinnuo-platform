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
  created() {
    this.init()
  },
  methods: {
    init(){
      let formData = new FormData()
      formData.append('sdsd','sdsdssdsdsdd')
      console.log(formData)
      console.log(formData.get('sdsd'))
    }
  },
};
</script>

<style scoped>
</style>