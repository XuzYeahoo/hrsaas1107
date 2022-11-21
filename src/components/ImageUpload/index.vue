<template>
  <div>
    <!-- 给action一个#号 就不会报错了 -->
    <!-- file-list是上传的文件列表 可以绑定到上传组件上 让上传组件显示要上传的文件 -->
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :on-preview="preview"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
      :file-list="fileList"
      :class="{disabled : fileComputed}"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showPercent" style="width: 180px" :percentage="percent" />
    <el-dialog :visible.sync="showDialog" title="图片预览">
      <img :src="imgUrl" alt="" style="width:100%">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'xxxx',
  SecretKey: 'xxxx'
})
export default {
  data() {
    return {
      fileList: [],
      showDialog: false,
      imgUrl: '',
      currentFileUid: null, // 记录当前上传的uid
      percent: 0, // 记录上传进度百分比
      showPercent: false
    }
  },
  computed: {
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    // 点击预览事件
    preview(file) {
      // console.log(file.url)
      this.imgUrl = file.url
      this.showDialog = true
    },
    // file是要删除的文件
    // fileList是删过之后的数组
    handleRemove(file, fileList) {
      // console.log(file)
      // console.log(fileList)
      // this.fileList = fileList
      this.fileList = this.fileList.filter(item => item.uid !== file.uid) // 将当前的删除文件排除在外
    },
    // 不能用push 因为这个钩子会执行多次
    changeFile(file, fileList) {
      // file是当前文件
      // fileList是最新数组
      this.fileList = fileList.map(item => item)
      // 此时还不成功是因为action等于#
      // on-change在添加图片、上传成功、上传失败时执行 所以第一次添加图片时fileList.length=1而第二次因为还没有上传（上传失败）fileList.length=0
      // 如果完成上传动作 第一次添加图片、第二次上传成功的fileList.length都等于1
      // 上传成功 => 数据进入fileList 所以这一步依赖于后面的上传图片到腾讯云
    },
    beforeUpload(file) {
      // 检查图片类型
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.some(item => item === file.type)) {
        // 如果不存在
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false // 上传终止
      }
      // 检查图片大小
      // 1M=1024KB 1KB=1024B
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      // 检查完之后已经确定当前要上传的文件就是file
      this.currentFileUid = file.uid
      this.showPercent = true
      return true
    },
    // 进行上传操作
    upload(params) {
      // console.log(params.file)
      if (params.file) {
        // 如果有文件就上传
        cos.putObject({
          // 上传到腾讯云
          Bucket: 'hrsaas-1116-1315095849', // 存储桶
          Region: 'ap-shanghai', // 地域
          Key: params.file.name, // 文件名
          Body: params.file, // 要上传的文件对象
          StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
          onProgress: (progressData) => {
            // console.log(progressData)
            this.percent = progressData.percent * 100
          }
        },
        (err, data) => {
          if (!err && data.statusCode === 200) {
            // 说明此时文件上传成功 要获取成功的返回地址 'http://' + data.Location
            // fileList才能显示到上传组件上 此时我们要将fileList数据中的url地址变成现在上传成功的地址
            // 目前虽然是一张图片 但是注意fileList是一个数组
            // 需要知道当前上传成功的是哪一张图片
            this.fileList = this.fileList.map(item => {
              // 去找谁的uid等于刚刚记录下来的id
              if (item.uid === this.currentFileUid) {
                // 将成功的地址赋值给原来的url
                // upload为true表示这张图片上传成功 这个属性要为我们后期应用的时候做标记
                return { url: 'http://' + data.Location, upload: true }
              }
              return item
            })
            // 关闭进度条 重置百分比
            this.showPercent = false
            this.percent = 0
          }
        })
      }
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card {
  display: none
}
</style>
