<template>
  <div>
    <svg-icon icon-class="fullscreen" style="color:#fff; width: 20px; height: 20px" @click="changeScreen" />
  </div>
</template>

<script>
import ScreenFull from 'screenfull'
export default {
  methods: {
    changeScreen() {
      // 原始js实现全屏
      // document.documentElement.requestFullscreen() 进入全屏
      // document.exitFullscreen() 退出全屏
      if (!ScreenFull.isEnabled) {
        this.$message.warning('全屏组件不可用')
        return
      }
      ScreenFull.toggle() // 全屏方法 toggle既可以全屏也可以退出全屏
    }
  }
}
</script>

<style>

</style>
